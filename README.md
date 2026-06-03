# JobBoard — MERN App on Microsoft Azure

A full-stack Job Board application built with the MERN stack and deployed on Microsoft Azure App Service.

## Live Demo

**[https://joboard-bbcvcygzgmdkg3c8.francecentral-01.azurewebsites.net](https://joboard-bbcvcygzgmdkg3c8.francecentral-01.azurewebsites.net)**

## Features

- Browse and search job listings by title, company, and job type
- Post new job listings with salary range and requirements
- Apply to jobs with a cover letter and portfolio link
- Dashboard with stats — total jobs, applications, pending reviews
- Update application statuses (Pending → Reviewed → Accepted / Rejected)
- Close or delete job listings
- Data persisted in MongoDB Atlas cloud database

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Hosting | Microsoft Azure App Service |
| CI/CD | GitHub Actions |

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       │   └── Navbar.js
│       └── pages/
│           ├── Home.js         # Job listings with search & filter
│           ├── JobDetail.js    # Job info + apply modal
│           ├── PostJob.js      # Create a job listing
│           └── Dashboard.js    # Stats + manage jobs & applications
├── server/                 # Express backend
│   ├── models/
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── jobs.js
│   │   └── applications.js
│   └── server.js
├── .github/
│   └── workflows/
│       └── main_joboard.yml    # Azure deployment workflow
└── package.json
```

## API Endpoints

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all open jobs (supports `?search=`, `?type=`) |
| GET | `/api/jobs/stats` | Dashboard statistics |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create a job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job and its applications |
| POST | `/api/jobs/:id/apply` | Submit an application |
| GET | `/api/jobs/:id/applications` | Get all applications for a job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications |
| PUT | `/api/applications/:id/status` | Update application status |
| DELETE | `/api/applications/:id` | Delete an application |

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/jerriecruiz001-prog/cloud-checkpoint.git
cd cloud-checkpoint
```

### 2. Set up environment variables
Create `server/config/.env`:
```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=3000
```

### 3. Install dependencies
```bash
npm install --prefix server
npm install --prefix client
```

### 4. Run in development
```bash
# Start Express server (port 3000)
npm run dev --prefix server

# Start React dev server (port 3001, proxies API to 3000)
npm start --prefix client
```

### 5. Build for production
```bash
npm run build --prefix client
cp -r client/build/. server/public/
node server/server.js
```

## Deployment (Azure)

This app is deployed using GitHub Actions to Azure App Service.

### Azure Configuration
- **Runtime:** Node 22 LTS on Linux
- **Startup Command:** `node server/server.js`
- **Environment Variable:** `MONGO_URI` set in Azure Configuration → Application settings

### CI/CD Pipeline
Every push to `main` triggers the GitHub Actions workflow which:
1. Installs server and client dependencies
2. Builds the React frontend
3. Copies the build into `server/public/`
4. Deploys to Azure Web App

## Author

**Jerrie Cruiz** — [@jerriecruiz001-prog](https://github.com/jerriecruiz001-prog)
