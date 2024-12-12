// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;






contract evento {



    struct ApostaInfo {
        string tipoAposta;
        uint256 valor;
    }

    struct Aposta {
    string descricao;                         
    address dono;                             
    uint unlockTime;                         
    mapping(address => ApostaInfo) apostas; 
    mapping(string => uint256) tipoAposta;   
    mapping(string => address[]) tipoParaApostadores; // Apostadores por tipo de aposta
    uint256 totalApostadoGeral;              // Valor total apostado na aposta
    bool apostaFechada;
    }


    Aposta[] public listaDeApostas;

    event NovaApostaCriada(address criador, uint apostaIndex, string descricao);
    event Resultado(uint apostaIndex, string resultado,address[] vencedores,string descricao);



  


    //novo unloctime
    function criarNovaAposta(string memory descricao) public {

        uint unlockTime = block.timestamp + 5 minutes; // 5 minutos no futuro (teste)

        require(
            block.timestamp < unlockTime, //novo
            "Unlock time should be in the future"
        );

        
        Aposta storage novaAposta = listaDeApostas.push();
        novaAposta.descricao = descricao;
        novaAposta.dono = msg.sender;
        novaAposta.unlockTime = unlockTime;
        novaAposta.apostaFechada=false;

        uint apostaIndex = listaDeApostas.length - 1; // Índice da nova aposta
        emit NovaApostaCriada(msg.sender, apostaIndex, descricao); // Emitindo o índice
    }



    function apostar(uint apostaIndex, string memory tipoResultado) public payable {


         
        require(apostaIndex < listaDeApostas.length, "Aposta nao encontrada");
        Aposta storage aposta = listaDeApostas[apostaIndex];

        require(!aposta.apostaFechada, "Aposta ja fechada");

        require(
            block.timestamp < aposta.unlockTime, //novo
            "Unlock time should be in the future"
        );


        require(msg.value > 0, "Valor da aposta deve ser maior que zero");
        require(bytes(aposta.apostas[msg.sender].tipoAposta).length == 0, "Ja realizou uma aposta");

        ApostaInfo memory novaApostaInfo = ApostaInfo({
            tipoAposta: tipoResultado,
            valor: msg.value
        });

        aposta.apostas[msg.sender] = novaApostaInfo;
        aposta.tipoParaApostadores[tipoResultado].push(msg.sender);
        atualizarApostas(aposta, tipoResultado, msg.value);
    }

    function atualizarApostas(Aposta storage aposta, string memory tipoResultado, uint256 valor) internal {
        aposta.tipoAposta[tipoResultado] += valor;
        aposta.totalApostadoGeral += valor;
    }

    function calcularOddsDinamicas(uint apostaIndex, string memory tipoResultado) public view returns (uint256) {
        require(apostaIndex < listaDeApostas.length, "Aposta nao encontrada");
        Aposta storage aposta = listaDeApostas[apostaIndex];
        require(aposta.tipoAposta[tipoResultado] > 0, "Nenhuma aposta neste resultado");

        uint256 valorNoResultado = aposta.tipoAposta[tipoResultado];
        uint256 odds = (aposta.totalApostadoGeral * 100) / valorNoResultado;
        return odds;
    }

    function resultado(uint apostaIndex) public {
        require(apostaIndex < listaDeApostas.length, "Aposta nao encontrada");
        Aposta storage aposta = listaDeApostas[apostaIndex];

        require(!aposta.apostaFechada, "Aposta ja fechada");


        require(block.timestamp >= aposta.unlockTime, "Aposta ainda nao terminou");


        string memory resultado_final = gerarResultado(apostaIndex);
        

        distribuirPremios(apostaIndex,aposta, resultado_final, address(this).balance);
        aposta.apostaFechada=true;


    }

    function distribuirPremios(uint apostaIndex,Aposta storage aposta, string memory resultadoVencedor, uint256 premioTotal) internal {
        address[] memory vencedores = aposta.tipoParaApostadores[resultadoVencedor];
        uint256 totalVencedores = 0;

        for (uint256 i = 0; i < vencedores.length; i++) {
            totalVencedores += aposta.apostas[vencedores[i]].valor;
        }

        require(totalVencedores > 0, "Nao ha vencedores com apostas");

        for (uint256 i = 0; i < vencedores.length; i++) {
            uint256 premio = (aposta.apostas[vencedores[i]].valor * premioTotal) / totalVencedores;
            payable(vencedores[i]).transfer(premio);
        }

        emit Resultado(apostaIndex,resultadoVencedor,vencedores,aposta.descricao);

    }



        function gerarResultado(uint apostaIndex) internal view     returns (string memory) {
            Aposta storage aposta = listaDeApostas[apostaIndex];
            require(!aposta.apostaFechada, "Resultado ja publicado");

            // Gera um número pseudo-aleatório usando o hash do bloco
            uint resultadoRandomico = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, apostaIndex))) % 2;

            string memory valor = resultadoRandomico == 0 ? "cara" : "coroa";

            return valor;
        }









    function getApostas() public view returns (
    string[] memory, 
    address[] memory, 
    uint[] memory, 
    uint256[] memory
    ) {
        uint totalApostas = listaDeApostas.length;

        string[] memory descricoes = new string[](totalApostas);
        address[] memory donos = new address[](totalApostas);
        uint[] memory unlockTimes = new uint[](totalApostas);
        uint256[] memory totaisApostados = new uint256[](totalApostas);

        for (uint i = 0; i < totalApostas; i++) {
            Aposta storage aposta = listaDeApostas[i];
            descricoes[i] = aposta.descricao;
            donos[i] = aposta.dono;
            unlockTimes[i] = aposta.unlockTime;
            totaisApostados[i] = aposta.totalApostadoGeral;
        }

        return (descricoes, donos, unlockTimes, totaisApostados);
    }



    }

    

