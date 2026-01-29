import os
import torch
import base64
import glob
import gc
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
from io import BytesIO

BASE_DIR = Path(__file__).resolve().parent
CHECKPOINT_DIR = os.path.join(BASE_DIR, "models", "checkpoint")
os.makedirs(CHECKPOINT_DIR, exist_ok=True)

LORA_DIR = os.path.join(BASE_DIR, "models", "loras")
os.makedirs(LORA_DIR, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
current_model_path = None
current_lora = None
pipe = None


def apply_optimizations(pipeline):
    if device == "cuda":
        try:
            pipeline.enable_xformers_memory_efficient_attention()
        except:
            pipeline.enable_attention_slicing()

        pipeline.enable_model_cpu_offload()
        pipeline.enable_vae_slicing()
    return pipeline


def load_model_into_memory(model_name: str):
    global pipe, current_model_path, current_lora
    models = glob.glob(os.path.join(CHECKPOINT_DIR, "*.safetensors"))
    model_map = {os.path.basename(f): f for f in models}
    model_path = model_map.get(model_name)

    if not model_path:
        raise ValueError("Model not found")
    if current_model_path == model_path and pipe is not None:
        return

    if pipe is not None:
        del pipe
        current_lora = None
        gc.collect()
        torch.cuda.empty_cache()

    is_xl = os.path.getsize(model_path) / (1024**3) > 4.0
    pipeline_class = StableDiffusionXLPipeline if is_xl else StableDiffusionPipeline

    pipe = pipeline_class.from_single_file(
        model_path,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        use_safetensors=True,
    )
    pipe = apply_optimizations(pipe)
    current_model_path = model_path


@app.get("/models")
async def list_models():
    files = glob.glob(os.path.join(CHECKPOINT_DIR, "*.safetensors"))
    return [os.path.basename(f) for f in files]


@app.get("/loras")
async def list_loras():
    files = glob.glob(os.path.join(LORA_DIR, "*.safetensors"))
    return ["None"] + [os.path.basename(f) for f in files]


class GenerateRequest(BaseModel):
    prompt: str
    model_name: str
    lora_name: str = "None"
    lora_weight: float = 0.75
    steps: int = 25
    cfg: float = 7.0
    seed: int = -1


@app.post("/generate")
async def generate_image(request: GenerateRequest):
    global pipe, current_lora
    try:
        load_model_into_memory(request.model_name)

        if request.lora_name == "None":
            if current_lora is not None:
                pipe.unload_lora_weights()
                current_lora = None
        else:
            if request.lora_name != current_lora:
                if current_lora is not None:
                    pipe.unload_lora_weights()

                lora_path = os.path.join(LORA_DIR, request.lora_name)
                pipe.load_lora_weights(lora_path, adapter_name="active_lora")
                current_lora = request.lora_name

            pipe.set_adapters(["active_lora"], adapter_weights=[request.lora_weight])

        seed = request.seed if request.seed != -1 else torch.Generator().seed()
        generator = torch.Generator(device="cpu").manual_seed(seed)

        file_size = os.path.getsize(current_model_path) / (1024**3)
        size = 1024 if file_size > 4.0 else 512

        image = pipe(
            prompt=request.prompt,
            num_inference_steps=request.steps,
            guidance_scale=request.cfg,
            generator=generator,
            width=size,
            height=size,
        ).images[0]

        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        del image
        gc.collect()
        torch.cuda.empty_cache()

        return {"image_base64": f"data:image/png;base64,{img_str}", "seed": seed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
