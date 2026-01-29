import os
import psutil
import torch
import base64
import glob
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
from io import BytesIO

# --- SETUP PATH ---
BASE_DIR = Path(__file__).resolve().parent
# Folder tempat menyimpan model single file (.safetensors)
CHECKPOINT_DIR = os.path.join(BASE_DIR, "models", "checkpoint")

# Pastikan folder ada
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

print("-" * 30)
print(f"🚀 GENFY BACKEND STARTING")
print(f"📁 Checkpoint Dir: {CHECKPOINT_DIR}")
print(f"💻 Device: {device.upper()}")
print("-" * 30)

# --- FUNCTIONS ---

def get_available_models():
    """Mencari semua file .safetensors di folder checkpoint"""
    files = glob.glob(os.path.join(CHECKPOINT_DIR, "*.safetensors"))
    # Return dict: { "Nama_Model": "Full_Path" }
    return {os.path.basename(f): f for f in files}

def load_model_into_memory(model_name: str):
    global pipe, current_model_path
    
    models = get_available_models()
    model_path = models.get(model_name)

    if not model_path:
        raise ValueError(f"Model {model_name} tidak ditemukan di folder!")

    if current_model_path == model_path and pipe is not None:
        return

    # 1. Cleanup memori
    if pipe is not None:
        print(f"🧹 Cleaning up memory...")
        del pipe
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    print(f"⏳ Loading Single File: {model_name}...")

    try:
        # Karena Illustrious & model modern rata-rata SDXL:
        # Kita coba load pakai XLPipeline. Jika file kecil/lama, biasanya SD v1.5
        # Tapi untuk Illustrious, ini wajib XLPipeline.
        pipe = StableDiffusionXLPipeline.from_single_file(
            model_path,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            use_safetensors=True
        )
        pipe.to(device)
        current_model_path = model_path
        print(f"✅ SUCCESS: {model_name} is ready!")
    except Exception as e:
        print(f"❌ Error loading single file: {e}")
        # Fallback jika model ternyata bukan SDXL (tapi SD v1.5)
        try:
            print("🔄 Attempting fallback to SD v1.5 Pipeline...")
            pipe = StableDiffusionPipeline.from_single_file(
                model_path,
                torch_dtype=torch.float16 if device == "cuda" else torch.float32
            )
            pipe.to(device)
            current_model_path = model_path
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e2)}")

# --- ENDPOINTS ---

@app.get("/models")
async def list_models():
    """Endpoint untuk UI mengambil daftar model yang ada"""
    models = get_available_models()
    return list(models.keys())

@app.get("/stats")
async def get_stats():
    stats = {
        "cpu": psutil.cpu_percent(interval=None),
        "ram": psutil.virtual_memory().percent,
        "vram": 0.0,
        "device": device.upper(),
        "active_model": os.path.basename(current_model_path) if current_model_path else "None"
    }
    if torch.cuda.is_available():
        vram_used = torch.cuda.memory_allocated(device=None) / (1024**3)
        stats["vram"] = round(vram_used, 2)
    return stats

class GenerateRequest(BaseModel):
    prompt: str
    model_name: str
    steps: int = 30
    cfg: float = 7.5
    seed: int = -1

@app.post("/generate")
async def generate_image(request: GenerateRequest):
    try:
        load_model_into_memory(request.model_name)
        
        seed = request.seed if request.seed != -1 else torch.Generator().seed()
        generator = torch.Generator(device=device).manual_seed(seed)
        
        # Deteksi otomatis size (SDXL file > 5GB biasanya 1024)
        file_size = os.path.getsize(current_model_path) / (1024**3)
        size = 1024 if file_size > 4.0 else 512
        
        print(f"🎨 Generating: {request.prompt[:30]}... | Resolution: {size}")
        
        image = pipe(
            request.prompt, 
            num_inference_steps=request.steps, 
            guidance_scale=request.cfg,
            generator=generator,
            width=size,
            height=size
        ).images[0]
        
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return {"image_base64": f"data:image/png;base64,{img_str}", "seed": seed}
    
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)