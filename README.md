# **pwnd**

**pwnd** is a single-page application (SPA) designed to process credential files, analyze them, and provide an interactive dashboard for querying data about compromised accounts. Built with modern web technologies, it integrates seamlessly with AWS to deliver a scalable, serverless solution.

---

## **Features**

- 📂 **Credential File Processing:** Upload credential files through S3 for processing and storage.
- 💾 **Data Storage:** Stores processed data securely in DynamoDB.
- 🔎 **Query Options:**
  - Filter by email domain.
  - Search by individual email addresses.
  - View all compromised accounts.
- 🖥️ **Dashboard:** An intuitive React-based dashboard for querying data via the backend.
- 🖥️ **Dashboard:** An intuitive React-based dashboard for querying data via the backend.

---

## **Technology Stack**

- **Frontend:** Vite, React
- **Backend:** Python, FastAPI
- **Database:** DynamoDB
- **Hosting:** EC2 instance
- **Infrastructure:** Serverless Framework with AWS services

---

## **How to Deploy**

### **Prerequisites**

1. Install [AWS CLI](https://aws.amazon.com/cli/) and configure it with your AWS credentials.
2. Install [npm](https://www.npmjs.com/).
3. Ensure you have the Serverless Framework installed globally:
   npm install -g serverless

## **Deploying**

Run the deployment script to provision the necessary AWS infrastructure and deploy the application:

./deploy.sh
The deployment script will:

Create an S3 bucket for uploading credential files.
Deploy the backend using FastAPI, hosted on an EC2 instance.
Set up a DynamoDB table for storing processed credential data.
Deploy the frontend (Vite/React) and connect it to the backend.
Once the deployment is complete, the script will output the URL for accessing the dashboard.
