// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract Aposta {
    string public descricao; 
    address public dono;
    uint256 public numeroVencedor;
    uint public unlockTime;

    mapping(address => ApostaInfo) public apostas;

    mapping(string => uint256) public tipoAposta;

    mapping(string => address[]) public tipoParaApostadores;

    uint256 public totalApostadoGeral; //valor total apostado no evento


    struct ApostaInfo {
        string tipoAposta;
        uint256 valor;
    }

    

    //evento para registrar o resultado
    event Resultado(string descric, string result);

    constructor(address criador, string memory _descricao, uint _unlockTime) {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        dono = criador;
        descricao = _descricao;
    }

    //atualiza as informações de apostas
    function atualizarApostas(string memory tipoResultado, uint256 valor) internal {
        tipoAposta[tipoResultado] += valor;
        totalApostadoGeral += valor;
    }

    //calcula odds dinâmicas
    function calcularOddsDinamicas(string memory tipoResultado) public view returns (uint256) {
        require(tipoAposta[tipoResultado] > 0, "Nenhuma aposta neste resultado");
        uint256 valorNoResultado = tipoAposta[tipoResultado];
        uint256 odds = (totalApostadoGeral * 100) / valorNoResultado; 
        return odds;
    }



    //fazer uma aposta
    function apostar(string memory tipoResultado) public payable {
        require(msg.value > 0, "Valor da aposta deve ser maior que zero");

        require(bytes(apostas[msg.sender].tipoAposta).length == 0, "Ja realizou uma aposta");


        ApostaInfo memory novaAposta = ApostaInfo({
            tipoAposta: tipoResultado,
            valor: msg.value
        });

        //registrar a aposta e atualizar os valores
        apostas[msg.sender] = novaAposta;

        tipoParaApostadores[tipoResultado].push(msg.sender);

        atualizarApostas(tipoResultado, msg.value);
    }




    //finalizar a aposta e distribuir prêmio
    function resultado(string memory resultadoVencedor) public {

        require(block.timestamp >= unlockTime, "Aposta ainda nao terminou");
        
        emit Resultado(descricao, resultadoVencedor);

        distribuirPremios(resultadoVencedor, address(this).balance);
    }


    //função para distribuir os prêmios proporcionalmente ao valor apostado pelos vencedores
    function distribuirPremios(string memory resultadoVencedor, uint256 premioTotal) internal {

        address[] memory vencedores = tipoParaApostadores[resultadoVencedor];

        uint256 totalVencedores = 0;
        for (uint256 i = 0; i < vencedores.length; i++) {
            totalVencedores += apostas[vencedores[i]].valor;
        }

        require(totalVencedores > 0, "Nao ha vencedores com apostas");

        //distribuir o prêmio proporcionalmente ao valor apostado
        for (uint256 i = 0; i < vencedores.length; i++) {
            uint256 premio = (apostas[vencedores[i]].valor * premioTotal) / totalVencedores;
            payable(vencedores[i]).transfer(premio);
        }
    }


    //função para verificar o saldo do contrato
    function saldoContrato() public view returns (uint256) {
        return address(this).balance;
    }

    //função para obter o endereço do contrato
    function obterEnderecoContrato() public view returns (address) {
        return address(this);
    }
}







