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
6. Add the default available credentials files contained in "challenge_creds.txt" at the root of the project to the Database

---

## **Post-Deployment**

### **Navigate to your Webpage**

1. At the end of the deployment there should be a url that says your static webpage is accessible. It will say something along these lines

```
Success! Your site should be available at http://pwnd-s3-bucket-creator-prod-staticsitebucket-os3tl0oysxfv.s3-website.us-east-2.amazonaws.com/
```

2. Open the link
3. Either search on email, query by domain name, or feel free to look through every entry in the database, as it is all paginated

### **Add Another Credentials File**

1. Log on to AWS Console and navigate to the RAW DATA S3 bucket created by the deploy script, it should have a long name such as pwnd-s3-bucket-creator-prod-pwndec2codebucket-irxvs9luvtna. In the cloudformation stack - Pwnd-s3-Bucket-Creator. It will be the PwndRawDataBucket. ![image](https://github.com/user-attachments/assets/d21ee17e-c6b2-4610-817a-3d8b745f3dcb)

2. On the S3 bucket, we have a create object trigger for files created with a prefix of `uploads/`
3. Ensure the file is in the same format as the challenge_creds.txt, if not the data will not enter the database
4. Place the file in the `uploads/
5. From here the s3 trigger will run and the contents of the file, if valid will be uploaded to the database.


## **API Usage**

### **Accesssing the API**
At the end of the deployment, in the same message as the static website's location, there should also be an output explaining what the API's url is. 
e.g.

```
Success! Your site should be available at http://pwnd-s3-bucket-creator-prod-staticsitebucket-os3tl0oysxfv.s3-website.us-east-2.amazonaws.com/
...
...
API Endpoint - https://h0oqi7jx70.execute-api.us-east-2.amazonaws.com/prod
```
This endpoint is publicly facing, so if you would like to make your own client or interact with the REST service exposed, you are able to. 

While included in the repo is an OpenAPI spec. I will go over basic usage here as well.

### ** Basic API Usage**
The only publicly exposed method should be a ```GET /query ```. So using the above example endpoint, we would be able to CURL it using
There are 5 possible Query parameters you can send.

```mode```: Required in all requests; must be one of scan, email, or domain.

```email```: Only valid when mode=email.

```domain```: Required when mode=domain.

```limit```: For paginated requests, max number of elements to return.

```last_evaluated_key```: Typically used for paginated requests and will be recieved from prior request to same endpoint query.

#### **Note**

```limit``` and ```last_evaluated_key```: Allowed only for mode=scan or mode=domain.

### **Sample CURL Requests **

#### **Base Query Template**
```
curl -X GET "https://h0oqi7jx70.execute-api.us-east-2.amazonaws.com/prod/query?mode=<MODE>&email=<EMAIL>&domain=<DOMAIN>&limit=<LIMIT>&last_evaluated_key=<LAST_EVALUATED_KEY>"
```

#### **Example 1: mode=email (search by email)**
```
curl -X GET "https://h0oqi7jx70.execute-api.us-east-2.amazonaws.com/prod/query?mode=email&email=example@gmail.com"
```

#### **Example 2: mode=domain (filter by domain)**
```
curl -X GET "https://h0oqi7jx70.execute-api.us-east-2.amazonaws.com/prod/query?mode=domain&domain=gmail.com"
```

#### **Example 3: mode=scan (fetch a batch with limit and pagination)**
```
curl -X GET "https://h0oqi7jx70.execute-api.us-east-2.amazonaws.com/prod/query?mode=scan&limit=50&last_evaluated_key=example@gmail.com"
```

#### **Example 4: mode=domain with pagination**

```
curl -X GET "https://h0oqi7jx70.execute-api.us-east-2.amazonaws.com/prod/query?mode=domain&domain=outlook.com&limit=25&last_evaluated_key=example@gmail.com"
```

#### **Example 5: mode=scan (no pagination, only limit)**

```
curl -X GET "https://h0oqi7jx70.execute-api.us-east-2.amazonaws.com/prod/query?mode=scan&limit=100"
```

