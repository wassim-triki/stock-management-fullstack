## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/wassim-triki/stock-management-fullstack
   ```

2. Step into project folder

   ```bash
   cd stock-management-fullstack
   ```

3. Copy the `.env.example` to `.env` and update the variables.

   ```bash
   cp .env.example .env
   ```

4. Install backend dependencies

   ```bash
   cd ./backend
   npm install
   ```

5. Install frontend dependencies

   ```bash
   cd ./frontend
   npm install
   ```

6. Start the development servers

   ```bash
   cd ./frontend
   npm run dev
   cd ..
   cd ./backend
   npm run dev
   ```
