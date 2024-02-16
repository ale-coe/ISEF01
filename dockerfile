FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
RUN apt-get install curl -y
RUN apt-get install ca-certificates -y 
RUN apt-get install gnupg -y
RUN mkdir -p /etc/apt/keyrings 
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt install nodejs -y

COPY FE/dist/fe /var/www/html
COPY default /etc/nginx/sites-available
COPY ssl/cert.pem /etc/nginx
COPY ssl/key.pem /etc/nginx

RUN mkdir -p /app/dist
WORKDIR /app

COPY BE/dist dist/
COPY BE/.env .
COPY BE/package.json .
COPY BE/localDb.db .

RUN npm install

CMD ["nginx","-g","daemon off;"]
