import requests

def get_instance_region():
    """
    function to grab EC2's metadata document to dynamically determine region
    """
    try:
        # Step 1: Get the session token for IMDSv2
        token_url = "http://169.254.169.254/latest/api/token"
        headers = {"X-aws-ec2-metadata-token-ttl-seconds": "21600"}  # Token valid for 6 hours
        token_response = requests.put(token_url, headers=headers, timeout=5)
        token_response.raise_for_status()
        token = token_response.text
        
        # Step 2: Use the token to access instance metadata
        metadata_url = "http://169.254.169.254/latest/dynamic/instance-identity/document"
        headers = {"X-aws-ec2-metadata-token": token}
        metadata_response = requests.get(metadata_url, headers=headers, timeout=5)
        metadata_response.raise_for_status()
        
        # Parse the JSON response to get the region
        metadata = metadata_response.json()
        return metadata.get("region")
    except requests.RequestException as e:
        print(f"Error fetching instance region: {e}")
        return None
