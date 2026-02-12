import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

url = "https://api.lgsinarmas.com/api/AUT/AUT21001"

payload = {
    "username": "68000068",
    "password": "$udarMida0510"
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=30,
        verify=False
    )

    print("Status Code:", response.status_code)

    if response.ok:
        print("Login Success")
        try:
            print("Response JSON:", response.json())
        except:
            print("Response Text:", response.text)
    else:
        print("Login Failed")
        print("Response Text:", response.text)

except requests.exceptions.SSLError as e:
    print("SSL Error:", e)

except requests.exceptions.ConnectionError as e:
    print("Connection Error:", e)

except requests.exceptions.Timeout as e:
    print("Timeout Error:", e)

except requests.exceptions.RequestException as e:
    print("General Request Error:", e)
