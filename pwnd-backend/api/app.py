from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import boto3
from boto3.dynamodb.conditions import Key
from typing import Optional,List
from pydantic import BaseModel
import logging
from get_region import get_instance_region



# Initialize log configuration
logging.basicConfig(level = logging.INFO)

# Retrieve the logger instance
logger = logging.getLogger()

logger.info("initializing FAST APP...")
app = FastAPI()

###create CORS headers
origins = ["*" #just for dev purposes
     #localhost just for testing    
    ]

logger.info("configuring CORS headers")

#add CORS Headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET,OPTIONS"],
    allow_headers=["*"],
)



region = get_instance_region() #determine AWS Region
region = region if region else "us-east-2" #ensure we have a valid region

logger.info(f"we are in {region}")
# Initialize DynamoDB client
dynamodb = boto3.resource("dynamodb",region_name = region)  
#table = dynamodb.Table(os.environ["DB_NAME"])
DB_NAME = ""
try:
    with open("db_name.txt") as file:
        DB_NAME = file.read().strip()
except Exception as e:
    logger.error("can't find db_name.txt")
    
if DB_NAME:
    table = dynamodb.Table(DB_NAME) # we have dynamically gathered this table name from userdata
else:
    table = dynamodb.Table("info-table") #as well need to dynamically gather this table name
# Initialize FastAPI app

#dynamoDB database item model 
class Item(BaseModel):
    email: str
    domain: str
    username:str
    password:str

    
class PaginatedResponse(BaseModel):
    items: List[Item]
    last_evaluated_key: Optional[str] = None
    count: int



@app.get("/query")
async def query_db( mode: str= None, email: str = None, domain: str = None, last_evaluated_key: str = None, limit: int = 10 ):
    """
    Retrieve an email from DynamoDB, search by email Domain, or return paginated results from DB.
    NOTE: email takes priority if both domain and email are input
    
    :param mode: string to determine how we will be querying the data
    :param email: email string to search to see if exists in DB
    :param domain: email domain to filter DB for
    :param last_evaluated_key: string to allow pagination, would be final key returned in previous query
    :param limit: limit number of results
    
    """
    
    logger.debug(f"api endpoing invoked - query info - model: {mode}, email: {email}, domain: {domain}, eval_key: {last_evaluated_key}, limit: {limit}")
    
    limit = 10 if limit > 100 or limit <=0 else limit # lower limit and ensure it is in bounds
    

    if mode == "email" and email:
        return search_email(email)
    elif mode == "domain" and domain:
        return search_domain(domain,limit=limit,last_evaluated_key=last_evaluated_key)
    elif mode == "show": 
        return scan_db_for_items(last_evaluated_key=last_evaluated_key, limit=limit)
    else:
        return HTTPException(status_code=401, detail=f"Must Select A Mode When Making Query")

        


def search_email(email):
    """
    runs a "get_item" query from our DDB table, and if found will return record
    else throws 404 Not Found
    
    :param email: email address sent by user
    """
    try:
        response = table.get_item(Key={"email": email})  # search DB for email
        if "Item" not in response:
            return PaginatedResponse(items=[], count=0)
        print(response)
        item = [Item(**response["Item"])]
        return PaginatedResponse(items=item, count=1)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

    
def search_domain(domain, limit=20, last_evaluated_key=None):
    """
    queries the domain secondary index and returns the top results, as well
    is able to be paginated
        """ 
    try:
        if last_evaluated_key:
            response = table.query( #query
                IndexName='domain-index', 
                KeyConditionExpression=Key('domain').eq(domain),
                Limit=limit,
                ExclusiveStartKey={"email" :last_evaluated_key, "domain": domain }
                )
        else:
            response = table.query( #query
                IndexName='domain-index', 
                KeyConditionExpression=Key('domain').eq(domain),
                Limit=limit,)

            
        logger.debug(response)
        if "Items" not in response:
            return PaginatedResponse(items=[], count=0)
        items = response["Items"]
        result_items = [Item(**item) for item in items] #convert DB items into Item model
        next_last_evaluated_key= response.get("LastEvaluatedKey")
        print(next_last_evaluated_key)
        return PaginatedResponse(items = result_items, count=response.get("Count"), last_evaluated_key= next_last_evaluated_key.get("email") if next_last_evaluated_key else None )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


#Scan DB
def scan_db_for_items(last_evaluated_key= None, limit= 20):
    """
    performs SCAN operation on DB, supports pagination by adding last_evaluated_key
    
    :param last_evaluated_key: the final item returned from the previous invocation
    :param limit: limit of how many items to return from DB
    
    """
    try:
        params = {
            "Limit": limit,  # You can adjust the limit per page here
        }
        
        if last_evaluated_key:
            params["ExclusiveStartKey"] = {"email" : last_evaluated_key}
        
        response = table.scan(**params) #perform SCAN operation on DB
        print(response)
        

        items = response.get("Items", []) #if DB is empty return an empty string

        next_last_evaluated_key = response.get("LastEvaluatedKey") #get Last Evaluated Key to be able to paginate response
        
        result_items = [Item(**item) for item in items] #convert DB items into Item model
        
        return PaginatedResponse(
            items=result_items,
            last_evaluated_key=next_last_evaluated_key.get("email") if next_last_evaluated_key else None,
            count = response.get("Count")
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")



    
