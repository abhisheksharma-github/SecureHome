# 🛡️ SecureHome — Smart Housing Society Security System

A production-ready, full-stack security management platform for residential societies.
Built with **React.js**, **Spring Boot**, and **PostgreSQL**, featuring real-time emergency
alerts via WebSockets.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [WebSocket Architecture](#websocket-architecture)
- [Roles & Access Control](#roles--access-control)
- [Screenshots](#screenshots)
- [Default Credentials](#default-credentials)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SecureHome is a smart security system designed for housing societies and residential
complexes. It provides real-time panic alerts, simulated CCTV monitoring, member
management, and a live admin command centre — all in one integrated platform.

When a resident triggers the panic button, an emergency alert is broadcast
**instantly** to all connected admin dashboards via STOMP WebSockets, with a
full-screen flashing modal showing the resident's name, unit number, block, floor,
and the precise time of the distress call.

---

## Features

### 🔐 Authentication
- JWT-based stateless authentication (HS256, 24-hour expiry)
- Auto-logout on token expiry (client-side timer + server 401 interception)
- BCrypt password hashing (strength 12)
- Role-based access control: ADMIN and MEMBER

### 🚨 Real-Time Emergency Alarm System
- One-click Panic Button for residents
- Instant WebSocket broadcast to all connected admin tabs
- Full-screen flashing alert modal with precise timestamp (HH:mm:ss)
- Alarm lifecycle: ACTIVE → ACKNOWLEDGED → RESOLVED
- Optional emergency message from resident
- 30-second panic button cooldown to prevent accidental re-triggers
- Full alarm history with status filtering

### 📹 CCTV Monitor (Simulated)
- Camera grid with live/offline status indicators
- One-click camera status toggle (ONLINE / OFFLINE / MAINTENANCE)
- Simulated live feed UI with scanline overlay effect
- Per-camera location and name display

### 👥 Member Management (Admin)
- View all registered residents
- Activate / Deactivate member accounts
- Search by name, email, or unit number

### 🏠 House Management
- View all society units with block and floor details
- Resident count per unit

### 🕐 Live System Clock
- Synchronized digital clock on all dashboards
- Format: YYYY-MM-DD HH:mm:ss (updates every second)

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3, React Router 6 |
| State      | React Context API (Auth + WebSocket)            |
| HTTP       | Axios with request/response interceptors        |
| WebSockets | STOMP over SockJS (@stomp/stompjs + sockjs-client) |
| Backend    | Java 21, Spring Boot 3.2                        |
| Security   | Spring Security 6, JWT (JJWT 0.12)             |
| Database   | PostgreSQL 15+, Spring Data JPA, Hibernate      |
| Build      | Maven 3.9+, npm                                 |

---

## Project Structure

```
SecureHome/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/securehome/
│       │   ├── SecureHomeApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java        # JWT + CORS + CSRF config
│       │   │   ├── WebSocketConfig.java       # STOMP broker config
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── controller/
│       │   │   ├── AuthController.java        # /api/auth/**
│       │   │   ├── AdminController.java       # /api/admin/**
│       │   │   └── MemberController.java      # /api/member/**
│       │   ├── dto/                           # Request/Response DTOs
│       │   ├── entity/                        # JPA Entities
│       │   │   ├── User.java
│       │   │   ├── House.java
│       │   │   ├── Alarm.java
│       │   │   └── Camera.java
│       │   ├── repository/                    # Spring Data JPA Repos
│       │   ├── security/                      # JWT Provider + Filters
│       │   └── service/                       # Business logic
│       └── resources/
│           └── application.properties
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                            # Router + providers
        ├── api/                               # Axios instance + API modules
        │   ├── api.js
        │   ├── authApi.js
        │   ├── adminApi.js
        │   └── memberApi.js
        ├── context/
        │   ├── AuthContext.jsx                # JWT decode + session management
        │   └── WebSocketContext.jsx           # STOMP client + alert queue
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx             # Role-based route guard
        │   ├── LiveClock.jsx                  # Synced digital clock
        │   └── AlertModal.jsx                 # Full-screen emergency overlay
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx         # CCTV grid + live incidents
        │   │   ├── AlarmHistory.jsx
        │   │   ├── ManageMembers.jsx
        │   │   ├── ManageHouses.jsx
        │   │   └── CameraMonitor.jsx
        │   └── member/
        │       └── MemberDashboard.jsx        # Panic button + history
        └── styles/
            └── global.css
```

---

## Prerequisites

Make sure the following are installed before you begin:

- **Java 21** (JDK) — [Download](https://adoptium.net/)
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** and **npm** — [Download](https://nodejs.org/)
- **PostgreSQL 15+** — [Download](https://www.postgresql.org/download/)

---

## Getting Started

### 1. Database Setup

Connect to your PostgreSQL instance and run the following:

```sql
-- Create the database
CREATE DATABASE securehome_db;

-- Connect to it
\c securehome_db

-- Then run the full DDL script from:
-- backend/src/main/resources/schema.sql
```

The DDL script creates 4 tables (`users`, `houses`, `alarms`, `cameras`),
all indexes, and seeds default data including 5 sample houses, 8 cameras,
and a default admin account.

---

### 2. Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/securehome.git
cd securehome/backend

# Update database credentials in application.properties
# spring.datasource.username=your_pg_username
# spring.datasource.password=your_pg_password

# Build and run
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**

To build a deployable JAR:
```bash
mvn clean package -DskipTests
java -jar target/securehome-backend-1.0.0.jar
```

---

### 3. Frontend Setup

```bash
cd securehome/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend starts on **http://localhost:5173**

All `/api/*` and `/ws/*` requests are proxied to `http://localhost:8080`
via Vite's dev server proxy — no CORS issues during development.

To build for production:
```bash
npm run build
# Output is in /dist — serve via Nginx or any static host
```

---

## Configuration

### Backend — `application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/securehome_db
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT — replace with a strong Base64-encoded 256-bit secret in production
# Generate: openssl rand -base64 64
securehome.jwt.secret=YOUR_BASE64_SECRET_HERE
securehome.jwt.expiration-ms=86400000

# CORS & WebSocket allowed origins (comma-separated)
securehome.cors.allowed-origins=http://localhost:5173
securehome.websocket.allowed-origins=http://localhost:5173
```

### Frontend — `vite.config.js`

The Vite proxy is pre-configured for local development:

```js
proxy: {
  '/api': { target: 'http://localhost:8080', changeOrigin: true },
  '/ws':  { target: 'http://localhost:8080', changeOrigin: true, ws: true },
}
```

For production, configure your reverse proxy (Nginx recommended) to route
`/api` and `/ws` to the Spring Boot service.

---

## API Reference

### Authentication (Public)

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | /api/auth/login       | Login for ADMIN or MEMBER    |
| POST   | /api/auth/register    | Self-register as new MEMBER  |
| GET    | /api/auth/verify      | Validate current JWT token   |

### Member Endpoints (JWT Required — MEMBER role)

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| POST   | /api/member/alarm           | Trigger panic/emergency alarm|
| GET    | /api/member/alarm/history   | View own alarm history       |

### Admin Endpoints (JWT Required — ADMIN role)

| Method | Endpoint                              | Description                  |
|--------|---------------------------------------|------------------------------|
| GET    | /api/admin/alarms                     | All alarms (full history)    |
| GET    | /api/admin/alarms/active              | Currently active alarms      |
| PATCH  | /api/admin/alarms/{id}/acknowledge    | Acknowledge an alarm         |
| PATCH  | /api/admin/alarms/{id}/resolve        | Resolve an alarm             |
| GET    | /api/admin/members                    | List all members             |
| PATCH  | /api/admin/members/{id}/activate      | Activate a member account    |
| PATCH  | /api/admin/members/{id}/deactivate    | Deactivate a member account  |
| GET    | /api/admin/cameras                    | List all cameras             |
| PATCH  | /api/admin/cameras/{id}/status        | Update camera status         |
| GET    | /api/admin/houses                     | List all houses              |

#### Example: Trigger Panic Alarm

```bash
curl -X POST http://localhost:8080/api/member/alarm \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Suspected intruder at front door"}'
```

#### Example: Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@securehome.com", "password": "Admin@123"}'
```

---

## WebSocket Architecture

SecureHome uses STOMP over SockJS for real-time communication.

```
Member Browser          Spring Boot Server          Admin Browser(s)
──────────────          ──────────────────          ────────────────
                                                    STOMP SUBSCRIBE
                                               ──▶  /topic/alerts

POST /api/member/alarm
─────────────────────▶
                        1. Validate JWT
                        2. Persist alarm to DB
                        3. SimpMessagingTemplate
                           .convertAndSend(
                             "/topic/alerts",
                             AlarmPayload{...}
                           )
                                              ────▶ STOMP MESSAGE
◀─────────────────────                             received live
200 OK { alarm details }                           AlertModal flashes
```

**WebSocket Endpoint:** `ws://localhost:8080/ws` (with SockJS fallback)

**Topic:** `/topic/alerts` — subscribed by all connected admin dashboards

**AlarmPayload schema:**
```json
{
  "alarmId":     1,
  "userId":      3,
  "memberName":  "Raj Kumar",
  "houseNumber": "A-101",
  "block":       "A",
  "floor":       1,
  "message":     "Intruder at main door",
  "status":      "ACTIVE",
  "triggeredAt": "2025-06-07T14:32:11.000Z"
}
```

---

## Roles & Access Control

| Feature                     | ADMIN | MEMBER |
|-----------------------------|:-----:|:------:|
| Login                       |  ✅   |  ✅    |
| Admin Dashboard             |  ✅   |  ❌    |
| CCTV Monitor                |  ✅   |  ❌    |
| Manage Members              |  ✅   |  ❌    |
| Manage Houses               |  ✅   |  ❌    |
| View All Alarms             |  ✅   |  ❌    |
| Acknowledge / Resolve Alarm |  ✅   |  ❌    |
| Trigger Panic Alarm         |  ❌   |  ✅    |
| View Own Alarm History      |  ❌   |  ✅    |
| Member Dashboard            |  ❌   |  ✅    |
| Receive Live WS Alerts      |  ✅   |  ❌    |

---

## Screenshots

```
Login Page          → Two-panel layout. Branding left, form right.
Member Dashboard    → Animated panic button with outer glow rings.
Admin Dashboard     → CCTV grid + live incident log side-by-side.
Alert Modal         → Full-screen red flash with pulsing rings on alarm.
Camera Monitor      → Toggle switches per camera (ONLINE/OFFLINE).
Alarm History       → Filterable table with Acknowledge/Resolve actions.
```

*Add actual screenshots to a `/screenshots` folder and update the paths above.*

---

## Default Credentials

The DDL seed script creates a default admin account:

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| ADMIN | admin@securehome.com     | Admin@123  |

> ⚠️ **Change this password immediately in any non-local environment.**
> Generate a new BCrypt hash with strength 12 and update it directly in the database.

To register a member account, use the `/register` page and provide a valid
house number (e.g. `A-101`, `B-201`). The house must already exist in the
`houses` table.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without behaviour change
- `style:` — formatting, missing semicolons, etc.
- `test:` — adding tests

---

## Roadmap

- [ ] Push notifications (browser Web Push API)
- [ ] Admin ability to create new house units via UI
- [ ] Visitor management (pre-approved guest entry logs)
- [ ] Mobile app (React Native)
- [ ] Camera integration with real RTSP streams (via HLS.js)
- [ ] Multi-society / multi-tenant support
- [ ] Audit log for all admin actions
- [ ] Email/SMS alerts on panic trigger (via Spring Mail / Twilio)

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 SecureHome Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  Built with Java, React, and PostgreSQL
  <br/>
  SecureHome — Protecting communities, one alert at a time.
</div>
