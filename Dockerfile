# stage 1: build frontend React kalau sumbernya tersedia.
# PR backend bisa di-merge duluan tanpa nunggu PR frontend.
# Caranya: copy frontend/ ke /src, kalau gak ada hasilnya kosong
# dan npm install di-skip lewat shell check.
FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /build

# taruh sumber frontend kalau ada (di branch yang punya)
COPY frontend* /srccheck/

# kalau package.json ketemu, build. kalau gak, folder dist kosong.
RUN if [ -f /srccheck/package.json ]; then \
      cp -r /srccheck /frontend && \
      cd /frontend && npm install && npm run build && \
      mkdir -p /out && cp -r /frontend/dist/* /out/; \
    else \
      mkdir -p /out; \
    fi

# stage 2: backend + hasil build frontend (kalau ada)
FROM node:20-bookworm-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

# hasil build FE: berisi file React, atau kosong kalau FE belum ada
COPY --from=frontend-builder /out ./frontend/dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
