# CASO TENHA FICADO CONFUSO O MOTIVO DE USARMOS DATAS ESPECÍFICAS PARA PUXAR OS JOGOS DA API,
# AQUI VAI FICAR MAIS CLARO: A API GRATUITA SÓ PERMITE PUXAR 15 JOGOS POR COMPETIÇÃO, E ELES SÃO
# SEMPRE OS PRIMEIROS 15 JOGOS DO ANO. JÁ A VERSÃO PREMIUM PERMITE PUXAR ATÉ 3000 JOGOS DE UMA VEZ.
# PORTANTO, SE TIVÉSSEMOS A ASSINATURA, A ÚNICA COISA QUE MUDARIA É QUE NÃO PRECISARÍAMOS USAR DATAS,
# E PODERÍAMOS USAR APENAS UM COMANDO PARA PUXAR TODOS OS JOGOS DE UM CAMPEONATO DE UMA VEZ.

# Se quiser testar pra ver se eu não estou mentindo, roda esse teste.py, e ele vai retornar os
# primeiros 15 jogos do ano, ou seja jogos que aconteceram lá pra março, então não seria nem 
# possivel testar jogos ao vivo, pq ja estamos em outubro, e os primeiros jogos do ano já passaram


# como isso é um mvp espero que vocês entendam a escolha que fizemos...

import requests
import json

API_KEY = "123" # sim a chave é essa msm
LEAGUE_ID = "5201" # ID da liga brasileira feminina
SEASON = "2025"

url = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/eventsseason.php?id={LEAGUE_ID}&s={SEASON}"

resp = requests.get(url)
data = resp.json()

print(json.dumps(data, indent=2, ensure_ascii=False))
