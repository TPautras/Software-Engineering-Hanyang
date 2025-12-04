FROM python:3.11-slim

WORKDIR /app

COPY api/requirements.txt api/requirements.txt
RUN pip install --no-cache-dir -r api/requirements.txt

COPY . .

ENV PYTHONPATH=/app
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/serviceAccountKey.json

EXPOSE 8080

CMD ["sh", "-c", "uvicorn api.inference_main:app --host 0.0.0.0 --port ${PORT:-8080}"]
