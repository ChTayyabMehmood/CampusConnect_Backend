# CampusConnect_Backend

src/
├── config/
│ └── db.js # Database connection pool
│
├── models/
│ ├── index.js # Export all models
│ ├── user.model.js
│ ├── studentProfile.model.js
│ ├── mentorProfile.model.js
│ ├── clubAdminProfile.model.js
│ ├── opportunity.model.js
│ ├── team.model.js
│ ├── teamMember.model.js
│ ├── applyEntity.model.js
│ ├── club.model.js
│ ├── clubMember.model.js
│ ├── saved.model.js
│ ├── mentorSession.model.js
│ └── messageLog.model.js
│
├── services/
│ ├── index.js # Export all services
│ ├── user.service.js
│ ├── studentProfile.service.js
│ ├── mentorProfile.service.js
│ ├── opportunity.service.js
│ ├── team.service.js
│ ├── application.service.js
│ ├── club.service.js
│ ├── mentorSession.service.js
│ └── message.service.js
│
├── controllers/
│ ├── index.js # Export all controllers
│ ├── user.controller.js
│ ├── studentProfile.controller.js
│ ├── opportunity.controller.js
│ ├── team.controller.js
│ ├── application.controller.js
│ ├── club.controller.js
│ ├── mentorSession.controller.js
│ └── message.controller.js
│
├── routes/
│ ├── index.js # Register all routes
│ ├── user.routes.js
│ ├── studentProfile.routes.js
│ ├── opportunity.routes.js
│ ├── team.routes.js
│ ├── application.routes.js
│ ├── club.routes.js
│ ├── mentorSession.routes.js
│ └── message.routes.js
│
├── middleware/
│ ├── auth.js # JWT authentication
│ ├── errorHandler.js # Global error handler
│ ├── validation.js # Request validation
│ └── logger.js # Request logging
│
├── utils/
│ ├── index.js # Export all utils
│ ├── helpers.js # Helper functions
│ ├── validators.js # Validation schemas
│ └── constants.js # App constants (roles, statuses)
│
├── scripts/
│ └── initDb.js # Database initialization (already have this)
│
├── tests/
│ ├── unit/
│ │ ├── models/
│ │ └── services/
│ └── integration/
│ └── api/
│
└── app.js # Express app setup

├── server.js # Entry point
├── .env # Environment variables
├── .gitignore
├── package.json
└── README.md
