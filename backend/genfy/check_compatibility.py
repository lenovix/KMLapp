# Membaca metadata dari file safetensors untuk menentukan arsitektur.
import os
from safetensors import safe_open


def get_architecture(file_path):
    try:
        with safe_open(file_path, framework="pt", device="cpu") as f:
            metadata = f.metadata()

            if not metadata:
                file_size_gb = os.path.getsize(file_path) / (1024**3)
                if file_size_gb > 3.5:
                    return "SDXL"
                return "SD1.5 / SD2.1"

            base_model = metadata.get("ss_base_model_version", "").lower()

            if "sdxl" in base_model or "stable-diffusion-xl" in base_model:
                return "SDXL"
            elif "v1-5" in base_model or "sd_v1_5" in base_model:
                return "SD1.5"
            else:
                return f"Unknown ({base_model})"
    except Exception as e:
        return f"Error reading file: {e}"


def validate_compatibility(model_path, lora_paths):
    print("=" * 50)
    print("🔍 GENFY ARCHITECTURE CHECKER")
    print("=" * 50)

    model_arch = get_architecture(model_path)
    print(f"MAIN MODEL: {os.path.basename(model_path)}")
    print(f"ARCHITECTURE: {model_arch}")
    print("-" * 50)

    for lora in lora_paths:
        lora_arch = get_architecture(lora)
        status = "✅ MATCH" if lora_arch == model_arch else "❌ MISMATCH"

        print(f"LoRA: {os.path.basename(lora)}")
        print(f"ARCH: {lora_arch}")
        print(f"STATUS: {status}")
        print("-" * 30)


checkpoint = r"./models/checkpoint/smoothMixOldVerNoobai_illustriousV3.safetensors"
loras = [
    r"./models/loras/final-000002.safetensors",
    r"./models/loras/shenhe_new.safetensors",
]

if os.path.exists(checkpoint):
    validate_compatibility(checkpoint, loras)
else:
    print("Path model tidak ditemukan! Pastikan path benar.")
