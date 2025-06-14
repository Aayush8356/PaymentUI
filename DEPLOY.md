# 🚀 Deployment Guide

Complete step-by-step guide to deploy your Payment UI system to production.

## 🎯 Deployment Overview

- **Frontend**: Vercel (React deployment)
- **Backend**: Render (Node.js deployment)  
- **Database**: Render PostgreSQL (Cloud database)

## 📦 Step 1: Database Setup

### Option A: Render PostgreSQL (Recommended)

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Sign up/Login with GitHub

2. **Create PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - **Name**: `payment-ui-database`
   - **Database**: `payment_ui_production`
   - **User**: `payment_ui_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or Paid for production)

3. **Copy Connection Details**
   ```
   Host: dpg-xxxxx-a.oregon-postgres.render.com
   Port: 5432
   Database: payment_ui_production
   Username: payment_ui_user
   Password: [generated password]
   ```

4. **Run Database Schema**
   - Connect using psql or database client:
   ```bash
   psql postgresql://payment_ui_user:[password]@[host]:5432/payment_ui_production
   ```
   - Run the schema from `database/schema.sql`
   - Run seed data from `database/seed.sql`

### Option B: Other Cloud Providers

**Neon (Serverless)**
- Visit [neon.tech](https://neon.tech)
- Create project → Copy connection string

**Supabase**
- Visit [supabase.com](https://supabase.com)
- Create project → Go to Settings → Database

**Railway**
- Visit [railway.app](https://railway.app)
- Create PostgreSQL service

## 🔗 Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
cd /Users/aayushgupta/Desktop/Component/PaymentUI
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: Payment UI with glassmorphism design and admin dashboard

- Beautiful payment component with multiple payment methods
- Admin dashboard with analytics and transaction monitoring
- Full TypeScript support with modern design
- Ready for production deployment"

# Set main branch
git branch -M main

# Add GitHub remote (replace with your repository)
git remote add origin https://github.com/yourusername/payment-ui.git

# Push to GitHub
git push -u origin main
```

## 🖥️ Step 3: Backend Deployment (Render)

1. **Create Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just pushed

2. **Configure Service Settings**
   ```
   Name: payment-ui-backend
   Environment: Node
   Region: (same as your database)
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Add Environment Variables**
   Go to Environment tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
   DB_PORT=5432
   DB_NAME=payment_ui_production
   DB_USER=payment_ui_user
   DB_PASSWORD=[your-database-password]
   JWT_SECRET=[generate-secure-random-string]
   FRONTEND_URL=https://your-payment-ui.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the service URL (e.g., `https://payment-ui-backend.onrender.com`)

## 🌍 Step 4: Frontend Deployment (Vercel)

### Method A: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow the prompts:**
   ```
   ? Set up and deploy "~/PaymentUI/frontend"? [Y/n] Y
   ? Which scope do you want to deploy to? [Your Account]
   ? Link to existing project? [y/N] N
   ? What's your project's name? payment-ui-frontend
   ? In which directory is your code located? ./
   ```

4. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Method B: Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

3. **Configure Settings**
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

## ⚙️ Step 5: Configure Environment Variables

### Frontend Environment Variables (Vercel)

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add the following:

```
REACT_APP_API_URL=https://payment-ui-backend.onrender.com
```

### Backend Environment Variables (Render)

Update your Render service environment variables:

```
FRONTEND_URL=https://payment-ui-frontend.vercel.app
```

## 🔄 Step 6: Update API URLs in Code

Update the API base URL in your frontend code:

```bash
cd frontend/src/lib
```

Edit `api.ts` to use environment variable:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

## 🧪 Step 7: Test Production Deployment

1. **Frontend Testing**
   - Visit your Vercel URL
   - Test payment component functionality
   - Check console for any errors

2. **Backend Testing**
   - Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","timestamp":"...","uptime":123}`

3. **Admin Dashboard Testing**
   - Access admin dashboard from frontend
   - Login with: `admin@paymentui.com` / `admin123`
   - Verify charts and transaction data load

4. **Payment Flow Testing**
   - Test different payment methods
   - Verify transactions appear in admin dashboard
   - Check database entries

## 🛠️ Step 8: Custom Domain (Optional)

### Frontend Custom Domain (Vercel)

1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `paymentui.yourdomain.com`)
3. Configure DNS settings as instructed
4. Update backend CORS settings with new domain

### Backend Custom Domain (Render)

1. Go to Render service → Settings → Custom Domains
2. Add your domain (e.g., `api.yourdomain.com`)
3. Configure DNS settings
4. Update frontend API URL

## 🔐 Step 9: Security Checklist

- [ ] JWT_SECRET is securely generated (32+ characters)
- [ ] Database password is strong
- [ ] CORS is configured for specific domains only
- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] Admin password is changed from default

## 📊 Step 10: Monitoring & Maintenance

### Monitor Your Deployments

1. **Render Dashboard**
   - Check service logs for errors
   - Monitor database connections
   - Watch resource usage

2. **Vercel Dashboard**
   - Monitor function executions
   - Check build logs
   - Track performance metrics

### Regular Maintenance

- Update dependencies monthly
- Monitor database storage usage
- Check for security updates
- Back up your database regularly

## 🆘 Troubleshooting

### Common Issues

**CORS Errors**
```
Solution: Ensure FRONTEND_URL matches your Vercel domain exactly
```

**Database Connection Errors**
```
Solution: Double-check all database environment variables
```

**Build Failures**
```
Solution: Check build logs in Render/Vercel dashboards
```

**Environment Variable Issues**
```
Solution: Restart services after changing environment variables
```

### Getting Help

1. Check service logs in Render/Vercel dashboards
2. Test API endpoints individually
3. Verify environment variables are set correctly
4. Check CORS configuration

## 🎉 Success! 

Your Payment UI system is now live in production:

- **Frontend**: `https://your-payment-ui.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Admin**: `https://your-payment-ui.vercel.app` (click Admin Dashboard)

### Demo Credentials
- **Email**: admin@paymentui.com
- **Password**: admin123

---

**Need help?** Check the logs in your Render and Vercel dashboards for detailed error information.