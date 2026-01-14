# Email Configuration Quick Reference

## ⚡ Quick Setup (2 minutes)

### 1. Gmail Method (Recommended for Testing)

```bash
# Step 1: Enable 2FA at myaccount.google.com/security
# Step 2: Get app password at myaccount.google.com/apppasswords
# Step 3: Create .env file with:

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
FRONTEND_URL=http://localhost:5173
```

### 2. Start Server
```bash
npm run dev
```

## 🔧 Configuration Reference

### Gmail Configuration
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxx
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.com
SMTP_PASSWORD=your_mailgun_password
```

### AWS SES
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_ses_username
SMTP_PASSWORD=your_ses_password
```

### Custom SMTP (Port 465 - TLS)
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_password
```

### Custom SMTP (Port 587 - STARTTLS)
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_password
```

## 📧 Email Functions

### Send Verification Code
```javascript
const { sendVerificationEmail } = require('../config/email');
await sendVerificationEmail(email, '123456');
```

### Send Password Reset
```javascript
const { sendPasswordResetEmail } = require('../config/email');
await sendPasswordResetEmail(email, resetToken);
```

## 🧪 Test Without Real Email

### Ethereal Email (Free, No Signup)
```
1. Visit https://ethereal.email/create
2. Get SMTP credentials
3. Add to .env (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD)
4. Check emails at https://ethereal.email
```

### Mailtrap (Free Tier Available)
```
1. Sign up at https://mailtrap.io
2. Get credentials from dashboard
3. Add to .env
4. Check emails in Mailtrap interface
```

## ❌ Troubleshooting

| Error | Fix |
|-------|-----|
| "Invalid login" | Use app password, not account password |
| "Network error" | Check SMTP_HOST and SMTP_PORT |
| "Timeout" | Check firewall allows outbound SMTP |
| "TLS error" | Verify SMTP_SECURE matches provider |
| "Email won't send" | Check EMAIL_USER/EMAIL_PASSWORD in .env |

## 📋 Environment Variables Required

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointcare

# JWT
JWT_SECRET=your_secret_here

# Email (choose one method)
# Method 1: Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Method 2: Custom SMTP
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your_email@example.com
# SMTP_PASSWORD=your_password

# General
FRONTEND_URL=http://localhost:5173
PORT=3000
```

## 🚀 For Production

1. Use professional email service (SendGrid, Mailgun, AWS SES)
2. Enable SMTP_SECURE=true
3. Add SPF, DKIM, DMARC records
4. Monitor delivery rates
5. Set up bounce/complaint handling

## 📚 Full Documentation

See `EMAIL_SETUP.md` in backend directory for:
- Complete setup guide
- All provider configurations
- Troubleshooting steps
- Production checklist

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit `.env` to repository
- [ ] Use app-specific password (Gmail)
- [ ] Rotate passwords regularly
- [ ] Use HTTPS in production
- [ ] Monitor email logs
