# Importa as bibliotecas necessárias do Flask para criar a aplicação e lidar com requisições HTTP
from flask import Flask, request, jsonify, render_template

# Importa funções específicas do módulo "logica" que implementam funcionalidades da aplicação
from logica import (
    criar_nova_aposta, get_minhas_apostas, get_apostas_abertas, criando_bet, 
    get_contract_logs, resultado, historico, calcular_odds_dinamicas, 
    depositar_1, sacar_1, get_saldo_carteira
)

# Importa o CORS para permitir que a aplicação Flask aceite requisições de outras origens (cross-origin requests)
from flask_cors import CORS

# Inicializa a aplicação Flask
app = Flask(__name__)

# Habilita o CORS na aplicação
CORS(app)

# Define a rota principal que renderiza a página inicial
@app.route('/')
def home():
    return render_template('index.html')  # Renderiza o template HTML 'index.html'

# Define a rota para criar uma nova aposta
@app.route('/criar_aposta', methods=['POST'])
def criar_aposta():
    # Obtém os dados enviados no corpo da requisição
    data = request.json
    descricao = data.get('descricao')  # Descrição da aposta
    conta = data.get('conta')  # Conta do usuário
    data_c = data.get('dato')  # Data relacionada à aposta

    print(conta)  # Log para depuração
    # Chama a função para criar uma nova aposta
    criar_nova_aposta(descricao, conta, data_c)

    # Retorna uma resposta em JSON informando que a aposta foi criada com sucesso
    return jsonify({"message": "Aposta criada com sucesso!"})

# Define a rota para listar apostas abertas
@app.route('/listar_apostas', methods=['GET'])
def listar():
    param = request.args.get('param', default=1, type=int)  # Parâmetro opcional da requisição
    apostas = get_apostas_abertas()  # Obtém as apostas abertas
    print(apostas)  # Log para depuração
    return jsonify(apostas)  # Retorna as apostas no formato JSON

# Define a rota para realizar uma aposta
@app.route('/realizar_aposta', methods=['POST'])
def apostar():
    print('apostando')  # Log para depuração
    data = request.json
    valor = data.get('valorAposta')  # Valor da aposta
    conta = data.get('conta')  # Conta do usuário
    index = data.get('index')  # Índice da aposta
    aposta = data.get('aposta')  # Detalhes da aposta
    print(valor, conta, index, aposta)  # Log para depuração
    # Realiza a aposta chamando a função correspondente
    criando_bet(valor, conta, index, aposta)
    return jsonify({"message": "Aposta realizada com sucesso!"})

# Define a rota para definir o resultado de uma aposta
@app.route('/resultado', methods=['POST'])
def definir_resultado():
    print('resultado ola')  # Log para depuração
    data = request.json
    index = data.get('index')  # Índice da aposta
    conta = data.get('conta')  # Conta do usuário
    print(index, conta)  # Log para depuração
    # Define o resultado da aposta chamando a função correspondente
    resultado(int(index), conta)
    return jsonify({"message": "Resultado definido com sucesso!"})

# Define a rota para visualizar o histórico de apostas
@app.route('/historico', methods=['GET'])
def ver_historico():
    historico_dados = historico()  # Obtém o histórico de apostas
    return jsonify(historico_dados)  # Retorna o histórico no formato JSON

# Define a rota para depositar dinheiro na conta
@app.route('/depositar', methods=['POST'])
def depositar():
    data = request.json
    valor = data.get('valor')  # Valor a ser depositado
    conta = data.get('conta')  # Conta do usuário
    print(valor, conta)  # Log para depuração
    depositar_1(valor, conta)  # Realiza o depósito chamando a função correspondente
    return jsonify({"message": "Depósito realizado com sucesso!"})

# Define a rota para sacar dinheiro da conta
@app.route('/sacar', methods=['POST'])
def sacar():
    data = request.json
    valor = data.get('valor')  # Valor a ser sacado
    conta = data.get('conta')  # Conta do usuário
    sacar_1(int(valor), conta)  # Realiza o saque chamando a função correspondente
    return jsonify({"message": "Saque realizado com sucesso!"})

# Define a rota para consultar o saldo da carteira
@app.route('/saldo_carteira', methods=['GET'])
def saldo():
    address = request.args.get('address')  # Obtém o endereço fornecido como parâmetro na URL

    if not address:
        # Retorna um erro caso o endereço não seja fornecido
        return jsonify({"erro": "Endereço não fornecido"}), 400

    saldo = get_saldo_carteira(address)  # Obtém o saldo da carteira
    return jsonify(saldo)  # Retorna o saldo no formato JSON

# Define a rota para listar as apostas de um usuário específico
@app.route('/minhas_apostas', methods=['POST'])
def minhas_apostas():
    data = request.json
    user_address = data.get('endereco')  # Endereço do usuário
    try:
        apostas = get_minhas_apostas(user_address)  # Obtém as apostas do usuário
        return jsonify(apostas), 200  # Retorna as apostas no formato JSON
    except Exception as e:
        # Retorna um erro caso ocorra uma exceção
        return jsonify({"error": str(e)}), 500

# Define a rota para obter logs do contrato
@app.route('/get-logs', methods=['GET'])
def get_logs():
    try:
        logs = get_contract_logs()  # Obtém os logs do contrato
        return jsonify(logs)  # Retorna os logs no formato JSON
    except Exception as e:
        # Retorna um erro caso ocorra uma exceção
        return jsonify({'error': str(e)}), 500

# Configura o servidor para rodar em modo de depuração
if __name__ == "__main__":
    app.run(debug=True)
