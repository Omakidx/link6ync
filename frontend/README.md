# AuthApp Frontend

A comprehensive Next.js frontend application for the NODE_AUTH backend, featuring a polished UI/UX with full authentication capabilities.

## Features

- 🔐 **Complete Authentication Flow**

  - User registration with email verification
  - Login with email/password
  - Password reset functionality
  - Google OAuth integration
  - Two-factor authentication (TOTP)

- 🎨 **Modern UI/UX**

  - Responsive design with Tailwind CSS
  - Beautiful components with smooth animations
  - Dark/light mode ready
  - Toast notifications

- 🏗️ **Best Practices**
  - TypeScript for type safety
  - Zustand for state management
  - React Hook Form with Zod validation
  - Axios with automatic token refresh
  - Protected routes with auth guards

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **2FA QR Codes**: qrcode.react

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── admin/              # Admin-only pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/               # Authentication forms
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── api/                # API client and functions
│   │   └── utils.ts            # Utility functions
│   ├── providers/              # React context providers
│   ├── store/                  # Zustand state management
│   └── types/                  # TypeScript type definitions
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Key Features Explained

### Authentication Flow

1. **Registration**: Users register with name, email, and password. A verification email is sent.
2. **Email Verification**: Users click the link in their email to verify their account.
3. **Login**: Verified users can log in. If 2FA is enabled, they must enter the TOTP code.
4. **Token Management**: Access tokens are stored in localStorage, refresh tokens in httpOnly cookies.
5. **Auto Refresh**: Axios interceptors automatically refresh expired tokens.

### Two-Factor Authentication

1. Users navigate to Settings → Two-Factor Authentication
2. A QR code is displayed for scanning with an authenticator app
3. User enters the 6-digit code to verify and enable 2FA
4. On subsequent logins, the 2FA code is required

### Role-Based Access Control

- **User Role**: Access to dashboard, profile, and settings
- **Admin Role**: Additional access to admin panel with user management

## API Integration

The frontend integrates with the following backend endpoints:

| Endpoint                | Method | Description                |
| ----------------------- | ------ | -------------------------- |
| `/auth/register`        | POST   | User registration          |
| `/auth/login`           | POST   | User login                 |
| `/auth/logout`          | POST   | User logout                |
| `/auth/refresh`         | POST   | Refresh access token       |
| `/auth/verify-email`    | GET    | Verify email               |
| `/auth/forgot-password` | POST   | Request password reset     |
| `/auth/reset-password`  | POST   | Reset password             |
| `/auth/google`          | GET    | Google OAuth redirect      |
| `/auth/2fa/setup`       | GET    | Get 2FA QR code            |
| `/auth/2fa/verify`      | POST   | Verify and enable 2FA      |
| `/user/me`              | GET    | Get current user           |
| `/admin/dashboard`      | GET    | Get all users (admin only) |

## Customization

### Theming

Update the colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      },
    },
  },
},
```

### Environment Variables

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
