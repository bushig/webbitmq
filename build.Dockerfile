FROM python:3.8-slim

RUN mkdir /app
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app