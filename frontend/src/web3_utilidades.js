import Web3 from 'web3';



// Configurações
const NETWORK = "http://127.0.0.1:8545";  // Endereço da rede (Ganache no caso)
const ENDERECO = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Endereço do contrato

// Função para conectar à rede
export async function connectToNetwork() {
  const provider = new Web3.providers.HttpProvider(NETWORK);
  
  // Inicializa a instância do Web3
  const web3 = new Web3(provider);
  return web3;
}

// Função para carregar o contrato
export async function loadContract(web3, address,b) {

  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "apostador",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventoIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "tipoResultado",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "valorAposta",
          "type": "uint256"
        }
      ],
      "name": "ApostaRealizada",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "criador",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventoIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "descricao",
          "type": "string"
        }
      ],
      "name": "NovoEventoCriado",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "eventoIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "resultado",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "vencedores",
          "type": "address[]"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "descricao",
          "type": "string"
        }
      ],
      "name": "Resultado",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventoIndex",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "tipoResultado",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "valorAposta",
          "type": "uint256"
        }
      ],
      "name": "apostar",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "carteiras",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "descricao",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        }
      ],
      "name": "criarNovoEvento",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "depositar",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dono_contrato",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEventosAbertos",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "descricao",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "dono",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "unlockTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalApostadoGeral",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "oddsCara",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "oddsCoroa",
              "type": "uint256"
            }
          ],
          "internalType": "struct evento.EventoSimplificado[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMinhasApostas",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "descricao",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "dono",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "unlockTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "valor_apostado",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "tipo",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "status",
              "type": "bool"
            }
          ],
          "internalType": "struct evento.Eventoenvia[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "listaDeEventos",
      "outputs": [
        {
          "internalType": "string",
          "name": "descricao",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "dono",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalApostadoGeral",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "apostaFechada",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "qntd_apostadores",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventoIndex",
          "type": "uint256"
        }
      ],
      "name": "resultado",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "valor",
          "type": "uint256"
        }
      ],
      "name": "sacar",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const contract = new web3.eth.Contract(abi, address);  // Cria o contrato com o ABI e endereço
  return contract;
}


