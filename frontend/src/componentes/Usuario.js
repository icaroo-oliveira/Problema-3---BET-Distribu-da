import React, { useState,useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AccountMenu from "./AccountMenu.js";
import Balance from "./Balance.js";
import Actions from "./Actions.js";
import { ethers } from "ethers";
import "./Usuario.css";
const { connectToNetwork, loadContract } = require('../web3_utilidades');  // Importa as funções

function Usuario() {
  
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]); //contas 
  const [balance, setBalance] = useState(null); // Saldo inicial
  const [balance_wallet, setBalance_w] = useState(null); // Saldo inicial
  const [showModal, setShowModal] = useState(false); // Controle do modal




  // Função para carregar as contas do Hardhat
  const loadAccounts = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const loadedAccounts = await provider.listAccounts();
      
      // endereços 
      const accountAddresses = loadedAccounts.map((account) => 
        typeof account === "string" ? account : account.address
      );
      
      setAccounts(accountAddresses); // Salva apenas os endereços no estado
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
    }
  };


  // Função para carregar o saldo de uma conta
  const loadBalance = async (accountAddress) => {
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const balanceWei = await provider.getBalance(accountAddress);
      const balanceEth = ethers.formatEther(balanceWei); // Converte de wei para ETH
      setBalance(balanceEth); // Atualiza o estado com o saldo da conta
      consultarSaldoCarteira(accountAddress);
    } catch (error) {
      console.error("Erro ao carregar o saldo:", error);
    }
  };




  
  // Funcao para consultar o saldo da carteira (dentro do contrato)
  const consultarSaldoCarteira = async (endereco) => {
    if (endereco) {
      try {
        
        // Conecta à rede e carrega o contrato
        const web3 = await connectToNetwork();  // Função que conecta à rede
        if (!web3.utils.isAddress(endereco)) {
          alert("Endereço inválido!");
          return;
        }
        const contrato = await loadContract(web3, "0x5FbDB2315678afecb367f032d93F642f64180aa3", './evento.json');  //endereco do contrato e ABI
  
        // Chama a função do contrato para obter o saldo em Wei
        const saldoWei = await contrato.methods.carteiras(endereco).call();
  
        // Converte o saldo de Wei para Ether
        const saldo = web3.utils.fromWei(saldoWei, 'ether');
  
        // Atualiza o estado do saldo
        setBalance_w(saldo);
      } catch (error) {
        console.error("Erro ao consultar o saldo no contrato:", error);
        alert("Houve um erro ao consultar o saldo no contrato.");
      }
    } else {
      alert("Endereço inválido!");
    }
  };
  

  // Função para depósito no contrato/carteira
  const handleDeposito = async () => {
    const valorDeposito = prompt("Digite o valor a depositar:");
    
    if (valorDeposito) {
      const deposito = parseFloat(valorDeposito);
  
      if (isNaN(deposito) || deposito <= 0) {
        alert("Valor inválido!");
      } else {
        try {
          // Conecta à rede e carrega o contrato
          const web3 = await connectToNetwork();  // Função que conecta à rede
          const contrato = await loadContract(web3, '0x5FbDB2315678afecb367f032d93F642f64180aa3', './evento.json');  // Substitua com o endereço correto do contrato
  
          // Converte o valor de Ether para Wei
          const valorDepositoWei = web3.utils.toWei(deposito.toString(), 'ether');
  
          // Envia a transação para o contrato com o valor do depósito
          const txHash = await contrato.methods.depositar().send({
            from: selectedAccount,  // Conta que está fazendo o depósito
            value: valorDepositoWei,  // Valor em Wei
          });
  
          // spera confirmação da transação
          await web3.eth.getTransactionReceipt(txHash.transactionHash);
          
          loadBalance(selectedAccount);  // Atualiza o saldo
          alert(`Depósito de ${deposito} realizado com sucesso!`);
        } catch (error) {
          console.error(error);
          alert("Houve um erro ao realizar o depósito.");
        }
      }
    }
  };
  

  // Funcao para saque tira do contrato e passa para conta
const handleSaque = async () => {
  const valorSaque = prompt("Digite o valor a sacar:");
  
  if (valorSaque) {
    const saque = parseFloat(valorSaque);

    if (isNaN(saque) || saque <= 0) {
      alert("Valor inválido!");
    } else if (saque > balance) {
      alert("Saldo insuficiente!");
    } else {
      try {
        // Conecta à rede e carrega o contrato
        const web3 = await connectToNetwork();  // Função que conecta à rede
        const contrato = await loadContract(web3, '0x5FbDB2315678afecb367f032d93F642f64180aa3', './evento.json'); 

        // Converte o valor de Ether para Wei
        const valorSaqueWei = web3.utils.toWei(saque.toString(), 'ether');

        // Envia a transação de saque para o contrato
        const txHash = await contrato.methods.sacar(valorSaqueWei).send({
          from: selectedAccount,  // Conta que está fazendo o saque
        });

        // Aguarda a confirmação da transação
        await web3.eth.getTransactionReceipt(txHash.transactionHash);

        loadBalance(selectedAccount);  // Atualiza o saldo
        alert(`Saque de ${saque} realizado com sucesso!`);
      } catch (error) {
        console.error(error);
        alert("Houve um erro ao realizar o saque.");
      }
    }
  }
};

  

  const handleEventos = () => {
    alert("Função de mais ainda em desenvolvimento!");
  };


  useEffect(() => {
    loadAccounts(); // Carregar as contas ao montar o componente
    setShowModal(true);
  }, []);
  


  useEffect(() => {
    if (selectedAccount) {
      loadBalance(selectedAccount); // Carrega o saldo quando a conta selecionada muda
    }
  }, [selectedAccount]);


    useEffect(() => {
    if (selectedAccount) {
      localStorage.setItem("selectedAccount", selectedAccount);
    }
  }, [selectedAccount]);


  
  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) {
      setSelectedAccount(savedAccount);
    }
  }, []);


  
  return (
  
    <div className="account-box">
      {/* Menu Suspenso */}
      <AccountMenu
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />

      {/* Saldo */}
      <Balance balance={balance} balance_wallet={balance_wallet} />

      {/* Ações */}
      <Actions
        onDeposito={handleDeposito}
        onSaque={handleSaque}
        onTroca={handleEventos}
        selectedAccount={selectedAccount}
      />
    </div>
  );
}

export default Usuario;



























