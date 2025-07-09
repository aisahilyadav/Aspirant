# This is a basic setup for a React application using Tailwind CSS.

## Project Structure
```
client
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── components
│   │   └── Layout.jsx
│   └── assets
│       └── react.svg
├── public
│   └── vite.svg
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd client
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm run dev
```
This will start the application on `http://localhost:3000` (or the port specified in your configuration).

### Tailwind CSS Setup
This project uses Tailwind CSS for styling. Ensure you have the necessary configurations in `src/App.css` to include Tailwind's base, components, and utilities.

### Pages
- **Home Page**: Accessible at `/` - Contains links to the login and signup pages.
- **Login Page**: Accessible at `/login` - Form for user authentication.
- **Signup Page**: Accessible at `/signup` - Form for new user registration.

### Components
- **Layout**: Provides a consistent layout structure across the application.

### Assets
- SVG assets are located in the `src/assets` and `public` directories.

### License
This project is licensed under the MIT License. See the LICENSE file for details.