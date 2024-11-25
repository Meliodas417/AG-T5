# AG-T5-KPI Integration Guide

## 1. Environment Setup
Before integrating the KPI Uploader, ensure that the following environment setup steps have been completed:

### Essential Installations:

1. Node.js and npm
   
   - Ensure Node.js and npm are installed by checking:
     
     ```
     node -v
     npm -v
     ```

2. Python and FastAPI

   - Python is required for backend functionality using FastAPI. Verify the installation with:

     ```
     python --version
     ```

   - Install FastAPI and Uvicorn in the project environment:

     ```
     pip install fastapi uvicorn
     ```

 3. React, TypeScript, and Vite

    - Install the project dependencies (React, TypeScript, Vite) by running:

      ```
      npm create vite@latest
      ```
      
 4. Install ESLint with React Plugin

    - To enable type-aware lint rules and ensure code quality:

      ```
      npm install eslint eslint-plugin-react --save-dev
      ```

 5. Other Libraries

    -  Dependencies like Chart.js, PapaParse, and AlaSQL for frontend and CSV parsing:

       ```
       npm install react-chartjs-2 chart.js papaparse alasql
       ```

## 2. Install Required Dependencies

Ensure the following are installed to support data handling, rendering, and React-TypeScript configurations:

- Vite Plugins

  - Install Babel or SWC plugin for Fast Refresh:

    ```
    npm install @vitejs/plugin-react
    ```

  - Configure ESLint and TypeScript for production-level linting:

    - Configure `eslint.config.js` as follows:

      ```javascript
      import react from 'eslint-plugin-react'

      export default tseslint.config({
        settings: { react: { version: '18.3' } },
        plugins: { react },
        rules: {
          ...react.configs.recommended.rules,
          ...react.configs['jsx-runtime'].rules,
        },
      })
      ```

## 3. Project Structure

The project structure for the KPI Uploader integration is as follows:

```
/kpi-client
│
├── /public                    # Public assets for the application
│   └── index.html             # Main HTML file
│
├── /src                       # Source files for the application
│   ├── App.tsx                # Main application file
│   ├── main.tsx               # Entry point for React with strict mode enabled
│   ├── index.css              # Main CSS file with Tailwind setup
│   ├── output.css             # Generated CSS output (optional if used)
│   ├── vite-env.d.ts          # TypeScript environment declarations for Vite
│   ├── types.ts               # Type definitions for application data structures
│   └── /components            # Component folder for reusable UI components
│       ├── Layout.tsx         # Main layout component
│       ├── Sidebar.tsx        # Sidebar for navigation and actions
│       ├── DataTable.tsx      # Data table for displaying CSV or database data
│       ├── ImportModal.tsx    # Modal for importing CSV/database data
│       ├── ExportModal.tsx    # Modal for exporting data to CSV/database
│       ├── ExpressionModal.tsx# Modal for applying expressions
│       └── JoinModal.tsx      # Modal for joining tables
│
├── .gitignore                 # Git ignore file
├── README.md                  # Project documentation
├── eslint.config.js           # ESLint configuration file for linting
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Lock file for npm dependencies
├── tailwind.config.js         # Tailwind CSS configuration file
├── tsconfig.app.json          # TypeScript configuration for the application
├── tsconfig.json              # Base TypeScript configuration
├── tsconfig.node.json         # TypeScript configuration for node-related files
└── vite.config.ts             # Vite configuration file
```

## 4. Running the Application

### Start Backend (FastAPI)

1. Start the FastAPI server to handle backend data operations:

   ```
   uvicorn src.main:app --reload --port 8001
   ```

### Start Frontend (React + Vite)

2. In a separate terminal, start the React frontend:

   ```
   npm run dev
   ```

## 5. Functionalities

### Import, Export, Join, and Expression Handling

- Data Import
  
  Supports CSV import and database connections. Configure import modal and `handleImport` function for CSV and database handling.

- Data Export

  Supports exporting current data view to CSV or connecting with databases.

- Join Operations

  Left, right, inner, and full joins between datasets, implemented in `JoinModal`.

- Expressions and Calculations

  Allows users to apply calculations between columns, e.g., addition, multiplication, etc., in `ExpressionModal`.


## 6. Chart Visualization

- The application supports data visualization using Line and Doughnut charts.

- Chart customization can be done in `DataTable` component for additional chart types or data manipulations.


## 7. CSS and Styling

- Tailwind CSS is used for styling. Update styles directly in `index.css` or add custom components.


## 8. KPI Library Integration

To use the KPI Library created by Team 5, follow these steps:

- Download and install the `kpi-formula-t5 library`, which Team 5 has published on the Python community platform. Ensure it is installed by running:

  ```
  pip install kpi-formula-t5
  ```

This library provides essential KPI calculation functions that other teams can integrate for consistent data handling.


## 9. Deployment

When ready for production:

```
npm run build
```

This generates a production-ready build in the `/dist` directory.




