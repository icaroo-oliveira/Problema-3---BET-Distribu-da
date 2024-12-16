// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;



import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract evento is ReentrancyGuard {

    
    mapping(uint => bool) private eventoLock;//novo


    mapping(address => uint256) public carteiras;
    

    struct ApostaInfo {
        string tipoAposta;
        uint256 valor;
    }

    struct Aposta {
        string descricao;  
        address dono;                           
        uint256 unlockTime;                        
        mapping(address => ApostaInfo) apostas; 
        mapping(string => uint256) tipoAposta;   
        mapping(string => address[]) tipoParaApostadores; 
        uint256 totalApostadoGeral;              
        bool apostaFechada; 
        uint256 id;
    }


    Aposta[] public listaDeApostas;


    event NovaApostaCriada(
        address criador,      
        uint apostaIndex,     
        string descricao              
    );


    modifier nonReentrantEvento(uint eventoIndex) {
        require(!eventoLock[eventoIndex], "Reentrancy detected for this event");
        eventoLock[eventoIndex] = true;  // Bloqueia o evento específico
        _;
        eventoLock[eventoIndex] = false; // Libera o evento após execução
    }









    

    //novo unloctime
    function criarNovaAposta(string memory descricao,uint256 unlockTime) public {

        
        // require(
        //     block.timestamp < unlockTime, //novo
        //     "Unlock time should be in the future"
        // );

        
        Aposta storage novaAposta = listaDeApostas.push();
        novaAposta.descricao = descricao;
        novaAposta.dono = msg.sender;
        novaAposta.unlockTime = unlockTime;
        novaAposta.apostaFechada=false;

        uint apostaIndex = listaDeApostas.length - 1; // Índice da nova aposta
        novaAposta.id=apostaIndex;
        emit NovaApostaCriada(msg.sender, apostaIndex, descricao); // Emitindo o índice
    }



    event ApostaRealizada(
        address apostador,
        uint apostaIndex, 
        string tipoResultado,
        uint256 valorAposta
    );//novo

    event Resultado(
        uint apostaIndex,      
        string resultado,       
        address[] vencedores,         
        string descricao               
    );//novo





    mapping(address => uint256[]) public bets;

    function apostar(uint apostaIndex, string memory tipoResultado, uint256 valorAposta) public nonReentrantEvento(apostaIndex){
        require(apostaIndex < listaDeApostas.length, "Aposta nao encontrada");
        Aposta storage aposta = listaDeApostas[apostaIndex];

        require(!aposta.apostaFechada, "Aposta ja fechada");

        // require(
        //     block.timestamp <= aposta.unlockTime,  //block.timestamp < aposta.unlockTime
        //     "Unlock time should be in the future"
        // );

        require(valorAposta > 0, "Valor da aposta deve ser maior que zero");
        require(bytes(aposta.apostas[msg.sender].tipoAposta).length == 0, "Ja realizou uma aposta");

        // Verifica se o usuário tem saldo suficiente na carteira
        require(carteiras[msg.sender] >= valorAposta, "Saldo insuficiente na carteira");

        // Deduz o valor da carteira do usuário
        carteiras[msg.sender] -= valorAposta;
        bets[msg.sender].push(apostaIndex);

        // Atualiza a estrutura da aposta
        ApostaInfo memory novaApostaInfo = ApostaInfo({
            tipoAposta: tipoResultado,
            valor: valorAposta
        });

        aposta.apostas[msg.sender] = novaApostaInfo;
        aposta.tipoParaApostadores[tipoResultado].push(msg.sender);

        atualizarApostas(aposta, tipoResultado, valorAposta);

        emit ApostaRealizada(msg.sender, apostaIndex, tipoResultado, valorAposta);//novo
    }



    function depositar() public payable {
        require(msg.value > 0, "O valor do deposito deve ser maior que zero");
        carteiras[msg.sender] += msg.value;
    }

    // Função para sacar fundos
    function sacar(uint256 valor) public nonReentrant {
        require(carteiras[msg.sender] >= valor, "Saldo insuficiente");
        carteiras[msg.sender] -= valor;
        payable(msg.sender).transfer(valor);
    }


    function atualizarApostas(Aposta storage aposta, string memory tipoResultado, uint256 valor) internal {
        aposta.tipoAposta[tipoResultado] += valor;
        aposta.totalApostadoGeral += valor;
    }

    


    function resultado(uint apostaIndex, uint customTimestamp) public {
        require(apostaIndex < listaDeApostas.length, "Aposta nao encontrada");
        Aposta storage aposta = listaDeApostas[apostaIndex];
        require(!aposta.apostaFechada, "Aposta ja fechada");
        

        // Verifica se o timestamp fornecido é maior ou igual ao unlockTime
        require(
            block.timestamp >= aposta.unlockTime,
            "Evento ainda nao pode ser encerrado"
        );

        // Logica do resultado
        string memory resultado_final = gerarResultado(apostaIndex);
        
        // Distribuição de prêmios
        distribuirPremios(apostaIndex, aposta, resultado_final);
        aposta.apostaFechada = true;
    }


  


    function distribuirPremios(uint apostaIndex, Aposta storage aposta, string memory resultadoVencedor) internal {
        address[] memory vencedores = aposta.tipoParaApostadores[resultadoVencedor];
        uint256 totalVencedores = 0;

        // Calcula o total apostado pelos vencedores
        for (uint256 i = 0; i < vencedores.length; i++) {
            totalVencedores += aposta.apostas[vencedores[i]].valor;
        }

        require(totalVencedores > 0, "Nao ha vencedores com apostas");

        // Distribui os prêmios para as carteiras dos vencedores
        for (uint256 i = 0; i < vencedores.length; i++) {
            uint256 premio = (aposta.apostas[vencedores[i]].valor * aposta.totalApostadoGeral) / totalVencedores;
            carteiras[vencedores[i]] += premio; // Adiciona o prêmio ao saldo do vencedor
        }

        emit Resultado(apostaIndex, resultadoVencedor, vencedores, aposta.descricao);
}


    function gerarResultado(uint apostaIndex) internal view     returns (string memory) {
        Aposta storage aposta = listaDeApostas[apostaIndex];
        require(!aposta.apostaFechada, "Resultado ja publicado");

        // Gera um número pseudo-aleatório usando o hash do bloco
        uint resultadoRandomico = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, apostaIndex))) % 2;

        string memory valor = resultadoRandomico == 0 ? "cara" : "coroa";

        return valor;
    }



















    struct ApostaSimplificada {
        uint256 id;
        string descricao;
        address dono;
        uint256 unlockTime;
        uint256 totalApostadoGeral;
        uint256 oddsCara;
        uint256 oddsCoroa;
    }


    // function calcularOddsDinamicas(uint apostaIndex, string memory tipoResultado) public view returns (uint256) {
    //     require(apostaIndex < listaDeApostas.length, "Aposta nao encontrada");
    //     Aposta storage aposta = listaDeApostas[apostaIndex];
    //     require(aposta.tipoAposta[tipoResultado] > 0, "Nenhuma aposta neste resultado");

    //     uint256 valorNoResultado = aposta.tipoAposta[tipoResultado];
    //     uint256 odds = (aposta.totalApostadoGeral * 100) / valorNoResultado;
    //     return odds;
    // }



    function getApostasAbertas() public view returns (ApostaSimplificada[] memory) {
    // Cria um array temporário
        ApostaSimplificada[] memory apostasAbertasTemp = new ApostaSimplificada[](listaDeApostas.length);
        uint256 count = 0;

        for (uint256 i = 0; i < listaDeApostas.length; i++) {
            if (!listaDeApostas[i].apostaFechada) {
                Aposta storage aposta = listaDeApostas[i];

                // Calcula as odds para "cara" e "coroa"
                uint256 oddsCara = aposta.tipoAposta["cara"] > 0
                    ? (aposta.totalApostadoGeral * 100) / aposta.tipoAposta["cara"]
                    : 0;

                uint256 oddsCoroa = aposta.tipoAposta["coroa"] > 0
                    ? (aposta.totalApostadoGeral * 100) / aposta.tipoAposta["coroa"]
                    : 0;

                // Adiciona a aposta à lista simplificada
                apostasAbertasTemp[count] = ApostaSimplificada({
                    id: aposta.id,
                    descricao: aposta.descricao,
                    dono: aposta.dono,
                    unlockTime: aposta.unlockTime,
                    totalApostadoGeral: aposta.totalApostadoGeral,
                    oddsCara: oddsCara,
                    oddsCoroa: oddsCoroa
                });
                count++;
            }
        }

    // Redimensiona o array para o número real de apostas abertas
        ApostaSimplificada[] memory apostasAbertas = new ApostaSimplificada[](count);
        for (uint256 i = 0; i < count; i++) {
            apostasAbertas[i] = apostasAbertasTemp[i];
        }

    return apostasAbertas;
    }



    function getMinhasApostas() public view returns (ApostaSimplificada[] memory) {
        // Recupera os índices das apostas em que o msg.sender participa
        uint256[] memory minhasApostasIndices = bets[msg.sender];
        uint256 count = minhasApostasIndices.length;

        // Cria um array temporário para armazenar as apostas simplificadas
        ApostaSimplificada[] memory minhasApostas = new ApostaSimplificada[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 apostaIndex = minhasApostasIndices[i];
            Aposta storage aposta = listaDeApostas[apostaIndex];

            // Calcula as odds para "cara" e "coroa"
            uint256 oddsCara = aposta.tipoAposta["cara"] > 0
                ? (aposta.totalApostadoGeral * 100) / aposta.tipoAposta["cara"]
                : 0;

            uint256 oddsCoroa = aposta.tipoAposta["coroa"] > 0
                ? (aposta.totalApostadoGeral * 100) / aposta.tipoAposta["coroa"]
                : 0;

            // Adiciona os dados ao array simplificado
            minhasApostas[i] = ApostaSimplificada({
                id: aposta.id,
                descricao: aposta.descricao,
                dono: aposta.dono,
                unlockTime: aposta.unlockTime,
                totalApostadoGeral: aposta.totalApostadoGeral,
                oddsCara: oddsCara,
                oddsCoroa: oddsCoroa
            });
        }

        return minhasApostas;
    }




    }

    

