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
pip install -U xformers --index-url https://download.pytorch.org/whl/cu124

D:\KMLapp>python -c "import torch; print(f'Nama GPU: {torch.cuda.get_device_name(0)}'); print(f'Total VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB')"
Nama GPU: NVIDIA GeForce RTX 4050 Laptop GPU
Total VRAM: 6.00 GB