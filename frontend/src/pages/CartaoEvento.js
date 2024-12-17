// Novo componente para o card de eventos
import React, { useState, useEffect,useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../UserContext';

const { connectToNetwork, loadContract } = require('../web3_utilidades');  // Importa as funções
function Eventcar({ onCreateEvent }) {
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventEndereco, setEventEndereco] = useState('');


  const { userAccount } = useContext(UserContext);


  const handleClose = () => setShowCreateModal(false);


  // Criando eventos, usa web3 para enviar o nome do envento, o endereco da conta e a data de temrino desse evento
  const handleCreateEvent = async () => {
    // Aqui você pode usar os dados a serem enviados
      const newEvent = { descricao: eventName, conta: userAccount, dato: eventDate };

      console.log('Descrição:', newEvent.descricao);
      console.log('Data:', newEvent.dato);

      // Chamando a função onCreateEvent recebida como prop
      if (onCreateEvent) {
        onCreateEvent(newEvent);
      }

      try {
        // Conectando com a rede Ethereum usando a função do blockchain.js
        const web3 = await connectToNetwork(); // Conecta à rede Ethereum

        // Carregando o contrato inteligente usando a função do blockchain.js
        const contrato = await loadContract(web3, '0x5FbDB2315678afecb367f032d93F642f64180aa3', './evento.json'); // Substitua com o endereço e caminho correto do contrato

        // Convertendo a data para timestamp
        const tempoLimite = convertToTimestamp(newEvent.dato);

        // Enviando a transação para o contrato inteligente
        const tx = contrato.methods.criarNovoEvento(newEvent.descricao, tempoLimite); //MODOFIQUEI AQUI
        const gas = await tx.estimateGas({ from: newEvent.conta });
        const txHash = await tx.send({ from: newEvent.conta, gas });

        // Mostrando o resultado da transação
        console.log(`Transação enviada com sucesso! Hash: ${txHash.transactionHash}`);
        alert('Evento criado com sucesso!');
      } catch (error) {
          console.error('Erro ao enviar os dados:', error);
          alert('Erro ao tentar conectar com o contrato.');
      }
  };

  // Função para converter a data para timestamp
  const convertToTimestamp = (data_str) => {
    const data = new Date(data_str);
    return Math.floor(data.getTime() / 1000);  // Retorna o timestamp em segundos
  };

  

  return (
    <>
      <div className="aposta-card" onClick={() => setShowCreateModal(true)}>
        <h3>Criar Novo Evento</h3>
        <p>Clique aqui para criar um novo evento</p>
      </div>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Criar Novo Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Nome do Evento:</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Digite o nome do evento"
            />
          </div>
          <div>
            <label>Data do Evento:</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          {/* <div>
            <label>Endereco:</label>
            <input
              type="text"
              value={eventEndereco}
              onChange={(e) => setEventEndereco(e.target.value)}
              placeholder="Endereco"
            />
          </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Criar Evento
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Eventcar;