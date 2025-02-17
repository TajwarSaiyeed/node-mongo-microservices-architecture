# Node.js Microservices Project

This project is a Node.js microservices-based application that consists of multiple services: User, Captain, Ride, and Gateway. Each service is responsible for a specific domain and communicates with others using RabbitMQ for messaging.

## Services

1. **User Service**: Manages user registration, login, profile, and ride acceptance.
2. **Captain Service**: Manages captain registration, login, profile, availability, and ride acceptance.
3. **Ride Service**: Manages ride creation and acceptance.
4. **Gateway Service**: Acts as an API gateway to route requests to the appropriate services.

## Prerequisites

- Docker
- Docker Compose
- Node.js (if running locally)
- MongoDB (if running locally)

## Setup

### Environment Variables

Each service requires specific environment variables. Create a `.env` file in each service directory with the following variables:

- **User Service**:
  ```
  PORT=3001
  MONGO_URI="mongodb://mongo:27017/user-db"
  JWT_SECRET="your_jwt_secret"
  RABBIT_MQ_URI="your_rabbitmq_uri"
  ```

- **Captain Service**:
  ```
  PORT=3002
  MONGO_URI="mongodb://mongo:27017/captain-db"
  JWT_SECRET="your_jwt_secret"
  RABBIT_MQ_URI="your_rabbitmq_uri"
  ```

- **Ride Service**:
  ```
  PORT=3003
  MONGO_URI="mongodb://mongo:27017/ride-db"
  JWT_SECRET="your_jwt_secret"
  BASE_URL="http://localhost:3000/api"
  RABBIT_MQ_URI="your_rabbitmq_uri"
  ```

- **Gateway Service**:
  ```
  PORT=3000
  USER_SERVICE_URL="http://user-service:3001"
  CAPTAIN_SERVICE_URL="http://captain-service:3002"
  RIDE_SERVICE_URL="http://ride-service:3003"
  ```

### Running with Docker Compose

1. Navigate to the project root directory.
2. Run the following command to start all services:
   ```sh
   docker-compose up --build
   ```

### Running Locally

1. Start MongoDB and RabbitMQ services.
2. Navigate to each service directory and install dependencies:
   ```sh
   npm install
   ```
3. Start each service:
   ```sh
   npm start
   ```

## Usage

### User Service

- **Register**: `POST /api/user/register`
- **Login**: `POST /api/user/login`
- **Logout**: `GET /api/user/logout`
- **Profile**: `GET /api/user/profile`
- **Accepted Ride**: `GET /api/user/accepted-ride`

### Captain Service

- **Register**: `POST /api/captain/register`
- **Login**: `POST /api/captain/login`
- **Logout**: `GET /api/captain/logout`
- **Profile**: `GET /api/captain/profile`
- **Toggle Availability**: `PATCH /api/captain/toggle-availability`
- **New Ride**: `GET /api/captain/new-ride`

### Ride Service

- **Create Ride**: `POST /api/ride/create-ride`
- **Accept Ride**: `PUT /api/ride/accept-ride`

### Gateway Service

The gateway service routes requests to the appropriate services:

- **User Service**: `/api/user`
- **Captain Service**: `/api/captain`
- **Ride Service**: `/api/ride`
