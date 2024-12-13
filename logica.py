from web3 import Web3
import json
import sys

# Configurações
NETWORK = "http://localhost:7545"  # Endereço da rede (Ganache no caso)
ENDERECO = "0x441BC5D17B3D5aba910EEf0B243663f7Ab14eF9A"  # Endereço do contrato

# Função para conectar à rede
def connect_to_network():
    web3 = Web3(Web3.HTTPProvider(NETWORK))
    if not web3.is_connected():
        raise ConnectionError("Falha ao conectar à rede")
    print("Conectado à rede Ganache")
    return web3

# Função para carregar o contrato
def load_contract(web3, address, abi_path):
    with open(abi_path, "r") as file:
        abi = json.load(file)
    address = web3.to_checksum_address(address)
    return web3.eth.contract(address=address, abi=abi)

# Função para criar uma nova aposta
def criar_nova_aposta(descricao, conta):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "evento.json")
    print('oi')
    
    tx_hash = contrato.functions.criarNovaAposta(descricao).transact({'from': conta})
    print(f"Transação enviada com sucesso! Hash da transação: {tx_hash.hex()}")

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transação confirmada!")

    # Escutar o evento
    event_filter = contrato.events.NovaApostaCriada.create_filter(from_block=tx_receipt['blockNumber'])
    eventos = event_filter.get_all_entries()
    

   
    for evento in eventos:
        print(f"Aposta criada por: {evento.args['criador']}")
        print(f"Índice da aposta: {evento.args['apostaIndex']}")
        print(f"Descrição: {evento.args['descricao']}")






# Função para realizar uma aposta
def depositar_1(valor,conta):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "evento.json")

    valor_aposta_ether = valor
    valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')

    conta = conta
    
    
    tx_hash = contrato.functions.depositar().transact({
        'from': conta,
        'value': valor_aposta_wei
    })

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transação confirmada!")




def sacar_1(valor,conta):

    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "evento.json")

    valor_aposta_ether = valor
    valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')

   
    tx_hash = contrato.functions.sacar(valor_aposta_wei).transact({
        'from': conta,
    })

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transação confirmada!")









# Função para realizar uma aposta
def criando_bet(valor,conta,index,aposta):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "evento.json")

    print(valor)
    valor_aposta_ether = valor
    valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')
    print(valor_aposta_wei)

    index = int(index)
    tx_hash = contrato.functions.apostar(index,aposta,valor_aposta_wei).transact({
        'from': conta
        # 'value': valor_aposta_wei
    })

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transação confirmada!")















    


# Função para listar apostas
def listar_apostas(param):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "evento.json")

    event_filter = contrato.events.NovaApostaCriada.create_filter(from_block=0)
    eventos = event_filter.get_all_entries()

    lista = []
    for evento in eventos:
        dic = {
            'criador': evento['args']['criador'],
            'descricao': evento['args']['descricao'],
            'index': evento['args']['apostaIndex']
        }
        lista.append(dic)
    print(lista)
    return lista



# Função para registrar o resultado
def resultado(index,from_account):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "evento.json")



    tx_hash = contrato.functions.resultado(index).transact({'from': from_account})
    print(f"Transação enviada! Hash: {tx_hash.hex()}")

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)


    event_filter = contrato.events.Resultado.create_filter(from_block=0)
    eventos = event_filter.get_all_entries()

    for evento in eventos:
        print(f"Aposta vencida por: {evento.args['vencedores']}")
        print(f"Índice da aposta: {evento.args['apostaIndex']}")
        print(f"Descrição: {evento.args['descricao']}")
        print(f"Resultado: {evento.args['resultado']}")



# Função para visualizar histórico de apostas

def historico():
    web3 = connect_to_network()
    
    aposta = load_contract(web3,ENDERECO, "evento.json")

    event_filter = aposta.events.Resultado.create_filter(from_block=0)
    eventos = event_filter.get_all_entries()

    # for evento in eventos:
    #     print(f"Aposta vencida por: {evento.args['vencedores']}")
    #     print(f"Índice da aposta: {evento.args['apostaIndex']}")
    #     print(f"Descrição: {evento.args['descricao']}")
    #     print(f"Resultado: {evento.args['resultado']}")

    lista = []
    for evento in eventos:
        dic = {
            'criador': evento['args']['vencedores'],
            'descricao': evento['args']['descricao'],
            'index': evento['args']['apostaIndex'],
            'resultado': evento['args']['resultado']
        }
        lista.append(dic)
    print(lista)
    return lista





# Função para calcular odds dinâmicas
def calcular_odds_dinamicas(apostaIndex, tipoResultado):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "evento.json")
    odds = contrato.functions.calcularOddsDinamicas(apostaIndex, tipoResultado).call()
    print(f"Odds para o resultado '{tipoResultado}': {odds}")

