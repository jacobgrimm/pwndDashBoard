#!/bin/bash
HOSTED_ZONE_ID="Z05835821S1C4RYAI5EBD"
DOMAIN_NAME="leakd.in"
set -e
cd s3-buckets
#first create the Backend API Buckets
npm install
serverless deploy
BUCKET_STACK_INFO=$(serverless info --verbose 2>&1) 

BUCKET_STACK_NAME=$(echo $BUCKET_STACK_INFO | grep -o "stack: [^ ]*" | awk '{print $2}')

#grab the bucket names so we can pass them into our MAIN Backend Stack
CODE_BUCKET_NAME=$(echo $BUCKET_STACK_INFO | grep -o "CodeBucket: [^ ]*" | awk '{print $2}')
DATA_BUCKET_NAME=$(echo $BUCKET_STACK_INFO | grep -o "RawDataBucket: [^ ]*" | awk '{print $2}')
STATIC_WEBSITE_BUCKET_NAME=$(echo $BUCKET_STACK_INFO | grep -o "StaticSiteBucket: [^ ]*" | awk '{print $2}')
cd ../pwnd-backend

#copy code onto S3 buckets so we can download it onto the EC2 instance that is hosting our API
aws s3 cp api/app.py s3://$CODE_BUCKET_NAME
aws s3 cp api/get_region.py s3://$CODE_BUCKET_NAME
npm install 

#deploy cloudformation Stack for backend infrastructure
serverless deploy --param="dataBucketName=$DATA_BUCKET_NAME" --param="codeBucketName=$CODE_BUCKET_NAME"

#grab API endpoint from CF STACK OUTPUTS so we can put it into the front-end
ENDPOINT=$(serverless info --verbose 2>&1 | grep -o "ServiceEndpoint: [^ ]*" | awk '{print $2}')

#navigate to Front END
cd ../pwnd-dashboard

#Update API endpoint
FILE="src/api/api-def.tsx"
#Create API File with new API ENDPOINT
cat <<EOL > $FILE
const API_ENDPOINT = "$ENDPOINT";

export default API_ENDPOINT;
EOL

# Confirm the change
echo "Updated API_ENDPOINT in $FILE to $ENDPOINT"

npm install
#build VITE app
npm run build

export STATIC_WEBSITE_BUCKET_NAME
#create env variable so that we can read the bucket name from the webapp
serverless client deploy --no-confirm --param="domainName=$DOMAIN_NAME" --param="hostedZoneId=$HOSTED_ZONE_ID"
serverless deploy --param="domainName=$DOMAIN_NAME" --param="hostedZoneId=$HOSTED_ZONE_ID"
cd ..

aws s3 cp challenge_creds.txt s3://$DATA_BUCKET_NAME/uploads/challenge_creds.txt

echo "Credential File has just been uploaded, processing into DB right now"


echo "API Endpoint - $ENDPOINT"
