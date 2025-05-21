# Mandarin Flashcards

This project is a web application designed to help users learn Mandarin vocabulary using flashcards. It features a React-based frontend and an Express.js backend.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (which includes npm) installed on your system. You can download it from [https://nodejs.org/](https://nodejs.org/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url> # Replace <repository_url> with the actual URL of this repository
    cd mandarin-flashcards
    ```

2.  **Install frontend dependencies:**
    Navigate to the root directory of the project (if you're not already there) and run:
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    Navigate to the `server` directory and run:
    ```bash
    cd server
    npm install
    cd ..
    ```

## Running the Project Locally

This project consists of a frontend client and a backend server.

### Recommended: Running Both Client and Server Concurrently

The easiest way to run the project for development is to use the script that starts both the frontend and backend servers concurrently.

1.  Make sure you are in the root directory of the project.
2.  Run the following command:
    ```bash
    npm run dev
    ```
    This will:
    *   Start the backend server (usually on `http://localhost:8000`).
    *   Start the frontend development server (usually on `http://localhost:3000`).
    The frontend application will open automatically in your default web browser.

### Running Client and Server Separately

You can also run the frontend and backend servers in separate terminals.

**1. Running the Backend Server:**

*   Navigate to the `server` directory:
    ```bash
    cd server
    ```
*   Start the backend development server:
    ```bash
    npm run dev
    ```
*   The server will typically be available at `http://localhost:8000`.

**2. Running the Frontend Client:**

*   Navigate to the root project directory:
    ```bash
    cd .. # If you are in the server directory
    ```
*   Start the frontend development server:
    ```bash
    npm start
    ```
*   The client will typically be available at `http://localhost:3000` and will open automatically in your browser. It's configured to proxy API requests to the backend server at `http://localhost:8000`.

## Available Scripts

This project uses npm scripts to automate common tasks.

### Root Directory (Frontend - `package.json`)

*   `npm start`: Runs the app in development mode. Opens [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.
*   `npm test`: Launches the test runner in interactive watch mode.
*   `npm run build`: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
*   `npm run eject`: **Note: this is a one-way operation. Once you `eject`, you can’t go back!** If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
*   `npm run server`: A convenience script to navigate to the `server` directory and run its `dev` script.
*   `npm run dev`: Runs both the frontend (`npm start`) and backend (`npm run server`) development servers concurrently.

### `server/` Directory (Backend - `server/package.json`)

*   `npm run build`: Compiles the TypeScript code to JavaScript in the `dist` folder.
*   `npm start`: Starts the production server by running the compiled JavaScript from `dist/index.js`. Make sure to run `npm run build` first.
*   `npm run dev`: Starts the backend development server using `ts-node-dev`. This server will automatically restart when you make changes to the backend code.
