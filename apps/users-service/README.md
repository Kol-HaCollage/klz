# Users Service

A Node.js/Express authentication service built with TypeScript, PostgreSQL, and raw SQL queries.

## Features

- User registration with password hashing (bcrypt)
- User login with credential verification
- PostgreSQL database with UUID primary keys
- Input validation and error handling
- RESTful API design

## API Endpoints

| Method | Endpoint           | Description       | Body                                         |
| ------ | ------------------ | ----------------- | -------------------------------------------- |
| GET    | `/health`          | Health check      | -                                            |
| GET    | `/api`             | Service info      | -                                            |
| POST   | `/api/auth/signup` | User registration | `{ email, password, firstName?, lastName? }` |
| POST   | `/api/auth/login`  | User login        | `{ email, password }`                        |

## Quick Start

### Prerequisites

- Node.js (v18+)
- npm
- PostgreSQL database

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Choose one of these database options:

#### Option A: Local PostgreSQL (Recommended for Development)

1. Install PostgreSQL locally
2. Create database and user:

```sql
CREATE DATABASE user_db;
CREATE USER users_service WITH PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE user_db TO users_service;
```

3. Set environment variables in `.env`:

```env
DATABASE_URL=
```

4. Run the database migration:

```bash
npx ts-node apps/users-service/src/test-db.ts
```

#### Option B: Minikube PostgreSQL (Current Setup)

1. Start minikube and install PostgreSQL:

```bash
minikube start
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgres bitnami/postgresql --set auth.database=user_db --set auth.username=users_service --set auth.password=dev_password_123
```

2. Port forward PostgreSQL:

```bash
kubectl port-forward svc/postgres-postgresql 5432:5432
```

3. Set environment variables in `.env`:

```env
DATABASE_URL=postgresql://users_service:dev_password_123@localhost:5432/user_db
```

4. Run the migration:

```bash
npx ts-node apps/users-service/src/test-db.ts
```

### 3. Start the Service

```bash
npx nx serve users-service
```

The service will be available at `http://localhost:3333`

## Environment Variables

Create a `.env` file in the workspace root:

```env
# Application
NODE_ENV=
PORT=

# Frontend URL for CORS
FRONTEND_URL=

# Database
DATABASE_URL=
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Registration

```bash
curl -X POST http://localhost:3333/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "firstName": "John"}'
```

### Login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Project Structure

```
apps/users-service/
├── src/
│   ├── main.ts                 # Express app setup
│   ├── routes/
│   │   └── authRoutes.ts       # Authentication endpoints
│   └── database/
│       ├── connection.ts       # PostgreSQL connection
│       └── migrations/
│           └── 001-create-users.sql
├── .env                        # Environment variables
└── README.md
```

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with raw SQL queries
- **Authentication**: bcrypt for password hashing
- **Build Tool**: nx
- **Security**: helmet, cors

## Development

### Available Scripts

- `npx nx serve users-service` - Start development server
- `npx nx build users-service` - Build for production
- `npx nx lint users-service` - Lint code
- `npx nx test users-service` - Run tests
