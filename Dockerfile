# Use a Node.js image to build the frontend assets
FROM node:16 AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend source files
COPY netquest-frontend/ .

# Install dependencies and build the frontend
RUN npm install
RUN npm run build

# Use a Java JDK image for the backend
FROM openjdk:21-jdk AS backend

# Set working directory for backend
WORKDIR /app/backend

# Copy backend source files
COPY netquest-backend/ .

# Copy frontend build files to the backend's resources (assuming Spring Boot or similar)
COPY --from=frontend-build /app/frontend/build /app/backend/src/main/resources/static

# Build the backend (e.g., using Maven or Gradle)
RUN ./mvnw clean package -DskipTests

# Expose the necessary port
EXPOSE 3000

# Start the backend server (adjust the JAR file name as needed)
CMD ["java", "-jar", "target/netquest-api-0.0.1-SNAPSHOT.jar"]
