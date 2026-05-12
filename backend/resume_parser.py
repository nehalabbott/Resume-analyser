# Import PyMuPDF library
# "fitz" is the module name used by PyMuPDF
import fitz

def extract_text_from_pdf(file_bytes: bytes) -> str:

    #store extracted text sections
    text_blocks = []

    #open PDF from memory using bytes stream
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            #extract text as blocks
            #(x0, y0, x1, y1, text, block_no, block_type)
            blocks = page.get_text("blocks")
            #sort blocks top to bottom and left to right
            blocks.sort(key=lambda b: (round(b[1] / 10) * 10, b[0]))

            #process each text block
            for block in blocks:
                # block[4] contains the actual text content
                content = block[4].strip()
                
                #ignore empty blocks
                if content:
                    content = content.replace("\xa0", " ")
                    content = " ".join(content.split())
                    text_blocks.append(content)

    return "\n".join(text_blocks)
