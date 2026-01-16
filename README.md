# Restaurant Management System

## 📖 Description

A comprehensive full-stack restaurant management system built with modern technologies. This application provides a complete solution for managing restaurant operations including table reservations, menu management, order processing, customer reviews, and payment handling.

### Key Features

- **🔐 Authentication & Authorization**: Secure user authentication with JWT tokens and Google OAuth2 integration
- **🍽️ Restaurant Management**: Complete restaurant profile management with multiple areas and categories
- **📅 Reservation System**: Real-time table booking and management system
- **📋 Menu Management**: Dynamic menu with categories, pricing, and availability tracking
- **🛒 Order Processing**: Pre-order and cart management for seamless customer experience
- **⭐ Review System**: Customer reviews with owner reply functionality
- **💳 Payment Integration**: Secure payment processing and transaction tracking
- **🔔 Notifications**: Real-time notifications for users and restaurant owners
- **🎁 Promotions**: Promotional campaigns and discount management
- **❤️ Favorites**: User favorite restaurants and dishes tracking

### Technology Stack

**Backend (Spring Boot)**
- Java 17
- Spring Boot 2.7.18
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL Database
- OAuth2 Client (Google)
- Maven Build System

**Frontend (Next.js)**
- Next.js 14.1.0
- React 18.2.0
- TypeScript
- Tailwind CSS
- React Hook Form + Zod Validation
- Axios for API calls

### Architecture

This project follows a modern microservices-inspired architecture with:
- RESTful API backend
- Separate frontend application
- Token-based authentication
- Role-based access control
- Modular and scalable design

### Security

- JWT access tokens (15-minute expiration)
- Refresh tokens (7-day expiration)
- BCrypt password encryption
- OAuth2 social authentication
- Secure API endpoints with Spring Security

---

**Status**: Active Development  
**Version**: 0.0.1-SNAPSHOT  
**License**: Private 
