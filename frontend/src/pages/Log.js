import React, { useEffect, useState } from 'react';
import '../styles/Log.css';
const { connectToNetwork, loadContract } = require('../web3_utilidades');  // Importa as funções

function Log() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os eventos diretamente da blockchain
  const fetchEventos = async () => {
    try {
      // Conectando à rede Ethereum usando a função connectToNetwork
      const web3 = await connectToNetwork();
      
      // Carregando o contrato inteligente usando a função loadContract
      const contrato = await loadContract(web3, '0x5FbDB2315678afecb367f032d93F642f64180aa3', './evento.json'); // Substitua com o endereço e caminho correto do contrato

      const eventos = await contrato.getPastEvents('allEvents', {
        fromBlock: 0, // Começa do bloco inicial
        toBlock: 'latest' // Vai até o bloco mais recente
      });

      // Formatando os eventos
      const listaEventos = eventos.map(evento => {
        switch (evento.event) {
          case 'ApostaRealizada':
            return {
              tipo: 'ApostaRealizada',
              apostador: evento.returnValues.apostador,
              index: evento.returnValues.eventoIndex,
              tipoResultado: evento.returnValues.tipoResultado,
              valorAposta: evento.returnValues.valorAposta,
            };
          case 'Resultado':
            return {
              tipo: 'Resultado',
              index: evento.returnValues.eventoIndex,
              resultado: evento.returnValues.resultado,
              vencedores: evento.returnValues.vencedores,
              descricao: evento.returnValues.descricao,
            };
          case 'NovoEventoCriado':
            return {
              tipo: 'NovoEventoCriado',
              criador: evento.returnValues.criador,
              index: evento.returnValues.eventoIndex,
              descricao: evento.returnValues.descricao,
            };
          default:
            return { tipo: 'Desconhecido', dados: evento.returnValues }; // Caso de evento não identificado
        }
      });

      return listaEventos; // Retorna a lista formatada de eventos
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw new Error('Erro ao tentar buscar os eventos');
    }
  };

  useEffect(() => {
    async function LoadEventos() {
      try {
        const eventosList = await fetchEventos();
        setEventos(eventosList); // Atualiza o estado com os eventos recebidos
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        setLoading(false);
      }
    }
    LoadEventos();
  }, []);

  return (
    <div className="lista-eventos-container">
      <h2 className="lista-eventos-titulo">LOG</h2>
      {loading ? (
        <div className="lista-eventos-loading-container">
          <p className="lista-eventos-loading-text">Carregando...</p>
        </div>
      ) : (
        <div>
          {eventos.length > 0 ? (
            <div className="lista-eventos-cards-container">
              {eventos.map((evento, index) => (
                <div className="evento-card" key={index}>
                  <h3 className="evento-card-tipo">Evento: {evento.tipo}</h3>
                  {evento.tipo === 'ApostaRealizada' && (
                    <>
                      <p><strong>Apostador:</strong> {evento.apostador}</p>
                      <p><strong>Índice:</strong> {evento.index}</p>
                      <p><strong>Tipo de Resultado:</strong> {evento.tipoResultado}</p>
                      <p><strong>Valor da Aposta:</strong> {evento.valorAposta}</p>
                    </>
                  )}
                  {evento.tipo === 'Resultado' && (
                    <>
                      <p><strong>Índice:</strong> {evento.index}</p>
                      <p><strong>Resultado:</strong> {evento.resultado}</p>
                      <p><strong>Vencedores:</strong> {evento.vencedores.join(', ')}</p>
                      <p><strong>Descrição:</strong> {evento.descricao}</p>
                    </>
                  )}
                  {evento.tipo === 'NovoEventoCriado' && (
                    <>
                      <p><strong>Criador:</strong> {evento.criador}</p>
                      <p><strong>Índice:</strong> {evento.index}</p>
                      <p><strong>Descrição:</strong> {evento.descricao}</p>
                    </>
                  )}
                  {evento.tipo === 'Desconhecido' && (
                    <p>Dados: {JSON.stringify(evento.dados)}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="lista-eventos-no-cards">Não há nenhum evento registrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Log;
