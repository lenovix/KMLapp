import os
import requests
from dotenv import load_dotenv
from tqdm import tqdm

# ======================
# ENV SETUP
# ======================
load_dotenv()

CIVITAI_API_KEY = os.getenv("CIVITAI_API_KEY")
BASE_DOWNLOAD_URL = "https://civitai.com/api/download/models"
BASE_MODEL_API = "https://civitai.com/api/v1/models"

if not CIVITAI_API_KEY:
    raise RuntimeError("CIVITAI_API_KEY tidak ditemukan di .env")

HEADERS = {"Authorization": f"Bearer {CIVITAI_API_KEY}"}


# ======================
# GET MODEL INFO
# ======================
def get_model_info(model_id: int):
    url = f"{BASE_MODEL_API}/{model_id}"
    res = requests.get(url)
    res.raise_for_status()
    return res.json()


# ======================
# DOWNLOAD MODEL
# ======================
def download_model(model_version_id: int, output_path: str):
    url = f"{BASE_DOWNLOAD_URL}/{model_version_id}"

    with requests.get(url, headers=HEADERS, stream=True) as r:
        r.raise_for_status()
        total_size = int(r.headers.get("Content-Length", 0))

        with open(output_path, "wb") as f, tqdm(
            total=total_size,
            unit="B",
            unit_scale=True,
            desc=os.path.basename(output_path),
        ) as bar:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    bar.update(len(chunk))

    print(f"✅ Download selesai: {output_path}")


# ======================
# MAIN FLOW
# ======================
if __name__ == "__main__":
    MODEL_ID = 342231  # ganti sesuai model civitai

    print("🔍 Mengambil info model...")
    model_data = get_model_info(MODEL_ID)

    latest_version = model_data["modelVersions"][0]
    print(f"📦 Versi terbaru: {latest_version['name']}")

    # pilih file safetensors pertama
    file_info = next(
        (f for f in latest_version["files"] if f["name"].endswith(".safetensors")), None
    )

    if not file_info:
        raise RuntimeError("File .safetensors tidak ditemukan")

    model_version_id = latest_version["id"]
    output_file = file_info["name"]

    print(f"⬇️ Downloading: {output_file}")
    download_model(model_version_id, output_file)
