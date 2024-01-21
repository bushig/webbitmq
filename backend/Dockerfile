FROM python:3.11-slim

RUN mkdir /app
WORKDIR /app

COPY requirements.txt ./
COPY dev-requirements.txt ./
RUN pip install --no-cache-dir -r dev-requirements.txt
# TODO: make only prod

COPY . /app