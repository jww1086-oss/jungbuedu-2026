import zipfile
import xml.etree.ElementTree as ET
import sys
import os

pptx_path = r"C:\Users\UserPC\Desktop\안티그래비티\교육플렛폼\중부위험성평가추가분.pptx"

if not os.path.exists(pptx_path):
    print("File not found.")
    sys.exit(1)

text_runs = []
try:
    with zipfile.ZipFile(pptx_path, 'r') as z:
        for filename in z.namelist():
            if filename.startswith('ppt/slides/slide') and filename.endswith('.xml'):
                xml_content = z.read(filename)
                tree = ET.fromstring(xml_content)
                for node in tree.iter():
                    if node.tag.endswith('}t') and node.text:
                        text_runs.append(node.text)
except Exception as e:
    print(e)
    sys.exit(1)

with open(r"C:\Users\UserPC\Desktop\안티그래비티\교육플렛폼\extracted.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(text_runs))
print("Extraction complete.")
