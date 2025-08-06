FROM openjdk:17-jdk-slim

LABEL maintainer="Task Manager App"

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/task-management-app-0.0.1-SNAPSHOT.jar"]