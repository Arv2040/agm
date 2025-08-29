import qrcode





item_id = "CAT449"
vehicle_type = "Dozer"

# Build URL with query params
url = f"http://127.0.0.1/scan?item_id={item_id}&vehicle_type={vehicle_type}"


img = qrcode.make(url)

# Save as image
img.save("rental_qr.png")

print("✅ QR code generated: rental_qr.png")
print(f"Scan this QR → {url}")
