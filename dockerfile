FROM mysql:latest

COPY . /usr
COPY init.sql /docker-entrypoint-initdb.d/
WORKDIR /usr

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs
RUN npm install

ENV default-authentication-plugin=mysql_native_password
ENV MYSQL_ROOT_PASSWORD=root-psw
ENV MYSQL_USER=client MYSQL_PASSWORD=client-psw
# "--default-authentication-plugin=caching_sha2_password"
CMD ["--default-authentication-plugin=mysql_native_password"]

# ENTRYPOINT [ "docker-entrypoint.sh" ]
# EXPOSE 3306
# EXPOSE 33060