# 📧 Appointment Booking System Setup Guide

## 🎉 **What's Implemented:**

Your website now has a **complete appointment booking system** that:
- ✅ Collects customer appointment details (date, time, service info)
- ✅ Sends professional email notifications to your chosen email address
- ✅ Shows confirmation to customers
- ✅ Works on mobile and desktop

## 🔧 **Setup Instructions:**

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Set Up Email Configuration**
1. **Copy the example environment file:**
```bash
cp .env.example .env
```

2. **Edit the .env file with your details:**
```env
# Your Gmail account (or other email provider)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# IMPORTANT: Where you want appointment emails sent
NOTIFICATION_EMAIL=thesky@marcelinmobilerepair.com
```

### **Step 3: Gmail App Password Setup** (if using Gmail)
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** → **2-Step Verification** (enable if not already on)
3. Click **Security** → **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password into `EMAIL_PASS` in your .env file

### **Step 4: Start the Server**
```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR Production mode
npm start
```

### **Step 5: Test the System**
1. Open your browser to `http://localhost:3000`
2. Fill out the appointment form
3. Check that you receive the email notification

## 📧 **Email Notification Features:**

When someone books an appointment, you'll receive a **professional email** with:
- 🆔 **Appointment ID** for tracking
- 📅 **Date & Time** requested
- 🚗 **Customer & Vehicle details**
- 📍 **Service location**
- ⚠️ **Urgency level** (color-coded)
- 📝 **Problem description**
- 📞 **Direct phone link** to call customer

## 🚀 **Deployment Options:**

### **Option A: Heroku (Recommended)**
```bash
# Install Heroku CLI, then:
heroku create marcelin-mobile-repair
git push heroku main

# Set environment variables
heroku config:set EMAIL_USER=your-gmail@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set NOTIFICATION_EMAIL=your-business-email@gmail.com
```

### **Option B: DigitalOcean/VPS**
1. Create a droplet/server
2. Install Node.js
3. Clone your repository
4. Set up environment variables
5. Use PM2 for process management

## ⚙️ **Customization Options:**

### **Change Notification Email:**
Edit the `NOTIFICATION_EMAIL` in your .env file to any email address you want.

### **Add Multiple Recipients:**
In `server.js`, change line with `to: process.env.NOTIFICATION_EMAIL` to:
```javascript
to: 'email1@example.com, email2@example.com, email3@example.com'
```

### **Customize Email Template:**
Edit the `emailHTML` variable in `server.js` to modify the email design.

### **Add SMS Notifications:**
Install Twilio and add SMS notifications alongside email.

## 🔒 **Security Features:**
- ✅ Rate limiting (max 20 requests per 15 minutes)
- ✅ Input validation
- ✅ CORS protection
- ✅ Environment variable protection

## 📱 **How It Works:**

1. **Customer** fills out appointment form on your website
2. **System** validates all required information
3. **Email** is sent instantly to your notification email
4. **Customer** sees confirmation with appointment ID
5. **You** receive detailed appointment info and can call to confirm

## ⚡ **Quick Test:**

After setup, you can test by:
1. Go to `http://localhost:3000`
2. Fill out the appointment form
3. Click "Book Appointment" 
4. Check your email for the notification!

---

**That's it! Your appointment booking system is ready to go live! 🎉**