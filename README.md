# Link6ync - URL Shortener with QR Code

A modern, full-stack URL shortener application with QR code generation and scanning capabilities.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **QR Code Generation**: Automatically generate QR codes for shortened links
- **QR Code Scanner**: Scan QR codes directly in the app
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Fast and responsive user interface

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **QR Code**: qrcode.react, html5-qrcode
- **Icons**: Lucide React, React Icons
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **URL Generation**: NanoID
- **Security**: Helmet, CORS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/link6ync.git
cd link6ync
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and add your MongoDB connection string:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` (if needed):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

## 🎮 Usage

1. **Backend**: Runs on `http://localhost:5000`
2. **Frontend**: Runs on `http://localhost:3000`

Visit `http://localhost:3000` in your browser to use the application.

## 📁 Project Structure

```
link6ync/
├── frontend/                # Next.js frontend application
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   └── public/            # Static assets
│
├── backend/               # Express.js backend API
│   ├── src/              # Source files
│   │   ├── config/       # Configuration
│   │   ├── database/     # Database setup
│   │   ├── Schema/       # MongoDB schemas
│   │   └── server.ts     # Entry point
│   └── auth/             # Authentication (if applicable)
│
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔧 Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server with hot reload
npm start        # Start production server
```

## 🚢 Deployment

### Backend
1. Build the TypeScript code: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Set environment variables on your hosting platform

### Frontend
1. Build the Next.js app: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service

## 🔒 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `MONGO_URI`: MongoDB connection string

### Frontend (.env)
- `NEXT_PUBLIC_API_URL`: Backend API URL

**⚠️ Important**: Never commit `.env` files to git! Use `.env.example` as a template.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is unlicensed.

## 👤 Author

**Omakidx**

## 🙏 Acknowledgments

- Radix UI for accessible component primitives
- Vercel for Next.js framework
- MongoDB for database solution
