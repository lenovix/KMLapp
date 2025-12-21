import re
import tkinter as tk
from tkinter import messagebox


def fix_paragraph(text):
    # Ganti simbol tertentu jadi koma
    for symbol in ["|", "♀", "♂"]:
        text = text.replace(symbol, ",")

    # Split berdasarkan angka + huruf K
    parts = re.split(r"\d+K?|\d+", text)

    # Bersihkan spasi
    cleaned = [part.strip() for part in parts if part.strip()]

    # Tambahkan koma di akhir
    return ", ".join(cleaned) + ","


def process_text(event=None):  # Tambahkan event=None agar bisa dipanggil dari shortcut
    input_text = input_box.get("1.0", tk.END).strip()
    if not input_text:
        messagebox.showwarning("Peringatan", "Masukkan teks terlebih dahulu!")
        return
    result = fix_paragraph(input_text)
    output_box.delete("1.0", tk.END)
    output_box.insert(tk.END, result)

    # ✅ Copy ke clipboard pakai Tkinter (cross-platform)
    root.clipboard_clear()
    root.clipboard_append(result)
    root.update()  # penting supaya clipboard langsung terisi


def reset_text(event=None):  # Tambahkan event=None agar bisa dipanggil dari shortcut
    input_box.delete("1.0", tk.END)
    output_box.delete("1.0", tk.END)


# Buat window utama
root = tk.Tk()
root.title("Fix Paragraph Tool")
root.geometry("500x450")

# Label dan input
tk.Label(root, text="Masukkan Paragraf:", font=("Arial", 12)).pack(pady=5)
input_box = tk.Text(root, height=5, width=50)
input_box.pack(pady=5)

# Frame untuk tombol
button_frame = tk.Frame(root)
button_frame.pack(pady=10)

# Tombol Proses & Copy
tk.Button(
    button_frame,
    text="Proses & Copy",
    command=process_text,
    font=("Arial", 12),
    bg="#4CAF50",
    fg="white",
    width=15,
).grid(row=0, column=0, padx=5)

# Tombol Reset
tk.Button(
    button_frame,
    text="Reset",
    command=reset_text,
    font=("Arial", 12),
    bg="#f44336",
    fg="white",
    width=10,
).grid(row=0, column=1, padx=5)

# Output
tk.Label(root, text="Hasil:", font=("Arial", 12)).pack(pady=5)
output_box = tk.Text(root, height=5, width=50)
output_box.pack(pady=5)

# ✅ Shortcut keyboard
root.bind("<Control-p>", process_text)  # Ctrl+P untuk proses
root.bind("<Control-r>", reset_text)  # Ctrl+R untuk reset

root.mainloop()
