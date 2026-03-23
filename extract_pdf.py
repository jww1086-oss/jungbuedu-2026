import sys
import subprocess

try:
    from pypdf import PdfReader
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    from pypdf import PdfReader

if len(sys.argv) < 2:
    print("Please provide a pdf path.")
    sys.exit(1)

pdf_path = sys.argv[1]
reader = PdfReader(pdf_path)

texts = []
for page in reader.pages:
    text = page.extract_text()
    if text:
        texts.append(text)

with open(r"C:\Users\UserPC\Desktop\안티그래비티\교육플렛폼\extracted.txt", "w", encoding="utf-8") as f:
    f.write("\n\n---\n\n".join(texts))

print("Extraction length:", len(texts))
