# Racket – Padel Court Booking Platform (Frontend)

Racket is a modern **frontend-only web application** built using **React** and **Vite**.  
The application allows users to discover padel clubs, view court details, check availability, see weather forecasts, and book courts through an interactive multi-step booking flow.  
It also includes an **admin interface** for club owners to manage courts and reservations.

This project focuses on **frontend architecture, routing, state management, and UI/UX design**, and is structured to be easily connected to a backend in the future.

---

## Features

### User Features
- Browse padel clubs
- View detailed club pages (gallery, facilities, contact info, location)
- View court details
- Interactive booking flow:
  - Select court
  - Pick date using a calendar
  - View weather forecast for the selected date
  - Choose time slot
  - Confirm reservation
- User profile page
- Add, edit, and delete reviews
- Responsive and modern UI design

### Admin / Owner Features
- Club owner signup (multi-step form)
- Admin dashboard
- Manage courts
- View and edit court details
- Manage reservations
- Add courts
- Add reservations manually

---

## Technology Stack

- **React** (functional components & hooks)
- **Vite** (development and build tool)
- **React Router DOM** (client-side routing)
- **CSS (custom styling)** – no UI framework
- **JavaScript (ES6+)**

---

## External API Used

### Open-Meteo Weather API

The project integrates the **Open-Meteo Weather API** to enhance the booking experience by displaying real-time weather information when a user selects a booking date.

**How it is used:**
- Weather data is fetched client-side using `fetch`
- Based on the selected club’s latitude and longitude
- Triggered automatically when the user selects a valid booking date
- Displays:
  - Weather condition (icon and description)
  - Minimum and maximum temperature
  - Rain probability for the selected day

**API Endpoint:**
 https://api.open-meteo.com/v1/forecast
- No authentication is required
- Used only for user experience (not critical booking logic)

  ---

## State Management

State in this project is handled entirely on the client side using React Hooks.

- **useState**
  - Manages local UI state (forms, steps, modals, selections)
  - Stores booking progress such as selected court, date, and time slot
  - Handles user data, reviews, and admin interactions

- **useEffect**
  - Handles side effects such as:
    - Fetching weather data from the Open-Meteo API
    - Syncing booking steps
    - Updating shared booking data
    - Cleaning up event listeners and temporary resources

- **Shared Booking State**
  - A shared `reservationDraft` object is used to temporarily store booking data across multiple pages
  - Ensures smooth navigation between booking steps without data loss

---

## Routing Structure

Client-side routing is implemented using **React Router DOM**.

### Public Routes
- `/` – Home page
- `/clubs` – List of all clubs
- `/clubs/:id` – Club details and booking flow
- `/clubs/:clubId/courts/:courtId` – Court details
- `/confirm-reservation` – Booking confirmation
- `/reservation-success` – Success page
- `/profile` – User profile
- `/login` – User login
- `/signup` – User signup

### Admin Routes
- `/admin` – Admin dashboard
- `/admin/signup` – Club owner signup
- `/admin/club` – Manage club
- `/admin/courts` – Manage courts
- `/admin/courts/:courtId` – Court details
- `/admin/reservations` – Reservations list
- `/admin/reservations/add` – Add reservation manually

---

## Project Structure

The project follows a clear and modular folder structure to improve readability, scalability, and future backend integration.

src/
│
├── assets/                # Images, icons, and media files
│   ├── clubs/
│   ├── courts/
│   ├── hero/
│   └── players/
│
├── components/            # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── AdminNav.jsx
│   └── corresponding CSS files
│
├── pages/                 # Application pages
│   ├── Home.jsx
│   ├── Clubs.jsx
│   ├── ClubDetails.jsx
│   ├── Courts.jsx
│   ├── CourtDetails.jsx
│   ├── ConfirmReservation.jsx
│   ├── ReservationSuccess.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── OwnerSignup.jsx
│   ├── Admin.jsx
│   ├── AdminLayout.jsx
│   ├── AdminClub.jsx
│   ├── AdminCourts.jsx
│   ├── AdminCourtDetails.jsx
│   ├── AdminReservations.jsx
│   ├── AdminAddCourt.jsx
│   ├── AdminAddReservation.jsx
│   └── NotFound.jsx
│
├── App.jsx                # Main routing and shared state
├── main.jsx               # Application entry point
├── index.css              # Global styles

Each page has its own dedicated CSS file to keep styles isolated and maintainable.

---

## Installation & Running the Project

### Install dependencies
-npm install

### Run development server
-npm run dev

### Open in browser
-http://localhost:5173


---

## Notes

-This is a frontend-only application	

-All data is currently handled on the client side

-No backend or database is connected yet

-Authentication is simulated for UI and flow demonstration

-The project structure is prepared for easy backend integration in the future

---

## Author

**Developed by: Ahmad Labadi**

**Course: Special Topics in Computer Science**

**Academic Year: 2025 / 2026**