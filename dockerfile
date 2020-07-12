FROM mysql:latest

COPY . /usr
COPY init.sql /docker-entrypoint-initdb.d/


# "--default-authentication-plugin=caching_sha2_password"
CMD ["--default-authentication-plugin=mysql_native_password"]
ENV default-authentication-plugin=mysql_native_password
ENV MYSQL_ROOT_PASSWORD=root-psw
ENV MYSQL_USER=client MYSQL_PASSWORD=client-psw
RUN apt-get update
RUN apt install nodejs -y
RUN apt upgrade nodejs -y
RUN apt install npm -y
RUN apt upgrade npm -y
RUN npm instal
# RUN npm run dev

WORKDIR /usr

# ENTRYPOINT [ "/bin/sh" ]
# ENTRYPOINT [ "docker" ]


# EXPOSE 3306
# EXPOSE 33060