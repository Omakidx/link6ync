# Backend - Link Shortener API

Express.js + TypeScript backend for the Link Shortener application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **ID Generation**: NanoID

## Features

- URL shortening service
- MongoDB integration
- CORS enabled
- Compression middleware
- Cookie parser
- Security headers (Helmet)
- TypeScript for type safety
- Hot reload with Nodemon

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```

## Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in .env)

## Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── server.ts          # Main application entry point
│   ├── config/            # Configuration files
│   ├── database/          # Database connection
│   └── Schema/            # MongoDB schemas
├── auth/                  # Authentication service (if applicable)
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── nodemon.json           # Nodemon configuration
└── eslint.config.mjs      # ESLint configuration
```

## API Endpoints

(Add your API endpoints documentation here as you develop)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGO_URI | MongoDB connection string | - |

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Unlicensed
