# FE

- npm run build

# BE

- npm run build

# DB

- node init_db.js

# ssl

- openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem

# Docker

- FE/BE/DB/ssl bauen
- Image bauen: docker build --platform linux/amd64 -t isfe .
- Container starten: docker run -d -p 80:80 -p 443:443 --name isfe_c isfe:latest
- Backend in Container starten: docker exec -d isfe_c node dist/main.js
- Betreten des Containers: docker exec -ti isfe_c bash
