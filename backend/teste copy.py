API_KEY = "a1583d84589bc5a44bdcb3829e748f4c" # sim a chave é essa msm

import http.client

conn = http.client.HTTPSConnection("v3.football.api-sports.io")

headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': f"{API_KEY}"
    }

conn.request("GET", "/fixtures/statistics?fixture=215662", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))