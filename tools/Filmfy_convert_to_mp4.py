import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
import subprocess
import os
import threading

class VideoConverterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("FFmpeg Video Converter (Lossless)")
        self.root.geometry("650x500")

        self.input_file = None

        self.file_label = tk.Label(root, text="No file selected", fg="blue", wraplength=600)
        self.file_label.pack(pady=5)

        title_frame = tk.Frame(root)
        title_frame.pack(pady=10)
        
        tk.Label(title_frame, text="Output Filename (Title):").grid(row=0, column=0, padx=5)
        self.title_entry = tk.Entry(title_frame, width=40)
        self.title_entry.grid(row=0, column=1, padx=5)
        tk.Label(title_frame, text=".mp4").grid(row=0, column=2)

        btn_frame = tk.Frame(root)
        btn_frame.pack(pady=10)

        tk.Button(btn_frame, text="Select Movie", width=15, command=self.select_file).grid(row=0, column=0, padx=5)
        tk.Button(btn_frame, text="Convert", width=15, bg="green", fg="white", command=self.convert_video).grid(row=0, column=1, padx=5)
        tk.Button(btn_frame, text="Clear Log", width=15, command=self.clear_log).grid(row=0, column=2, padx=5)

        tk.Label(root, text="Process Log:").pack(anchor="w", padx=10)
        self.log = scrolledtext.ScrolledText(root, height=15)
        self.log.pack(fill="both", expand=True, padx=10, pady=10)

    def select_file(self):
        filetypes = [
            ("Video files", "*.ts *.mkv *.avi *.mov *.flv *.wmv *.mp4"),
            ("All files", "*.*")
        ]
        self.input_file = filedialog.askopenfilename(filetypes=filetypes)

        if self.input_file:
            self.file_label.config(text=f"Selected: {self.input_file}")
            base_name = os.path.splitext(os.path.basename(self.input_file))[0]
            self.title_entry.delete(0, tk.END)
            self.title_entry.insert(0, base_name)
            self.log_message(f"Selected file: {self.input_file}")

    def clear_log(self):
        self.log.delete(1.0, tk.END)

    def log_message(self, message):
        self.log.insert(tk.END, message + "\n")
        self.log.see(tk.END)

    def convert_video(self):
        if not self.input_file:
            messagebox.showwarning("Warning", "Please select a video file first!")
            return
        
        if not self.title_entry.get().strip():
            messagebox.showwarning("Warning", "Please enter a title for the output file!")
            return

        thread = threading.Thread(target=self.run_ffmpeg)
        thread.start()

    def run_ffmpeg(self):
        input_path = self.input_file
        output_dir = os.path.dirname(input_path)
        new_title = self.title_entry.get().strip()
        
        output_path = os.path.normpath(os.path.join(output_dir, f"{new_title}.mp4"))

        self.log_message("Starting conversion (Lossless Copy)...")
        self.log_message(f"Output: {output_path}")

        command = [
            "ffmpeg",
            "-y",
            "-i", input_path,
            "-c", "copy",
            "-movflags", "+faststart",
            output_path
        ]

        try:
            startupinfo = None
            if os.name == 'nt':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                startupinfo.wShowWindow = 0

            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                startupinfo=startupinfo
            )

            for line in process.stdout:
                self.log_message(line.strip())

            process.wait()

            if process.returncode == 0:
                self.log_message("\n✅ Conversion completed successfully!")
                messagebox.showinfo("Success", f"File saved as:\n{output_path}")
            else:
                self.log_message("\n❌ Conversion failed!")
                
        except Exception as e:
            self.log_message(f"Error: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = VideoConverterApp(root)
    root.mainloop()