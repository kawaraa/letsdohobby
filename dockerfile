FROM docker:dind

COPY . .

ENV privileged=true



# RUN [  "apk add --no-cache py-pip", "&&", "pip install docker-compose"]
# RUN --privileged -p 8080:8080 -p 3306:3306
# CMD docker-compose up
# ENTRYPOINT [ "sh" ]

# RUN ["--privileged" "--name my-app" "-p 8080:8080" "-p 3306:3306" "-it -d"]
