import requests
import os
import time
import threading
import tkinter as tk
from tkinter import scrolledtext
import re

class ImageDownloaderGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Komify Image Downloader - Fixed")
        self.root.geometry("600x550")

        tk.Label(root, text="Masukkan Link Gambar (URL):", font=("Arial", 10, "bold")).pack(pady=(10, 0))
        self.entry_url = tk.Entry(root, width=70)
        self.entry_url.pack(pady=5)
        self.entry_url.insert(0, "https://i.pximg.net/img-original/img/2024/06/11/21/59/34/119113011-70e4c543f8d3338aa8ab53c4b3faae0c_p0.jpg")

        tk.Label(root, text="Nama Folder Kustom (Kosongkan untuk gunakan ID):", font=("Arial", 10)).pack(pady=(10, 0))
        self.entry_folder = tk.Entry(root, width=70)
        self.entry_folder.pack(pady=5)

        self.btn_download = tk.Button(root, text="Mulai Download", command=self.start_thread, bg="green", fg="white", font=("Arial", 10, "bold"))
        self.btn_download.pack(pady=15)

        tk.Label(root, text="Log Aktivitas:").pack()
        self.log_area = scrolledtext.ScrolledText(root, width=70, height=15)
        self.log_area.pack(pady=5)

    def write_log(self, message):
        self.log_area.insert(tk.END, message + "\n")
        self.log_area.see(tk.END)

    def start_thread(self):
        self.btn_download.config(state=tk.DISABLED)
        thread = threading.Thread(target=self.process_download, daemon=True)
        thread.start()

    def process_download(self):
        full_url = self.entry_url.get().strip()
        custom_folder = self.entry_folder.get().strip()
        
        if not full_url:
            self.write_log("Error: Link tidak boleh kosong!")
            self.btn_download.config(state=tk.NORMAL)
            return

        try:
            target_file = full_url.rsplit('/', 1)[1]
            base_url = full_url.rsplit('/', 1)[0] + "/"
            
            match = re.search(r'^(\d+)', target_file)
            if not match:
                self.write_log("Error: Format ID tidak ditemukan dalam URL.")
                self.btn_download.config(state=tk.NORMAL)
                return
            
            image_id_clean = match.group(1)
            start_id = int(image_id_clean)

            folder_name = custom_folder if custom_folder else image_id_clean
            
            root_save_path = r"D:\KMLapp\tools\output"
            subfolder_path = os.path.join(root_save_path, folder_name)
            
            if not os.path.exists(subfolder_path):
                os.makedirs(subfolder_path)

            self.write_log(f"--- Folder Tujuan: {folder_name} ---")
            self.write_log(f"--- Memulai Download ID: {image_id_clean} ---")

            headers = {
                "Referer": "https://www.pixiv.net/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }

            current_id = start_id
            while True:
                found_any_in_id = False
                page = 0
                while True:
                    if page == 0 and current_id == start_id:
                        filename = target_file
                    else:
                        filename = f"{current_id}_p{page}.jpg"

                    url = base_url + filename
                    self.write_log(f"Mengecek: {filename}...")
                    
                    try:
                        res = requests.get(url, headers=headers, timeout=10)
                        if res.status_code == 200:
                            file_path = os.path.join(subfolder_path, filename)
                            with open(file_path, 'wb') as f:
                                f.write(res.content)
                            self.write_log(f"Berhasil: {filename}")
                            found_any_in_id = True
                            page += 1
                            time.sleep(0.5)
                        else:
                            if "_p0" in filename and "-" in filename:
                                filename = f"{current_id}_p0.jpg"
                                continue 
                            
                            self.write_log(f"Berhenti di: {filename} (Status: {res.status_code})")
                            break
                    except Exception as e:
                        self.write_log(f"Error Koneksi: {e}")
                        break

                if not found_any_in_id:
                    self.write_log("\n--- Proses Selesai ---")
                    break
                
                current_id += 1

        except Exception as e:
            self.write_log(f"Kesalahan: {e}")
        
        self.btn_download.config(state=tk.NORMAL)

if __name__ == "__main__":
    root = tk.Tk()
    app = ImageDownloaderGUI(root)
    root.mainloop()