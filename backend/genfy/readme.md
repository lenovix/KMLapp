# cek versi cuda yang didukung maksimum oleh laptop

nvidia-smi

# Buat virtual environment agar library AI tidak berantakan

python -m venv venv

# Aktifkan venv

# Windows:

venv\Scripts\activate

# Linux/Mac:

source venv/bin/activate

# Install dependencies utama

pip install diffusers transformers accelerate pillow fastapi uvicorn

# CUDA 12.4

pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124
