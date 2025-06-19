# Chess Coaching Portfolio - Vedant Maheshwari

Professional portfolio website for chess coaching and AMC 8 preparation services. Features secure email verification system and comprehensive spam protection.

## Features

- **Professional Portfolio Design**: Showcases chess achievements, math competition victories, and teaching services
- **Email Verification System**: Mandatory email verification prevents fake contact submissions
- **Comprehensive Spam Protection**: Rate limiting, disposable email blocking, and content filtering
- **Analytics Ready**: Google Analytics integration prepared for visitor tracking
- **Responsive Design**: Modern design optimized for all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js + Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Replit Autoscale

## Environment Variables

Create a `.env` file with the following variables:

```env
# Email Configuration (Required for contact form)
EMAIL_USER=mathbymoves@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here

# Google Analytics (Optional)
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id_here
```

### Gmail App Password Setup

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this password in EMAIL_PASSWORD environment variable

## Installation

1. Clone the repository
```bash
git clone https://github.com/vedant-maheshwari09/mathbymoves.git
cd mathbymoves
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (see above)

4. Run development server
```bash
npm run dev
```

## Deployment

The application is configured for Replit deployment:

1. Import project to Replit
2. Add environment variables in Replit Secrets
3. Click Deploy button for automatic deployment

## Email Verification System

The contact form requires email verification to prevent spam:

1. User submits contact form
2. Verification email sent to user's address
3. User clicks verification link
4. Only then is message forwarded to mathbymoves@gmail.com

This ensures only legitimate contacts from real email addresses reach the coach.

## Analytics Setup

To enable visitor tracking:

1. Create Google Analytics account
2. Set up GA4 property for your website
3. Add VITE_GA_MEASUREMENT_ID to environment variables

## Contact Information

- **Email**: mathbymoves@gmail.com
- **Services**: Chess Coaching (Beginner to Expert), AMC 8 Preparation
- **Location**: San Diego, California

## License

Private project - All rights reserved
