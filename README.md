````markdown
# 🚀 Resume Analyzer AI

> **An AI-powered Full-Stack Recruitment Intelligence Platform that analyzes resumes, evaluates candidate-job compatibility, generates recruiter-grade interview reports, and creates ATS-optimized resumes using Google's Gemini Large Language Models.**

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-Validation-purple?style=for-the-badge)
![Puppeteer](https://img.shields.io/badge/PDF-Puppeteer-orange?style=for-the-badge)
![JWT](https://img.shields.io/badge/Auth-JWT-red?style=for-the-badge)

</p>

---

# 📖 Overview

Resume Analyzer AI is a production-inspired full-stack application that simulates an intelligent recruitment platform capable of analyzing resumes, comparing candidates against job descriptions, generating interview preparation reports, and producing ATS-friendly resumes tailored to specific positions.

Unlike traditional CRUD applications, this project focuses on solving real-world recruitment workflows by combining modern backend engineering practices with Large Language Models (LLMs).

The platform demonstrates scalable software architecture, schema-driven AI integration, structured outputs, runtime validation, PDF generation, and resilient AI model orchestration.

---

# ✨ Features

## 🤖 AI Resume Analysis

- Resume vs Job Description Matching
- AI Candidate Evaluation
- Professional Recruiter Summary
- Candidate Strength Analysis
- Weakness Detection
- Skill Gap Identification
- Hiring Recommendation
- Match Score (0-100)

---

## 🎯 AI Interview Preparation

Automatically generates

- Technical Interview Questions
- Behavioral Interview Questions
- Question Intentions
- Ideal Answers
- Interview Preparation Roadmap
- 7-Day Learning Plan

---

## 📄 ATS Resume Generator

Generate

- ATS Friendly Resume
- AI Optimized Resume
- Recruiter Focused Resume
- HTML Resume
- PDF Resume
- Print Ready Resume

---

## 📊 Candidate Intelligence

The generated report includes

- Match Score
- Candidate Summary
- Strengths
- Weaknesses
- Missing Skills
- Hiring Recommendation
- Recommendation Reason
- Interview Questions
- Preparation Plan

---

# 🏗 System Architecture

```text
                     React Frontend
                            │
                            ▼
                    React Router DOM
                            │
                            ▼
                    Context Providers
                            │
                            ▼
                     Axios API Client
                            │
                            ▼
                     Express REST API
                            │
                            ▼
                        Controllers
                            │
                            ▼
                      Business Services
                            │
                            ▼
                  AI Orchestration Layer
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Gemini Model 1      Gemini Model 2      Gemini Model 3
        │                   │                   │
        └──────── Automatic Failover ───────────┘
                            │
                            ▼
               Native Structured JSON Output
                            │
                            ▼
                  Runtime Validation (Zod)
                            │
                            ▼
                    MongoDB Schema Validation
                            │
                            ▼
                      MongoDB Atlas Storage
                            │
                            ▼
                      REST API Response
```

---

# 🧠 AI Processing Pipeline

```text
Resume

↓

Self Description

↓

Job Description

↓

Prompt Engineering

↓

Google Gemini SDK

↓

Native Structured Output Schema

↓

JSON Response

↓

Runtime Validation (Zod)

↓

MongoDB Validation

↓

Database Storage

↓

API Response
```

---

# ⚙ Backend Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Google Gemini SDK
- Puppeteer
- JWT Authentication
- bcrypt
- Zod
- dotenv
- Multer
- Cookie Parser
- CORS

---

# 🎨 Frontend Tech Stack

- React
- Vite
- React Router
- React Context API
- Custom Hooks
- SCSS
- Axios

---

# 📂 Folder Structure

```text
resumeAnalyzer/

├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   ├── contexts/
│   ├── features/
│   │
│   │    ├── interview/
│   │    ├── authentication/
│   │    ├── resume/
│   │
│   ├── hooks/
│   ├── routes/
│   ├── pages/
│   ├── styles/
│   └── assets/
│
│
├── backend/
│
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── templates/
│   └── uploads/
│
├── .env
├── package.json
└── README.md
```

---

# 🏛 Backend Architecture

The backend follows a layered architecture.

```text
Client

↓

Express Router

↓

Controller Layer

↓

Business Service Layer

↓

AI Service Layer

↓

MongoDB Models

↓

Database
```

Each layer has a single responsibility which improves maintainability and scalability.

---

# 🤖 AI Engineering

Instead of relying solely on prompt engineering, the AI layer combines multiple engineering techniques:

- Google Gemini SDK
- Native Structured Outputs
- Runtime Validation
- Schema Enforcement
- Deterministic Prompt Engineering
- AI Response Parsing
- Automatic Model Failover
- Centralized AI Service Layer

---

# 🔄 AI Model Failover Strategy

The application includes a centralized AI request handler capable of automatically retrying requests across multiple Gemini models.

```text
Gemini Model A

↓

Failed?

↓

Gemini Model B

↓

Failed?

↓

Gemini Model C

↓

Return First Successful Response
```

Benefits

- Improved reliability
- Reduced downtime
- Cleaner controller logic
- Centralized retry strategy
- Easy future model upgrades

---

# 📄 Resume Generation Pipeline

```text
Candidate Resume

↓

Gemini AI

↓

Professional HTML Resume

↓

Puppeteer

↓

PDF Rendering

↓

Downloadable Resume
```

---

# 💾 Database Design

MongoDB stores

- Resume
- Job Description
- Self Description
- Match Score
- Candidate Summary
- Strengths
- Weaknesses
- Recommendation
- Technical Questions
- Behavioral Questions
- Skill Gaps
- Preparation Plans

using embedded subdocuments for efficient document retrieval.

---

# 🛡 Validation Pipeline

Every request passes through multiple validation stages.

```text
Client Request

↓

Express Validation

↓

Gemini Structured Output

↓

JSON Parsing

↓

Runtime Validation (Zod)

↓

MongoDB Validation

↓

Database Storage
```

This prevents malformed AI responses from reaching the database.

---

# 🔐 Security

- JWT Authentication
- bcrypt Password Hashing
- HTTP Only Cookies
- Environment Variables
- MongoDB Validation
- Zod Runtime Validation
- Input Sanitization
- CORS Protection

---

# ⚡ Performance Optimizations

- Layered Backend Architecture
- Modular Services
- Centralized AI Service
- Async/Await
- Embedded Mongo Documents
- Schema Validation
- AI Response Validation
- Model Failover Strategy
- Stateless REST APIs

---

# 🔌 REST APIs

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

---

## Interview

```http
POST /api/interview/report
GET  /api/interview/history
GET  /api/interview/:id
```

---

## Resume

```http
POST /api/resume/pdf
POST /api/resume/analyze
```

---

# 🧪 Testing

The backend APIs were tested using

- Postman
- MongoDB Atlas
- MongoDB Compass

Testing included

- Authentication
- Resume Analysis
- Interview Report Generation
- PDF Generation
- MongoDB Persistence
- AI Response Validation
- API Error Handling

---

# 🚧 Engineering Challenges & Solutions

## 1. Gemini API Model Deprecation

### Problem

During development, multiple Gemini model versions became unavailable or unsupported, resulting in API failures.

### Solution

Refactored the AI service into a centralized orchestration layer with a prioritized list of supported Gemini models. The service automatically retries requests against the next available model until a successful response is received.

---

## 2. AI Response Validation

### Problem

LLM responses occasionally omitted required properties or returned malformed JSON.

### Solution

Implemented native Gemini structured outputs combined with Zod runtime validation before persisting any data to MongoDB.

---

## 3. MongoDB Validation Errors

### Problem

AI-generated responses initially did not match the MongoDB document schema.

### Solution

Redesigned the AI output schema to mirror the Mongoose model and validated responses before database insertion.

---

## 4. TLS / HTTPS Connection Issues

### Problem

Development occasionally experienced TLS handshake failures (`ECONNRESET`) when connecting to the Google Generative Language API. The issue was environment/network specific rather than application logic.

### Solution

Introduced a centralized AI request layer with improved error handling and automatic model failover. This isolated network-related failures from the application logic and made the service resilient to temporary API availability issues.

---

## 5. React Context Errors

### Problem

Custom hooks were accidentally used outside their respective Context Providers.

### Solution

Wrapped application routes with the required providers and standardized Context API usage across the frontend.

---

## 6. Module Resolution Errors

### Problem

Vite failed to resolve imports because of incorrect paths and inconsistent file extensions.

### Solution

Standardized the project structure, corrected import paths, and aligned file naming conventions.

---

## 7. AI Response Consistency

### Problem

Different Gemini models occasionally produced responses with slight structural differences.

### Solution

Introduced a unified structured output schema and runtime validation pipeline to normalize responses across supported models.

---

# 📈 Software Engineering Concepts Demonstrated

- Layered Architecture
- RESTful API Design
- MVC Principles
- Separation of Concerns
- Dependency Injection Pattern
- Service Abstraction
- Runtime Validation
- Schema-Driven Development
- AI Integration
- Prompt Engineering
- PDF Rendering Pipeline
- MongoDB Document Modeling
- Error Handling
- Async Programming
- Context API
- Custom React Hooks
- Component Reusability
- State Management

---

# 🚀 Future Improvements

- Docker Containerization
- CI/CD Pipeline
- Redis Caching
- Background Job Queues
- AI Mock Interview Simulator
- Voice Interview Practice
- Recruiter Dashboard
- Resume Keyword Heatmap
- Company-Specific Interview Preparation
- Resume Version Comparison
- Multi-language Resume Generation
- Analytics Dashboard

---

# 👨‍💻 Author

**Abdul Azeem**

Backend Engineer • Full Stack Developer • AI Enthusiast

Passionate about building scalable backend systems, AI-powered developer tools, and modern web applications using Node.js, React, MongoDB, and Large Language Models.

---

# ⭐ Support

If you found this project interesting or helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.
````
