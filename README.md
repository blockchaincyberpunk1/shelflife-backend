# ShelfLife Backend

This repository contains the backend API for the ShelfLife application, a book tracking app built with the MERN (MongoDB, Express.js, React, Node.js) stack.

## Table of Contents

- [ShelfLife Backend](#shelflife-backend)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Server](#running-the-server)
  - [API Endpoints](#api-endpoints)
  - [Testing](#testing)
  - [Contributing](#contributing)

## Getting Started

### Prerequisites

* Node.js and npm (or yarn) installed on your system.
* A MongoDB database (local or cloud-based).

### Installation

1. Clone the repository: 
   ```bash
   git clone https://github.com/your-username/shelflife-backend.git 
   ```
2. Navigate to the project directory: 
   ```bash
   cd shelflife-backend
   ```
3. Install dependencies:
   ```bash
   npm install 
   ```

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```
MONGO_URI=your_mongodb_connection_string 
JWT_SECRET=your_strong_random_secret
PORT=your_desired_port (optional)
```

* Replace the placeholders with your actual values. 

### Running the Server

* **Development Mode:**
   ```bash
   npm run dev  // Uses nodemon to automatically restart the server on changes
   ```
* **Production Mode:**
   ```bash
   npm start
   ```
   (Make sure to build your app for production using `npm run build` before deploying.)

## API Endpoints

The following API endpoints are available:

**Books:**

* `GET /api/books`:  Fetch all books.
* `GET /api/books/shelf/:shelf`: Fetch books by shelf (replace `:shelf` with the shelf name, e.g., `currentlyReading`).
* `PUT /api/books/:id`: Update a book's shelf (replace `:id` with the book's ID). 
* `POST /api/books` (optional):  Add a new book.

**Authentication (if implemented):**

* `POST /api/auth/signup`: Create a new user account.
* `POST /api/auth/login`:  Log in a user.

## Testing

To run the tests, execute the following command:

```bash
npm test
```

## Contributing

Contributions are welcome!  Please open an issue or submit a pull request if you'd like to contribute to the project. 

