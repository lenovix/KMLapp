import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
import subprocess
import os
import threading

class VideoConverterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("FFmpeg Video Converter")
        self.root.geometry("650x400")

        self.input_file = None

        # === Buttons Frame ===
        btn_frame = tk.Frame(root)
        btn_frame.pack(pady=10)

        tk.Button(btn_frame, text="Select Movie", width=15, command=self.select_file).grid(row=0, column=0, padx=5)
        tk.Button(btn_frame, text="Convert", width=15, command=self.convert_video).grid(row=0, column=1, padx=5)
        tk.Button(btn_frame, text="Clear", width=15, command=self.clear_log).grid(row=0, column=2, padx=5)

        # === Selected File Label ===
        self.file_label = tk.Label(root, text="No file selected", fg="blue")
        self.file_label.pack()

        # === Log Area ===
        self.log = scrolledtext.ScrolledText(root, height=15)
        self.log.pack(fill="both", expand=True, padx=10, pady=10)

    def select_file(self):
        filetypes = [
            ("Video files", "*.ts *.mkv *.avi *.mov *.flv *.wmv *.mp4"),
            ("All files", "*.*")
        ]
        self.input_file = filedialog.askopenfilename(filetypes=filetypes)

        if self.input_file:
            self.file_label.config(text=self.input_file)
            self.log_message(f"Selected file: {self.input_file}")

    def clear_log(self):
        self.log.delete(1.0, tk.END)
        self.file_label.config(text="No file selected")
        self.input_file = None

    def log_message(self, message):
        self.log.insert(tk.END, message + "\n")
        self.log.see(tk.END)

    def convert_video(self):
        if not self.input_file:
            messagebox.showwarning("Warning", "Please select a video file first!")
            return

        thread = threading.Thread(target=self.run_ffmpeg)
        thread.start()

    def run_ffmpeg(self):
        input_path = self.input_file
        output_path = os.path.splitext(input_path)[0] + ".mp4"

        self.log_message("Starting conversion...")
        self.log_message(f"Output file: {output_path}")

        # command = [
        #     "ffmpeg",
        #     "-y",
        #     "-i", input_path,
        #     "-c:v", "libx264",
        #     "-preset", "fast",
        #     "-crf", "23",
        #     "-c:a", "aac",
        #     "-b:a", "128k",
        #     output_path
        # ]

        command = [
            "ffmpeg",
            "-y",
            "-i", input_path,
            "-c:v", "copy",
            "-c:a", "copy",
            "-movflags", "+faststart",
            output_path
        ]

        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )

        for line in process.stdout:
            self.log_message(line.strip())

        process.wait()

        if process.returncode == 0:
            self.log_message("✅ Conversion completed successfully!")
        else:
            self.log_message("❌ Conversion failed!")

if __name__ == "__main__":
    root = tk.Tk()
    app = VideoConverterApp(root)
    root.mainloop()
