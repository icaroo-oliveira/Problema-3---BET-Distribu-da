// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;



import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract evento is ReentrancyGuard {

    //Mapeando ''locks'' para eventos, usado em funções suscetiveis a falhas
    mapping(uint => bool) private eventoLock;

    //Carteira virtual para o contrato 
    mapping(address => uint256) public carteiras;
    

    struct ApostaInfo {
        string tipoAposta;
        uint256 valor;
    }


    //Como é um evento: 
    struct Eventos_e {
        string descricao;  
        address dono;                           
        uint256 unlockTime;                        
        mapping(address => ApostaInfo) apostas; 
        mapping(string => uint256) tipoAposta;   
        mapping(string => address[]) tipoParaApostadores; 
        uint256 totalApostadoGeral;              
        bool apostaFechada; 
        uint256 id;
        uint256 qntd_apostadores;
    }

    //lista de eventos
    Eventos_e[] public listaDeEventos;

    address public dono_contrato;


    constructor() {
        dono_contrato = msg.sender; //O endereço do criador do contrato como dono
    }



    //Marcando em log que um novo evento foi criada
    event NovoEventoCriado(
        address criador,      
        uint eventoIndex,     
        string descricao              
    );


    
    // Modificador para prevenir reentrância em uma função específica de evento
    modifier nonReentrantEvento(uint eventoIndex) {
        // Verifica se o evento já está bloqueado (em execução) para evitar reentrância
        require(!eventoLock[eventoIndex], "Reentrancia detecetada para esse evento");
        
        // Bloqueia o evento, marcando-o como em execução
        eventoLock[eventoIndex] = true;  
        
        // Executa a função chamada com o modificador
        _;  
        
        // Libera o evento após a execução da função
        eventoLock[eventoIndex] = false; 
}










    

    //Criando um novo evento, descricao e data de termino
    function criarNovoEvento(string memory descricao,uint256 unlockTime) public {

        
        // require(
        //     block.timestamp < unlockTime, //novo
        //     "Unlock time should be in the future"
        // );

        
        Eventos_e storage novoEvento = listaDeEventos.push();
        novoEvento.descricao = descricao;
        novoEvento.dono = msg.sender; //criador do evento
        novoEvento.unlockTime = unlockTime;
        novoEvento.apostaFechada=false; //aposta aberta

        uint eventoIndex = listaDeEventos.length - 1; // Índice da nova aposta
        novoEvento.id=eventoIndex;
        emit NovoEventoCriado(msg.sender, eventoIndex, descricao); // Emitindo um novo evento, que bom!
    }



    event ApostaRealizada(
        address apostador,
        uint eventoIndex, 
        string tipoResultado,
        uint256 valorAposta
    );//marcando em log que uma nova aposta foi realizada

    event Resultado(
        uint eventoIndex,      
        string resultado,       
        address[] vencedores,         
        string descricao               
    );//marcando em log o resultado de um evento





    mapping(address => uint256[]) public bets; // mapeando o endereço com as apostas do cara


    //função para apostar em um evento, recebe o indice do enveto, o tipo da aposta (cara ou coroa) e o valor
    //bloqueia o acesso a essa função, um por vez, devido a possibildiade de reentrancia
    //multiplas pessoas apostados no mesmo evento ao mesmo tempo poderia fazer com que dados se sobrepossem 
    function apostar(uint eventoIndex, string memory tipoResultado, uint256 valorAposta) public nonReentrantEvento(eventoIndex){
        require(eventoIndex < listaDeEventos.length, "Aposta nao encontrada");
        Eventos_e storage evento = listaDeEventos[eventoIndex];

        require(!evento.apostaFechada, "Aposta ja fechada");

        // require(
        //     block.timestamp <= aposta.unlockTime,  //a partir de momento x nao pode mais apostar
        //     "Unlock time should be in the future"
        // );

        require(valorAposta > 0, "Valor da aposta deve ser maior que zero");
        require(bytes(evento.apostas[msg.sender].tipoAposta).length == 0, "Ja realizou uma aposta");

        // Verifica se o usuário tem saldo suficiente na carteira
        require(carteiras[msg.sender] >= valorAposta, "Saldo insuficiente na carteira");

        // Deduz o valor da carteira do usuário
        carteiras[msg.sender] -= valorAposta;
        bets[msg.sender].push(eventoIndex);

        // Atualiza a estrutura da aposta
        ApostaInfo memory novaApostaInfo = ApostaInfo({
            tipoAposta: tipoResultado,
            valor: valorAposta
        });

        evento.apostas[msg.sender] = novaApostaInfo;
        evento.tipoParaApostadores[tipoResultado].push(msg.sender);
        evento.qntd_apostadores++;
        atualizarApostas(evento, tipoResultado, valorAposta);

        emit ApostaRealizada(msg.sender, eventoIndex, tipoResultado, valorAposta);//novo
    }


    //função pra depositar, msg.value é o valor depositado, passado via web3
    function depositar() public payable {
        require(msg.value > 0, "O valor do deposito deve ser maior que zero");
        carteiras[msg.sender] += msg.value;
    }

    //função para sacar
    function sacar(uint256 valor) public nonReentrant {
        require(carteiras[msg.sender] >= valor, "Saldo insuficiente");
        carteiras[msg.sender] -= valor;
        payable(msg.sender).transfer(valor);
    }


    function atualizarApostas(Eventos_e storage evento, string memory tipoResultado, uint256 valor) internal {
        evento.tipoAposta[tipoResultado] += valor;
        evento.totalApostadoGeral += valor;
    }

    


    //função para solicitar resultado, pode ser o dono da aposta se tiver no dia, ou qualquer pessoa depois de um dia do final
    function resultado(uint eventoIndex) public {
        require(eventoIndex < listaDeEventos.length, "Aposta nao encontrada");
        Eventos_e storage evento = listaDeEventos[eventoIndex];

        // Verifica se o evento já foi fechado 
        require(!evento.apostaFechada, "Evento ja fechado");

        // Verifica se o timestamp atual passou do prazo máximo (1 dia após unlockTime), 
        // ou se a pessoa que chamou é o dono da aposta
        uint256 prazoMaximo = evento.unlockTime + 1 days;
        bool podeDistribuir = (block.timestamp >= prazoMaximo || msg.sender == evento.dono);
        require(podeDistribuir, "Somente o dono ou qualquer pessoa apos 1 dia pode encerrar");

        // Verifica se o evento pode ser encerrado (precisa ter passado o unlockTime)
        require(block.timestamp >= evento.unlockTime, "Evento ainda nao pode ser encerrado");

        // Lógica do resultado
        string memory resultado_final = gerarResultado(eventoIndex);

        // Distribuição de prêmios
        distribuirPremios(eventoIndex, evento, resultado_final);

        // Marca a aposta como fechada
        evento.apostaFechada = true;
}



    //Distribuindo os prêmios
    function distribuirPremios(uint eventoIndex, Eventos_e storage evento, string memory resultadoVencedor) internal {
        address[] memory vencedores = evento.tipoParaApostadores[resultadoVencedor];//vencedores 
        uint256 totalVencedores = 0;
        uint256 totalApostadoGeral = evento.totalApostadoGeral;

        uint256 totalverdadeiro = totalApostadoGeral;


        // Calcula o total apostado pelos vencedores
        for (uint256 i = 0; i < vencedores.length; i++) {
        totalVencedores += evento.apostas[vencedores[i]].valor;
        }

        // Calcula 7% do total apostado e envia para o dono do contrato
        uint256 premioDono = (totalApostadoGeral * 7) / 100; // 7% do total apostado
        payable(dono_contrato).transfer(premioDono); // Envia 7% para o dono
        totalApostadoGeral=totalApostadoGeral-premioDono;


        //se existir vencedores:
        if (totalVencedores > 0) {
             // Distribui o prêmio restante para os vencedores
            for (uint256 i = 0; i < vencedores.length; i++) {
                uint256 premio = (evento.apostas[vencedores[i]].valor * totalApostadoGeral) / totalVencedores;
                carteiras[vencedores[i]] += premio; // Adiciona o prêmio ao saldo do vencedor
            }

            emit Resultado(eventoIndex, resultadoVencedor, vencedores, evento.descricao);//emite um evento de resultado do evento

        } else {//se não teve nenhum vencedor, vai devolver o valor para os apostadores(vai ser menos pq o dono do contrato recebeu 7%)

            bytes32 hashedString = keccak256(abi.encodePacked("cara"));
            bytes32 targetHash = keccak256(abi.encodePacked(resultadoVencedor));

            if (hashedString == targetHash) { // para o caso que os perdedores apostaram em ''coroa''
                address[] memory pessoas = evento.tipoParaApostadores["coroa"];
                uint256 totalPorcentagens = 0; // Para verificar a soma de todas as porcentagens
                
                
                // Vetor temporário para armazenar porcentagens de cada apostador
                uint256[] memory porcentagens = new uint256[](pessoas.length);

                // Calcula as porcentagens do valor da aposta de cada apostador sobre o montante total
                for (uint256 i = 0; i < pessoas.length; i++) {
                    uint256 valorApostado = evento.apostas[pessoas[i]].valor;
                    porcentagens[i] = (valorApostado * 100) / totalverdadeiro;
                    totalPorcentagens += porcentagens[i];
                }

                // Distribui o valor restante (o total menos a taxa do dono) proporcionalmente com base nas porcentagens calculadas
                for (uint256 i = 0; i < pessoas.length; i++) {
                    uint256 valorDistribuido = (totalApostadoGeral * porcentagens[i]) / 100;
                    carteiras[pessoas[i]] += valorDistribuido; // Adiciona o valor ao saldo do apostador
                 }

                emit Resultado(eventoIndex, "Sem vencedores, na lista reembolsados",pessoas, evento.descricao);

            }else{//mesma coisa agora o casos q todos mundo perdeu e era "cara"

                address[] memory pessoas = evento.tipoParaApostadores["cara"];
                uint256 totalPorcentagens = 0; // Para verificar a soma de todas as porcentagens
                
                
                // Vetor temporário para armazenar porcentagens de cada apostador
                uint256[] memory porcentagens = new uint256[](pessoas.length);

                // Calcula as porcentagens de cada apostador
                for (uint256 i = 0; i < pessoas.length; i++) {
                    uint256 valorApostado = evento.apostas[pessoas[i]].valor;
                    porcentagens[i] = (valorApostado * 100) / totalverdadeiro;
                    totalPorcentagens += porcentagens[i];
                }

                // Distribui o valor restante proporcionalmente com base nas porcentagens calculadas
                for (uint256 i = 0; i < pessoas.length; i++) {
                    uint256 valorDistribuido = (totalApostadoGeral * porcentagens[i]) / 100;
                    carteiras[pessoas[i]] += valorDistribuido; // Adiciona o valor ao saldo do apostador
                }

                emit Resultado(eventoIndex, "Sem vencedores, na lista reembolsados",pessoas, evento.descricao);//emitindo evento

                
            }

           
            
            
        }

       
    }



    //funcao para gerar o resultado aleatoriamente, cara ou coroa?!
    function gerarResultado(uint eventoIndex) internal view     returns (string memory) {
        Eventos_e storage evento = listaDeEventos[eventoIndex];
        require(!evento.apostaFechada, "Resultado ja publicado");

        // Gera um número pseudo-aleatório usando o hash do bloco
        uint resultadoRandomico = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, eventoIndex))) % 2;

        string memory valor = resultadoRandomico == 0 ? "cara" : "coroa";

        return valor;
    }



    struct EventoSimplificado {
        uint256 id;
        string descricao;
        address dono;
        uint256 unlockTime;
        uint256 totalApostadoGeral;
        uint256 oddsCara;
        uint256 oddsCoroa;
    }



    struct Eventoenvia {
        uint256 id;
        string descricao;
        address dono;
        uint256 unlockTime;
        uint256 valor_apostado;
        string tipo;
        uint256 oddsCara;
        uint256 oddsCoroa;
    }





    //pega os eventos abertos
    function getEventosAbertos() public view returns (EventoSimplificado[] memory) {
    // Cria um array temporário
        EventoSimplificado[] memory eventosAbertosTemp = new EventoSimplificado[](listaDeEventos.length);
        uint256 count = 0;

        for (uint256 i = 0; i < listaDeEventos.length; i++) {
            if (!listaDeEventos[i].apostaFechada) {
                Eventos_e storage evento = listaDeEventos[i];

                // Calcula as odds para "cara" e "coroa"
                uint256 oddsCara = evento.tipoAposta["cara"] > 0
                    ? (evento.totalApostadoGeral * 100) / evento.tipoAposta["cara"]
                    : 0;

                uint256 oddsCoroa = evento.tipoAposta["coroa"] > 0
                    ? (evento.totalApostadoGeral * 100) / evento.tipoAposta["coroa"]
                    : 0;

                // Adiciona a aposta à lista simplificada
                eventosAbertosTemp[count] = EventoSimplificado({
                    id: evento.id,
                    descricao: evento.descricao,
                    dono: evento.dono,
                    unlockTime: evento.unlockTime,
                    totalApostadoGeral: evento.totalApostadoGeral,
                    oddsCara: oddsCara,
                    oddsCoroa: oddsCoroa
                });
                count++;
            }
        }

    // Redimensiona o array para o número real de eventos abertos
        EventoSimplificado[] memory eventosAbertos = new EventoSimplificado[](count);
        for (uint256 i = 0; i < count; i++) {
            eventosAbertos[i] = eventosAbertosTemp[i];
        }

    return eventosAbertos;
    }



    //apostas do caboclo
    function getMinhasApostas() public view returns (Eventoenvia[] memory) {
        // Recupera os índices das apostas em que o msg.sender participa
        uint256[] memory minhasApostasIndices = bets[msg.sender];
        uint256 count = minhasApostasIndices.length;

        // Cria um array temporário para armazenar as apostas simplificadas
        Eventoenvia[] memory minhasApostas = new Eventoenvia[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 eventoIndex = minhasApostasIndices[i];
            Eventos_e storage evento = listaDeEventos[eventoIndex];

            // Calcula as odds para "cara" e "coroa"
            uint256 oddsCara = evento.tipoAposta["cara"] > 0
                ? (evento.totalApostadoGeral * 100) / evento.tipoAposta["cara"]
                : 0;

            uint256 oddsCoroa = evento.tipoAposta["coroa"] > 0
                ? (evento.totalApostadoGeral * 100) / evento.tipoAposta["coroa"]
                : 0;

            // Adiciona os dados ao array simplificado
            minhasApostas[i] = Eventoenvia({
                id: evento.id,
                descricao: evento.descricao,
                dono: evento.dono,
                unlockTime: evento.unlockTime,
                valor_apostado: evento.apostas[enderecoApostador].valor,
                tipo:evento.apostas[enderecoApostador].tipoAposta,
                oddsCara: oddsCara,
                oddsCoroa: oddsCoroa
            });
        }

        return minhasApostas;
    }



    }

    

