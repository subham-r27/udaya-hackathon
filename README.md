Udaya Hackathon Registration Portal
A full-stack web application built to manage team registrations for the "Udaya" hackathon. The platform features a responsive frontend built with React and a robust backend powered by Django.

✨ Features
Team Registration Form: Allows teams of up to 4 members to register for the event.

-Dynamic Form Validation: Ensures all required fields are filled correctly before submission.

-Real-time Progress Bar: A visual indicator shows the completion status of the registration form.

-Idea Submission: Participants can upload their ideas in PDF format directly through the form.

-RESTful API: A clean and efficient API built with Django REST Framework to handle all data operations.

-Optional Email Notifications: Backend is configured to (optionally) send confirmation emails to registered participants.

🛠️ Tech Stack
Backend:

Python
Django
Django REST Framework

Frontend:

React.js
Tailwind CSS
Axios (for API communication)

Database:

SQLite3 (default for development)

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Python 3.8+

Node.js v14+ and npm

A virtual environment tool for Python (like venv)

Backend Setup
Clone the repository:

git clone https://github.com/subham-r27/udaya-hackathon-app.git
cd udaya-hackathon-app

Navigate to the backend directory and create a virtual environment:

cd backend
python -m venv venv

Activate the virtual environment:

On Windows:

.\venv\Scripts\activate

On macOS/Linux:

source venv/bin/activate

Install the required Python packages:

pip install django djangorestframework django-cors-headers qrcode pillow

Apply database migrations:

python manage.py makemigrations
python manage.py migrate

Run the Django development server:

python manage.py runserver

The backend will be running at http://127.0.0.1:8000.

Frontend Setup
Navigate to the frontend directory in a new terminal:

cd frontend

Install the required npm packages:

npm install

Run the React development server:

npm start

The frontend will open in your browser at http://localhost:3000.

📝 API Endpoint
The primary API endpoint for team registration is:

POST /api/register/

This endpoint accepts multipart/form-data containing the team and participant information.
