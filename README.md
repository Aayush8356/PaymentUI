# Payment UI Component & Admin Dashboard

A comprehensive full-stack payment UI component and admin dashboard system built with modern technologies and beautiful glassmorphism design.

![Payment UI Demo](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react)

## 🚀 Technologies

### Frontend Stack
- **React 18** with TypeScript
- **TailwindCSS** with custom glassmorphism theme
- **shadcn/ui** components for consistent design
- **Framer Motion** for smooth animations
- **Recharts** for interactive analytics
- **Axios** for API communication

### Backend Stack
- **Node.js** with TypeScript
- **Express.js** web framework
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **Helmet** & **CORS** for security

## 📁 Project Structure

```
PaymentUI/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── PaymentUI.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── TransactionTable.tsx
│   │   │   └── AnalyticsCharts.tsx
│   │   ├── lib/            # Utilities and API
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
├── backend/                 # Node.js TypeScript API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── config/         # Database config
│   │   └── types/          # TypeScript types
│   └── package.json
├── database/               # PostgreSQL schema & seeds
│   ├── schema.sql
│   └── seed.sql
├── DEPLOYMENT.md          # Detailed deployment guide
└── package.json          # Root package scripts
```

## 🎯 Key Features

### 🎨 Payment UI Component
- **Beautiful glassmorphic design** with neon aesthetics
- **Multi-payment support**: UPI, Cards, NetBanking, PayPal, Wallets
- **Real-time validation** and error handling
- **Smooth animations** with Framer Motion
- **Fully responsive** and mobile-optimized
- **TypeScript** for type safety
- **Exportable** as standalone npm package

### 📊 Admin Dashboard
- **Secure JWT authentication** system
- **Real-time transaction monitoring** 
- **Advanced filtering & search** capabilities
- **Interactive analytics charts**:
  - Payment method distribution (Pie chart)
  - Daily revenue trends (Line chart)
  - Transaction status breakdown (Bar chart)
  - Hourly transaction patterns
- **Export functionality** for reports
- **Responsive design** for all devices

### 🔒 Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention

## 🛠 Quick Start

### 🎉 **CURRENTLY RUNNING** 
- **Frontend**: http://localhost:3001 ✅
- **Backend**: http://localhost:5001 ✅
- **Database**: Needs PostgreSQL setup ⚠️

### Option 1: One-Command Setup
```bash
# Install all dependencies
npm run install:all

# Set up database (ensure PostgreSQL is running)
createdb payment_ui
npm run db:setup
npm run db:seed

# Start both frontend and backend
npm run dev
```

### Option 2: Manual Setup

#### 1. Database Setup
```bash
# Create PostgreSQL database
createdb payment_ui

# Run schema migration
psql -d payment_ui -f database/schema.sql

# (Optional) Add sample data
psql -d payment_ui -f database/seed.sql
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🌟 Usage Examples

### Basic Payment Component
```tsx
import { PaymentUI } from '@/components/PaymentUI'

function App() {
  const handleSuccess = (data: any) => {
    console.log('Payment successful:', data)
    // Handle successful payment
  }

  const handleError = (error: any) => {
    console.error('Payment failed:', error)
    // Handle payment error
  }

  return (
    <PaymentUI
      amount={1299.99}
      currency="INR"
      onSuccess={handleSuccess}
      onError={handleError}
      className="custom-styling"
    />
  )
}
```

### Admin Dashboard Integration
```tsx
import { AdminApp } from '@/components/AdminApp'

function AdminPage() {
  return <AdminApp />
}
```

### Custom Styling
```tsx
<PaymentUI
  amount={2500}
  currency="USD"
  onSuccess={handleSuccess}
  onError={handleError}
  className="max-w-lg mx-auto"
/>
```

## 📊 Admin Dashboard Features

### 🔐 Authentication
- **Email**: `admin@paymentui.com`
- **Password**: `admin123`
- Secure JWT-based session management

### 📈 Analytics Views
1. **Overview Dashboard**: Key metrics and KPIs
2. **Transaction History**: Searchable, filterable table
3. **Analytics Charts**: Visual data representation

### 🔍 Transaction Management
- Real-time transaction monitoring
- Advanced search and filtering
- Export capabilities
- Status tracking (Pending, Completed, Failed)
- Payment method breakdown

## 🎨 Design System

### Glassmorphism Theme
- **Background**: Gradient from purple to blue
- **Glass Cards**: Semi-transparent with backdrop blur
- **Neon Accents**: Blue and purple gradient highlights
- **Smooth Animations**: Framer Motion powered
- **Responsive**: Mobile-first design approach

### Color Palette
```css
Primary: #3B82F6 (Blue)
Secondary: #8B5CF6 (Purple)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Glass: rgba(255, 255, 255, 0.1)
```

## 🚀 Production Deployment

### Environment Variables
```bash
# Backend
NODE_ENV=production
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret

# Frontend  
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Build Commands
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Start production
npm run start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including Docker, Heroku, and Vercel configurations.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Transactions
- `POST /api/transactions/create` - Process payment
- `GET /api/transactions` - Get transaction history (Admin)
- `GET /api/transactions/:id` - Get transaction details (Admin)

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/payment-methods` - Payment method stats
- `GET /api/analytics/daily-transactions` - Daily transaction data
- `GET /api/analytics/status-distribution` - Status breakdown

## 🧪 Testing

The system includes sample data and a demo mode for testing:

1. **Payment Testing**: Use the demo interface with various payment methods
2. **Admin Testing**: Login with provided credentials to explore analytics
3. **API Testing**: All endpoints include proper error handling and validation

## 📦 Export as NPM Package

The Payment UI component is designed to be exportable:

```bash
# In frontend directory
npm run build

# The component can be imported from:
import { PaymentUI } from './dist/components/PaymentUI'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

MIT License - feel free to use this project for commercial and non-commercial purposes.

## 🆘 Support

For support and questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review the code comments and documentation
3. Open an issue on GitHub
4. Check the console logs for error details

## 🌟 Features Roadmap

- [ ] Real payment gateway integration (Stripe, Razorpay)
- [ ] Multi-currency support
- [ ] Subscription payments
- [ ] Webhook support
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile app version
- [ ] Multi-language support

---

**Built with ❤️ using modern web technologies for the next generation of payment interfaces.**