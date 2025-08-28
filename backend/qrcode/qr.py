import qrcode
import json

def generate_qr_from_json(data, filename="equipment_qr.png"):
    
    json_data = json.dumps(data, indent=2)
    
   
    qr = qrcode.QRCode(
        version=None,  
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(json_data)
    qr.make(fit=True)
    
   
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    print(f"✅ QR Code saved as {filename}")


equipment_data = {
  "Equipment": {
  "EquipmentID": "EQX1001",
  "Type": "Excavator",
  "SiteID": "S003",
  "CheckOutDate": "2025-04-01",
  "CheckInDate": "2025-04-16",
  "EngineHoursPerDay": 1.5,
  "IdleHoursPerDay": 10,
  "OperatingDays": 15,
  "LastOperatorID": "OP101"
}

}


generate_qr_from_json(equipment_data, "equipment_qr.png")
