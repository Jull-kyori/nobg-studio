from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io

app = FastAPI(
    title="NoBg Studio API",
    description="API untuk menghapus background foto otomatis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024


@app.get("/")
def home():
    return {
        "message": "NoBg Studio API is running"
    }


@app.post("/remove-background")
async def remove_background(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        return Response(
            content="File harus berupa gambar",
            status_code=400
        )

    image_bytes = await image.read()

    if len(image_bytes) > MAX_FILE_SIZE:
        return Response(
            content="Ukuran gambar maksimal 10MB",
            status_code=400
        )

    try:
        input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

        output_image = remove(input_image)

        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format="PNG")

        return Response(
            content=output_buffer.getvalue(),
            media_type="image/png"
        )

    except Exception as e:
        return Response(
            content=f"Gagal memproses gambar: {str(e)}",
            status_code=500
        )