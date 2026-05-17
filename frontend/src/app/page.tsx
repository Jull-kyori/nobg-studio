"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import { Upload, Download, ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const removeBackground = async () => {
    if (!selectedImage) {
      alert("Pilih gambar terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await axios.post(
        "http://localhost:8000/remove-background",
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const resultBlob = new Blob([response.data], {
        type: "image/png",
      });

      setResultUrl(URL.createObjectURL(resultBlob));
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus background. Pastikan backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "nobg-studio-result.png";
    link.click();
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500">
              <Sparkles size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">NoBg Studio</h1>
              <p className="text-sm text-slate-400">Free HD Background Remover</p>
            </div>
          </div>

          <a
            href="#upload"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Mulai Upload
          </a>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              Gratis • Tanpa Login • Tanpa Watermark
            </div>

            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Hapus background foto secara otomatis dan tetap HD.
            </h2>

            <p className="max-w-xl text-lg leading-relaxed text-slate-300">
              Upload foto kamu, biarkan AI menghapus background secara otomatis,
              lalu download hasilnya dalam format PNG transparan.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#upload"
                className="rounded-full bg-blue-500 px-7 py-3 font-semibold transition hover:bg-blue-600"
              >
                Upload Sekarang
              </a>

              <button className="rounded-full border border-white/10 px-7 py-3 font-semibold text-slate-200 transition hover:bg-white/10">
                Lihat Fitur
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-slate-800">
                <ImageIcon className="text-slate-500" size={80} />
              </div>

              <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-[linear-gradient(45deg,#334155_25%,transparent_25%),linear-gradient(-45deg,#334155_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#334155_75%),linear-gradient(-45deg,transparent_75%,#334155_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]">
                <Sparkles className="text-blue-400" size={80} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="upload" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold">Upload Foto</h3>
            <p className="mt-2 text-slate-400">
              Format JPG, PNG, JPEG, atau WEBP. Hasil akan menjadi PNG transparan.
            </p>
          </div>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed p-10 text-center transition ${
              dragActive
                ? "border-blue-400 bg-blue-500/10"
                : "border-white/10 bg-slate-900/60 hover:bg-slate-900"
            }`}
          >
            <Upload className="mb-4 text-blue-400" size={48} />
            <p className="text-lg font-semibold">
              Drag & drop gambar di sini
            </p>
            <p className="mt-1 text-sm text-slate-400">
              atau klik untuk memilih file
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </label>

          {previewUrl && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-900 p-4">
                <h4 className="mb-4 font-semibold">Gambar Asli</h4>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[420px] w-full rounded-2xl object-contain"
                />
              </div>

              <div className="rounded-[1.5rem] bg-slate-900 p-4">
                <h4 className="mb-4 font-semibold">Hasil Remove Background</h4>

                {resultUrl ? (
                  <div className="rounded-2xl bg-[linear-gradient(45deg,#334155_25%,transparent_25%),linear-gradient(-45deg,#334155_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#334155_75%),linear-gradient(-45deg,transparent_75%,#334155_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]">
                    <img
                      src={resultUrl}
                      alt="Result"
                      className="max-h-[420px] w-full rounded-2xl object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 text-slate-500">
                    Hasil akan muncul di sini
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={removeBackground}
              disabled={!selectedImage || loading}
              className="flex items-center gap-2 rounded-full bg-blue-500 px-7 py-3 font-semibold transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Memproses...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Remove Background
                </>
              )}
            </button>

            {resultUrl && (
              <button
                onClick={downloadResult}
                className="flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                <Download size={20} />
                Download PNG
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            "100% Gratis",
            "Tanpa Watermark",
            "Hasil PNG HD",
            "Tanpa Login",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}