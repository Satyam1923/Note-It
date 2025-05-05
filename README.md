# NoteIt API

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![Express](https://img.shields.io/badge/Express-v4.18%2B-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15%2B-blueviolet)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![REST API](https://img.shields.io/badge/REST-API-brightgreen)

A secure note-taking API with user authentication and sharing capabilities, built with Node.js, Express, and PostgreSQL.

## Table of Contents
- [Features](#features)
- [API Documentation](#api-documentation)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Development](#development)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

### Authentication
- User registration with email/password
- JWT-based authentication
- Secure logout mechanism
- Account deletion

### Notes Management
- Create, read, update, and delete notes
- Bulk note creation
- Note duplication
- Mark notes as favorites
- Full-text search functionality

### Sharing
- Generate secure shareable links
- Accept shared notes
- Token-protected sharing

## API Documentation

### Authentication Routes

| Endpoint    | Method | Description                | Parameters               | Auth Required |
|-------------|--------|----------------------------|--------------------------|---------------|
| `/register` | POST   | Register new user          | email, password          | No            |
| `/login`    | POST   | Login and get JWT token    | email, password          | No            |
| `/logout`   | POST   | Logout user                | -                        | Yes           |
| `/delete`   | DELETE | Delete user account        | -                        | Yes           |

### Notes Routes

| Endpoint                     | Method | Description                          | Parameters               | Auth Required |
|------------------------------|--------|--------------------------------------|--------------------------|---------------|
| `/notes/`                    | GET    | Get all user notes                   | -                        | Yes           |
| `/notes/search`              | GET    | Search notes                         | query                    | Yes           |
| `/notes/:id`                 | GET    | Get specific note                    | id                       | Yes           |
| `/notes/add`                 | POST   | Create new note                      | title, content           | Yes           |
| `/notes/bulk-add`            | POST   | Create multiple notes                | Array of notes           | Yes           |
| `/notes/duplicate/:id`       | POST   | Duplicate a note                     | id                       | Yes           |
| `/notes/update/:id`          | PATCH  | Update a note                        | id, [title, content]     | Yes           |
| `/notes/delete/:id`          | DELETE | Delete a note                        | id                       | Yes           |
| `/notes/favourites/:id`      | GET    | Toggle favorite status               | id                       | Yes           |
| `/notes/share/:id`           | POST   | Generate shareable link              | id                       | Yes           |
| `/notes/accept-share/:id`    | POST   | Accept shared note                   | id, token                | Yes           |

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone git@github.com:Satyam1923/Note-It.git
cd noteit-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Configuration](#configuration))

4. Set up the database (see [Database Setup](#database-setup))

5. Start the server:
```bash
npm start
```

For development with hot-reload:
```bash
npm run dev
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=noteit
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

## Database Setup

you can set up the database manually using the SQL script:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shared_notes (
  id SERIAL PRIMARY KEY,
  note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  share_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
## Usage

### Authentication

#### Register a new user:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

#### Login:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

Response:
```json
{
  "token": "your.jwt.token",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Logout:
```bash
curl -X POST http://localhost:3000/logout \
  -H "Authorization: Bearer your.jwt.token"
```

### Notes Management

#### Get all notes:
```bash
curl -X GET http://localhost:3000/notes \
  -H "Authorization: Bearer your.jwt.token"
```

#### Create a new note:
```bash
curl -X POST http://localhost:3000/notes/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your.jwt.token" \
  -d '{"title": "My First Note", "content": "This is the content of my first note."}'
```

#### Search notes:
```bash
curl -X GET "http://localhost:3000/notes/search?query=first" \
  -H "Authorization: Bearer your.jwt.token"
```

#### Update a note:
```bash
curl -X PATCH http://localhost:3000/notes/update/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your.jwt.token" \
  -d '{"title": "Updated Title", "content": "Updated content."}'
```

#### Delete a note:
```bash
curl -X DELETE http://localhost:3000/notes/delete/1 \
  -H "Authorization: Bearer your.jwt.token"
```

### Sharing Notes

#### Generate a shareable link:
```bash
curl -X POST http://localhost:3000/notes/share/1 \
  -H "Authorization: Bearer your.jwt.token"
```

Response:
```json
{
  "shareUrl": "http://localhost:3000/notes/accept-share/1?token=share_token",
  "expiresAt": "2023-06-15T12:00:00Z"
}
```

#### Accept a shared note:
```bash
curl -X POST http://localhost:3000/notes/accept-share/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your.jwt.token" \
  -d '{"token": "share_token"}'
```

## Security

- All passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- CORS is configured to restrict access
- Rate limiting is implemented to prevent brute force attacks
- Input validation is performed on all requests
- Database queries use parameterized statements to prevent SQL injection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
