# Task Management Web Application

A full-stack Java-based Task Management web application built with Spring Boot, MySQL, and modern frontend technologies. Users can register, log in, and manage their to-do tasks with deadlines, priority levels, and status tracking.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Organization**: 
  - Status tracking (To Do, In Progress, Done)
  - Priority levels (Low, Medium, High, Urgent)
  - Deadline management with overdue detection
- **Modern UI**: Responsive design with beautiful animations and toast notifications
- **Real-time Statistics**: Dashboard with task counts and overview
- **Filtering**: Filter tasks by status and priority
- **Security**: JWT-based authentication with Spring Security

## 🛠️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Database Operations)
- **MySQL 8.0** (Database)
- **Maven** (Build Tool)

### Frontend
- **HTML5**
- **CSS3** (Modern styling with animations)
- **JavaScript ES6+** (Vanilla JS with modern features)
- **Font Awesome** (Icons)

### DevOps
- **Docker & Docker Compose** (Containerization)

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0 (or Docker for containerized setup)
- Docker & Docker Compose (optional, for containerized deployment)

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - The MySQL database will be automatically set up and configured

### Option 2: Manual Setup

1. **Clone and setup database**
   ```bash
   git clone <repository-url>
   cd task-management-app
   
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE taskmanager;
   ```

2. **Configure database connection**
   Update `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/taskmanager
       username: your_username
       password: your_password
   ```

3. **Build and run**
   ```bash
   mvn clean package
   java -jar target/task-management-app-0.0.1-SNAPSHOT.jar
   ```

4. **Access the application**
   - Open `http://localhost:8080`

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### Task Management Endpoints

All task endpoints require JWT authentication header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Tasks
```http
GET /api/tasks
```

#### Get Task by ID
```http
GET /api/tasks/{id}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management application",
  "status": "TODO",
  "priority": "HIGH",
  "deadline": "2024-12-31T23:59:59"
}
```

#### Update Task
```http
PUT /api/tasks/{id}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "deadline": "2024-12-31T23:59:59"
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
```

#### Update Task Status
```http
PATCH /api/tasks/{id}/status?status=DONE
```

#### Filter Tasks
```http
GET /api/tasks/status/TODO
GET /api/tasks/priority/HIGH
GET /api/tasks/overdue
```

### Task Status Values
- `TODO` - To Do
- `IN_PROGRESS` - In Progress
- `DONE` - Completed

### Task Priority Values
- `LOW` - Low Priority
- `MEDIUM` - Medium Priority
- `HIGH` - High Priority
- `URGENT` - Urgent

## 🎨 Frontend Features

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Styling**: Clean, professional interface with smooth animations
- **Dark Theme**: Beautiful gradient backgrounds and card-based layout
- **Interactive Elements**: Hover effects and smooth transitions

### User Experience
- **Toast Notifications**: Real-time feedback for all actions
- **Loading Indicators**: Visual feedback during API calls
- **Form Validation**: Client-side and server-side validation
- **Modal Dialogs**: Intuitive task creation and editing
- **Filtering**: Easy task organization and searching

### Dashboard Features
- **Statistics Cards**: Quick overview of task counts
- **Status Indicators**: Visual task status representation
- **Priority Badges**: Color-coded priority levels
- **Overdue Detection**: Automatic highlighting of overdue tasks
- **Deadline Tracking**: Clear deadline display with warnings

## 🔧 Configuration

### Database Configuration
The application uses MySQL with the following default settings:
- Host: `localhost:3306`
- Database: `taskmanager`
- Username: `root`
- Password: `password`

### JWT Configuration
- Secret Key: Configurable in `application.yml`
- Expiration: 24 hours (86400000 ms)

### Security Features
- Password encryption using BCrypt
- JWT token-based authentication
- CORS configuration for frontend integration
- Role-based access control

## 🐳 Docker Configuration

### Services
- **MySQL**: Database service with persistent volume
- **App**: Spring Boot application service
- **Network**: Bridge network for service communication

### Volumes
- `mysql_data`: Persistent storage for MySQL data

### Ports
- Application: `8080`
- MySQL: `3306`

## 🧪 Testing

### Manual Testing
1. Register a new user account
2. Login with created credentials
3. Create tasks with different priorities and deadlines
4. Update task status and details
5. Filter tasks by status and priority
6. Test overdue task detection

### API Testing with curl

```bash
# Register
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Create Task (replace TOKEN with actual JWT token)
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Task","description":"Test Description","priority":"HIGH"}'
```

## 📝 Usage Instructions

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your task statistics and overview

### Managing Tasks
1. **Create Task**: Click "Add Task" button and fill in the details
2. **Edit Task**: Click the "Edit" button on any task card
3. **Complete Task**: Click "Complete" to mark as done
4. **Delete Task**: Click "Delete" to remove a task
5. **Filter Tasks**: Use dropdown filters to organize your view

### Task Properties
- **Title**: Required, short description of the task
- **Description**: Optional, detailed task information
- **Status**: TODO, IN_PROGRESS, or DONE
- **Priority**: LOW, MEDIUM, HIGH, or URGENT
- **Deadline**: Optional, due date and time

## 🛡️ Security Considerations

- Passwords are encrypted using BCrypt
- JWT tokens expire after 24 hours
- CORS is configured for secure cross-origin requests
- SQL injection protection through JPA
- XSS protection through input sanitization

## 🚀 Deployment

### Production Deployment
1. Update database credentials in `application.yml`
2. Configure JWT secret key
3. Build the application: `mvn clean package`
4. Deploy the JAR file to your server
5. Ensure MySQL is running and accessible
6. Configure reverse proxy (nginx) if needed

### Environment Variables
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the logs: `docker-compose logs app`
2. Verify database connection
3. Ensure all ports are available
4. Check JWT token validity

## 🔮 Future Enhancements

- Task categories and tags
- File attachments
- Team collaboration features
- Email notifications
- Mobile app
- Advanced reporting and analytics
- Task templates
- Recurring tasks

---

**Built with ❤️ using Spring Boot and modern web technologies**
