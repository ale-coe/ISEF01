# FE

- npm run build

# BE

- npm run build

# DB
- node init_db.js

# Docker

- FE/BE/DB bauen
- Image bauen: docker build --platform linux/amd64 -t isfe .
- Container starten: docker run -d -p 80:80 --name isfe_c isfe:latest
- Backend in Container starten: docker exec -d isfe_c node dist/main.js
- Betreten des Containers: docker exec -ti isfe_c bash


mkcert localhost 127.0.0.1 ::1