FROM alpine:3.7

COPY . .

RUN apk update
RUN apk add --no-cache docker
RUN apk add py-pip python3-dev libffi-dev openssl-dev gcc libc-dev make pip3 install docker-compose
RUN pip install --upgrade pip

# WORKDIR /usr