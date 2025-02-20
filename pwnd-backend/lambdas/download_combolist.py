import os, threading

import requests
from bs4 import BeautifulSoup
import boto3

def lambda_handler(event, context ):
    total = 0
    combolists_to_search_for = ["combolist Shopping", "combolist shopping","combolist MIX", "combolist mix","combolist Streaming", "combolist streaming"]
    found_combolist_urls = combolist_gen(combolists_to_search_for)
    threads = []
    for url in found_combolist_urls:
        thread = threading.Thread(target=download_and_write_to_s3, args=(url,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()


    print(f"Total Accounts ---> {total}")


    
    return  {"statusCode" : 200,
    "body" : "Successfully downloaded file(s)"}





def combolist_gen(combolist_types):
    urls_saved = []
    for page_number in range(1,2):
        url = f'https://combolist.co/list/{page_number}/'
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            links = soup.find_all('a', href=True)

            for link in links:
                href = link['href']
                for term in combolist_types:
                    if term in link.text:
                        print(f"Downloading Combolist --> {href}")
                        response = requests.get(href)
                        response.raise_for_status()

                        soup = BeautifulSoup(response.text, 'html.parser')
                        links = soup.find_all('a', href=True)
                        for link in links:
                            href2 = link['href']
                            if href2.startswith('https://www.upload.ee/files/'):
                                try:
                                    response = requests.get(href2)
                                    response.raise_for_status()

                                    soup = BeautifulSoup(response.text, 'html.parser')
                                    links = soup.find_all('a', href=True)

                                    for link in links:
                                        href3 = link['href']
                                        if href3.startswith('https://www.upload.ee/download/'):
                                            urls_saved.append(href3)
                                    else:
                                        link_element = soup.find('a', href=True)
                                        if link_element:
                                            url = link_element['href']
                                        else:
                                            pass
                                except requests.exceptions.RequestException:
                                    pass
                        else:
                            pass
        except requests.exceptions.RequestException:
            pass
        else:
            pass
    return urls_saved



def download_and_write_to_s3(url):

    name =  url.split("/")[-1]

    response = requests.get(url)

    if response.status_code == 200:

        # Decode content, split into lines
        lines = response.content.decode("utf-8", errors="ignore").splitlines()
        
        unwanted_phrases = [
            "**** Combolist ****",
            "https://combolist.co/",
            "**************************"
        ]


        # Remove empty lines and unwanted phrases
        cleaned_lines = [line for line in lines if line.strip() and not any(phrase in line for phrase in unwanted_phrases)]
        total = len(cleaned_lines)
        print(f"{total} records found in file {name}")
        s3 = boto3.client('s3')
        
        upload_data = "\n".join(cleaned_lines)
        
        file_name = name
        print(f"uploading {name} to s3")
        resp = s3.put_object(Bucket=os.environ["BUCKET_NAME"], Key=file_name, Body=upload_data)
        
    else:
        print(f"unable to download {name}")

    