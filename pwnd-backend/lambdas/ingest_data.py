import boto3
import urllib.parse
import re
import logging
import os

# Initialize log configuration
logging.basicConfig(level = logging.INFO)

# Retrieve the logger instance
logger = logging.getLogger()

# Initialize S3 client
s3 = boto3.client('s3')

db_table = boto3.resource("dynamodb").Table(os.environ.get("CREDS_TABLE"))



def prepare_DB_record(line):
    """
    this function creates the DB record
    
    :param line: string object of the line on the file
    
    """
    
    
    
    parts = []
    # Split the line into email and password using multiple delimiters and only split on the first delimiter in case in password
    parts = re.split(r'[:;,~~~]+', line.strip(), 1)
    
    if len(parts) == 2:  # Expecting exactly two parts (email, password)
        email, password = parts
        email = email.lower() #lowercase because email is non-case sensitive
        if len(email) > 320:  #max length of any email address is 320 chars
            return
        try:
            username, domain = email.split("@", 1) #split on 1st @ sign
        except:
            username, domain = email,email #if not we can write the email as the username too
        credentials = { #this is essentially our DB object and how we will put it in
            "email": email,
            "username": username,
            "domain": domain,
            "password": password
                    }
        
        return credentials
    else:
        logging.warning(f"invalid line: {line}")
    
    


def lambda_handler(event, context):
    """
    This lambda handler processes a txt file from an S3 Upload event
    of credentials that should be seperated by
    particular delimiters ":" ";" "," "~" 
    and inserts them in a DynamoDB
    
    :param event: is an trigger which contains information about the newly created file and the associated event
    :param context: is the lambda context object
    
    
    """
    logger.info(f"function run, {event}")
    # Get bucket name and object key from the event
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = event["Records"][0]["s3"]["object"]["key"]
    
    
    # Decode the object key (handles URL encoding)
    object_key = urllib.parse.unquote_plus(object_key)
    
    logger.info(f"Bucket Name : {bucket_name}, Object Key : {object_key}" )

    
    try:
        # Fetch the file content from S3
        logger.info("fetching file from S3")
        response = s3.get_object(Bucket=bucket_name, Key=object_key)
        logger.info("gathered file from S3 and reading into lamdba")
        
        # Read the content of the file (assuming it's a text file)
        file_content = response['Body'].read().decode('utf-8')
                
    except Exception as e:
        logging.error(f"Error getting object {object_key} from bucket {bucket_name}: {e}")
        raise
    
    lines = set(file_content.splitlines())  # Split file into lines and remove duplicate lines
    
    
    with db_table.batch_writer() as batch_writer: #use DDB batch writer to improve these big uploads
        for line in lines:
            # Ignore empty lines or lines that don't contain valid credentials
            if not line.strip():
                print("error" + line)
                continue
            
            db_record = prepare_DB_record(line)
            if db_record:
                try:
                    logger.info(f"putting {db_record} in db")
                    resp = batch_writer.put_item (Item= db_record) #put record into DB
                except Exception as e:
                    logger.error(f"upload failed for record {db_record} : {e}") #if fails would we want to retry?
        


    return {"statusCode" : 200,
    "body" : "Successfully processed file"}
