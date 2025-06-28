# Centralized Missing Persons Database and Mobile Application

## Overview
A comprehensive system for managing missing persons reports in Kenya, providing a centralized database accessible to law enforcement, NGOs, and authorized organizations.

## Features
- **Centralized Database**: Single national database for all missing persons reports
- **Mobile Application**: User-friendly interface for reporting and tracking
- **Real-time Alerts**: GPS-based notifications for community members
- **Multi-platform Access**: Web and mobile interfaces
- **Integration Capabilities**: Works with existing systems (DCI, Kenya Red Cross, etc.)
- **AI-Powered Tools**: Facial recognition and age progression
- **Privacy-Compliant**: Adheres to data protection laws

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Frontend  │    │  Admin Panel    │
│   (React Native)│    │     (React)     │    │     (React)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
              ┌─────────────────────────────────────┐
              │          API Gateway                │
              │         (Express.js)                │
              └─────────────────────────────────────┘
                                 │
              ┌─────────────────────────────────────┐
              │        Backend Services             │
              │    (Node.js/Express + Python)       │
              └─────────────────────────────────────┘
                                 │
              ┌─────────────────────────────────────┐
              │         Database Layer              │
              │    (PostgreSQL + Redis Cache)       │
              └─────────────────────────────────────┘
```

## Project Structure

```
missing-persons-system/
├── backend/          # Backend API and services
├── frontend/         # Web application (React)
├── mobile/           # Mobile application (React Native)
├── database/         # Database schemas and migrations
├── docs/             # Documentation
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL (v13+)
- Redis
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies for each component
3. Set up environment variables
4. Initialize the database
5. Start the services

Detailed instructions are available in each component's directory.

## Key Components

### 1. Backend API
- User authentication and authorization
- Missing persons report management
- Real-time notifications
- Integration with external services
- Data analytics and reporting

### 2. Web Frontend
- Administrative dashboard
- Public search interface
- Report management system
- Analytics and reporting tools

### 3. Mobile Application
- Easy reporting interface
- GPS functionality
- Push notifications
- Offline capabilities
- Photo and document upload

### 4. Database
- User management
- Missing persons records
- Location data
- Audit trails
- Integration logs

## Security and Privacy

- End-to-end encryption for sensitive data
- Role-based access control
- Data anonymization capabilities
- GDPR/Data Protection Act compliance
- Secure API authentication (JWT + OAuth2)

## Integration Points

- Kenya Police Service
- Directorate of Criminal Investigations (DCI)
- Kenya Red Cross
- Missing Child Kenya
- Mobile network operators (for CDR analysis)
- CCTV surveillance systems

## Development Status

- [x] Project structure setup
- [ ] Backend API development
- [ ] Database schema design
- [ ] Web frontend development
- [ ] Mobile application development
- [ ] AI/ML integration
- [ ] Testing and QA
- [ ] Deployment and DevOps

## Contributing

This project aims to help reunite families and support law enforcement in Kenya. Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or collaboration opportunities, please contact the development team.

