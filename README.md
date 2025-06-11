# Isracard Flight Board Frontend

A React + TypeScript web application for managing and displaying flight information in real time.  
This project features live updates via SignalR, flight filtering, and a responsive UI built with Material-UI.

## Features

- **Live Flight Updates:** Real-time flight status and board changes using SignalR.
- **Add/Delete Flights:** Easily add new flights or remove existing ones.
- **Flight Filtering:** Filter flights by status and destination.
- **Visual Feedback:** New and updated flights animate and glow for clarity.

## Tech Stack

- [C# ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core)
- [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI (MUI)](https://mui.com/)
- [Vite](https://vitejs.dev/) (or Create React App, depending on your setup)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (for the ASP.NET Core backend)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/alonasher/FlightBoard.git
cd isracard-fb
```

#### 2. Install and run the **backend** (ASP.NET Core)

```bash
cd isracard-fb-be
dotnet restore
dotnet build
dotnet run
```

The backend will start (by default on [http://localhost:5256](http://localhost:5256) or as configured).

#### 3. Install and run the **frontend** (React)

Open a new terminal window/tab:

```bash
cd isracard-fb/isracard-fb-fe
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

**Note:**  
- Make sure the backend is running before starting the frontend for full functionality.

### Example API requests

#### Get all flights (with optional filters)
```bash
curl "http://localhost:5256/api/flights?status=Scheduled&destination=London"
```

#### Add a new flight
```bash
curl -X POST "http://localhost:5256/api/flights" ^
  -H "Content-Type: application/json" ^
  -d "{\"flightNumber\":\"LY1234\",\"destination\":\"Tel Aviv\",\"departureTime\":\"2025-06-12T15:30:00\",\"gate\":\"B1\",\"flightStatus\":\"Scheduled\"}"
```

#### Delete a flight
```bash
curl -X DELETE "http://localhost:5256/api/flights/LY1234"
```

### Backend runtime dependencies

- [`Microsoft.AspNetCore.SignalR`] – Real-time web functionality for ASP.NET Core
- [`Microsoft.EntityFrameworkCore`] – Entity Framework Core
- [`Microsoft.EntityFrameworkCore.Sqlite`] – SQLite provider for Entity Framework Core
- [`Swashbuckle.AspNetCore`] – Swagger/OpenAPI documentation for ASP.NET Core APIs

### Frontend Runtime dependencies

- [`@emotion/react`] – CSS-in-JS styling for React
- [`@emotion/styled`] – Styled components for Emotion
- [`@fontsource/roboto`] – Roboto font for Material-UI
- [`@microsoft/signalr`] – SignalR client for real-time communication
- [`@mui/material`] – Material-UI React component library
- [`axios`] – Promise-based HTTP client

