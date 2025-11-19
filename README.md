# SFXC Tabulation System

A comprehensive real-time event scoring and tabulation system built with Laravel 12, React, and Inertia.js. Designed for managing competitions, pageants, singing contests, and dance events with multiple rounds and judges.

## 📋 Overview

The SFXC Tabulation System is a professional-grade scoring platform that enables seamless management of competitive events. It supports multiple event types, real-time score updates, multi-round competitions, and comprehensive judge assignment capabilities.

## ✨ Key Features

### Event Management
- **Multi-Event Support**: Create and manage multiple events simultaneously (Pageants, Singing, Dancing)
- **Event Configuration**: Define event details, dates, descriptions, and active status
- **Event Archiving**: Archive completed events for historical reference
- **Real-time Updates**: Automatic broadcasting of score changes across all connected judges

### Contestant Management
- **Contestant Registration**: Add contestants with names, sequence numbers, and photos
- **Photo Upload**: Support for contestant photo uploads with automatic management
- **Multi-Round Assignment**: Assign contestants to specific competition rounds
- **Unique Sequencing**: Ensure unique sequence numbers per event

### Scoring System
- **Criteria-Based Scoring**: Define custom scoring criteria with percentages and definitions
- **Flexible Scoring**: Support for 0-10 point scales per criterion
- **Round-Specific Criteria**: Define different criteria for different competition rounds
- **Score Locking**: Lock scores after submission to prevent accidental changes
- **Automatic Calculation**: Real-time total score computation

### Online Sync
- **Database Sync**: Sync local data to online server for public viewing
- **Foreign Key Protection**: Automatic table sequence enforcement prevents data corruption
- **Atomic Transactions**: All-or-nothing sync ensures data integrity
- **Real-time Monitoring**: View sync status and statistics
- **See**: `DATABASE_IMPORT_SEQUENCE.md` and `SYNC_IMPLEMENTATION.md`

### Judge Management
- **Judge Assignment**: Assign multiple judges to events
- **Role-Based Access**: Separate interfaces for administrators and judges
- **Real-time Tabulation**: Judges can score contestants in real-time
- **Individual Scoring**: Each judge scores independently with personal dashboards

### User & Permission Management
- **Role-Based System**: Admin and Judge roles with distinct permissions
- **User Management**: Create, edit, and manage user accounts
- **Active Status Control**: Enable/disable user accounts as needed
- **Secure Authentication**: Password hashing and secure session management

### Round Management
- **Multi-Round Competitions**: Support for multiple competition rounds
- **Active Round Control**: Set specific rounds as active for judging
- **Tabulation Population**: Automatically generate scoring sheets for all judges
- **Round-Specific Contestants**: Different contestants can participate in different rounds

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 12
- **PHP**: ^8.2
- **Database**: SQLite (easily configurable for MySQL/PostgreSQL)
- **Authentication**: Laravel Sanctum
- **Real-time**: Laravel Echo with Pusher

### Frontend
- **UI Framework**: React 18
- **Routing**: Inertia.js 2.0
- **Styling**: Tailwind CSS 3
- **Components**: HeadlessUI, Lucide React
- **Notifications**: SweetAlert2
- **Build Tool**: Vite 7

### Additional Tools
- **Route Generation**: Ziggy
- **Development**: Laravel Breeze, Pail, Pint
- **Testing**: Pest PHP

## 📦 Installation

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 18
- npm or yarn

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SFXC-Tabulation
   ```

2. **Install dependencies and setup**
   ```bash
   composer setup
   ```
   This command will:
   - Install Composer dependencies
   - Copy `.env.example` to `.env`
   - Generate application key
   - Run database migrations
   - Install npm dependencies
   - Build frontend assets

3. **Configure environment**
   Edit `.env` file for your database and broadcast settings:
   ```env
   DB_CONNECTION=sqlite
   BROADCAST_CONNECTION=pusher
   ```

4. **Start development servers**
   ```bash
   composer dev
   ```
   This runs:
   - Laravel development server (http://localhost:8000)
   - Queue worker
   - Log viewer (Pail)
   - Vite development server

### Manual Setup

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Install JavaScript dependencies
npm install

# Build assets
npm run build
```

## 🚀 Usage

### Admin Functions

#### Event Management
- Create, edit, and delete events
- Set event types (Pageant, Singing, Dancing)
- Define event dates and descriptions
- Activate/deactivate events
- Archive completed events

#### Criteria Management
- Create scoring criteria with percentages
- Define criteria definitions and descriptions
- Assign criteria to specific rounds
- Set maximum percentage limits per criterion
- Activate/deactivate criteria

#### Contestant Management
- Add contestants with names and sequence numbers
- Upload contestant photos
- Edit contestant information
- Remove contestants from events
- Assign contestants to specific rounds

#### Judge Assignment
- Assign judges to events
- View available judges
- Manage judge assignments
- Control judge access to events

#### Round Management
- Add contestants to specific rounds
- Set active rounds for judging
- Populate tabulation sheets automatically
- View round contestants
- Remove contestants from rounds

#### User Management
- Create admin and judge accounts
- Set user passwords
- Activate/deactivate users
- Manage user roles

### Judge Functions

#### Scoring Interface
- View assigned event and active round
- Access contestant information and photos
- Score contestants based on defined criteria
- View real-time score calculations
- Submit and update scores
- View scoring progress

## 🗄️ Database Schema

### Main Tables
- **events**: Competition/event information
- **contestants**: Participant details with photos
- **criterias**: Scoring criteria definitions
- **rounds**: Round assignments for contestants
- **actives**: Active round management
- **tabulations**: Individual judge scores
- **users**: System users (admins and judges)
- **roles**: User role definitions
- **assigns**: Judge-to-event assignments
- **results_archive**: Historical event results

## 🔧 Development

### Available Scripts

```bash
# Install and setup everything
composer setup

# Start all development servers
composer dev

# Run tests
composer test

# Build for production
npm run build
```

### Code Quality
- **Laravel Pint**: PHP code styling
- **Pest PHP**: Testing framework
- **ESLint**: JavaScript linting (via Vite)

## 🔐 Security

- Password hashing with bcrypt
- CSRF protection on all forms
- Role-based middleware protection
- Secure session management
- Input validation on all requests

## 🤝 Contributing

This is a commissioned project for SFXC. For inquiries about modifications or feature requests, please contact the development team.

## 📄 License

This project is proprietary software developed for SFXC. All rights reserved.

## 👥 Support

For technical support or questions, please contact the development team.

---

**Built with ❤️ using Laravel, React, and Inertia.js**
