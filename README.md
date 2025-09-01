# Dinder Web

- Create a Vite + React application
- Remove unecessary code and create a Hello World app
- Install tailwind CSS
- Install Daisy UI
- Add NavBar component to App.jsx
- Create a NavBar.jsx separate file Component file
- Install react router dom
- Create BrowserRouter > Routes > Route=/ Body > RouteChildren
- Create an Outlet in your Body Component
- Create a Footer
- Create a Login Page
- Install axios
- CORS - install cors in backend => add middleware to with configuration: orgin, credential: true
- Whenever you're making an API call so pass axios => { withCredential: true }
- Install Redux Toolkit
- Install react-redux + @reduxjs/toolkit - https://redux-tootkit.js.orq/tutorials/quick-start
- configureStore => Provider => createSlice => add reducer to store
- Add redux devtoots in chrome
- Login and see if your data is coning property in the store
- NavBar should update as soon as user logs in
- Refactor our code to add constants file + create a components folder
- You should not be able to access other routes without login
- If token is not present, redirect user to login page
- Logout Feature
- Get the feed and add feed into the store
- build the user card on the feed
- Edit Profile Feature
- Show toast message on save of Profile
- New Page - See all my connections
- New Page - See all my Connection Requests
- Feature - Accept/Reject Connection Request
- Send/Ignore the user on feed
- SignUp New User

Remaining:

- E2ETesting

Body
NavBar
Routes/ Feed
Route=/login Login
Route=/connetions Connections
Route=/profile Profile

Deploynent

- Signup on AWS
- Launch instance
- chmod 400 <secret>.pen
- ssh -i "devTinder-secret .pen"ubuntueec2-43-204-96-49.ap-south-1.compute.amazonaws.com
- Instat Node version 16.17.0 (22.18.0)
- Git clone
- Frontend
  - npm install -> dependencies install
  - npm run build
  - sudo apt update
  - sudo apt install nginx
  - sudo apt enable nginx
  - Copy code from the dist(buid files) to /var/www/html/
  - Enable port 80 on your instance
- Backend
  - updated DB password
  - allowed ec2 instance public IP on mongodb server
  - installed npm --name "devinder-Backend" install pm2 -g
  - pm2 start npm -- start
  - pm2 logs
  - pm2 list, pm2 flush <name> , pm2 stop <name> , pm2 delete <name>
  - config nginx - /etc/nginx/sites-available/default

Frontend: http://43.204.96.49/
Backend: http://43.204.96.49:7777/

Domain name: devtinder.com => 43.204.96.49

Frontend: devtinder.com
Backend: devtinder.con:7777 => devtinder.con/api

nginx config :

server_name 43.204.96.49;

location /api/ {
proxy_pass http://16.171.65.131:3000/;

        # Recommended proxy settings
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
