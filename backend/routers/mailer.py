import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

load_dotenv()
router = APIRouter()

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

# Pydantic model for POST request
class MailRequest(BaseModel):
    to_email: str
    subject: str
    body_text: str
    body_html: str = None

@router.post("/")
def send_mail(request: MailRequest):
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = SMTP_USER
        msg["To"] = request.to_email
        msg["Subject"] = request.subject

        # Attach plain text
        if request.body_text:
            msg.attach(MIMEText(request.body_text, "plain"))
        # Attach HTML
        if request.body_html:
            msg.attach(MIMEText(request.body_html, "html"))

        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, request.to_email, msg.as_string())

        return {"status": "success", "message": "Email sent successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")
