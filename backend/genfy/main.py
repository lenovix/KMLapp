import os
import psutil
import torch
import base64
import glob
import gc  # Garbage Collector
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
from io import BytesIO

# --- SETUP PATH ---
BASE_DIR = Path(__file__).resolve().parent
CHECKPOINT_DIR = os.path.join(BASE_DIR, "models", "checkpoint")
os.makedirs(CHECKPOINT_DIR, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION ---
device = "cuda" if torch.cuda.is_available() else "cpu"
current_model_path = None
pipe = None

def apply_optimizations(pipeline):
    if device == "cuda":
        try:
            pipeline.enable_xformers_memory_efficient_attention()
        except:
            pipeline.enable_attention_slicing()
        
        # PENTING: Membantu GPU 6GB menangani model besar
        pipeline.enable_model_cpu_offload()
        pipeline.enable_vae_slicing()
    return pipeline

def load_model_into_memory(model_name: str):
    global pipe, current_model_path
    models = glob.glob(os.path.join(CHECKPOINT_DIR, "*.safetensors"))
    model_map = {os.path.basename(f): f for f in models}
    model_path = model_map.get(model_name)

    if not model_path: raise ValueError("Model not found")
    if current_model_path == model_path and pipe is not None: return

    if pipe is not None:
        del pipe
        gc.collect()
        torch.cuda.empty_cache()

    is_xl = os.path.getsize(model_path) / (1024**3) > 4.0
    pipeline_class = StableDiffusionXLPipeline if is_xl else StableDiffusionPipeline
    
    pipe = pipeline_class.from_single_file(
        model_path,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        use_safetensors=True
    )
    pipe = apply_optimizations(pipe)
    current_model_path = model_path

# --- ENDPOINTS ---

@app.get("/models")
async def list_models():
    files = glob.glob(os.path.join(CHECKPOINT_DIR, "*.safetensors"))
    return [os.path.basename(f) for f in files]

@app.get("/stats")
async def get_stats():
    # Menghitung VRAM terpakai dalam GB
    vram = 0
    if torch.cuda.is_available():
        vram = torch.cuda.memory_reserved() / (1024**3)
    
    return {
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory().percent,
        "ram_gb": round(psutil.Process().memory_info().rss / (1024**3), 2),
        "vram": round(vram, 2),
        "active_model": os.path.basename(current_model_path) if current_model_path else "None"
    }

class GenerateRequest(BaseModel):
    prompt: str
    model_name: str
    steps: int = 25
    cfg: float = 7.0
    seed: int = -1

@app.post("/generate")
async def generate_image(request: GenerateRequest):
    global pipe
    try:
        load_model_into_memory(request.model_name)
        seed = request.seed if request.seed != -1 else torch.Generator().seed()
        generator = torch.Generator(device="cpu").manual_seed(seed)
        
        file_size = os.path.getsize(current_model_path) / (1024**3)
        size = 832 if file_size > 4.0 else 512
        
        image = pipe(
            prompt=request.prompt,
            num_inference_steps=request.steps,
            guidance_scale=request.cfg,
            generator=generator,
            width=size,
            height=size
        ).images[0]
        
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        # --- MEMORY CLEANUP AGRESSIVE ---
        del image
        gc.collect() # Paksa Python buang sampah memori
        torch.cuda.empty_cache() # Kosongkan cache GPU
        
        return {"image_base64": f"data:image/png;base64,{img_str}", "seed": seed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)