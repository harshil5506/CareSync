# 🔐 CareSync Login Credentials

## ⚠️ Test Credentials (Development Only)

> **Note:** These credentials are only for testing purposes. Run the seeder to populate the database with these test users.

### Backend Seeding

```bash
cd server
npm run seed
```

---

## 👨‍💼 Admin Account

**Email:** `admin@caresync.com`  
**Password:** `Admin@123`  
**Role:** Admin  
**Access:**

- Dashboard with analytics
- All patient management
- Doctor management
- Department management
- Billing & revenue reports

---

## 👨‍⚕️ Doctor Accounts

All doctors use password: `Doctor@123`

| Name             | Email                  | Specialization     | Department       |
| ---------------- | ---------------------- | ------------------ | ---------------- |
| Dr. Rajesh Kumar | `doctor1@caresync.com` | General Physician  | General Medicine |
| Dr. Priya Singh  | `doctor2@caresync.com` | Cardiologist       | Cardiology       |
| Dr. Amit Patel   | `doctor3@caresync.com` | Pediatrician       | Pediatrics       |
| Dr. Ananya Desai | `doctor4@caresync.com` | Orthopedic Surgeon | Orthopedics      |

**Doctor Access:**

- My Appointments
- My Patients (add/remove patients directly)
- Prescriptions
- Settings

---

## 👥 Patient Accounts

All patients use password: `Patient@123`

**Patients:** `patient1@caresync.com` to `patient20@caresync.com`  
**Example:** `patient1@caresync.com` / `Patient@123`

**Patient Access:**

- My Appointments (view, book, cancel)
- My Prescriptions
- Billing & invoices
- Settings

---

## 🏥 Department Management (Admin Only)

Available Departments:

1. **General Medicine** - General medical services and consultations
2. **Cardiology** - Heart and cardiovascular disease treatment
3. **Pediatrics** - Child healthcare and pediatric services
4. **Orthopedics** - Bone, joint and muscle treatment
5. **Dentistry** - Dental care and treatment

---

## 🎯 Quick Test Workflow

### 1. **Admin Testing**

```
Email: admin@caresync.com
Password: Admin@123

Then:
- Navigate to /doctors to see doctor list
- Navigate to /patients to see patient list
- Navigate to /appointments to manage appointments
- Navigate to /departments to manage departments
```

### 2. **Doctor Testing**

```
Email: doctor1@caresync.com
Password: Doctor@123

Then:
- Click "My Patients" to add/view patients
- Click "My Appointments" to view appointments
- Add new patient from the modal in My Patients page
```

### 3. **Patient Testing**

```
Email: patient1@caresync.com
Password: Patient@123

Then:
- View dashboard
- Book appointments with doctors
- View my appointments
- Access prescriptions (after doctor creates them in Phase 6)
```

---

## 📋 Feature Checklist by Role

### Admin Features ✅

- [x] Dashboard with statistics
- [x] Patient management (CRUD)
- [x] Doctor management (CRUD)
- [x] Appointment management
- [x] Department management
- [x] Search & filter
- [x] Pagination

### Doctor Features ✅

- [x] Dashboard
- [x] My Appointments view
- [x] My Patients page
- [x] Add patients directly (New!)
- [x] Remove patients
- [x] Search & filter patients
- [x] Profile settings

### Patient Features ✅

- [x] Dashboard
- [x] Book appointments
- [x] View my appointments
- [x] Cancel appointments
- [x] View doctors by specialization
- [x] Profile settings

---

## 🔗 URLs

**Development:**

- Frontend: `http://localhost:5173` (or next available port)
- Backend API: `http://localhost:5000`
- API Health: `http://localhost:5000/api/health`

---

## 🚀 Login Process

1. Go to `http://localhost:5173/login` (or your frontend URL)
2. Enter email from the credentials above
3. Enter corresponding password
4. Click "Login"
5. You'll be redirected to dashboard based on your role

---

## 💡 Notes

- **Password Requirements:** 8+ characters, uppercase, lowercase, number, special character (@$!%\*?&)
- **Reset Password:** Use the "Forgot Password" link on login page (Phase 8 feature)
- **Multi-role Limitation:** Current implementation doesn't support users with multiple roles
- **Department Assignment:** Doctors are automatically assigned to their specialization's department
- **Queue Management:** Appointments automatically generate queue numbers per doctor per day

---

**Last Updated:** 2026-05-13
