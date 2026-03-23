import tkinter as tk
from tkinter import ttk, messagebox
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
import time
import json
import subprocess
import os
import threading

class FilmfyApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Filmfy Trailer Downloader v1.0")
        self.root.geometry("500x400")
        self.root.configure(bg="#1e1e1e")

        style = ttk.Style()
        style.theme_use('clam')
        
        tk.Label(root, text="Filmfy Downloader", font=("Arial", 18, "bold"), fg="white", bg="#1e1e1e").pack(pady=10)
        
        tk.Label(root, text="Masukkan URL Video:", fg="#aaaaaa", bg="#1e1e1e").pack(anchor="w", padx=20)
        self.url_entry = tk.Entry(root, width=50, font=("Consolas", 10))
        self.url_entry.insert(0, "https://javtrailers.com/video/atid00635")
        self.url_entry.pack(pady=5, padx=20)

        self.btn_download = tk.Button(root, text="MULAI DOWNLOAD", command=self.start_thread, 
                                      bg="#0078d4", fg="white", font=("Arial", 10, "bold"), 
                                      padx=20, pady=10, relief="flat")
        self.btn_download.pack(pady=15)

        tk.Label(root, text="Log Aktivitas:", fg="#aaaaaa", bg="#1e1e1e").pack(anchor="w", padx=20)
        self.log_text = tk.Text(root, height=10, width=55, bg="#000000", fg="#00ff00", font=("Consolas", 9))
        self.log_text.pack(pady=5, padx=20)

    def write_log(self, message):
        self.log_text.insert(tk.END, f"> {message}\n")
        self.log_text.see(tk.END)

    def start_thread(self):
        url = self.url_entry.get()
        if not url:
            messagebox.showwarning("Peringatan", "Isi URL dulu bos!")
            return
        
        self.btn_download.config(state="disabled")
        thread = threading.Thread(target=self.process_download, args=(url,))
        thread.daemon = True
        thread.start()

    def process_download(self, url):
        driver = None
        try:
            output_dir = r"D:\KMLapp\tools\output"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)

            video_id = url.split('/')[-1] if url.split('/')[-1] else "trailer_result"
            output_path = os.path.join(output_dir, f"{video_id}.mp4")

            self.write_log(f"Inisialisasi browser untuk {video_id}...")
            
            options = uc.ChromeOptions()
            options.add_argument("--mute-audio")
            options.set_capability("goog:loggingPrefs", {"performance": "ALL"})

            driver = uc.Chrome(options=options)
            
            driver.set_window_rect(x=510, y=100, width=800, height=600)

            driver.get(url)
            self.write_log("Menunggu Cloudflare & Page Load...")
            time.sleep(15)

            self.write_log("Memicu Play via Script...")
            driver.execute_script("""
                var player = document.querySelector('.video-js');
                if (player && player.player) { player.player.play(); }
                var bigPlay = document.querySelector('.vjs-big-play-button');
                if (bigPlay) bigPlay.click();
                var videoTag = document.querySelector('video');
                if (videoTag) { videoTag.muted = true; videoTag.play(); }
            """)

            time.sleep(10)
            self.write_log("Mencari link stream...")

            logs = driver.get_log("performance")
            video_url = None
            for entry in logs:
                msg = json.loads(entry["message"])["message"]
                if msg.get("method") == "Network.requestWillBeSent":
                    req_url = msg["params"]["request"]["url"]
                    if ".m3u8" in req_url.lower() and "poster" not in req_url.lower():
                        video_url = req_url

            if video_url:
                self.write_log("Link ditemukan! Memulai FFmpeg...")
                cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-i', video_url, '-c', 'copy', output_path]
                subprocess.run(cmd, check=True)
                self.write_log(f"SUKSES: {video_id}.mp4")
                messagebox.showinfo("Berhasil", f"Video tersimpan di:\n{output_path}")
            else:
                self.write_log("GAGAL: Link m3u8 tidak ditemukan.")

        except Exception as e:
            self.write_log(f"ERROR: {str(e)}")
        finally:
            if driver:
                self.write_log("Menutup browser...")
                driver.quit()
            self.btn_download.config(state="normal")

if __name__ == "__main__":
    root = tk.Tk()
    app = FilmfyApp(root)
    root.mainloop()