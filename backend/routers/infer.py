from groq import Groq
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

load_dotenv()
router = APIRouter()

# Receive the full data as a string
class PromptRequest(BaseModel):
    prompt: str

@router.post("/")
def llminfer(request: PromptRequest):
    try:
        client = Groq()

        # Construct a structured prompt for vehicle placement analysis
        analysis_prompt = (
            f"You are an AI analyst for a vehicle rental company. "
            f"The following data contains vehicle types and demand information:\n\n"
            f"{request.prompt}\n\n"
            "Analyze the data and provide recommendations on where to place each type of vehicle "
            "to meet demand efficiently. Give a clear summary for each vehicle type. just give output dont add anything else send the data in proper format and in spaces."
        )

        # Create completion without streaming
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": analysis_prompt}],
            temperature=1.0,
            max_completion_tokens=1024,
            top_p=1,
            stream=False  # full output at once
        )

        # The model output is in completion.choices[0].message.content
        full_output = completion.choices[0].message.content

       
        return full_output

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
