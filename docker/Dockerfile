FROM python:3.12

RUN apt-get update && apt-get install -y curl git build-essential \
 && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get install -y nodejs \
 && npm install -g expo-cli \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup fastapi server
COPY requirements.txt ./server/
COPY server ./server
RUN pip install --no-cache-dir -r ./server/requirements.txt

# Setup client
COPY client ./client
WORKDIR /app/client
RUN npm install \
 && npx expo export --platform web

WORKDIR /app
ENV APP_PORT=8000
EXPOSE ${APP_PORT}
CMD ["sh", "-c", "uvicorn server.src.main:app --host 0.0.0.0 --port $APP_PORT"]