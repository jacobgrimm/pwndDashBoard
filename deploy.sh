#!/bin/bash

cd s3-buckets
#first create the Backend API Buckets
npm install
serverless deploy
bucket_stack_name="Pwnd-S3-Bucket-Creator-prod"
#grab the bucket names so we can pass them into our MAIN Backend Stack
CODE_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name $bucket_stack_name --query "Stacks[0].Outputs[?OutputKey=='PwndCodeBucket'].OutputValue" --output text)
DATA_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name $bucket_stack_name --query "Stacks[0].Outputs[?OutputKey=='PwndRawDataBucket'].OutputValue" --output text)
STATIC_WEBSITE_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name $bucket_stack_name --query "Stacks[0].Outputs[?OutputKey=='StaticSiteBucket'].OutputValue" --output text)
cd ../pwnd-backend

#copy code onto S3 buckets so we can download it onto the EC2 instance that is hosting our API
aws s3 cp api/app.py s3://$CODE_BUCKET_NAME
aws s3 cp api/get_region.py s3://$CODE_BUCKET_NAME
npm install 

#deploy cloudformation Stack for backend infrastructure
serverless deploy --param="dataBucketName=$DATA_BUCKET_NAME" --param="codeBucketName=$CODE_BUCKET_NAME"

#grab API endpoint from CF STACK OUTPUTS so we can put it into the front-end
ENDPOINT=$(aws cloudformation describe-stacks --stack-name Pwnd-Backend-prod --query "Stacks[0].Outputs[?OutputKey=='ServiceEndpoint'].OutputValue" --output text)

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

serverless client deploy --no-confirm

cd ..

aws s3 cp challenge_creds.txt s3://$DATA_BUCKET_NAME/uploads/challenge_creds.txt

echo "Credential File has just been uploaded, processing into DB right now"


echo "API Endpoint - $ENDPOINT"
