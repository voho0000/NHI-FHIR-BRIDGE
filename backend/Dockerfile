FROM python:3.11-slim

WORKDIR /app

# CJK fonts for any future PDF / image rendering of FHIR resources.
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /app/data

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8010"]
