import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../UserContext';

const { connectToNetwork, loadContract } = require('../web3_utilidades.js');  // Importa as funções

function ApostaModal({ apost }) {
  const [show, setShow] = useState(false);


  const { userAccount } = useContext(UserContext);

  // Adicionando states para os campos de texto
  const [valorAposta, setValorAposta] = useState('');
  const [conta, setconta] = useState('');
  const [aposta, seaposta] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'valorAposta') {
      setValorAposta(value);
    } else if (name === 'conta') {
      setconta(value);
    } else if (name === 'aposta') {
      seaposta(value);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleResultado = async () => {
    const resultadoData = {
      index: apost.id,  // Índice da aposta
      conta: userAccount, // Endereço da conta
    };
  
    try {
      // Conectando à rede Ethereum e carregando o contrato
      const web3 = await connectToNetwork();  // Conecta à rede Ethereum
      const contrato = await loadContract(web3, '0x5fbdb2315678afecb367f032d93f642f64180aa3','evento.json');  // Substitua com o endereço e caminho correto do contrato
      
      // Obtém o timestamp atual
      const customTimestamp = Math.floor(Date.now() / 1000);  // Conversão para timestamp em segundos
  
      // Envia a transação para o contrato
      const txHash = await contrato.methods.resultado(resultadoData.index, customTimestamp).send({
        from: resultadoData.conta,  // Endereço da conta que está enviando a transação
      });
  
      console.log(`Transação enviada! Hash: ${txHash.transactionHash}`);  // Log da transação
  
      // Aguarda a confirmação da transação na blockchain
      await web3.eth.getTransactionReceipt(txHash.transactionHash);
  
      alert('Resultado definido com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar os dados para a blockchain:', error);
      alert('O evento tempo limite ainda nao foi atingido ou você não é o criador desse evento.');
    }
  
    handleClose();  // Fecha o modal
  };
  
  



  // Função para lidar com o envio da aposta
  const handleApostar = async () => {
    // Aqui você pode usar valorAposta, conta e aposta como dados a serem enviados
    const valorApostaEther = valorAposta;  // Supondo que valorAposta esteja em Ether
    const apostaIndex = apost.id;  // Índice da aposta
    const apostaDescricao = aposta;  // Descrição da aposta
    const contaOrigem = userAccount;  // Endereço da conta que faz a aposta
  
    try {
      // Conecta à rede Ethereum e carrega o contrato
      const web3 = await connectToNetwork();  // Função que conecta à rede
      const contrato = await loadContract(web3, '0x5FbDB2315678afecb367f032d93F642f64180aa3','evento.json');  // Substitua com o endereço correto do contrato
  
      // Converte o valor da aposta de Ether para Wei
      const valorApostaWei = web3.utils.toWei(valorApostaEther.toString(), 'ether');  // Converte para Wei
  
      // Envia a transação para o contrato
      const txHash = await contrato.methods.apostar(apostaIndex, apostaDescricao, valorApostaWei).send({
        from: contaOrigem,  // Endereço da conta que está fazendo a aposta
      });
  
      console.log(`Transação enviada! Hash: ${txHash.transactionHash}`);  // Exibe o hash da transação
  
      // Aguarda a confirmação da transação
      await web3.eth.getTransactionReceipt(txHash.transactionHash);
  
      alert('Aposta realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar a aposta:', error);
      alert('Erro ao tentar realizar a aposta na blockchain.');
    }
  
    handleClose();  // Fecha o modal
  };
  

  return (
    <>

      <Button variant="primary" onClick={handleShow} className="me-2">
        Ver Detalhes/Apostar
      </Button>

      <Button variant="primary" onClick={handleResultado}>
        Encerrar
      </Button>



      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{apost.descricao}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Índice:</strong> {apost.id}</p>
          <p><strong>Criador:</strong> {apost.dono}</p>
          <p><strong>Detalhes:</strong> {apost.detais}</p>

          {/* Campo para valor da aposta */}
          <div>
            <label htmlFor="valorAposta">Valor da Aposta:</label>
            <input
              type="number"
              id="valorAposta"
              name="valorAposta"
              value={valorAposta}
              onChange={handleChange}
              placeholder="Digite o valor da aposta"
            />
          </div>

      
          {/* Campo para aposta de aposta */}
          <div>
            <label htmlFor="aposta">aposta:</label>
            <textarea
              id="aposta"
              name="aposta"
              value={aposta}
              onChange={handleChange}
              placeholder="aposta da aposta"
            />
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleApostar}>
            Apostar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ApostaModal;
