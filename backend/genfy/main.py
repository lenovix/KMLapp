import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from diffusers import StableDiffusionPipeline
import base64
from io import BytesIO

BASE_DIR = Path(__file__).resolve().parent
CACHE_PATH = os.path.join(BASE_DIR, "models_cache")

os.environ['HUGGINGFACE_HUB_CACHE'] = CACHE_PATH

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_id = "runwayml/stable-diffusion-v1-5"
device = "cuda" if torch.cuda.is_available() else "cpu"

print("-" * 30)
print(f"🚀 GENFY BACKEND STARTING")
print(f"📁 Project Root: {BASE_DIR}")
print(f"📦 Model Cache: {CACHE_PATH}")
print(f"💻 Device: {device.upper()}")
print("-" * 30)

try:
    print("⏳ Loading model... (please wait)")
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id, 
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        local_files_only=True, 
        use_safetensors=True
    )
    pipe.to(device)
    print("✅ SUCCESS: Model loaded from local storage!")
except Exception as e:
    print(f"⚠️  NOTICE: Local load failed or incomplete. Attempting online check...")
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id, 
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        local_files_only=False
    )
    pipe.to(device)
    print("✅ SUCCESS: Model is ready!")

class GenerateRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_image(request: GenerateRequest):
    try:
        print(f"🎨 Generating: {request.prompt[:50]}...")
        
        generator = torch.Generator(device=device)
        
        image = pipe(request.prompt, generator=generator).images[0]
        
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        print("✨ Generation complete!")
        return {"image_base64": f"data:image/png;base64,{img_str}"}
    
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)