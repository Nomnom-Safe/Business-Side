# User Manual

### Prerequisites

- Node.js
- npm
- MongoDB

### Clone the repository

```jsx
git clone https://github.com/Anna-Dinius/ase-285-team-project.git
```

### Install Dependencies

```jsx
cd app
npm intall express
npm install
```

This will install express (for backend functionality) and all of the dependencies in `package.json`, including:

- react
- react-dom
- react-router-dom
- react-scripts
- react-select
- material-react-table
- sass
- axios
- web-vitals
- Testing libraries (e.g. `@testing-library/react`)

### Set Up Environment Variables

Create a `.env` file in the `api` directory and include the following

```jsx
MONGO_URI = your_mongodb_connection_string;
```

### Run the App

Start the backend server

```jsx
cd api
node server.js
```

Start the frontend

```jsx
cd app
npm start
```
