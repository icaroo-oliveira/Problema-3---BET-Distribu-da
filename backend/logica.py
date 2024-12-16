from web3 import Web3
import json
import sys
from datetime import datetime
import time



# Configurações
NETWORK = "http://127.0.0.1:8545"  # Endereço da rede (Ganache no caso)
ENDERECO = "0x5FbDB2315678afecb367f032d93F642f64180aa3"  # Endereço do contrato
# Função para conectar à rede
# Esta função estabelece uma conexão com a rede blockchain especificada pela variável `NETWORK`.
# Utiliza o HTTPProvider da biblioteca Web3.py e verifica se a conexão foi bem-sucedida.
# Se a conexão falhar, lança um erro. Caso contrário, retorna a instância do objeto `web3`.
def connect_to_network():
    web3 = Web3(Web3.HTTPProvider(NETWORK))
    if not web3.is_connected():
        raise ConnectionError("Falha ao conectar à rede")
    print("Conectado à rede hardhat")
    return web3

# Função para carregar o contrato
# Recebe como parâmetros a instância `web3`, o endereço do contrato e o caminho para o arquivo ABI.
# Carrega o ABI do contrato a partir de um arquivo JSON e retorna o objeto do contrato carregado.
def load_contract(web3, address, abi_path):
    with open(abi_path, "r") as file:
        abi = json.load(file)
    address = web3.to_checksum_address(address)  # Garante que o endereço esteja no formato correto.
    return web3.eth.contract(address=address, abi=abi)

# Função para criar uma nova aposta
# Recebe uma descrição da aposta, a conta que cria a aposta e a data limite como string no formato "YYYY-MM-DD".
# Conecta-se à rede, carrega o contrato e converte a data limite para timestamp.
# Envia a transação para criar a nova aposta e aguarda a confirmação da transação.
def criar_nova_aposta(descricao, conta, data_c):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")
    tempo_limite = convert_to_timestamp(data_c)  # Converte a data limite para timestamp.
    tx_hash = contrato.functions.criarNovaAposta(descricao, tempo_limite).transact({'from': conta})
    print(f"Transação enviada com sucesso! Hash da transação: {tx_hash.hex()}")

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)  # Aguarda a confirmação da transação.
    print("Transação confirmada!")

# Função para converter data para timestamp
# Converte uma data no formato "YYYY-MM-DD" para um timestamp Unix (segundos desde 01/01/1970).
# Levanta um erro caso o formato da data não seja válido.
def convert_to_timestamp(data_str):
    try:
        data = datetime.strptime(data_str, "%Y-%m-%d")
        return int(data.timestamp())
    except ValueError:
        raise ValueError(f"Data '{data_str}' não corresponde ao formato esperado 'YYYY-MM-DD'.")

# Função para realizar um depósito (aposta)
# Recebe o valor da aposta em Ether e a conta que realizará a aposta.
# Conecta-se à rede, carrega o contrato e converte o valor para Wei antes de enviar a transação.
def depositar_1(valor, conta):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")

    valor_aposta_ether = valor
    valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')  # Converte Ether para Wei.

    tx_hash = contrato.functions.depositar().transact({
        'from': conta,
        'value': valor_aposta_wei  # Inclui o valor em Wei na transação.
    })

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)  # Aguarda confirmação.
    print("Transação confirmada!")

# Função para sacar valores
# Permite que a conta especificada saque um valor em Ether do contrato.
# Conecta-se à rede, carrega o contrato e converte o valor para Wei antes de enviar a transação.
def sacar_1(valor, conta):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")

    valor_aposta_ether = valor
    valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')  # Converte Ether para Wei.

    tx_hash = contrato.functions.sacar(valor_aposta_wei).transact({
        'from': conta,  # Especifica a conta que realizará o saque.
    })

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)  # Aguarda confirmação.
    print("Transação confirmada!")

# Função para realizar uma aposta em um evento
# Recebe o valor da aposta, a conta do apostador, o índice do evento e a opção de aposta.
# Conecta-se à rede, carrega o contrato e converte o valor da aposta para Wei antes de enviar a transação.
def criando_bet(valor, conta, index, aposta):
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")

    valor_aposta_ether = valor
    valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')  # Converte Ether para Wei.

    index = int(index)  # Garante que o índice seja um inteiro.
    tx_hash = contrato.functions.apostar(index, aposta, valor_aposta_wei).transact({
        'from': conta  # Especifica a conta que está realizando a aposta.
    })

    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)  # Aguarda confirmação.
    print("Transação confirmada!")


# Função para enviar o resultado de um evento para o contrato
# Recebe o índice do evento e a conta que realizará a transação.
# Conecta-se à rede, carrega o contrato e envia o timestamp atual como argumento.
def resultado(index, from_account):
    web3 = connect_to_network()  # Conecta à rede blockchain.
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")  # Carrega o contrato no endereço especificado.

    custom_timestamp = int(time.time())  # Obtém o timestamp atual.

    # Realiza a transação chamando a função 'resultado' no contrato.
    tx_hash = contrato.functions.resultado(index, custom_timestamp).transact({'from': from_account})
    print(f"Transação enviada! Hash: {tx_hash.hex()}")  # Exibe o hash da transação no console.

    # Aguarda a confirmação da transação na blockchain.
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)


# Função para visualizar o histórico de apostas concluídas
# Obtém todos os eventos do tipo 'Resultado' gerados no contrato.
# Retorna uma lista formatada com informações detalhadas de cada evento.
def historico():
    web3 = connect_to_network()  # Conecta à rede blockchain.
    aposta = load_contract(web3, ENDERECO, "backend/evento.json")  # Carrega o contrato no endereço especificado.

    # Cria um filtro para buscar todos os eventos do tipo 'Resultado' desde o bloco 0.
    event_filter = aposta.events.Resultado.create_filter(from_block=0)
    eventos = event_filter.get_all_entries()  # Obtém todas as entradas dos eventos filtrados.

    lista = []  # Lista para armazenar os eventos formatados.
    for evento in eventos:
        dic = {
            'vencedores': evento['args']['vencedores'],  # Lista de vencedores registrados no evento.
            'descricao': evento['args']['descricao'],  # Descrição do evento ou aposta.
            'index': evento['args']['apostaIndex'],  # Índice do evento no contrato.
            'resultado': evento['args']['resultado']  # Resultado do evento.
        }
        lista.append(dic)  # Adiciona o evento formatado à lista.

    print(lista)  # Exibe a lista formatada no console.
    return lista  # Retorna a lista com os eventos.


# Função para calcular as odds dinâmicas de uma aposta
# Recebe o índice do evento e o tipo de resultado desejado.
# Conecta-se à rede, carrega o contrato e chama a função correspondente para obter as odds.
def calcular_odds_dinamicas(apostaIndex, tipoResultado):
    web3 = connect_to_network()  # Conecta à rede blockchain.
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")  # Carrega o contrato no endereço especificado.

    # Chama a função do contrato para calcular as odds dinâmicas.
    odds = contrato.functions.calcularOddsDinamicas(apostaIndex, tipoResultado).call()

    # Exibe as odds calculadas no console.
    print(f"Odds para o resultado '{tipoResultado}': {odds}")


# Função para obter a lista de apostas abertas no contrato
# Conecta-se à rede, carrega o contrato e chama a função para buscar apostas abertas.
# Retorna uma lista formatada com informações detalhadas sobre cada aposta.
def get_apostas_abertas():
    web3 = connect_to_network()  # Conecta à rede blockchain.
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")  # Carrega o contrato no endereço especificado.

    try:
        # Chama a função do contrato para obter as apostas abertas.
        apostas_abertas = contrato.functions.getApostasAbertas().call()
    except Exception as e:
        # Trata possíveis erros na chamada da função e exibe o erro no console.
        print(f"Erro ao buscar apostas abertas: {e}")
        return []

    apostas_formatadas = []  # Lista para armazenar as apostas abertas formatadas.
    for aposta in apostas_abertas:
        # Formata as informações da aposta em um dicionário.
        aposta_dict = {
            "id": aposta[0],  # ID da aposta.
            "descricao": aposta[1],  # Descrição da aposta.
            "dono": aposta[2],  # Endereço do dono da aposta.
            "unlockTime": aposta[3],  # Tempo de desbloqueio da aposta.
            "totalApostadoGeral": aposta[4],  # Valor total apostado na aposta.
            "oddsCara": aposta[5],  # Odds para o resultado "cara".
            "oddsCoroa": aposta[6],  # Odds para o resultado "coroa".
        }
        apostas_formatadas.append(aposta_dict)  # Adiciona a aposta formatada à lista.

    return apostas_formatadas  # Retorna a lista de apostas formatadas.

# Função para obter as apostas feitas pelo usuário
# Recebe o endereço do usuário como parâmetro.
# Conecta-se à rede, carrega o contrato e utiliza uma chamada `view` para buscar as apostas associadas ao usuário.
def get_minhas_apostas(user_address):
    web3 = connect_to_network()  # Conecta ao provedor Web3.
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")  # Carrega o contrato no endereço especificado.

    try:
        # Chamando a função do contrato para buscar as apostas do usuário.
        minhas_apostas = contrato.functions.getMinhasApostas().call({'from': user_address})
    except Exception as e:
        # Tratamento de erro caso a chamada ao contrato falhe.
        print(f"Erro ao buscar minhas apostas: {e}")
        return []

    # Formata os dados retornados pelo contrato em um formato amigável.
    apostas_formatadas = []
    for aposta in minhas_apostas:
        aposta_dict = {
            "id": aposta[0],  # ID da aposta.
            "descricao": aposta[1],  # Descrição da aposta.
            "dono": aposta[2],  # Endereço do criador da aposta.
            "unlockTime": aposta[3],  # Tempo de desbloqueio da aposta.
            "totalApostadoGeral": aposta[4],  # Valor total apostado.
            "oddsCara": aposta[5],  # Odds para o resultado "cara".
            "oddsCoroa": aposta[6],  # Odds para o resultado "coroa".
        }
        apostas_formatadas.append(aposta_dict)  # Adiciona a aposta formatada à lista.

    return apostas_formatadas  # Retorna a lista formatada de apostas.


# Função para obter o saldo da carteira de um usuário
# Recebe o endereço do usuário como parâmetro.
# Valida o endereço, conecta-se ao contrato e obtém o saldo em Ether.
def get_saldo_carteira(address):
    web3 = connect_to_network()  # Conecta ao provedor Web3.
    contrato = load_contract(web3, ENDERECO, "backend/evento.json")  # Carrega o contrato no endereço especificado.

    # Verifica se o endereço fornecido é válido.
    if not Web3.is_address(address):
        raise ValueError(f"O endereço '{address}' não é válido.")  # Lança um erro em caso de endereço inválido.

    # Faz a chamada ao contrato para obter o saldo em Wei.
    saldo_wei = contrato.functions.carteiras(address).call()

    # Converte o saldo de Wei para Ether para facilitar a leitura.
    saldo = web3.from_wei(saldo_wei, 'ether')

    return saldo  # Retorna o saldo em Ether.


# Função para obter os logs do contrato
# Busca os eventos associados ao contrato em todos os blocos.
# Retorna os logs encontrados.
def get_contract_logs():
    web3 = connect_to_network()  # Conecta ao provedor Web3.

    # Define os parâmetros para filtrar os logs do contrato.
    filter_params = {
        'fromBlock': 0,  # Busca desde o bloco 0.
        'toBlock': 'latest',  # Até o bloco mais recente.
        'address': ENDERECO  # Filtra apenas pelos logs do endereço do contrato.
    }
    
    # Obtém os logs usando os parâmetros definidos.
    logs = web3.eth.getLogs(filter_params)
    
    return logs  # Retorna os logs obtidos.
