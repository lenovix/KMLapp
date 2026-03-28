import os
import fitz
import tkinter as tk
from tkinter import filedialog, messagebox

def pdf_to_images():
    pdf_path = entry_pdf.get()
    base_output = r"D:\KMLapp\tools\output"

    if not pdf_path:
        messagebox.showwarning("Peringatan", "Silakan pilih file PDF terlebih dahulu!")
        return

    try:
        pdf_filename = os.path.basename(pdf_path)
        pdf_name_only = os.path.splitext(pdf_filename)[0]

        final_output_folder = os.path.join(base_output, pdf_name_only)

        if not os.path.exists(final_output_folder):
            os.makedirs(final_output_folder)

        label_status.config(text="Status: Sedang memproses...", fg="blue")
        root.update_idletasks()

        doc = fitz.open(pdf_path)
        
        zoom = 4 
        mat = fitz.Matrix(zoom, zoom)

        for i, page in enumerate(doc):
            pix = page.get_pixmap(matrix=mat)
            
            image_name = f"halaman_{i + 1:03d}.jpg"
            save_path = os.path.join(final_output_folder, image_name)
            
            pix.save(save_path)
        
        doc.close()
        
        label_status.config(text="Status: Selesai!", fg="green")
        messagebox.showinfo("Berhasil", f"Selesai! Gambar disimpan di:\n{final_output_folder}")

    except Exception as e:
        label_status.config(text="Status: Terjadi kesalahan", fg="red")
        messagebox.showerror("Error", f"Terjadi kesalahan: {str(e)}")

def browse_file():
    filename = filedialog.askopenfilename(
        title="Pilih File PDF",
        filetypes=[("PDF files", "*.pdf")]
    )
    if filename:
        entry_pdf.delete(0, tk.END)
        entry_pdf.insert(0, filename)

root = tk.Tk()
root.title("Komify - PDF to Image (Auto-Folder)")
root.geometry("500x250")

tk.Label(root, text="Konversi PDF ke Folder Gambar", font=("Arial", 12, "bold")).pack(pady=10)

frame = tk.Frame(root)
frame.pack(pady=10, padx=20)

entry_pdf = tk.Entry(frame, width=40)
entry_pdf.pack(side=tk.LEFT, padx=5)

btn_browse = tk.Button(frame, text="Pilih PDF", command=browse_file)
btn_browse.pack(side=tk.LEFT)

label_status = tk.Label(root, text="Status: Ready", fg="grey")
label_status.pack(pady=5)

btn_convert = tk.Button(root, text="START CONVERT", 
                       command=pdf_to_images, 
                       bg="#2196F3", fg="white", 
                       font=("Arial", 10, "bold"),
                       padx=20, pady=10)
btn_convert.pack(pady=20)

root.mainloop()