# SubDub - Subscription Tracker API

A comprehensive subscription management system built with Node.js, Express, and MongoDB. Track your subscriptions, get renewal reminders, and manage your recurring payments efficiently.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Subscription Management**: Create, read, update, and delete subscriptions
- **Automated Reminders**: Smart email notifications for upcoming renewals (7, 5, 2, 1 days before)
- **Workflow Automation**: Upstash Workflow integration for reliable reminder scheduling
- **Security**: Arcjet middleware for rate limiting and security protection
- **Email Notifications**: Nodemailer integration with customizable email templates
- **Data Validation**: Comprehensive input validation and error handling
- **Multi-Currency Support**: USD, EUR, GBP, INR currency options
- **Flexible Billing**: Daily, weekly, monthly, and yearly subscription frequencies

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Arcjet, bcryptjs
- **Email**: Nodemailer
- **Workflow**: Upstash Workflow
- **Date Handling**: Day.js
- **Development**: Nodemon, ESLint

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Email service credentials (Gmail/SMTP)
- Upstash account for workflow management
- Arcjet account for security features

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd subscription-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.development.local` file in the root directory:

```env
# Server Configuration
PORT=5500
SERVER_URL="http://localhost:5500"
NODE_ENV='development'

# Database
DB_URI="your_mongodb_connection_string"

# JWT Authentication
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="1d"

# Arcjet Security
ARCJET_KEY="your_arcjet_key"
ARCJET_ENV="development"

# Upstash Workflow
QSTASH_URL="your_qstash_url"
QSTASH_TOKEN="your_qstash_token"

# Email Configuration
EMAIL_PASSWORD="your_email_app_password"
```

### 4. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5500`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Subscription Endpoints

#### Create Subscription
```http
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "paymentMethod": "Credit Card",
  "startDate": "2024-01-01"
}
```

#### Get User Subscriptions
```http
GET /api/v1/subscriptions/user/:userId
Authorization: Bearer <token>
```

### Workflow Endpoints

#### Subscription Reminder Workflow
```http
POST /api/v1/workflows/subscription/reminder
Content-Type: application/json

{
  "subscriptionId": "subscription_object_id"
}
```

## 🗂️ Project Structure

```
subscription-tracker/
├── config/
│   ├── arcjet.js          # Arcjet security configuration
│   ├── env.js             # Environment variables
│   ├── nodemailer.js      # Email service configuration
│   └── upstash.js         # Upstash workflow client
├── controllers/
│   ├── auth.controller.js      # Authentication logic
│   ├── subscription.controller.js # Subscription CRUD operations
│   ├── user.controller.js      # User management
│   └── workflow.controller.js  # Workflow automation
├── database/
│   └── mongodb.js         # Database connection
├── middlewares/
│   ├── arcjet.middleware.js    # Security middleware
│   ├── auth.middleware.js      # JWT authentication
│   └── error.middleware.js     # Error handling
├── models/
│   ├── subscription.model.js   # Subscription schema
│   └── user.model.js          # User schema
├── routes/
│   ├── auth.routes.js         # Authentication routes
│   ├── subscription.routes.js # Subscription routes
│   ├── user.routes.js         # User routes
│   └── workflow.routes.js     # Workflow routes
├── utils/
│   ├── email-template.js      # Email templates
│   └── send-emaill.js         # Email sending utility
├── app.js                     # Application entry point
└── package.json              # Dependencies and scripts
```

## 🔧 Configuration

### Database Schema

#### User Model
- `name`: String (required, 2-50 characters)
- `email`: String (required, unique, validated)
- `password`: String (required, min 6 characters, hashed)

#### Subscription Model
- `name`: String (required, 2-100 characters)
- `price`: Number (required, min 0)
- `currency`: Enum ['USD', 'EUR', 'GBP', 'INR']
- `frequency`: Enum ['daily', 'weekly', 'monthly', 'yearly']
- `category`: Enum ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other']
- `paymentMethod`: String (required)
- `status`: Enum ['active', 'cancelled', 'expired']
- `startDate`: Date (required, must be in past)
- `renewalDate`: Date (auto-calculated based on frequency)
- `user`: ObjectId (reference to User)

### Email Reminder System

The application automatically sends email reminders at:
- 7 days before renewal
- 5 days before renewal
- 2 days before renewal
- 1 day before renewal

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Mongoose schema validation
- **Rate Limiting**: Arcjet middleware protection
- **CORS**: Cross-origin resource sharing configuration
- **Error Handling**: Centralized error management

## 🚀 Deployment

### AWS EC2 with PM2 (Production)

This application is deployed on AWS EC2 using PM2 for process management.

#### Setup Steps:
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2 (using npm start)
pm2 start npm --name subdub -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Monitor application
pm2 status
pm2 logs subdub
```

#### PM2 Commands:
```bash
# Restart application
pm2 restart subdub

# Stop application
pm2 stop subdub

# View logs
pm2 logs subdub --lines 100

# Monitor resources
pm2 monit

# Kill processes on port (if needed)
pkill node
lsof -i :5500
```

### Environment Variables for Production
Create `.env.production.local` file:
```env
NODE_ENV='production'
PORT=5500
SERVER_URL="http://localhost:5500"
DB_URI="your_mongodb_production_uri"
JWT_SECRET="your_strong_production_secret"
JWT_EXPIRES_IN="1d"
ARCJET_KEY="your_arcjet_production_key"
ARCJET_ENV="production"
QSTASH_URL="your_qstash_url"
QSTASH_TOKEN="your_qstash_token"
EMAIL_PASSWORD="your_email_password"
```

#### Important Notes:
- Ensure `NODE_ENV=production` is set in package.json start script
- Use `openssl rand -hex 64` to generate secure JWT secrets
- Configure Arcjet for production IP handling

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npx eslint .
```

## 📈 Monitoring and Logging

- Request logging with Morgan
- Error tracking and handling
- Workflow execution monitoring via Upstash
- Email delivery status tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Roadmap

- [ ] Frontend dashboard
- [ ] Mobile app integration
- [ ] Advanced analytics
- [ ] Multiple payment method tracking
- [ ] Subscription cost optimization suggestions
- [ ] Integration with banking APIs
- [ ] Push notifications
- [ ] Subscription sharing features

---

**Built with ❤️ using Node.js and modern web technologies**