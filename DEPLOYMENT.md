# Deployment Guide

This guide covers how to deploy the Payment UI Component and Admin Dashboard system.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Environment Setup

### 1. Database Setup

First, set up your PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE payment_ui;

# Exit psql
\q
```

Run the database migrations:

```bash
# Navigate to database directory
cd database

# Run schema creation
psql -U postgres -d payment_ui -f schema.sql

# Run seed data (optional)
psql -U postgres -d payment_ui -f seed.sql
```

### 2. Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=payment_ui
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# JWT_SECRET=your_very_long_and_secure_jwt_secret
```

### 3. Frontend Configuration

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for API URL (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## Development Setup

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

## Production Deployment

### 1. Backend Production Build

```bash
cd backend

# Build TypeScript
npm run build

# Start production server
npm start
```

### 2. Frontend Production Build

```bash
cd frontend

# Build for production
npm run build

# The build folder contains the production-ready files
```

### 3. Environment Variables for Production

Update your environment variables for production:

**Backend (.env):**
```
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=payment_ui
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_very_long_and_secure_jwt_secret_for_production
```

**Frontend (.env.production):**
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Docker Deployment (Optional)

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: payment_ui
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      DB_USER: postgres
      DB_PASSWORD: password
      DB_NAME: payment_ui
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Cloud Deployment Options

### Vercel (Frontend)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Heroku (Backend + Database)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-payment-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

### Railway (Full Stack)

1. Connect your GitHub repository to Railway
2. Deploy backend with PostgreSQL addon
3. Deploy frontend separately
4. Configure environment variables in Railway dashboard

## Security Considerations

1. **Environment Variables**: Never commit sensitive environment variables
2. **JWT Secret**: Use a strong, unique JWT secret for production
3. **Database**: Use strong database credentials and restrict access
4. **CORS**: Configure CORS properly for your frontend domain
5. **HTTPS**: Always use HTTPS in production
6. **API Rate Limiting**: Consider adding rate limiting to your API endpoints

## Monitoring and Logging

Consider adding:

- Application logging (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Uptime monitoring (Pingdom, UptimeRobot)

## Backup Strategy

1. **Database Backups**: Set up automated PostgreSQL backups
2. **Code Backups**: Use version control (Git) with remote repositories
3. **Environment Configs**: Keep secure backups of environment configurations

## Support

For deployment issues:

1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure database connectivity
4. Check firewall and security group settings
5. Verify API endpoints are accessible

## Admin Credentials

Default admin credentials for testing:
- Email: `admin@paymentui.com`
- Password: `admin123`

**Important**: Change these credentials in production by updating the database directly or through the admin interface.