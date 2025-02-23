# Academic Issue Tracking System (AITS)

The Academic Issue Tracking System (AITS) is a web application designed to streamline the reporting and management of academic issues (e.g., missing marks, appeals, corrections) at Makerere University. It provides a user-friendly interface for students to sign up and report issues, and for lecturers, heads of departments, and academic registrars to manage them. Built with a React frontend and Django REST Framework backend, AITS ensures efficient tracking and resolution of academic concerns.

## Features

- **Student Signup**: Students can register with their email, name, phone, and college selection from a hardcoded list of Makerere University colleges.
- **Role-Based Dashboards**: Separate interfaces for Students, Lecturers, Heads of Departments (HoDs), and Academic Registrars.
- **Issue Management**: Create, assign, and resolve academic issues with real-time statistics.
- **Notifications**: In-app and email notifications for status updates and overdue issues.
- **Audit Logs**: Track actions taken on issues for accountability.
- **Start Screen**: Welcoming landing page for all users with login/signup options.

## Tech Stack

- **Frontend**: React 18, Material-UI, React Router DOM
- **Backend**: Django 4.2, Django REST Framework, SQLite
- **Authentication**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
- **Deployment**: Local development setup (instructions for production deployment TBD)

## Prerequisites

- **Python**: 3.12+
- **Node.js**: 18+ (with npm)
- **Git**: For cloning and version control

## Setup Instructions

### Backend Setup (Django)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/aits.git
   cd aits/aits_backend
Install Dependencies:
Create a virtual environment and install Python packages:
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt

Configure Environment Variables:
Create a .env file in aits_backend/:
SECRET_KEY=your-secret-key-here-50-chars-long
DEBUG=True
DB_NAME=db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
Replace placeholders with your values (e.g., Gmail app password for email).

Apply Migrations:
python manage.py makemigrations
python manage.py migrate

Populate Colleges:
Run the Django shell to add Makerere colleges:
python manage.py shell
from core.models import College
colleges = ['COCIS', 'CEDAT', 'LAW', 'CAES', 'CHUSS', 'CONAS', 'EDUC', 'CHS', 'COVAB', 'COBAMS']
for i, name in enumerate(colleges, start=1):
    College.objects.get_or_create(id=i, defaults={'name': name})
exit()

Create Superuser:
python manage.py createsuperuser

Run the Server:
python manage.py runserver

Frontend Setup (React)
Navigate to Frontend Directory:
cd ../frontend

Install Dependencies:
npm install

Run the Development Server:
npm start

The app will open at http://localhost:3000.
Start Screen: Visit http://localhost:3000/ to see the welcome page:
Click "Sign Up" to register as a student.
Click "Login" to access your dashboard with existing credentials.
Student Signup:
Fill in email, password, first name, last name, phone (optional), and select a college from the dropdown.
Submit to register and be redirected to the student dashboard.

Dashboards:
Student: View and create issues.
Lecturer: Resolve assigned issues.
HoD: Reassign and resolve issues.
Registrar: Manage all issues in their college.
Admin Panel:
Access http://localhost:8000/admin/ with superuser credentials to manage users, colleges, and issues.

API Endpoints
POST /api/register/: Register a new student.
POST /api/token/: Obtain JWT token for login.
GET /api/issues/: Fetch issues (authenticated).
GET /api/notifications/: Fetch notifications (authenticated).
GET /api/audit-logs/: Fetch audit logs (authenticated).
Project Structure
aits/
├── aits_backend/
│   ├── core/             # Django app with models, views, serializers
│   ├── aits_backend/     # Django settings and URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/   # React components (SignUp, Login, Dashboards)
│   │   ├── api.js        # API client
│   │   ├── App.js        # Main app with routing
│   │   └── theme.js      # Material-UI theme
│   ├── public/
│   └── package.json
└── README.md
Troubleshooting
400 Bad Request on Signup:
Ensure all required fields (email, password, first_name, last_name, college) are sent.
Verify core_college table has IDs 1-10 matching frontend hardcoded list.
Check browser console for payload and backend logs for validation errors.
500 Internal Server Error:
Run python manage.py migrate to ensure database schema is up-to-date.
Populate colleges if FOREIGN KEY constraint failed occurs.

Contributing
Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to your fork (git push origin feature/your-feature).
Open a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details (TBD).
Contact
For issues or questions, contact ahumuzacedric@gmail.com or open an issue on GitHub.

---

### Customization Notes
- **Repository URL**: Replace `https://github.com/yourusername/aits.git` with your actual GitHub repository URL.
- **Paths**: Adjust `aits_backend` and `frontend` paths if your directory structure differs.
- **Email Credentials**: Replace placeholders in the `.env` example with real values.
- **License**: Add a `LICENSE` file if you choose to include one (e.g., MIT License text).

---

### Adding to Git
1. **Create the File**:
   - In your project root (`aits/`), create `README.md` and paste the content above.
2. **Stage and Commit**:
   ```bash
   git add README.md
   git commit -m "Add README for AITS project"
   git push origin main
