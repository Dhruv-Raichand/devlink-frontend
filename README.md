# 🚀 DevLink - Frontend

A modern, responsive frontend for a professional networking and dating platform. Built with React 18, Vite, Redux Toolkit, and styled with Tailwind CSS and DaisyUI. Features real-time chat, dynamic feed, and seamless user experience.

**🌐 Live Demo:** [linkdev.online](https://linkdev.online)

---

## ✨ Features

### User Interface
- 🎨 **Modern UI/UX** - Clean, responsive design with Tailwind CSS and DaisyUI
- 🔐 **Authentication Flow** - Login, Signup, and protected routes
- 👤 **User Profiles** - View and edit profile with photo upload
- 🤝 **Connection System** - Send, accept, or reject connection requests
- 💬 **Real-time Chat** - Instant messaging with Socket.io
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- 📱 **Fully Responsive** - Mobile-first design

### Technical Features
- ⚡ Lightning-fast Vite build system
- 🗃️ Redux Toolkit for state management
- 🛣️ React Router for navigation
- 🔒 Protected routes with authentication
- 📡 Axios for API communication
- 🎭 Component-based architecture
- 🔄 Auto-updating UI on state changes

---

## 🛠️ Tech Stack

### Core Framework
- React 18
- Vite

### State Management
- Redux Toolkit
- React-Redux

### Routing
- React Router DOM

### Styling
- Tailwind CSS
- DaisyUI

### API & Real-time
- Axios
- Socket.io Client

### Development Tools
- Redux DevTools
- ESLint

---

## 📂 Project Structure

```
devlink-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── UserCard.jsx
│   │   └── ...
│   ├── pages/           # Route pages
│   │   ├── Feed.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Connections.jsx
│   │   ├── Requests.jsx
│   │   └── Chat.jsx
│   ├── store/           # Redux store
│   │   ├── store.js
│   │   ├── userSlice.js
│   │   ├── feedSlice.js
│   │   └── connectionSlice.js
│   ├── utils/           # Utility functions
│   │   ├── constants.js
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
└── vite.config.js
```

---

## 🎯 Key Pages & Routes

### Public Routes
- `/login` - User login page
- `/signup` - New user registration

### Protected Routes (Require Authentication)
- `/` - Main feed with user cards
- `/profile` - User profile view and edit
- `/connections` - All accepted connections
- `/requests` - Pending connection requests
- `/chat/:targetUserId` - Real-time chat with specific user

---

## 🔐 Authentication Flow

1. User logs in via `/login`
2. JWT token stored in HTTP-only cookie
3. Token validated on protected routes
4. User redirected to `/login` if unauthorized
5. Navbar updates based on auth state
6. Logout clears token and redirects

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16.17.0 or higher)
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/Dhruv-Raichand/devlink-frontend.git
cd devlink-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables
VITE_API_URL=http://localhost:7777

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://linkdev.online/api
VITE_SOCKET_URL=https://linkdev.online
```

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality
```

---

## 🗃️ Redux Store Structure

### Slices
- **userSlice** - Current user data, authentication state
- **feedSlice** - Feed data with pagination
- **connectionSlice** - Connections and pending requests

### Example State
```javascript
{
  user: {
    data: { id, firstName, lastName, emailId, ... },
    isAuthenticated: true
  },
  feed: {
    users: [...],
    page: 1,
    hasMore: true
  },
  connections: {
    list: [...],
    requests: [...]
  }
}
```

---

## 🎨 UI Components

### Core Components
- **Navbar** - Navigation with conditional rendering based on auth
- **Footer** - Site footer
- **UserCard** - Display user info on feed
- **Body** - Main layout wrapper with Outlet for routes
- **ProtectedRoute** - HOC for route protection

### Features Implementation
- Toast notifications for user feedback
- Loading states for async operations
- Error handling with user-friendly messages
- Responsive design for all screen sizes

---

## 🚀 Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Output will be in /dist folder
```

### Deployment on AWS EC2

```bash
# SSH into EC2 instance
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# Navigate to project directory
cd devlink-frontend

# Pull latest changes
git pull origin main

# Install dependencies and build
npm install
npm run build

# Copy build files to Nginx
sudo cp -r dist/* /var/www/html/

# Restart Nginx
sudo systemctl restart nginx
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name linkdev.online;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:7777/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔗 API Integration

### Axios Configuration

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookies
});

export default api;
```

### Example API Calls

```javascript
// Login
const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

// Get Feed
const getFeed = async (page = 1) => {
  const response = await api.get(`/feed?page=${page}`);
  return response.data;
};

// Send Connection Request
const sendRequest = async (userId, status) => {
  const response = await api.post(`/request/send/${status}/${userId}`);
  return response.data;
};
```

---

## 🔄 Real-time Chat Implementation

### Socket.io Client Setup

```javascript
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
});

// Listen for messages
socket.on('message', (data) => {
  console.log('New message:', data);
});

// Send message
socket.emit('sendMessage', { targetUserId, message });
```

---

## 🎯 Key Features Implementation

### Route Protection
- Checks for JWT token in cookies
- Redirects to `/login` if not authenticated
- Updates Navbar based on auth state

### State Management
- User login updates Redux store
- Navbar re-renders automatically
- Feed data cached in store for performance

### Pagination
- Feed loads 10 users at a time
- "Load More" button for next page
- Handles end of feed gracefully

### Toast Notifications
- Success messages on profile save
- Error messages on failed operations
- Auto-dismiss after 3 seconds

---

## 🔗 Related Repository

**Backend Repository:** [DevLink Backend](https://github.com/Dhruv-Raichand/devlink-backend)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Dhruv Raichand**

- GitHub: [@Dhruv-Raichand](https://github.com/Dhruv-Raichand)
- Website: [linkdev.online](https://linkdev.online)

---

## 🙏 Acknowledgments

- Vite for lightning-fast development
- Redux Toolkit for simplified state management
- DaisyUI for beautiful components
- Socket.io for real-time features

---

**Built with ❤️ and ⚛️ by Dhruv Raichand**
