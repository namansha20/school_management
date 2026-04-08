# School Management API

A Node.js REST API for managing school data, built with Express.js and MySQL.

## Features

- **Add School** – Add a new school with name, address, latitude, and longitude.
- **List Schools** – Retrieve all schools sorted by proximity to a user-specified location.

## Tech Stack

- Node.js
- Express.js
- MySQL (via `mysql2`)
- dotenv

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/namansha20/school_management.git
   cd school_management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your MySQL credentials:
   ```bash
   cp .env.example .env
   ```

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=school_management
   PORT=3000
   ```

4. **Create the database and table**

   Run the provided SQL schema:
   ```bash
   mysql -u root -p < schema.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

## API Endpoints

### POST `/addSchool`

Add a new school to the database.

**Request Body (JSON):**
```json
{
  "name": "Springfield Elementary",
  "address": "123 Main St, Springfield",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Springfield Elementary",
    "address": "123 Main St, Springfield",
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

---

### GET `/listSchools`

Retrieve all schools sorted by proximity to the given coordinates.

**Query Parameters:**
- `latitude` – User's latitude (required)
- `longitude` – User's longitude (required)

**Example Request:**
```
GET /listSchools?latitude=37.7749&longitude=-122.4194
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Springfield Elementary",
      "address": "123 Main St, Springfield",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "distance": 0
    }
  ]
}
```

## Project Structure

```
school_management/
├── src/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   └── schoolController.js # Route handlers & business logic
│   └── routes/
│       └── schoolRoutes.js    # Express route definitions
├── index.js                   # Application entry point
├── schema.sql                 # MySQL schema
├── .env.example               # Example environment variables
└── package.json
```