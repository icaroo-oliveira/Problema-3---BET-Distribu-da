<h1 align="center"> BET Distribuída: Sistema de Apostas Descentralizado</h1>

## Introdução
<div align="justify"> 

Com o avanço da tecnologia e a ampla disseminação da internet, as plataformas de apostas online tornaram-se amplamente populares, possibilitando que usuários ao redor do mundo apostem em uma variedade de eventos, desde esportes até simulações computacionais. Entretanto, o modelo tradicional, que depende de intermediários centralizados, levanta questões relacionadas à transparência, controle, e possíveis intervenções governamentais.

Sabendo dessas problemáticas, o sistema desenvolvido permite que os usuários cadastrem eventos, realizem apostas e acompanhem resultados de maneira segura e verificável. Além disso, implementa funcionalidades para gerenciamento de créditos e históricos de apostas, assegurando que somente usuários com saldo suficiente possam participar. Esta abordagem descentralizada é sustentada por mecanismos que garantem a integridade dos dados e a equidade nos resultados, fortalecendo a confiança entre os participantes.

O projeto em sua completude apresenta o desenvolvimento de um sistema de apostas online descentralizado, baseado em tecnologias de ledger distribuído. Para isso, o uso de tecnologias e ferramentas como Solidity, Hardhat, Ganache e Web3, foram de vital importância para o desenvolvimento da solução, contribuindo ativamente para a formação de um ambiente eficiente para o desenvolvimento da aplicação.

## Fundamentação Teórica

Para o desenvolvimento de um sistema de apostas online descentralizado, foi essencial explorar e compreender uma série de conceitos fundamentais. Entre as principais questões abordadas estão: como funciona um sistema de ledger distribuído, os princípios por trás do funcionamento de plataformas de apostas, e as melhores práticas para garantir transparência e segurança aos usuários.

Neste tópico, são apresentados os conceitos teóricos que embasaram o projeto, fornecendo as respostas para essas e outras perguntas, bem como direcionando as escolhas técnicas e arquiteturais adotadas na solução.

**Ledger distribuído**

Um ledger distribuído é um banco de dados descentralizado mantido e atualizado de forma colaborativa por diversos participantes em uma rede. Ele registra transações ou eventos de maneira imutável, transparente e segura, eliminando a necessidade de uma autoridade central para gerenciar os dados.

A estrutura do ledger é baseada em nós, dispositivos conectados à rede que operam como unidades de processamento. Cada nó armazena uma cópia completa ou parcial do ledger, e as atualizações no sistema são sincronizadas entre todos os participantes para garantir a consistência dos dados.

<p align="center">
  <img src="/imagens/distributed-ledgers.png" width = "600" />
</p>
<p align="center"><strong> Figura 1. Nós de um ledger distribuído </strong></p>
</strong></p>

Uma característica central do ledger distribuído é a imutabilidade das informações armazenadas. Transações validadas não podem ser alteradas ou excluídas. Para assegurar isso, algoritmos de consenso são utilizados para validar novas transações antes de adicioná-las ao ledger. Dessa forma, alguns nós participantes, votam para que transações sejam validadas ou não. Uma vez aprovadas, essas transações são replicadas em todos os nós, garantindo a sincronização e a confiabilidade do sistema.

Esse modelo oferece alta segurança e integridade, pois a existência de múltiplas cópias distribuídas impede que falhas em um ou mais nós comprometam o sistema como um todo. Além disso, a ausência de um ponto único de falha torna o ledger resistente a ataques centralizados, como ataques DDoS.

**Tolerância a Falhas Bizantinas (BFT)**

A Tolerância a Falhas Bizantinas (BFT) é um mecanismo para alcançar consenso em sistemas distribuídos mesmo na presença de falhas arbitrárias, incluindo comportamentos maliciosos. 

Inspirada no Problema dos Generais Bizantinos, a BFT garante que nós honestos concordem sobre um estado final, independentemente de até 
*f* nós defeituosos ou comprometidos, desde que *n* ≥ 3*f* + 1, onde *n* é o número total de nós. 

Amplamente usada em blockchains e sistemas críticos, BFT assegura segurança e confiabilidade em redes distribuídas, mas enfrenta desafios relacionados à escalabilidade e à troca de mensagens intensiva.

**Blockchain**

Sendo um tipo específico de ledger distribuído, uma blockchain é uma tecnologia caracterizada por armazenar os dados em blocos interligados, encadeados e protegidos por criptografia.

Cada bloco contém um conjunto de transações, um identificador único chamado hash, o hash do bloco anterior (para ligação dos blocos) e um timestamp. Essa estrutura forma uma cadeia contínua, onde qualquer alteração em um bloco exigiria a modificação de todos os blocos subsequentes. Essa característica dificulta significativamente tentativas de adulteração, pois as mudanças seriam facilmente detectadas por outros participantes da rede.

<p align="center">
  <img src="/imagens/blockchain-estrutura.png" width = "600" />
</p>
<p align="center"><strong> Figura 2. Estrutura de uma blockchain </strong></p>
</strong></p>

Devido à sua capacidade de garantir integridade e segurança nos registros, a blockchain foi utilizada como base para o desenvolvimento da solução do problema proposto. Essa abordagem permite um sistema de apostas descentralizado confiável, onde os resultados e transações são armazenados de maneira transparente e verificável, eliminando a necessidade de uma entidade central para gerenciar os dados.

**Contratos inteligentes**

Contratos inteligentes são programas autoexecutáveis armazenados em blockchain, que funcionam como acordos digitais acionados automaticamente quando condições predefinidas são atendidas. Eles eliminam intermediários, proporcionando eficiência, segurança e transparência nas transações, de forma descentralizada.

No sistema desenvolvido, utilizou-se a blockchain do Ethereum, uma plataforma amplamente reconhecida por sua robustez e suporte a contratos inteligentes. O Ethereum oferece uma infraestrutura confiável e segura para criação e execução de contratos, permitindo que as apostas, validações de resultados e distribuições de prêmios ocorram de forma autônoma e imutável.

**Comunicação entre aplicação e contratos inteligentes**

A comunicação entre uma aplicação e contratos inteligentes em uma blockchain envolve a interação por meio do envio de transações e da leitura de dados armazenados no contrato.

As aplicações utilizam interfaces e/ou bibliotecas específicas para preparar e enviar transações, assinadas digitalmente para garantir autenticidade, contendo informações como o endereço do contrato, a função a ser chamada e outros parâmetros necessários. 

Após o envio, a rede valida a transação e a registra na blockchain. A aplicação pode então receber feedback sobre a execução ou monitorar eventos emitidos pelo contrato para obter atualizações em tempo real, como notificações sobre alterações no estado do contrato (por exemplo, o resultado de uma aposta).

Além disso, a leitura de dados pode ser feita sem modificar o estado da blockchain, através de consultas diretas ao contrato (call) que retornam informações diretamente do contrato, como o saldo de um usuário ou o estado de um evento de aposta. 

Esse processo assegura uma interação eficiente e segura entre a aplicação e a blockchain, permitindo a criação de sistemas complexos, como o de apostas online, com total transparência e confiança para os usuários.

**Odds dinâmicas**

As odds dinâmicas representam um sistema de cálculo de probabilidades em apostas que se ajusta em tempo real, considerando fatores como o comportamento dos apostadores, alterações nas condições do evento e dados históricos. Esse modelo oferece maior flexibilidade e precisão em comparação às odds fixas, incentivando novos participantes e refletindo a realidade do mercado de apostas.

A medida que novos dados ou eventos ocorrem, as probabilidades são recalculadas continuamente, permitindo que os apostadores avaliem o impacto de mudanças nas condições do evento e incentive que novos apostadores se envolvam, mesmo após o início de um evento.

Por exemplo, em um evento de cara ou coroa, a probabilidade de vitória seria:

* Cara: 50% = 0.5
* Coroa: 50% = 0.5

A odd então seria calculada como o inverso da probabilidade:

* 1 / probabilidade

logo:

* Cara: 1 / 0.5 = 2
* Coroa: 1 / 0.5 = 2

No entanto, se houver um maior volume de apostas em "Cara", as odds são ajustadas para equilibrar o mercado:

* Cara: 1.8 (menos retorno porque há mais apostas)
* Coroa: 2.2 (mais retorno para atrair apostas)

Além disso, outros critérios podem influenciar os ajustes. Por exemplo, se dados históricos indicam que "Coroa" é sorteado em 60% das vezes, as probabilidades seriam recalculadas:

* Cara: 1 / 0.4 = 2.5
* Coroa: 1 / 0.6 = 1.67

Esse sistema dinâmico reflete melhor o risco e a probabilidade real dos resultados, promovendo um ambiente de apostas mais competitivo e transparente.

## Metodologia e Resultados

Este tópico apresenta os métodos utilizados para o desenvolvimento do sistema de apostas online descentralizado, desde a escolha das tecnologias até a implementação das funcionalidades principais. A abordagem incluiu o uso da blockchain Ethereum para garantir descentralização e segurança, de contratos inteligentes para automatizar processos críticos, como validação de apostas e distribuição de prêmios, entre outros conceitos.

Além disso, são apresentados os resultados obtidos durante o desenvolvimento, demonstrando como as soluções implementadas atenderam aos requisitos propostos, como transparência, flexibilidade e confiabilidade do sistema.

**Arquitetura**

O sistema apresenta uma organização baseada em algumas estruturas principais, sendo elas: 

* __BLOCKCHAIN__ - Foi utilizado uma blockchain de testes. O projeto faz uso do Framework HardHat e este já possui uma Blockchain para testes integrada, nela é possível acompanhar transações e as implantações de contrato. Importante destacar que essa Blockchain do HardHat, simula a do Ethereum. A configuração dessa rede é simples, bastando ir no arquivo de configuração do Hardhat, criar uma rede local e associar à porta 8545, que é a da rede do Hardhat.

* __O CONTRATO__ (responsável por toda lógica envolvendo eventos e apostas) - onde todas funcionalidade esperadas foram implementadas, sendo possível sacar, apostar, depositar, calcular ODDs dinamicamente e entre outros. Para dar o “deploy” do contrato na blockchain (rede do Hardhat), foi feito uso também do framework HardHat, onde o processo de compilação e “deploy” é abstraído e resumido a dois comandos (o de compilação e deploy).
  - Estrutura do contrato: 
    - Os Eventos  ficam em uma lista que contém todos os Eventos;
    - Saldo associado ao usuário (ver mais na seção Contas);
    - Funções como depósito, saque e outras que interagem com os Eventos e o Contrato.
      <p align="center">
      <img src="/imagens/contrato.drawio.png" width = "300" />
    </p>
    <p align="center"><strong> Figura 3. Representação do contrato </strong></p>
    </strong></p>
* __COMUNICAÇÃO COM O CONTRATO__ (via Web3) - o módulo responsável pela comunicação com o contrato já ‘’lançado’’ na Blockchain. Apresenta funções para se conectar a rede, carregar o contrato com base no endereço e na ABI (representação do contrato) e transferir saldos.
* __A INTERFACE__ (e seus endpoints) - Criação de uma interface utilizando endpoints (Flask) e HTML, como primeira camada de interação com o sistema
  
A arquitetura por camadas é então como mostrado na Figura 4, a seguir:

  <p align="center">
      <img src="/imagens/Figure_1.png" width = "500" />
    </p>
    <p align="center"><strong> Figura 4. Sistema por Camadas </strong></p>
    </strong></p>

**Transações**

Com exceção de métodos para busca de histórico (resultados), Eventos criados ou retorno de ODD para um determinado Evento, todos os outros métodos interagem com a Blockchain e o contrato implementado através de transações. São usadas transações pois elas são capazes de enviar dados para a rede/contrato e alterar o estado do contrato, por exemplo. Para usar essas transações, é feito uso do método ‘’transact’’ da biblioteca ‘’web3” para Python. Esse método abstrai todo o cálculo de gás (usado nas transações), o nonce (usado para garantir a sequência correta das transações), assinatura (onde a rede associa endereço e chave privada, provendo segurança) entre outros.  

**Contas**

É possível, mediante contrato implantado a “criação de contas”. O processo funciona da seguinte forma: através de um mapeamento baseado em endereços de contas, é associado valores de saldo, criando uma estrutura baseada em uma carteira, para aquele endereço/pessoa. O processo para criação dessa “carteira”, se dá então no momento do primeiro depósito, onde o usuário informa o endereço da conta e o saldo a depositar. Em depósitos subsequentes, o valor só é adicionado ao existente. Para depósito e saque, foram estabelecidas condições baseadas na função de controle “require” do solidity. Saques só são naturalmente possíveis, se o usuário contém um saldo suficiente para saque. Depósito por sua vez, se o valor for maior que 0.
Pelo saldo ser depositado no contrato em si, esse mapeamento associando endereço com saldo faz-se então imprescindível, para que seja possível administrar corretamente os valores de cada um (ver mais na seção de contabilidade).

**Eventos**

Qualquer pessoa consegue criar um Evento. Para criação do Evento existe um método no  contrato (“CriarNovoEvento”). Esse método é acionado através de uma transação que recebe como parâmetros, a descrição do Evento, o endereço da conta e o momento de término daquele Evento. Se tudo ocorrer corretamente na criação do Evento, é montado um ‘’struct’’ com os parâmetros do Evento, e este é colocado em uma lista de Eventos. Por fim, em caso de sucesso na criação de Evento, um ‘’event” (estrutura do solidity usado no processo de registro de logs) é emitido, esse registro serve para marcar em Log, o início de um evento. Se algo der errado no momento da criação, por exemplo, e o término do Evento estiver no passado, uma “exceção” é levantada pelo ‘’require”, a transação será revertida e a função será impedida de terminar. 

A estrutura do struct para os eventos é a seguinte:

<p align="center">
      <img src="/imagens/evento.png" width = "400" />
    </p>
    <p align="center"><strong> Figura 5. Struct do Evento </strong></p>
    </strong></p>

**Apostas**

É possível apostar em um Evento. A cada nova aposta em um determinado Evento, um ‘’event’’ é emitido para registrar em Log - na blockchain - que uma determinada pessoa apostou. Além de registrado na blockchain, é também registrado dentro do contrato os apostadores de um determinado Evento, sendo possível consultar esses dados posteriormente. 
Existem  algumas verificações com a função ‘’require’’, sendo elas:

* É necessário que o INDEX (as apostas são identificadas por esse identificador, um número) seja válido;
* Que aposta não tenha sido encerrada e/ou o período para apostar tenha chegado ao fim;
* Que o valor da aposta seja maior que 0;
* Que seja a primeira aposta do usuário (decisão de projeto);

Passando por essas verificações, o saldo é descontado da carteira do usuário e é registrado a aposta daquele usuário. Além disso, outras funções internas ao contrato são chamadas para atualização dos valores totais daquela aposta e outros.

**Simulação em tempo real**

O sistema processa eventos em tempo real.

* **Estágio 1- Criação de Evento:** Dado um endereço e a descrição da aposta, um evento é criado.
* **Estágio 2- Apostas e visualização de eventos criados até um determinado tempo limite:** É possível listar os eventos e realizar apostas.
* **Estágio 3- Solicitação de resultados:** Com base na requisição de um usuário, se o tempo limite da aposta terminar, o resultado daquela aposta será retornado.
* **Estágio 4- Distribuição dos prêmios:** O saldo é distribuído corretamente entre os vencedores.
* **Estágio 5- Checagem de resultado e histórico:** Permite consultar o histórico e os resultados das apostas.

**Odds**

O sistema utiliza um sistema de cálculo de Odd baseado em Odds dinâmicas. O processo é simples e funciona da seguinte maneira, com base no valor total apostado, é feito o cálculo para um aposta específica, utilizando o montante apostado naquela aposta específica e fazendo um cálculo proporcional do tipo:

<p align="center">
  Odd = (Valor_total_da_aposta / Valor_no_resultado) * 100%
</p>

Sendo possível consultar as Odds de uma determinada aposta num Evento.

**Contabilidade**

Um dos tópicos mais importantes do sistema, ele perpassa desde a administração do saldo do contrato (associando o valor de cada ‘’conta’’ corretamente) até o momento da distribuição dos prêmios.
A administração do saldo, já foi brevemente referenciada no presente relatório, mas funciona da seguinte maneira: quando um usuário deposita um valor, ele deposita no saldo do próprio contrato, ou seja, o contrato em si detém o valor depositado e não sabe a princípio de quem é aquele valor. Para isso, foi então criado as estruturas das carteiras já mencionadas anteriormente, no tópico de contas. 
Já para distribuição de prêmio, na primeira etapa é descoberto os vencedores, e depois é feita a verificação se realmente existem vencedores. Depois disso, ocorre a distribuição do prêmio proporcionalmente com base nos valores apostados por cada vencedor. O processo funciona baseado na seguinte fórmula:

<p align="center">
  P = (V / Tv)*Tg
</p>

Onde P é o prêmio proporcional a um vencedor, V o valor apostado por aquele vencedor, Tv total apostado pelos vencedores e Tg o total apostado por todos (vencedores e perdedores).

**Publicação**

Como já dito algumas vezes, o sistema faz uso de ‘’events’’ para registro de Log na blockchain. O contrato apresenta 3 ‘’events’’ sendo um para criação de Eventos, um para apostas realizadas e o último para um resultado de um Evento.
O sistema por usar “events” consegue registrar os ‘’events’’ descritos anteriormente on-chain. Existem métodos para buscar esses ‘’events’’ no Log da blockchain, baseado em filtros que distinguem que tipo de “event’’ está sendo ‘’procurado’’, seja de criação, aposta ou resultado do Evento. 
Além disso, é possível fazer buscas dentro das próprias estruturas de dados do contrato, analisando um Evento (quando foi iniciado, finalizado, os apostadores e resultado).

**Confiabilidade do contrato**

Durante a construção do código foram feitos alguns ajustes para aumentar a confiabilidade do contrato e a resistência a problemas de concorrência.

* Evitando ataques de reentrada: para evitar ataques de reentrada, a função de saque, foi organizada de modo que primeiro é deduzido o valor da carteira do usuário no contrato e só depois ocorre a transferência através do método ‘’transfer’’. Isso evita que o valor pudesse ser transferido sem antes atualizar o resultado da carteira, potencialmente criando situações onde ocorresse a subtração de dinheiro que não pertence a aquele endereço/carteira. Para aumentar mais ainda a segurança foi feito uso de reentrancy guards, fazendo com que durante o saque, não seja possível a reentrada naquela função até o fim.

* Evitando condições de corrida: Embora a blockchain processe as transações de forma sequencial, é possível que, em um intervalo entre duas transações, o contrato inteligente esteja em um estado intermediário, no qual as mudanças propostas pela primeira transação ainda não foram completamente refletidas no estado do contrato. Nesse momento, uma segunda transação pode alterar o estado do contrato, sobrescrevendo as mudanças da primeira transação. Esse tipo de problema é conhecido como "condição de corrida". No contexto da função de aposta, isso pode ocorrer se dois usuários tentarem apostar no mesmo evento ao mesmo tempo, podendo um sobrescrever a aposta do outro. Para evitar esse tipo de situação, foi implementado um mecanismo de lock usando reentrância. Esse lock impede que a função de aposta seja chamada novamente para o mesmo evento enquanto uma transação ainda está em andamento, garantindo que as apostas sejam processadas de maneira ordenada e sem conflitos.

## Conclusão

Por fim, foi possível criar um sistema de apostas online descentralizado utilizando tecnologias de ledger distribuído, como a blockchain do Ethereum, que apresentou uma solução segura para as apostas digitais. Ao eliminar a necessidade de intermediários e implementar contratos inteligentes, foi possível garantir maior transparência, integridade e eficiência nas transações e no gerenciamento das apostas.

Através do uso de odds dinâmicas e a comunicação eficiente entre a aplicação e os contratos inteligentes, o sistema garante uma experiência interativa, flexível e segura aos usuários, ao mesmo tempo em que mantém a descentralização e a resistência a falhas. A utilização de mecanismos como a Tolerância a Falhas Bizantinas (BFT) assegura que a plataforma continue operando de forma confiável, mesmo diante de adversidades ou tentativas de manipulação.

De melhoras para o sistema, poderia criar um oráculo principalmente para garantir maior segurança na aleatoridade dos resultados dos Eventos, sendo que essa aleatoridade depende da mineração de blocos e pode potencialmente ser manipulada por mineradores.
