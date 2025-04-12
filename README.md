# Quiz
# **Project Setup Guide**

Follow the steps below to set up both the frontend and backend of this project.

---

## **Frontend Setup**

1. Navigate to the frontend directory and create a `.env` file.
2. Copy and paste the following environment variables into the `.env` file:

   ```env
   VITE_BACKEND_URL_LOCAL=http://localhost:3000
   VITE_BACKEND_URL_PRODUCTION=https://quiz-1-u3ch.onrender.com
3. Run the following commands to set up the project:

   ```sh
    npm install
    npm run dev

 ---

 ## **Blockchain Setup** 

 1. Setup metamask in your browser
 2. Copy and paste the private key of your metamask wallet in the `./backend/.env` file: 
       
       ```env
       PRIVATE_KEY=<YOUR_PRIVATE_KEY>
3. Create account on [PINATA](https://pinata.cloud/) for IPFS 
4. Copy and paste the API_Key, API_Secret,PINATA_JWT from PINATA to `./backend/.env` file: 
       
       ```env
       API_Key=<API_Key> 
       API_Secret=<PINATA_JWT> 
       PINATA_JWT=<PINATA_JWT>
5. Run tests
  `$ npx hardhat test`       

## **Backend Setup**   

1. Navigate to the frontend directory and create a `.env` file.
2. Copy and paste the following environment variables into the `.env` file:

   ```env
   DATABASE_URL=<your-mongodb-connection-string>
   JWT_SECRETE_KEY=<your-secret-key>  
   
3. Run the following commands to set up the project:

   ```sh
    npm install
    npm run dev