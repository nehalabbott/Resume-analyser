import fitz  # PyMuPDF
import logging

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract structured text from PDF resumes.
    Supports multi-column layouts using spatial sorting.
    """

    text_blocks = []

    try:

        with fitz.open(stream=file_bytes, filetype="pdf") as doc:

            for page in doc:

                blocks = page.get_text("blocks")

                # Sort blocks:
                # top-to-bottom first, then left-to-right
                blocks.sort(
                    key=lambda b: (
                        round(b[1] / 10) * 10,
                        b[0]
                    )
                )

                for block in blocks:

                    content = block[4].strip()

                    if content:

                        # Clean spaces
                        content = content.replace("\xa0", " ")

                        # Remove extra whitespace
                        content = " ".join(content.split())

                        text_blocks.append(content)

                # Separate pages
                text_blocks.append("\n")

        final_text = "\n".join(text_blocks).strip()

        return final_text

    except Exception as e:

        logger.error(f"PDF extraction failed: {e}")

        return ""