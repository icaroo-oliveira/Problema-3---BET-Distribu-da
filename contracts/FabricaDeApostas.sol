// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
import "./Aposta.sol";  
contract FabricaDeApostas {
    Aposta[] public apostas;

    function criarNovaAposta(string memory descricao) public {
        uint unlockTime = block.timestamp + 5 minutes; // 5 minutos no futuro (teste)
        Aposta novaAposta = new Aposta(msg.sender, descricao,unlockTime);



        //emitir o evento NovaApostaCriada do contrato Aposta
        // emit Aposta.NovaApostaCriada(msg.sender, address(novaAposta), descricao);
        apostas.push(novaAposta);
    }

    function listarApostas() public view returns (Aposta[] memory) {
        return apostas;
    }
}
