**General Hospital Patient Portal**

A modern web portal for patients to manage appointments, access hospital services, and interact via a built-in chatbot. Designed for efficiency, usability, and security.

🌟 **Features**
**Appointments Management**

Book, view, and manage appointments.

Filter by upcoming, past, or all appointments.

Real-time updates after booking.

Appointment status badges: Pending, Confirmed, Cancelled.

Smart Chatbot with CLaude API for easier navigation and guidance.

Navigate through hospital services via a chatbot.

Simple conversational UI for guidance.

Note: Currently in developer mode, so responses are basic and limited.

**Secure Authentication**

Mobile OTP Login: Quick and convenient login.

OAuth Integration: Supports Google, Facebook, and other OAuth providers for secure sign-in.

Session management and logout functionality.

**User-Friendly Interface**

Responsive design, optimized for mobile and desktop.

Modern, clean UI using React.js with custom components.

Filter tabs and cards for intuitive appointment management.

**Developer Tools**

Easy API integration using FastAPI backend.

PostgreSQL / SQLAlchemy for database management.

Zone-aware datetime handling (Asia/Kolkata timezone).

🛠️ **Tech Stack**
Layer	Technology
Frontend	React.js, HTML5, CSS3,Bootstrap5
Backend	Python, FastAPI, SQLAlchemy
Database	PostgreSQL
Auth	OAuth2, Mobile OTP
Deployment	Docker, Nginx (optional)
⚡ **Installation**
1. Clone the Repository
git clone https://github.com/chay123-crypto/Hospital_User_interface.git
cd Hospital_User_interface
2. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
pip install -r requirements.txt
3. Configure Environment Variables

Create .env file:

DATABASE_URL=postgresql://username:password@localhost:5432/medicare
SECRET_KEY=your-secret-key
OAUTH_GOOGLE_CLIENT_ID=your-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-client-secret
4. Run Backend
uvicorn main:app --reload
5. Frontend Setup
cd frontend
npm install
npm start

Visit http://localhost:3000
 to see the app.

💡 **Usage**

Book Appointment: Click “📅 Book New”, fill in details, submit.

Filter Appointments: Click All, Upcoming, or Past tabs.

Logout: Click the 🚪 Logout button to end session.

Chatbot: Access via “My Queries” for navigation help.

🛡️ **Security**

OAuth and OTP ensure secure authentication.

All sensitive data is stored securely in PostgreSQL.

Backend API uses JWT tokens for authenticated requests.

🧩 **Future Enhancements**

Full-featured chatbot AI for better navigation and queries.

Push notifications for appointment reminders.

Payment gateway integration for hospital services.

Multi-language support for international patients.

👨‍💻 **Contributing**

Fork the repository.

Create a feature branch (git checkout -b feature-name).

Commit your changes (git commit -m "Add feature").

Push to the branch (git push origin feature-name).

Open a Pull Request.
