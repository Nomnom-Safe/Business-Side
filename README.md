# README

# NomNom Safe

---

### _Peace of mind: on every plate, every place._

A simple and user-friendly web-based application that allows restaurants to store, modify, and display accurate and up-to-date dietary information about each of their menu items.

## Table of Contents

- Overview
- Features
- Tools Used
- Requirements
- Installation
- Modules

# Overview

---

NomNom Safe helps restaurants enhance their reputation as a business that cares about their entire customer base — including those with dietary restrictions — by providing a simple and user-friendly web-based application that stores and displays accurate and up-to-date dietary information about each of their menu items. NomNom Safe allows business users to quickly and easily input, verify, and modify information about menus, disclaimers, menu items, and the restaurant itself.

# Features

---

### User Accounts and Roles

- **User authentication**: Sign up, log in, and securely manage sessions
- **Account management**: Edit or delete your account information
- **Role-based access control**: Admins can manage user permissions and promote users

### Restaurant Management

- Authorized users can create, edit, or delete restaurants they manage
- Restaurants can have one or more associated menus

### Menu & Menu Item Management

- Create, edit, and delete menus for a restaurant
- Add menu items with:
  - Name, description, price
  - Dietary tags (e.g., vegan, keto)
  - Preset allergen tags (e.g., nuts, dairy, shellfish)
- Search and filter menu items by name or allergen

### Allergen Awareness

- Tag menu items with allergens from a predefined list
- Filter menu items based on allergens
- Display disclaimers about allergens (default or custom)

### Admin Dashboard

- Admins can view and manage all users and restaurants
- Grant/revoke access to restaurants
- Promote users to admin status

### Tech Stack

- **Frontend**: React, CSS, Bootstrap
- **Backend**: Node.js, Express, MongoDB

# Tools Used

---

As a team, we used these tools:

- GitHub
- MongoDB
- Visual Studio Code
- HTML
- CSS
- JS
- Nodejs
- React
- Notion
- Teams - Communication
- Canvas
- Google Docs

# Requirements

---

This application meets these requirements as user stories

- As a new user, I should be able to create an account with my business email so I can create a profile for my restaurant(s).
- As a returning user, I should be able to log in with my business email and password so I can access my restaurant’s page.
- As an authorized user, I should be able to view the restaurants I have access to so I can make changes to them.
- As an authorized user, I should be able to delete my own account.
- As an administrator, I should be able to control which users have access to view and modify the information for my restaurants so I can share responsibilities.
- As an administrator, I should be able to promote certain users to administrator status so I can share responsibilities.
- As an authorized user, I should be able to tag menu items as having certain allergens from a pre-created list of allergens so I don't have to manually type them in.
- As an authorized user, I should be able to filter the menu items based on allergens so I can quickly find and modify them.
- As an authorized user, I should be able to create new menu items for my restaurants so I can keep the menu accurate and up-to-date.
- As an authorized user, I should be able to edit existing menu items for my restaurants so I can keep the menu accurate and up-to-date.
- As an authorized user, I should be able to delete existing menu items for my restaurants so I can keep the menu accurate and up-to-date.
- As an authorized user, I should be able to search for a specific menu item so I can find it quickly if I need to alter it.
- As an authorized user, I should be able to create menus associated with the restaurant(s) I have access to so I can keep the information accurate and up-to-date.
- As an authorized user, I should be able to edit menus associated with the restaurant(s) I have access to so I can keep the information accurate and up-to-date.
- As an authorized user, I should be able to delete menus associated with the restaurant(s) I have access to so I can keep the information accurate and up-to-date.
- As an authorized user, I should be able to add delete information about the restaurant I have access to alter so I can keep the information up to date.
- As an authorized user, I should be able to edit information about the restaurant I have access to alter so I can keep the information up to date.
- As an authorized user, I should be able to delete information about the restaurant I have access to alter so I can keep the information up to date.

# Installation

---

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
- bcrypt
- dotenv
- cookie-parser
- cors

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

# Modules

---

See `/docs/modules/` for more detailed documentation.

### Admin Module

Handles user management including:

- Adding/removing users
- Promoting/demoting
- Viewing all authorized users in a business

### Authentication Module

Handles user authentication including:

- User sing up and login
- Password and email changes

Also contains lists for:

- Allergens
- Diets

### Menu Module

Handles menu management including:

- Creating and organizing menus
- Editing menus
- Deleting menus
- Viewing menus and navigating to menu items

### Menu Items Module

Handles menu item management including:

- Creating and editing menu items
- Managing allergens and ingredients
- Organizing menu items across menus
- Searching and filtering items

### Business Module

Handles business profile management including:

- Editing business information
- Managing unavoidable allergens

### Testing Module

Ensures correctness and reliability across all core modules using Jest and Supertest. Includes:

- Unit tests for schema validation, model methods, and pre-save hooks
- Integration tests for API routes including authentication, user management, menus, and menu items
- In-memory MongoDB for isolated database testing
