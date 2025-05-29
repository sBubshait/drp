FROM maven:3.8.3-openjdk-17

WORKDIR /app

COPY pom.xml .
COPY application.yml .

RUN mvn dependency:go-offline -B

COPY src ./src

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]