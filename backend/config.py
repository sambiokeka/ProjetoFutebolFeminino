# A chave de API da TheSportsDB.
API_KEY = "123"

# Todas as requisições serão feitas a partir desta URL.
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/"

# Lista de nomes das ligas de futebol feminino que serão processadas.
LEAGUE_NAMES = ["Brazil Brasileiro Women", "International Friendlies Women", "English Womens Super League", "Brazilian Serie A"]



# Tenho que chamar os jogos por data, preciso fazer assim pq a chave q usamos da api é gratuita, então se fosse pra listar os jogos de algum campeonato usando a api ele retornario miseros 15 jogos, e são os 
# 15 primeiros jogos do ano todo, geralmente fica lá pra março... ai se você pega por data ele pega todos os jogos que aconteceram em um dia, mas caso eu usasse a api premium, era só puxar
# pela própria api que ele já mostrava os ultimos 3000 jogos do campeonatoKKKKKK, mas já basta o dinheiro q gasto na faculdade 


# CASO NÃO ACREDITE EM MIM VEJA O TESTE.PY POR FAVOR ACREDITA EM MIM POR FAVORAAAAAAAAAAAAAAAAAA
LEAGUE_DATES = {
    "Brazil Brasileiro Women": [
        "2025-03-22", "2025-03-23", "2025-03-25", "2025-03-26", "2025-03-27",
        "2025-03-29", "2025-03-30", "2025-03-31",
        "2025-04-11", "2025-04-12", "2025-04-13", "2025-04-15", "2025-04-16",
        "2025-04-17", "2025-04-19", "2025-04-20", "2025-04-21", "2025-04-22",
        "2025-04-26", "2025-04-27", "2025-04-28", "2025-04-30",
        "2025-05-01", "2025-05-03", "2025-05-04", "2025-05-05", "2025-05-10",
        "2025-05-11", "2025-05-12", "2025-05-17", "2025-05-18", "2025-05-19",
        "2025-05-21", "2025-05-22",
        "2025-06-06", "2025-06-07", "2025-06-08", "2025-06-09", "2025-06-14",
        "2025-06-15", "2025-06-18",
        "2025-08-09", "2025-08-10", "2025-08-16", "2025-08-17", "2025-08-24",
        "2025-08-31", '2025-09-14'
    ],
    "International Friendlies Women": [
        "2025-06-29",
        "2025-07-01",
        "2025-07-02",
        "2025-07-03",
        "2025-07-05",
        "2025-07-08",
        "2025-10-22",
        "2025-10-23",
        "2025-10-24",
        "2025-10-25",
        "2025-10-26",
        "2025-10-27"
    ],


    'Brazilian Serie A': [
        "2025-09-17",         
    ],

    "English Womens Super League": [
        "2025-05-04","2025-05-05","2025-05-10","2025-05-10","2025-05-10",
        "2025-05-10","2025-05-10","2025-05-10","2025-09-05","2025-09-06",
        "2025-09-07","2025-09-07","2025-09-07","2025-09-07","2025-09-12",
        "2025-09-12","2025-09-14","2025-09-14", "2025-09-19", "2025-09-21",
        "2025-09-27", "2025-09-28",   


        "2025-10-05", "2025-10-12",
        "2025-11-01", "2025-11-02", "2025-11-08", "2025-11-09"
    ],


}