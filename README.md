# Eventra - Premium Event Discovery & Milestone Tracking Platform

Welcome to **Eventra**! This repository is organized as a monorepo consisting of a React frontend and a Laravel API backend. Below are the complete step-by-step instructions to configure the database, start the backend API server, and launch the frontend web application.

---

## Project Structure
- `/eventra_backend` — Laravel 11 API Backend (PHP 8.5)
- `/eventra_frontend` — React Single Page Application (Vite + Tailwind CSS)

---

## Prerequisites
Before starting, ensure you have the following installed on your machine:
1. **Laragon** (provides Apache/Nginx, PHP 8.5.x, and MySQL)
2. **Node.js** & **npm** (for the frontend React app)

---

## 1. Database Setup
The backend Laravel application uses a MySQL database. By default, it expects a database named `eventra_db`.

### Step 1.1: Start MySQL in Laragon
1. Open the **Laragon** desktop application.
2. Click **Start All** to launch Apache and MySQL services.

### Step 1.2: Create the Database
Create a database named `eventra_db` in MySQL. You can do this via:
- **HeidiSQL** (included with Laragon): Click **Open** in Laragon, log in using user `root` (no password), right-click on the host, select **Create new** -> **Database**, and name it `eventra_db`.
- Or run the following SQL command in your database manager:
  ```sql
  CREATE DATABASE eventra_db;
  ```

### Step 1.3: Run Database Migrations and Seeders
To build the tables and populate the database with default categories, events, organizers, and settings, run the following command inside the `eventra_backend` directory:

```powershell
# Open terminal and navigate to eventra_backend
cd C:\laragon\www\eventra\eventra_backend

# Run migrations and seed the database using Laragon's PHP 8.5 executable
C:\laragon\bin\php\php-8.5.6-Win32-vs17-x64\php.exe artisel kdgujjgkj
```

---

## 2. Backend Setup & Run
The Laravel API runs on PHP. Note that backend dependencies require **PHP version 8.4 or higher**, so you must use Laragon's PHP 8.5 path.

### Step 2.1: Install Composer Dependencies (If fresh clone)
If the backend does not have a `vendor` folder, run:
```powershell
C:\laragon\bin\php\php-8.5.6-Win32-vs17-x64\php.exe C:\laragon\bin\composer\composer.phar install
```

### Step 2.2: Configure Environment `.env`
Ensure that the `.env` file exists in `/eventra_backend` and has the correct database connection:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eventra_db
DB_USERNAME=root
DB_PASSWORD=
```

### Step 2.3: Start the Backend server
Run the development server command inside the `eventra_backend` directory:
```powershell
C:\laragon\bin\php\php-8.5.6-Win32-vs17-x64\php.exe artisan serve
```
This will start the backend at **`http://127.0.0.1:8000`** (which matches the frontend API configurations).

---

## 3. Frontend Setup & Run
The frontend is built using React, Vite, and Tailwind CSS.

### Step 3.1: Install npm Packages
Open a separate terminal window, navigate to the `eventra_frontend` directory, and install dependencies:
```powershell
cd C:\laragon\www\eventra\eventra_frontend
npm install
```

### Step 3.2: Verify API Configuration
Check `eventra_frontend/src/config.js` to verify it points to the correct backend API server:
```javascript
export const API_BASE_URL = 'http://localhost:8000/api';
```

### Step 3.3: Run the Frontend App
Start the Vite local development server:
```powershell
npm run dev
```
The console will output the local address, typically **`http://localhost:5173`**. Open this link in your web browser to interact with the application.

---

## 4. Default Seeded User Credentials
Once you have run the migrations and seeds, you can log in using these default credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@eventra.com` | `password123` | Control panel, category management, approval of organizer requests |
| **Organizer** | `organizer@eventra.com` | `password123` | Creating/managing events, custom speakers, viewing analytics |
| **Participant** | `participant@eventra.com` | `password123` | Registering for events, viewing my certificates, updating interests |
