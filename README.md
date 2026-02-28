# HelpDesk Ticketing System

A comprehensive help desk ticketing system built with Django REST Framework and Next.js, designed to streamline support operations with role-based access control and ticket management.

## Overview

HelpDesk is a full-stack web application that enables organizations to:
- Create and manage support tickets
- Track issue categories and sub-issues
- Assign tickets to support staff
- Monitor ticket activity and status transitions
- Provide role-based access (Admin, Staff, Client)
- Generate dashboard analytics

## Tech Stack

### Backend
- **Framework**: Django 6.0.2
- **API**: Django REST Framework 3.16.1
- **Database**: PostgreSQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Additional**: django-cors-headers, django-filter, django-smart-selects

### Frontend
- **Framework**: Next.js 16.1.6
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3.7.0
- **Language**: TypeScript

## Project Structure

```
HelpDesk/
├── backend/                    # Django REST API
│   ├── accounts/              # User authentication and profiles
│   │   ├── models/            # User model with roles
│   │   ├── views/             # Profile views
│   │   └── serializers/       # Serializers for user data
│   ├── core/                  # Core entities (Issues, SubIssues)
│   │   ├── models/            # Issue and SubIssue models
│   │   ├── views/             # Issue views
│   │   └── serializers/       # Issue serializers
│   ├── tickets/               # Main ticket system
│   │   ├── models/            # Ticket, Staff, Client models
│   │   ├── views/             # Ticket, activity, dashboard views
│   │   ├── serializers/       # Ticket serializers
│   │   ├── services/          # Business logic (dashboard service)
│   │   └── permissions.py     # Custom permission classes
│   ├── config/                # Django settings and configuration
│   ├── manage.py              # Django management script
│   └── requirements.txt        # Python dependencies
├── frontend/                  # Next.js React application
│   ├── app/                   # App directory with pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/             # Login page
│   │   └── layout.tsx         # Root layout
│   ├── component/             # Reusable components
│   ├── lib/                   # Utility functions and API client
│   ├── package.json           # Node dependencies
│   └── tsconfig.json          # TypeScript configuration
└── README.md                  # This file
```

## Prerequisites

Before you begin, ensure you have installed:
- **Python 3.9+** - [Download](https://www.python.org/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)
- **pip** - Python package manager (comes with Python)
- **npm** or **yarn** - Node package manager

## Installation & Setup

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   ```powershell
   venv\Scripts\Activate.ps1
   ```

4. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Configure environment variables**
   
   Update the `.env` file with your configuration:
   ```env
   SECRET_KEY=your-super-secret-key
   DEBUG=True
   ALLOWED_HOSTS=127.0.0.1,localhost
   
   # Database
   DB_NAME=helpdesk
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. **Create and configure PostgreSQL database**
   ```sql
   CREATE DATABASE helpdesk;
   ```

7. **Run migrations**
   ```powershell
   python manage.py migrate
   ```

8. **Create a superuser**
   ```powershell
   python manage.py createsuperuser
   ```

9. **Start the backend server**
   ```powershell
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```powershell
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

## Running the Application

### Development Mode

Terminal 1 - Backend:
```powershell
cd backend
venv\Scripts\Activate.ps1
python manage.py runserver
```

Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

### Production Build

**Backend:**
```powershell
python manage.py runserver 0.0.0.0:8000
```

**Frontend:**
```powershell
npm run build
npm start
```

## Features

### User Roles & Permissions

- **Admin**: Full access to all tickets, analytics, issue management
- **Staff**: Can view and update assigned tickets, view activity logs
- **Client**: Can create tickets, view their own tickets and activity

### Core Features

- **Ticket Management**: Create, read, update tickets with status tracking
- **Issue Categorization**: Organize tickets by issue types and sub-issues
- **Ticket Assignment**: Assign tickets to support staff members
- **Activity Tracking**: Log all ticket updates and changes
- **Dashboard**: View analytics and ticket statistics
- **Status Transitions**: Workflow management for ticket states
- **Client Management**: Track client information and their tickets

## API Endpoints

The backend provides REST API endpoints for:

### Authentication
- `POST /api/auth/login/` - Login with credentials
- `POST /api/auth/refresh/` - Refresh JWT token

### Tickets
- `GET/POST /api/tickets/` - List and create tickets
- `GET/PUT/DELETE /api/tickets/{id}/` - Retrieve, update, delete ticket
- `GET /api/tickets/activity/` - Ticket activity logs

### Issues
- `GET/POST /api/issues/` - Manage issue categories
- `GET /api/issues/{id}/sub-issues/` - Get sub-issues for an issue

### Users
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile

### Dashboard
- `GET /api/dashboard/stats/` - Dashboard statistics

## Development

### Code Organization

- **Models** (`/models`): Database schema definitions
- **Views** (`/views`): API endpoint handlers
- **Serializers** (`/serializers`): Data validation and transformation
- **Services** (`/services`): Business logic layer
- **Selectors** (`/selectors`): Query optimization layer
- **Permissions** (`permissions.py`): Access control

### Running Tests

```powershell
# Backend tests
python manage.py test

# Frontend tests
npm test
```

### Linting

```powershell
# Frontend
npm run lint
```

## Database Schema

Key models:
- **User**: Custom user model with roles (Admin, Staff, Client)
- **Ticket**: Main support ticket entity
- **Issue/SubIssue**: Issue categorization
- **Client**: Client information linked to users
- **Staff**: Staff information linked to users
- **TicketActivity**: Activity log for ticket changes

## Environment Variables

### Backend (.env)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `ALLOWED_HOSTS` - Allowed hostnames
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE helpdesk;`

### CORS Errors
- Check `ALLOWED_HOSTS` in backend settings
- Verify frontend URL is accessible to backend

### Port Already in Use
- Backend (8000): `python manage.py runserver 8001`
- Frontend (3000): `npm run dev -- -p 3001` or `npm run dev -- -p 3001` in PowerShell

## Contributing

When contributing to this project:
1. Create a feature branch
2. Make your changes
3. Ensure tests pass
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue in the repository.
