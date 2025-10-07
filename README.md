# E-Commerce Portfolio Platform

A comprehensive e-commerce portfolio platform built with React and Node.js, featuring real-time collaboration, freelancing marketplace, and portfolio management.

## Features

- **Portfolio Management**: Create and manage professional portfolios
- **Real-time Collaboration**: Live editing and collaboration features
- **Freelancing Marketplace**: Job posting and proposal system
- **Authentication & Authorization**: Secure user management
- **Payment Integration**: Stripe payment processing
- **File Upload**: Cloudinary integration for media management
- **Real-time Communication**: Socket.io for live updates

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Query
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT Authentication
- Stripe API
- Cloudinary API

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd e-commerce-folio
```

2. Install dependencies
```bash
# Install root dependencies
pnpm install

# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

3. Set up environment variables
```bash
# Server .env
cp server/.env.example server/.env
# Configure your MongoDB URI, JWT secret, Stripe keys, etc.

# Client .env (if needed)
cp client/.env.example client/.env
```

4. Start the development servers
```bash
# Start server (from server directory)
cd server
pnpm dev

# Start client (from client directory)
cd ../client
pnpm dev
```

## Project Structure

```
e-commerce-folio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── context/        # React contexts
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── socket/            # Socket.io handlers
│   └── config/            # Configuration files
├── database/              # Database setup
├── infrastructure/        # Docker & CI/CD
└── docs/                  # Documentation
```

## API Documentation

See [API.md](docs/API.md) for detailed API documentation.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## License

This project is licensed under the ISC License.

## Copyright

© 2025 devtechs001. All rights reserved.
