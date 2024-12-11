from web3 import Web3
import json

NETWORK = "http://localhost:7545"  # Ou o endereço correto se for diferente
ENDERECO = "0x8922BDF86F907285E4bb8d58D48DD56b65C5dEc2"

def connect_to_network():
    web3 = Web3(Web3.HTTPProvider(NETWORK))
    if not web3.is_connected():
        raise ConnectionError(f"Falha ao conectar à rede")
    print(f"Conectado à rede Ganache")
    return web3


def load_contract(web3, address, abi_path):
    with open(abi_path, "r") as file:
        abi = json.load(file)
    address = web3.to_checksum_address(address)
    return web3.eth.contract(address=address, abi=abi)


def criar_nova_aposta(descricao,conta):
    web3 = connect_to_network()
    conta = conta

    contrato = load_contract(web3, ENDERECO, "evento.json")

    tx_hash = contrato.functions.criarNovaAposta(descricao).transact({'from': conta})

    print(f"Transação enviada com sucesso! Hash da transação: {tx_hash.hex()}")

    #esperando a transação
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transação confirmada!")

    # Escutar o evento
    event_filter = contrato.events.NovaApostaCriada.create_filter(from_block=tx_receipt['blockNumber'])
    eventos = event_filter.get_all_entries()

    for evento in eventos:
        print(f"Aposta criada por: {evento.args['criador']}")
        print(f"Índice da aposta: {evento.args['apostaIndex']}")
        print(f"Descrição: {evento.args['descricao']}")

  

def criando_bet():
    
    
    web3 = connect_to_network()
    
    aposta = load_contract(web3,ENDERECO, "evento.json")

    valor_aposta_ether = float(input("valor"))

    valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')

    conta = input("conta")
    index = int(input("evento né"))
    tx_hash = aposta.functions.apostar(index,"1 - 3").transact({
    'from': conta,
    'value': valor_aposta_wei  
    })
    print(f"hash!: {tx_hash}")

   




def listar_apostas(param):
    #Filtrar eventos (Exemplo para NovaApostaCriada)

    web3 = connect_to_network()
    
    aposta = load_contract(web3,ENDERECO, "evento.json")

    event_filter = aposta.events.NovaApostaCriada.create_filter(from_block=0)

    # Buscar eventos
    eventos = event_filter.get_all_entries()


    if param ==1:
    # Processar os eventos
        for evento in eventos:
            criador = evento['args']['criador']
            descricao = evento['args']['descricao']
            index = evento['args']['apostaIndex']
            print(f"Aposta criada por: {criador}")
            print(f"Descrição: {descricao}")
            print(f"Index: {index}")
    else:
        lista = []
        for evento in eventos:
            dic={}
            dic['criador']=evento['args']['criador']
            dic['descricao']=evento['args']['descricao']
            dic['index']=evento['args']['index']
            lista.append(dic)
        return lista,web3,aposta


def resultado():
    
    

        web3 = connect_to_network()
    
        aposta = load_contract(web3,ENDERECO, "evento.json")


        
        resultado_vencedor = "1 - 0"  
        from_account = web3.eth.accounts[0]  #conta 0 ganache

        index = int(input("digite qual aposta é"))
        
        tx_hash = aposta.functions.resultado(index,resultado_vencedor).transact({'from': from_account})

        print(f"Transação enviada com sucesso! Hash da transação: {tx_hash.hex()}")

        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)



        event_filter = aposta.events.Resultado.create_filter(from_block=0)
        eventos = event_filter.get_all_entries()

        for evento in eventos:
            print(f"Aposta vencida por: {evento.args['vencedores']}")
            print(f"Índice da aposta: {evento.args['apostaIndex']}")
            print(f"Descrição: {evento.args['descricao']}")
            print(f"Resultado: {evento.args['resultado']}")






def historico():
    web3 = connect_to_network()
    
    aposta = load_contract(web3,ENDERECO, "evento.json")

    event_filter = aposta.events.Resultado.create_filter(from_block=0)
    eventos = event_filter.get_all_entries()

    for evento in eventos:
        print(f"Aposta vencida por: {evento.args['vencedores']}")
        print(f"Índice da aposta: {evento.args['apostaIndex']}")
        print(f"Descrição: {evento.args['descricao']}")
        print(f"Resultado: {evento.args['resultado']}")



def calcular_odds_dinamicas(apostaIndex, tipoResultado):
    web3 = connect_to_network()
    aposta = load_contract(web3, ENDERECO, "evento.json")
    odds = aposta.functions.calcularOddsDinamicas(apostaIndex, tipoResultado).call()
    print(f"Odds para o resultado '{tipoResultado}': {odds}")




if __name__ == "__main__":
    
    print("1. Criar Aposta")
    print("2. Listar Apostas")
    escolha = input("Escolha uma opção: ")

    if escolha == "1":
        descricao = input("Descrição da aposta: ")
        conta=input("conta").strip()
        criar_nova_aposta(descricao,conta)
    elif escolha == "2":
        listar_apostas(1)
    elif escolha=="3":
        criando_bet()
    elif escolha=='4':
        resultado()
    else:
        historico()
