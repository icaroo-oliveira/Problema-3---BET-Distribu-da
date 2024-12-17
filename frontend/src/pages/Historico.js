import React, { useEffect, useState } from 'react';
import '../styles/Historico.css';
const { connectToNetwork, loadContract } = require('../web3_utilidades');  // Importa as funções

function Historico() {
  const [apostas, setApostas] = useState([]);
  const [loading, setLoading] = useState(true);


  // Função para buscar o histórico de apostas (concluidas) diretamente da blockchain
  const fetchApostas = async () => {
    try {
      // Conectando à rede Ethereum usando a função connectToNetwork
      const web3 = await connectToNetwork();  // Conecta à rede Ethereum
      
      // Carregando o contrato inteligente usando a função loadContract
      const contrato = await loadContract(web3, '0x5FbDB2315678afecb367f032d93F642f64180aa3', './evento.json'); 

 
      const eventos = await contrato.getPastEvents('Resultado', {
        fromBlock: 0,
        toBlock: 'latest'
      });
      

      // Formatando os eventos
      const listaApostas = eventos.map(evento => ({
        vencedores: evento.returnValues.vencedores,
        descricao: evento.returnValues.descricao,
        index: evento.returnValues.eventoIndex,
        resultado: evento.returnValues.resultado,
      }));

      return listaApostas;  // Retorna a lista formatada de apostas
    } catch (error) {
      console.error('Erro ao buscar apostas:', error);
      throw new Error('Erro ao tentar buscar os eventos');
    }
  };


  // Já carrega os Eventos
  useEffect(() => {
    async function LoadApostas() {
      try {
        const apostasList = await fetchApostas();
        setApostas(apostasList);  // Atualiza o estado com os eventos recebidos
        setLoading(false);  // Finaliza o carregamento
      } catch (error) {
        console.error('Erro ao buscar apostas:', error);
        setLoading(false);
      }
    }
    LoadApostas();
  }, []);

  return (
    <div className="lista-apostas-simples-container">
      <h2 className="lista-apostas-simples-titulo">Histórico de Resultado</h2>
      {loading ? (
        <div className="lista-apostas-simples-loading-container">
          <p className="lista-apostas-simples-loading-text">Carregando...</p>
        </div>
      ) : (
        <div>
          {apostas.length > 0 ? (
            <div className="lista-apostas-simples-apostas-container">
              {apostas.map((aposta, index) => (
                <div className="lista-apostas-simples-aposta-card" key={index}>
                  <h3 className="lista-apostas-simples-aposta-descricao">{aposta.descricao}</h3>
                  <p><strong>Índice:</strong> {aposta.index}</p>
                  <p><strong>Vencedores:</strong> {aposta.vencedores}</p>
                  <p><strong>Resultado:</strong> {aposta.resultado}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="lista-apostas-simples-no-apostas">Não há apostas disponíveis no histórico.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Historico;
