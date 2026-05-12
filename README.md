# CareSync - Enterprise Patient Management System

A production-ready, modern Patient Management System built with the MERN stack (MongoDB, Express, React, Node.js). Features comprehensive healthcare management with role-based access, real-time notifications, analytics dashboards, and premium UI/UX.

## Features

### 🔐 Authentication & Authorization

- Secure JWT-based authentication
- Password encryption with bcryptjs
- Role-based access control (Admin, Doctor, Receptionist, Patient)
- Protected routes and API endpoints
- Refresh token mechanism

### 👥 Patient Management

- Complete patient CRUD operations
- Medical history tracking
- Allergies and chronic disease documentation
- Document/report uploads (Cloudinary integration)
- Search, filter, and pagination

### 📅 Appointment Management

- Online appointment booking system
- Doctor availability management
- Calendar views (day/week)
- Appointment status tracking
- Queue management system

### 💊 Prescription Management

- Digital prescription creation
- Medicine details (dosage, frequency, duration)
- PDF generation and download
- Prescription history tracking
- Follow-up scheduling

### 💰 Billing & Invoices

- Invoice creation and management
- Tax and discount calculation
- Payment tracking
- Multiple payment methods

### 📊 Analytics & Dashboards

- Role-specific dashboards (Admin, Doctor, Patient)
- Revenue analytics
- Appointment statistics
- Department distribution charts
- Monthly growth metrics

### 🔔 Notifications

- Real-time Socket.io notifications
- WhatsApp notifications (Twilio integration)
- Appointment reminders
- Status updates

### 🎨 Modern UI/UX

- ShadCN UI components
- Dark/light mode toggle
- Fully responsive design (mobile, tablet, desktop)
- Loading skeletons
- Professional healthcare theme

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS v3, ShadCN UI, Socket.io  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Socket.io  
**Infrastructure:** Cloudinary, Twilio, MongoDB Atlas

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Twilio account (optional for WhatsApp)

### Installation

```bash
# Install all dependencies
npm install
cd server && npm install
cd ../client && npm install

# Setup environment variables
cp server/.env.example server/.env
# Edit server/.env with your credentials

# Start development servers
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000

### Default Test Users

After seeding with `npm run seed`:

| Role    | Email                 | Password    |
| ------- | --------------------- | ----------- |
| Admin   | admin@caresync.com    | Admin@123   |
| Doctor  | doctor1@caresync.com  | Doctor@123  |
| Patient | patient1@caresync.com | Patient@123 |

## Project Structure

```
CareSync/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components & layout
│   │   ├── features/       # Feature modules
│   │   ├── context/        # State management
│   │   └── services/       # API integration
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # API handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   └── package.json
├── package.json            # Root config
└── README.md
```

## Key Endpoints

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Reset password

### Patients

- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET/PUT/DELETE /api/patients/:id` - CRUD operations

### Appointments

- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/slots` - Available slots

### Doctors

- `GET /api/doctors` - List doctors
- `POST /api/doctors` - Add doctor
- `PUT /api/doctors/:id/availability` - Set availability

### Prescriptions

- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/:id/pdf` - Download PDF

### Billing

- `GET /api/bills` - List bills
- `POST /api/bills` - Create bill
- `PUT /api/bills/:id/pay` - Record payment

## Development

**Frontend Development:**

- Components: `src/components/`
- Pages: `src/features/`
- API calls: `src/services/axios.js`
- State: `src/context/`

**Backend Development:**

- Models: `src/models/`
- Controllers: `src/controllers/`
- Routes: `src/routes/`
- Middleware: `src/middleware/`

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deploy frontend to Vercel/Netlify, backend to Heroku/Render.

## Security Features

✅ JWT authentication  
✅ Password hashing (bcryptjs)  
✅ Role-based authorization  
✅ HTTPS ready (helmet)  
✅ CORS configured  
✅ Rate limiting  
✅ Input validation

## Performance

- Code splitting & lazy loading
- Compression middleware
- Database indexing
- Optimized API responses
- Production builds

## Troubleshooting

**MongoDB Connection:** Verify MONGODB_URI and IP whitelist  
**Cloudinary Errors:** Check credentials and file size limits  
**Twilio WhatsApp:** Verify account and phone number format

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and create PR

## License

MIT License

## Support

For issues: GitHub Issues  
Questions: support@caresync.com

---

**Built with ❤️ for healthcare excellence**
