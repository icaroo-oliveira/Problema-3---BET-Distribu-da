from flask import Flask, request, jsonify, render_template
from logica import (
    criar_nova_aposta, listar_apostas, criando_bet, resultado, historico, calcular_odds_dinamicas,depositar_1,sacar_1
)
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return render_template('index.html')  # Página inicial

@app.route('/criar_aposta', methods=['POST'])
def criar_aposta():
    data = request.json
    descricao = data.get('descricao')
    conta = data.get('conta')
    print(conta)
    criar_nova_aposta(descricao, conta)
    return jsonify({"message": "Aposta criada com sucesso!"})

@app.route('/listar_apostas', methods=['GET'])
def listar():
    param = request.args.get('param', default=1, type=int)
    apostas= listar_apostas(param)
    print(apostas)
    return jsonify(apostas)

@app.route('/realizar_aposta', methods=['POST'])
def apostar():
    print('apostando')
    data = request.json
    valor = data.get('valorAposta')
    conta = data.get('conta')
    index = data.get('index')
    aposta = data.get('aposta')
    print(valor,conta,index,aposta)
    criando_bet(valor, conta, index,aposta)
    return jsonify({"message": "Aposta realizada com sucesso!"})

@app.route('/resultado', methods=['POST'])
def definir_resultado():
    print('resultado ola')
    data = request.json
    index = data.get('index')
    conta = data.get('conta')

    print(index,conta)
    resultado(int(index), conta)
    return jsonify({"message": "Resultado definido com sucesso!"})

@app.route('/historico', methods=['GET'])
def ver_historico():
    historico_dados = historico()
    return jsonify(historico_dados)




@app.route('/depositar', methods=['PUT'])
def depositar():
    data = request.json
    valor = data.get('valor')
    conta = data.get('conta')
    depositar_1(valor,conta)
    
    return jsonify({"message":"depoisito realziado!"})



@app.route('/sacar', methods=['PUT'])
def sacar():
    data = request.json
    valor = data.get('valor')
    conta = data.get('conta')
    sacar_1(int(valor),conta)
    
    return jsonify({"message":"saque realizado!"})

if __name__ == "__main__":
    app.run(debug=True)
