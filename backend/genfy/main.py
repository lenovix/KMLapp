import os
import torch
import base64
import glob
import gc
import asyncio
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
from io import BytesIO
from typing import List
from safetensors import safe_open
from fastapi import WebSocket, WebSocketDisconnect

BASE_DIR = Path(__file__).resolve().parent
CHECKPOINT_DIR = os.path.join(BASE_DIR, "models", "checkpoint")
os.makedirs(CHECKPOINT_DIR, exist_ok=True)

LORA_DIR = os.path.join(BASE_DIR, "models", "loras")
os.makedirs(LORA_DIR, exist_ok=True)

app = FastAPI()
executor = ThreadPoolExecutor(max_workers=1)
main_loop = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
current_model_path = None
pipe = None
active_websocket: WebSocket = None


@app.on_event("startup")
async def startup_event():
    global main_loop
    main_loop = asyncio.get_running_loop()


def progress_callback(pipe, step_index, timestep, callback_kwargs):
    global active_websocket, main_loop
    if active_websocket and main_loop:
        total_steps = callback_kwargs.get("num_inference_steps", 25)
        progress = (step_index + 1) / total_steps

        try:
            asyncio.run_coroutine_threadsafe(
                active_websocket.send_json({"progress": progress}), main_loop
            )
        except Exception as e:
            print(f"WS Send Error: {e}")
    return callback_kwargs


@app.websocket("/ws/progress")
async def websocket_endpoint(websocket: WebSocket):
    global active_websocket
    await websocket.accept()
    active_websocket = websocket
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_websocket = None
        print("Client disconnected")


def get_architecture(file_path):
    try:
        if not file_path or not os.path.exists(file_path):
            return "Unknown"

        with safe_open(file_path, framework="pt", device="cpu") as f:
            metadata = f.metadata()
            if not metadata:
                size_mb = os.path.getsize(file_path) / (1024**2)
                return "SDXL" if size_mb > 100 else "SD1.5"

            base_model = metadata.get("ss_base_model_version", "").lower()
            if any(
                x in base_model
                for x in ["sdxl", "stable-diffusion-xl", "pony", "illustrious"]
            ):
                return "SDXL"
            return "SD1.5"
    except Exception:
        size_gb = os.path.getsize(file_path) / (1024**3)
        return "SDXL" if size_gb > 0.1 else "SD1.5"


def apply_optimizations(pipeline):
    if device == "cuda":
        pipeline.vae.enable_slicing()
        pipeline.vae.enable_tiling()
        pipeline.enable_model_cpu_offload()
    return pipeline


def load_model_into_memory(model_name: str):
    global pipe, current_model_path
    models = glob.glob(os.path.join(CHECKPOINT_DIR, "*.safetensors"))
    model_map = {os.path.basename(f): f for f in models}
    model_path = model_map.get(model_name)

    if not model_path:
        raise ValueError("Model not found")
    if current_model_path == model_path and pipe is not None:
        return

    if pipe is not None:
        del pipe
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
    lora_info = []
    for f in files:
        name = os.path.basename(f)
        arch = get_architecture(f)
        lora_info.append({"name": name, "arch": arch})
    return lora_info


class LoraConfig(BaseModel):
    name: str
    weight: float


class GenerateRequest(BaseModel):
    prompt: str
    model_name: str
    active_loras: List[LoraConfig] = []
    steps: int = 25
    cfg: float = 7.0
    seed: int = -1
    width: int = 512
    height: int = 512


@app.post("/generate")
async def generate_image(request: GenerateRequest):
    global pipe
    try:
        loop = asyncio.get_event_loop()

        def sync_generate():
            load_model_into_memory(request.model_name)

            seed = request.seed if request.seed != -1 else torch.Generator().seed()
            generator = torch.Generator(device="cpu").manual_seed(seed)

            current_model_arch = get_architecture(current_model_path)
            print(f"--- Generator Active: {current_model_arch} mode ---")

            try:
                pipe.unload_lora_weights()
            except:
                pass

            if request.active_loras:
                adapter_names = []
                adapter_weights = []

                for idx, lora in enumerate(request.active_loras):
                    if lora.name == "None":
                        continue

                    lora_path = os.path.join(LORA_DIR, lora.name)
                    lora_arch = get_architecture(lora_path)
                    if lora_arch != current_model_arch:
                        print(
                            f"⚠️ SKIPPING LORA: {lora.name} ({lora_arch}) is incompatible with Model ({current_model_arch})"
                        )
                        continue

                    adapter_name = f"lora_{idx}"
                    pipe.load_lora_weights(lora_path, adapter_name=adapter_name)
                    adapter_names.append(adapter_name)
                    adapter_weights.append(lora.weight)
                    print(f"✅ LOADED LORA: {lora.name} as {adapter_name}")

                if adapter_names:
                    pipe.set_adapters(adapter_names, adapter_weights=adapter_weights)

            seed = request.seed if request.seed != -1 else torch.Generator().seed()
            generator = torch.Generator(device="cpu").manual_seed(seed)

            output = pipe(
                prompt=request.prompt,
                num_inference_steps=request.steps,
                guidance_scale=request.cfg,
                generator=generator,
                width=request.width,
                height=request.height,
                callback_on_step_end=progress_callback,
                callback_on_step_end_tensor_inputs=["latents"],
            )
            return output.images[0], seed

        image, final_seed = await loop.run_in_executor(executor, sync_generate)
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        gc.collect()
        if device == "cuda":
            torch.cuda.empty_cache()

        return {"image_base64": f"data:image/png;base64,{img_str}", "seed": final_seed}

    except Exception as e:
        print(f"🔥 ERROR DETAIL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
