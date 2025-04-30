# 🚚 TruckRoutePlanner

![TruckRoutePlanner Banner](https://via.placeholder.com/1200x300.png?text=TruckRoutePlanner+-+Plan+Your+Trip+with+Ease)

A modern full-stack application built with **Django** and **React** to help truck drivers plan trips, visualize routes, and generate FMCSA-compliant Driver's Daily Logs. This app ensures compliance with Hours of Service (HOS) regulations while providing a sleek, user-friendly interface.

---

## ✨ Features

- **Trip Planning:** Input your current location, pickup, and dropoff points to get an optimized route.
- **Route Visualization:** View your route on an interactive map with marked stops for fueling, rests, and more using a free map API (OpenStreetMap).
- **HOS Compliance:** Automatically calculates driving windows, rest breaks, and cycle limits based on FMCSA regulations (70-hour/8-day rule, 14-hour window, 11-hour driving limit, 30-minute breaks).
- **Driver's Daily Logs:** Generates downloadable PDF logs for each day of your trip, including a 24-hour graph grid and detailed remarks.
- **Fueling Stops:** Adds fueling stops every 1,000 miles (1-hour stop, logged as "On Duty Not Driving").
- **Modern UI/UX:** A clean, intuitive interface designed with Tailwind CSS for a seamless user experience.
- **Deployment Ready:** Easily deploy the app on Vercel for a live hosted version.

---

## 📋 Project Overview

TruckRoutePlanner is designed to assist property-carrying truck drivers in planning their trips while adhering to FMCSA Hours of Service (HOS) regulations. The app takes trip details as inputs, calculates the route, enforces HOS rules (including rest breaks and fueling stops), and generates daily logs in PDF format. The frontend is built with React for a dynamic user experience, while the backend uses Django to handle trip calculations and log generation.

### Assumptions

- Property-carrying driver under the 70-hour/8-day HOS rule.
- No adverse driving conditions.
- Fueling stops every 1,000 miles (1-hour stop).
- 1-hour duration for pickup and drop-off (logged as "On Duty Not Driving").

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, OpenStreetMap (via Leaflet)
- **Backend:** Django, Django REST Framework
- **PDF Generation:** ReportLab (for generating Driver's Daily Logs)
- **Deployment:** Vercel
- **Other Tools:** Python, JavaScript, Node.js

---

## 📦 Installation

Follow these steps to set up the project locally.

### Prerequisites

- **Python** (>=3.8)
- **Node.js** (>=14.x)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TruckRoutePlanner.git
cd TruckRoutePlanner
```

### 2. Set Up the Backend (Django)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply migrations:

   ```bash
   python manage.py migrate
   ```

5. Start the Django development server:

   ```bash
   python manage.py runserver
   ```

### 3. Set Up the Frontend (React)

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

### 4. Test the App

- Open your browser and navigate to `http://localhost:3000`.
- Input your trip details (current location, pickup, dropoff, and current cycle hours).
- View the route on the map and download the Driver's Daily Logs as PDFs.

---

## 🚀 Deployment on Vercel

Follow these steps to deploy the app on Vercel for a live hosted version.

### 1. Prepare the Backend for Vercel

1. In the `backend` directory, create a `vercel.json` file with the following content:

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "manage.py",
         "use": "@vercel/python",
         "config": { "maxLambdaSize": "15mb" }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "manage.py"
       }
     ]
   }
   ```

2. Ensure `requirements.txt` includes `gunicorn` and `django` for production.

### 2. Prepare the Frontend for Vercel

1. In the `frontend` directory, ensure the `package.json` has the correct `homepage` field (e.g., `"/"`).
2. Build the frontend:

   ```bash
   npm run build
   ```

### 3. Deploy to Vercel

1. Install the Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy the backend:

   ```bash
   cd backend
   vercel deploy
   ```

3. Deploy the frontend:

   ```bash
   cd ../frontend
   vercel deploy
   ```

4. Follow the Vercel CLI prompts to link your project, configure environment variables (e.g., backend API URL), and deploy.
5. Once deployed, Vercel will provide URLs for the live app.

---

## 📜 Driver's Daily Log Format

The app generates FMCSA-compliant Driver's Daily Logs for each day of the trip, including:

- **Graph Grid:** A 24-hour grid with rows for:
  - Off Duty
  - Sleeper Berth
  - Driving
  - On Duty Not Driving
- **Fields:**
  - Date, total miles driven, truck/tractor number, carrier name, main office address, driver signature, co-driver name, time base, and remarks.
- **Remarks:** Logs the location of each duty status change (e.g., "Started driving in Richmond, VA").

The logs are downloadable as PDFs and adhere to HOS rules, such as the 14-hour driving window, 11-hour driving limit, and mandatory 30-minute breaks.

---

## 📸 Screenshots

| **Home Page** | **Route Map** | **Driver's Log Preview** |
|---------------|---------------|--------------------------|
| ![Home Page](https://via.placeholder.com/300x200.png?text=Home+Page) | ![Route Map](https://via.placeholder.com/300x200.png?text=Route+Map) | ![Driver's Log](https://via.placeholder.com/300x200.png?text=Driver's+Log) |

---

## 📂 Repository Structure

```
TruckRoutePlanner/
├── backend/                   # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── vercel.json
│   ├── truckplanner/          # Django app
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── ...
│   └── ...
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── ...
│   ├── package.json
│   └── ...
├── README.md                 # Project documentation
└── LICENSE                   # License file
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

For questions or support, reach out at:

- **Email:** info.ak.computerscience@gmail.com
- **GitHub Issues:** [Open an Issue](https://github.com/Alex-Muhscience/Trucker-Log-App/issues)

---

**Built with 💙 by Alex Muhscience**