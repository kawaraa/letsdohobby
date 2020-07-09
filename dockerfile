FROM docker:dind

COPY . /home

WORKDIR /home

# RUN ["--privileged" "--name my-app" "-p 8080:8080" "-p 3306:3306" "-it -d"]