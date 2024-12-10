from web3 import Web3
import json

NETWORK = "http://localhost:7545"  # Ou o endereço correto se for diferente
ENDERECO = "0x72025D751fbAa860618bbe1ad8293B28334340C5"

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

    contrato = load_contract(web3, ENDERECO, "fabrica.json")

    tx_hash = contrato.functions.criarNovaAposta(descricao).transact({'from': conta})

    print(f"Transação enviada com sucesso! Hash da transação: {tx_hash.hex()}")

    #esperando a transação
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transação confirmada!")

    
    # tx = contrato.functions.criarNovaAposta(descricao).build_transaction({
    #     "from": conta.address,
    #     "nonce": web3.eth.get_transaction_count(conta.address),
    #     "gas": 2000000,
    #     "gasPrice": web3.to_wei('20', 'gwei')
    # })

    # signed_tx = web3.eth.account.sign_transaction(tx, conta.key)
    # tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

    # print(f"Transação enviada! Hash: {tx_hash.hex()}")
    # receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    # print(f"Transação confirmada! {receipt}")


def listar_apostas():
    web3 = connect_to_network()
    contrato = load_contract(web3, ENDERECO, "fabrica.json")

    apostas = contrato.functions.listarApostas().call()
    print("Apostas Criadas:", apostas)
    return apostas


def criando_bet():
    
    apostas_enderecos = listar_apostas()
    
    if len(apostas_enderecos) > 0:
        print(apostas_enderecos)
        while True:
            x=input('selecione a aposta')
            if x in apostas_enderecos:
                break


        web3 = connect_to_network()
        
        aposta = load_contract(web3, x, "aposta.json")

    
        valor_aposta_ether = float(input("valor"))
        #valor para Wei
        valor_aposta_wei = web3.to_wei(valor_aposta_ether, 'ether')

        conta = input("endereço")
        tx_hash = aposta.functions.apostar("0 - 0").transact({
        'from': conta,
        'value': valor_aposta_wei  
        })
        print(f"hash!: {tx_hash}")

    else:
        print("Nenhuma aposta criada ainda.")








def resultado():
    
    apostas_enderecos = listar_apostas()
    
    if len(apostas_enderecos) > 0:
        print(apostas_enderecos)
        while True:
            x=input('selecione a aposta')
            if x in apostas_enderecos:
                break


        web3 = connect_to_network()
        
        aposta = load_contract(web3, x, "aposta.json")

    
        
        resultado_vencedor = "3 - 0"  
        from_account = web3.eth.accounts[0]  #conta 0 ganache

        
        
        tx_hash = aposta.functions.resultado(resultado_vencedor).transact({'from': from_account})

        print(f"Transação enviada com sucesso! Hash da transação: {tx_hash.hex()}")

        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    else:
        print("Nenhuma aposta criada ainda.")















if __name__ == "__main__":
    
    print("1. Criar Aposta")
    print("2. Listar Apostas")
    escolha = input("Escolha uma opção: ")

    if escolha == "1":
        descricao = input("Descrição da aposta: ")
        conta=input("conta").strip()
        criar_nova_aposta(descricao,conta)
    elif escolha == "2":
        listar_apostas()
    elif escolha=="3":
        criando_bet()
    else:
        resultado()
