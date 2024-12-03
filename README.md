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
- 🖥️ **Pagination:** Able to Paginate on Large Queries

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
3. Clone the repo to your local computer

## **Deploying**

Run the deployment script from the project's root directory to provision the necessary AWS infrastructure and deploy the application:

```
./deploy.sh
```

The deployment script will:

1. Create an S3 bucket for uploading credential files.
2. Deploy the backend using FastAPI, hosted on an EC2 instance.
3. Set up a DynamoDB table for storing processed credential data.
4. Deploy the frontend (Vite/React) and connect it to the backend.
5. Once the deployment is complete, the script will output the URL for accessing the dashboard.
6. Add the default available credentials files contained in "challenge_creds.txt" at the root of the project

---

## **Post-Deployment**

### **Navigate to your Webpage**

1. At the end of the deployment there should be a url that says your static webpage is accessible. It will say something along these lines

```
Success! Your site should be available at http://pwnd-s3-bucket-creator-prod-staticsitebucket-os3tl0oysxfv.s3-website.us-east-2.amazonaws.com/
```

2. Open the link
3. Either search on email, query by domain name, or feel free to look through every entry in the database, as it is all paginated

### **Add-More Credentials**

1. Log on to AWS Console and navigate to the RAW DATA S3 bucket created by the deploy script, it should have a long name such as pwnd-s3-bucket-creator-prod-pwndec2codebucket-irxvs9luvtna
2. On the S3 bucket, we have a create object trigger for files created with a prefix of `uploads/`
3. Ensure the file is in the same format as the challenge_creds.txt, if not the data will not enter the database
4. Place the file in the `uploads/`
