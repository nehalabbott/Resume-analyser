#using Python 3.11 image as base
FROM python:3.11-slim

#setting working directory inside container
WORKDIR /app

#to install system dependencies for PyMuPDF
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmupdf-dev \
    && rm -rf /var/lib/apt/lists/*

#copy dependency list
COPY requirements.txt .

#install python packages
RUN pip install --no-cache-dir -r requirements.txt

#copy all project files onto container
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
