import fitz  # PyMuPDF


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract and structure text from a PDF file.
    Handles multi-column layouts by sorting blocks spatially.
    """
    text_blocks = []

    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            blocks = page.get_text("blocks")
            # Sort top-to-bottom, left-to-right
            blocks.sort(key=lambda b: (round(b[1] / 10) * 10, b[0]))
            for block in blocks:
                content = block[4].strip()
                if content:
                    # Clean non-breaking spaces and extra whitespace
                    content = content.replace("\xa0", " ")
                    content = " ".join(content.split())
                    text_blocks.append(content)

    return "\n".join(text_blocks)
