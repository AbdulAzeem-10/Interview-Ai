# Resume Analyzer Backend

> Enterprise-grade MERN backend powering AI-driven Resume Analysis, ATS Resume Generation, and Interview Preparation.

Designed using scalable backend architecture with modular services, clean separation of concerns, AI integrations, MongoDB Atlas, and RESTful APIs.

---

# Overview

This backend is responsible for:

- User Authentication
- Resume Processing
- AI Interview Report Generation
- ATS Resume Generation
- Secure API Management
- MongoDB Data Persistence
- PDF Generation
- Email Services
- Authentication & Authorization

The system follows a layered architecture making it easy to extend, maintain, and deploy.

---

# Tech Stack

| Category | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT + HTTP Cookies |
| Password Hashing | bcryptjs |
| AI SDK | Google GenAI SDK |
| AI Models | Gemini Flash Family |
| PDF Engine | Puppeteer |
| Validation | Zod |
| Schema Conversion | zod-to-json-schema |
| Environment Variables | dotenv |
| CORS | cors |
| Cookies | cookie-parser |
| Email Service | Nodemailer |
| Development | Nodemon |

---

# Backend Features

## Authentication System

- Secure Registration
- Login
- JWT Authentication
- Password Hashing
- Protected Routes
- Cookie-based Authentication
- User Session Management

---

## AI Interview Report Generator

The backend integrates Google's Gemini SDK to generate structured interview reports.

Generated report includes:

- Resume Match Score
- HR Evaluation
- Candidate Summary
- Hiring Recommendation
- Strength Analysis
- Weakness Analysis
- Technical Interview Questions
- Behavioral Interview Questions
- Skill Gap Detection
- 7-Day Preparation Plan

Every response is validated using Zod before being persisted into MongoDB.

---

## ATS Resume Generator

Generates recruiter-friendly resumes by:

- Understanding Resume
- Understanding Job Description
- Understanding Candidate Self Description

The AI returns semantic HTML which is converted into PDF using Puppeteer.

Generated resumes are:

- ATS Friendly
- Human-like
- Professional Layout
- Printable
- One Page
- Optimized for Recruiters

---

## AI Response Validation

Unlike basic AI applications, every Gemini response is validated before being accepted.

Pipeline:

Gemini
↓

JSON Response

↓

Zod Validation

↓

Business Logic Validation

↓

MongoDB Storage

↓

API Response

This prevents malformed AI outputs from corrupting the database.

---

# AI Architecture

The project follows a dedicated AI Service Layer.

```
Controller
      │
      ▼
AI Service
      │
      ▼
Gemini SDK
      │
      ▼
Structured JSON
      │
      ▼
Zod Validation
      │
      ▼
MongoDB
```

---

# Gemini Integration

Uses the official Google GenAI SDK.

The service supports:

- Structured Outputs
- JSON Response Mode
- Prompt Engineering
- Resume Analysis
- ATS Resume Creation
- Interview Simulation

The prompts are carefully engineered to produce deterministic recruiter-quality outputs.

---

# Model Routing & AI Provider Layer

The backend is designed with an abstraction layer around AI providers.

Instead of coupling business logic directly with Gemini, all AI calls pass through a centralized service.

Benefits:

- Easy Model Switching
- SDK Isolation
- Better Maintainability
- Centralized Prompt Management
- Response Validation
- Retry Handling

The architecture allows future support for:

- Gemini
- OpenAI
- Claude
- Azure OpenAI
- Local LLMs

without changing controller logic.

---

# AI Retry & Fallback Strategy

The AI service is designed with resiliency in mind.

Supported recovery strategies include:

- Retry on transient network failures
- Timeout handling
- Response validation
- Structured JSON enforcement
- Graceful API failure handling

The abstraction layer also enables future provider fallback (Gemini → OpenAI → Claude) with minimal changes.

---

# REST API Architecture

```
Client

↓

Express Router

↓

Controller

↓

Business Service

↓

AI Service / Database

↓

MongoDB Atlas

↓

JSON Response
```

---

# Folder Structure

```
backend
│
├── src
│
├── config
│     ├── database.js
│     ├── jwt.js
│
├── controllers
│     ├── auth.controller.js
│     ├── interview.controller.js
│
├── middleware
│     ├── auth.middleware.js
│     ├── error.middleware.js
│
├── models
│     ├── user.model.js
│     ├── interviewReport.model.js
│
├── routes
│     ├── auth.routes.js
│     ├── interview.routes.js
│
├── services
│     ├── ai.service.js
│     ├── email.service.js
│
├── utils
│
├── app.js
│
└── server.js
```

---

# MongoDB Atlas

Uses MongoDB Atlas as the cloud database.

Features:

- Cloud Hosted
- Automatic Scaling
- Connection Pooling
- Mongoose ODM
- Schema Validation
- Indexed Queries

Collections include:

- Users
- Interview Reports

---

# Validation

Request validation is implemented using Zod.

Benefits:

- Type-safe AI responses
- Strong schema enforcement
- Cleaner controllers
- Reduced runtime errors

---

# Security

Security measures include:

- Password Hashing (bcrypt)
- JWT Authentication
- HTTP Only Cookies
- Environment Variables
- Protected Routes
- Authentication Middleware
- MongoDB Injection Prevention (via Mongoose)

---

# API Testing

All REST APIs were tested using Postman.

Tested scenarios include:

- User Registration
- User Login
- Authentication Middleware
- Protected Routes
- Resume Upload
- Interview Report Generation
- ATS Resume Generation
- MongoDB CRUD Operations
- Error Handling
- Validation Failures

---

# API Endpoints

Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

Interview

```
POST /api/interview/report

POST /api/interview/resume
```

---

# Error Handling

Centralized error handling middleware provides consistent API responses.

Handles:

- Validation Errors
- Authentication Errors
- MongoDB Errors
- AI Service Errors
- Network Errors
- Unknown Exceptions

---

# PDF Generation

The ATS Resume Generator converts AI-produced HTML into production-ready PDFs using Puppeteer.

Benefits:

- Pixel Perfect Rendering
- Print Ready
- Recruiter Friendly
- ATS Compatible

---

# Environment Variables

```
PORT=

MONGO_URI=

JWT_SECRET=

GOOGLE_GENAI_API_KEY=

EMAIL_USER=

EMAIL_PASS=
```

---

# Scalability

The backend was designed with scalability in mind.

Current architecture allows easy addition of:

- Redis Caching
- Rate Limiting
- Queue Workers
- Background Jobs
- Multi-AI Provider Support
- Docker Deployment
- Kubernetes
- CI/CD Pipelines
- Microservices

without major refactoring.

---

# Engineering Principles

- Modular Architecture
- Separation of Concerns
- Reusable Services
- Clean Folder Structure
- RESTful Design
- Centralized Error Handling
- Environment-Based Configuration
- Schema Validation
- AI Response Validation
- Production-Oriented Code Organization

---

# Performance Considerations

- Lightweight Controllers
- Service Layer Abstraction
- MongoDB Connection Reuse
- JSON Schema Validation
- Efficient Prompt Design
- Stateless APIs
- Cloud Database Integration

---

# Future Enhancements

- Multi-Model AI Routing
- Provider Failover
- Resume Version History
- OCR Support
- WebSocket Notifications
- Queue-Based PDF Generation
- Redis Cache
- Docker Compose
- Kubernetes Deployment
- GitHub Actions CI/CD
- Unit & Integration Testing
- API Documentation (Swagger/OpenAPI)

---

# Author

**Abdul Azeem**

Backend Developer | MERN Stack | AI Integration | REST APIs | MongoDB | Node.js | Express.js | Generative AI