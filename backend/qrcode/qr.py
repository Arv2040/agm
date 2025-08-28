from fastapi import FastAPI
from fastapi.responses import JSONResponse, FileResponse
import qrcode
import os

app = FastAPI()

QR_FOLDER = "qr_codes"
os.makedirs(QR_FOLDER, exist_ok=True)


@app.get("/generate_qr/{vehicle_id}")
def generate_qr(vehicle_id: str):
    filename = os.path.join(QR_FOLDER, f"{vehicle_id}.png")
    
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(vehicle_id)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    
    return JSONResponse({
        "message": f"QR for vehicle {vehicle_id} generated successfully!",
        "qr_file": filename
    })


@app.get("/scan_qr/{vehicle_id}")
def scan_qr(vehicle_id: str):
    
    return JSONResponse({
        "message": f"Vehicle {vehicle_id} rented successfully! QR scanned."
    })


@app.get("/qr_image/{vehicle_id}")
def get_qr_image(vehicle_id: str):
    filepath = os.path.join(QR_FOLDER, f"{vehicle_id}.png")
    if os.path.exists(filepath):
        return FileResponse(filepath, media_type="image/png", filename=f"{vehicle_id}.png")
    return JSONResponse({"error": "QR not found"})
