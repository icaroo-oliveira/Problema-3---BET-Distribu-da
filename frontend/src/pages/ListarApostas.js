import React, { useEffect, useState } from 'react';
import '../styles/ListarApostas.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ApostaModal from './modal.js';
import Usuario from '../componentes/Usuario.js';
import { FaUserCircle } from 'react-icons/fa';
import Eventcar from './CartaoEvento.js';
const { connectToNetwork, loadContract } = require('../web3_utilidades.js');  // Importa as funções


function ListarApostas() {
  const [apostas, setApostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);

  const [descricao, setDescricao] = useState('');
  const [valorAposta, setValorAposta] = useState('');
  const [endereco, setEndereco] = useState('');


  // Sempre tenta dar fetch nos eventos atuais (eventos que estão abertos)
  useEffect(() => {
    async function fetchApostas() {
      try {
        // Conectando à rede Ethereum usando a função connectToNetwork
        const web3 = await connectToNetwork();  // Conecta à rede Ethereum
        
        // Carregando o contrato inteligente usando a função loadContract
        const contrato = await loadContract(web3, '0x5FbDB2315678afecb367f032d93F642f64180aa3','evento.json'); // Substitua com o endereço e caminho correto do contrato
  
        // Obtendo as eventos abertos do contrato
        const apostasAbertas = await contrato.methods.getEventosAbertos().call();
  
        // Formatando os eventos abertos para exibição
        const listaApostas = apostasAbertas.map(aposta => ({
          id: aposta[0],
          descricao: aposta[1],
          dono: aposta[2],
          unlockTime: aposta[3],
          totalApostadoGeral: Number(aposta[4]),
          oddsCara: Number(aposta[5]),
          oddsCoroa: Number(aposta[6]),
        }));
  
        setApostas(listaApostas);  // Atualiza o estado com as apostas abertas
        setLoading(false);  // Finaliza o carregamento
      } catch (error) {
        console.error('Erro ao buscar apostas abertas:', error);
        setLoading(false);  // Finaliza o carregamento mesmo em caso de erro
      }
    }
    fetchApostas();  // Chama a função para buscar as apostas abertas diretamente da blockchain
  }, []);  // O efeito é executado uma vez quando o componente for montado
  
  const handleCreateAposta = () => {
    const novaAposta = { descricao, valorAposta, endereco };
    console.log('Nova aposta:', novaAposta);
    alert('Nova aposta criada!');
    setShowCreateModal(false);
  };

  return (
    <div className="container">
      {/* Ícone de usuário */}
      <div className="user-icon" onClick={() => setShowUsuarioModal(true)}>
        <FaUserCircle size={40} />
      </div>

      {/* Linha horizontal para separar seção */}
      <hr className="section-divider" />

      {/* Conteúdo da página */}
      <h2 className="titulo">Lista de Eventos</h2>
      {loading ? (
        <div className="loading-container">
          <p className="loading-text">Carregando...</p>
        </div>
      ) : (
        <div>
          {apostas.length > 0 ? (
            <div className="apostas-container">
              <Eventcar />
              {apostas.map((aposta, index) => (
                <div className="aposta-card" key={index}>
                  <h3>Descrição: {aposta.descricao}</h3>
                  <p><strong>Índice:</strong> {aposta.id}</p>
                  <p><strong>Criador:</strong> {aposta.dono}</p>
                  <p><strong>Data de término:</strong> {aposta.unlockTime}</p>
                  <p><strong>Total apostado:</strong> {aposta.totalApostadoGeral}</p>
                  <p><strong>Odd-cara:</strong> {aposta.oddsCara/100}</p>
                  <p><strong>Odd-coroa:</strong> {aposta.oddsCoroa/100}</p>
                  <ApostaModal apost={aposta} />
                </div>
              ))} 
            </div>
          ) : (
            <div>
              <p className="no-apostas">Não há apostas disponíveis.</p>
              <Eventcar />
            </div>
          )}
        </div>
      )}

      {/* Modal para criar nova aposta */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Nova Aposta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição da aposta"
            />
          </div>
          <div>
            <label>Valor da Aposta:</label>
            <input
              type="number"
              value={valorAposta}
              onChange={(e) => setValorAposta(e.target.value)}
              placeholder="Digite o valor da aposta"
            />
          </div>
          <div>
            <label>Endereço:</label>
            <textarea
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleCreateAposta}>
            Criar Aposta
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Modal*/}
      <Modal show={showUsuarioModal} onHide={() => setShowUsuarioModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Conta de Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Usuario /> {/* usuario modal */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUsuarioModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default ListarApostas;

