# MedAlert Backend API

A complete Express.js REST API for a medication alert system with authentication, medication management, alerts, reports, community discussions, and location services.

## 🚀 Features

### ✅ Fully Implemented
- **Authentication System**: JWT-based authentication with user registration, login, profile management
- **Security**: Password hashing with bcrypt, rate limiting, CORS, Helmet security headers
- **Error Handling**: Comprehensive error handling with custom error classes
- **Validation**: Input validation using express-validator
- **Database**: MongoDB with Mongoose ODM and proper indexing

### 🔧 Boilerplate Endpoints
- **Medications**: CRUD operations for medication management
- **Alerts**: Medication reminder system with snooze functionality
- **Reports**: Medication adherence tracking and reporting
- **Discussions**: Community forum for medication discussions
- **Locations**: Pharmacy and healthcare location management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medalert-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment example file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Environment Variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/medalert
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Security Configuration
   BCRYPT_SALT_ROUNDS=12
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ Database Setup

The API uses MongoDB with Mongoose. Make sure MongoDB is running:

```bash
# Start MongoDB (if using local installation)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

#### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get current user profile | Private |
| PUT | `/update-profile` | Update user profile | Private |
| PUT | `/change-password` | Change password | Private |
| POST | `/refresh` | Refresh JWT token | Private |
| DELETE | `/delete-account` | Delete account | Private |

#### 💊 Medications (`/api/medications`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all medications | Private |
| POST | `/` | Add new medication | Private |
| GET | `/search` | Search medications | Private |
| PUT | `/bulk` | Bulk update medications | Private |
| GET | `/:id` | Get specific medication | Private |
| PUT | `/:id` | Update medication | Private |
| DELETE | `/:id` | Delete medication | Private |
| GET | `/:id/stats` | Get medication statistics | Private |

#### ⏰ Alerts (`/api/alerts`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all alerts | Private |
| POST | `/` | Create new alert | Private |
| GET | `/stats` | Get alert statistics | Private |
| GET | `/upcoming` | Get upcoming alerts | Private |
| PUT | `/bulk` | Bulk update alerts | Private |
| PUT | `/:id` | Update alert | Private |
| DELETE | `/:id` | Delete alert | Private |
| POST | `/:id/mark-taken` | Mark medication as taken | Private |
| POST | `/:id/snooze` | Snooze alert | Private |

#### 📊 Reports (`/api/reports`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all reports | Private |
| POST | `/` | Create new report | Private |
| GET | `/summary` | Get adherence summary | Private |
| GET | `/chart` | Get chart data | Private |
| GET | `/export` | Export reports | Private |
| GET | `/:id` | Get specific report | Private |
| PUT | `/:id` | Update report | Private |
| DELETE | `/:id` | Delete report | Private |

#### 💬 Discussions (`/api/discussions`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all discussions | Private |
| POST | `/` | Create new discussion | Private |
| GET | `/search` | Search discussions | Private |
| GET | `/popular` | Get popular discussions | Private |
| GET | `/:id` | Get specific discussion | Private |
| PUT | `/:id` | Update discussion | Private |
| DELETE | `/:id` | Delete discussion | Private |
| POST | `/:id/like` | Like/unlike discussion | Private |
| POST | `/:id/replies` | Add reply | Private |
| POST | `/:id/replies/:replyId/solution` | Mark reply as solution | Private |

#### 📍 Locations (`/api/locations`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all locations | Private |
| POST | `/` | Add new location | Private |
| GET | `/nearby` | Get nearby locations | Private |
| GET | `/search` | Search locations | Private |
| GET | `/favorites` | Get favorite locations | Private |
| GET | `/:id` | Get specific location | Private |
| PUT | `/:id` | Update location | Private |
| DELETE | `/:id` | Delete location | Private |
| POST | `/:id/favorite` | Toggle favorite | Private |
| POST | `/:id/review` | Add review | Private |

## 🔧 Usage Examples

### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Add Medication (with authentication)
```bash
curl -X POST http://localhost:5000/api/medications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Aspirin",
    "dosage": "100mg",
    "frequency": "Once daily",
    "instructions": "Take with food"
  }'
```

### Create Alert
```bash
curl -X POST http://localhost:5000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicationId": "med_1",
    "time": "08:00",
    "frequency": "daily",
    "message": "Time to take your medication!"
  }'
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
medalert-api/
├── config/
│   ├── database.js          # Database connection
│   └── default.js           # Application configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── medicationController.js
│   ├── alertController.js
│   ├── reportController.js
│   ├── discussionController.js
│   └── locationController.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Input validation
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Medication.js        # Medication schema
│   ├── Alert.js             # Alert schema
│   ├── Report.js            # Report schema
│   ├── Discussion.js        # Discussion schema
│   └── Location.js          # Location schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── medications.js       # Medication routes
│   ├── alerts.js            # Alert routes
│   ├── reports.js           # Report routes
│   ├── discussions.js       # Discussion routes
│   └── locations.js         # Location routes
├── utils/
│   └── helpers.js           # Utility functions
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                # Main application file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Rate Limiting**: Prevents abuse on authentication endpoints
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express.js
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Secure error responses without sensitive data exposure

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medalert
JWT_SECRET=your-super-secure-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start server.js --name "medalert-api"

# Monitor the application
pm2 monit

# View logs
pm2 logs medalert-api
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `http://localhost:5000/api`
- Review the health check at `http://localhost:5000/health`

## 🔄 Status

- ✅ Authentication System (Fully Implemented)
- 🔧 Medication Management (Boilerplate)
- 🔧 Alert System (Boilerplate)
- 🔧 Reporting System (Boilerplate)
- 🔧 Discussion Forum (Boilerplate)
- 🔧 Location Services (Boilerplate)

The authentication system is fully functional with proper JWT implementation, while other features are implemented as boilerplate endpoints that return mock data and success messages. These can be extended with actual database operations as needed. 