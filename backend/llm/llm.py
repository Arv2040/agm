from groq import Groq
from dotenv import load_dotenv
load_dotenv()
def llminfer(prompt: str, model: str = "llama-3.3-70b-versatile", temperature: float = 1, max_tokens: int = 1024):
    
    client = Groq()
    full_output = ""

    completion = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        max_completion_tokens=max_tokens,
        top_p=1,
        stream=True,
        stop=None
    )

    for chunk in completion:
        delta_content = chunk.choices[0].delta.content
        if delta_content:
            print(delta_content, end="", flush=True)
            full_output += delta_content

    print("\n--- Completion finished ---")
    return full_output

    
