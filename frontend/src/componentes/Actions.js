import { FaArrowDown, FaArrowUp, FaEllipsisH } from "react-icons/fa";
import React, { useState, useEffect } from "react";
const { connectToNetwork, loadContract } = require('../web3_utilidades');  // Importa as funções





const Actions = ({ onDeposito, onSaque, onTroca, selectedAccount }) => {
  const [transacoes, setTransacoes] = useState([]);

  const getMinhasApostas = async (userAddress) => {
    try {
      console.log('Buscando apostas para o endereço:', userAddress); // Adiciona log para verificar se o endereço é válido
  
      // Conecta à rede e carrega o contrato
      const web3 = await connectToNetwork();  // Função que conecta à rede
      const contrato = await loadContract(web3, "0x5FbDB2315678afecb367f032d93F642f64180aa3", './evento.json');  // Substitua com o endereço correto do contrato
  
      // Chama a função do contrato para obter as apostas do usuário
      const minhasApostas = await contrato.methods.getMinhasApostas().call({ from: userAddress });
  
      console.log('Minhas apostas:', minhasApostas);  // Exibe as apostas no console
  
      // Formata as apostas para um formato mais amigável
      const apostasFormatadas = minhasApostas.map((aposta) => ({
        id: aposta[0],  // ID da aposta
        descricao: aposta[1],  // Descrição da aposta
        dono: aposta[2],  // Endereço do dono da aposta
        unlockTime: aposta[3],  // Tempo de desbloqueio
        valor_apostado:aposta[4], //valor daquela bet
        tipo:aposta[5], //tipo daquela bet
        status: String(aposta[6]),  // Valor total apostado
      }));
  
      return apostasFormatadas;  // Retorna as apostas formatadas
    } catch (error) {
      console.error('Erro ao tentar buscar as apostas:', error);
      alert('Erro ao tentar conectar com o contrato.');
    }
  };
  

  const actions = [
    { 
      label: "Depósito", 
      icon: <FaArrowDown />, 
      onClick: onDeposito 
    },
    { 
      label: "Eventos", 
      icon: <FaEllipsisH />, 
      onClick: onTroca 
    },
    { 
      label: "Saque", 
      icon: <FaArrowUp />, 
      onClick: onSaque 
    }
  ];

  useEffect(() => {
    console.log('useEffect disparado, selectedAccount:', selectedAccount); // Adiciona log para ver se useEffect é disparado
    if (selectedAccount) {
      console.log('selectedAccount mudou:', selectedAccount); // Verifica se selectedAccount está sendo alterado
      const fetchData = async () => {
        try {
          const apostas = await getMinhasApostas(selectedAccount);
          setTransacoes(apostas);
        } catch (error) {
          console.error('Erro ao buscar apostas:', error);
        }
      };

      fetchData();  // Chama a função de fetch quando selectedAccount mudar
    }
  }, [selectedAccount]);

  return (
    <div className="account-box">
      {/* Ações */}
      <div className="actions">
        {actions.map((action, index) => (
          <div 
            key={index} 
            className="action-item" 
            onClick={action.onClick}
          >
            {action.icon} {/* Ícone */}
            <span>{action.label}</span> {/* Texto */}
          </div>
        ))}
      </div>

      {/* Transações */}
      <div className="transactions">
        <h3>Minhas Apostas</h3>
        <ul>
  {transacoes && transacoes.length > 0 ? (
    transacoes.map((item, index) => (
      <li key={index}>
        <div>
          <strong>Descrição:</strong> {item.descricao}
        </div>
        <div>
          <strong>Dono:</strong> {item.dono}
        </div>
        <div>
          <strong>ID:</strong> {item.id}
        </div>
        <div>
          <strong>Aposta tipo:</strong> {item.tipo}
        </div>
        <div>
          <strong>Aposta Fechada:</strong> {item.status}
        </div>
        <div>
          <strong>Valor Apostado:</strong> {item.valor_apostado}
        </div>
        <div>
          <strong>Unlock Time:</strong> {item.unlockTime}
        </div>
      </li>
    ))
  ) : (
    <li>Nenhuma aposta registrada</li>
  )}
</ul>

      </div>
    </div>
  );
};

export default Actions;
