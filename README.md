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

No sistema desenvolvido, utilizou-se a blockchain do Ethereum, uma plataforma amplamente reconhecida por sua robustez e suporte a contratos inteligentes. O Ethereum oferece uma infraestrutura confiável e segura para criação e execução de contratos, permitindo que as apostas, validações de resultados e distribuições de prêmios ocorram de forma autônoma e imutável. Essa escolha reforça a transparência e a confiança no sistema, características essenciais para a solução descentralizada proposta.

**Comunicação entre aplicação e contratos inteligentes**

A comunicação entre uma aplicação e contratos inteligentes em uma blockchain envolve a interação por meio do envio de transações e da leitura de dados armazenados no contrato.

As aplicações utilizam interfaces e bibliotecas específicas para preparar e enviar transações, assinadas digitalmente para garantir autenticidade, contendo informações como o endereço do contrato, a função a ser chamada e outros parâmetros necessários. 

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

**Arquitetura**: 

O sistema apresenta uma estrutura onde um servidor dispõe de um conjunto de métodos para troca de informações com os clientes e entre servidores. Dessa forma, um usuário deve escolher qual dos servidores ele deseja conectar-se, ou seja, determina o servidor coordenador, e esse servidor coordenador que será responsável por enviar requisições aos outros servidores, caso necessário. Para a implementação, foi usado o Protocolo de Transferência de Hipertexto(Hypertext Transfer Protocol), utilizando o micro-framework Flask para criação da API com métodos como GET e POST e seus respectivos endpoints. O uso do HTTP se deu pelo fato de ser um padrão flexível, sem estado e bem estruturado, que se localiza em cima do TCP, responsável pela entrega dos pacotes de dados (IBM,2024). Cada um dos três servidores é apoiado por três arquivos no formato JSON. O primeiro para armazenamento de informações de passagens (que registrará informações das compras de uma pessoa/cpf como distância, número do assento, trajeto e valor). O segundo, será um arquivo que conterá em si os trechos entre cidades, a distância entre essas cidades e os assentos disponíveis para cada trecho, além de também salvar informações do comprador de um assento de determinado trecho, como o CPF. Por fim, o terceiro irá armazenar rollbacks pendentes de outros servidores, ou seja, trechos de outros servidores que precisam ser "descomprados". Esse terceiro arquivo será melhor abordado posteriormente na documentação.

Os módulos do cliente são apoiados por sub-módulos:
* O primeiro está relacionado a utilidades.
* O segundo é chamado *interface*. Que é um sub-módulo responsável por toda interatividade por parte do cliente. É um “módulo meio” responsável por coletar ‘’inputs’’ e passar para a parte de processamento.
* O último, comum também ao servidor, é o *connection*. Ele é o responsável por implementar as requisições como POST e GET.

Já o módulo do servidor é apoiado por dois sub-módulos:
* O primeiro é relacionado a utilidades do servidor, como a criação do grafo de trechos (já predefinido), carregar o grafo (trechos de viagem), carregar as passagens já compradas, salvar grafos e passagens, encontrar caminhos e verificações de compras em um CPF ou caminhos válidos. 
* O segundo é o *connection*, explicado acima, detêm as chamadas para POST, GET e algumas solicitações tipo de compras.

A arquitetura é caracterizado como de Microserviços com a possibilidade de compartilhamento de dados, visto que os servidores são independentes e podem cooperar ou não - cada um detém seus próprios arquivos JSON, cooperação essa que se da via API Restful. Além disso, se caracteriza também como arquitetura uma arquitetura distribuída.

**Protocolo de comunicação**: 

O protocolo de comunicação é via HTTP como já mencionado e feito com Flask. Foi criado métodos para POST e GET. 

Para comunicações que seguem a direção Cliente -> Servidor, os seguintes métodos são usados:

| **Endpoint**           | **Método HTTP** | **Descrição**                                                                                     |
|------------------------|-----------------|---------------------------------------------------------------------------------------------------|
| `/caminhos_cliente`    | GET             | Retorna os caminhos disponíveis de origem a destino, solicitado diretamente pelo cliente.|
| `/passagens_cliente`   | GET             | Verifica e retorna as passagens compradas pelo cliente, solicitado pelo próprio cliente. |
| `/comprar_cliente`     | POST            | Registra e verifica a compra de trechos, solicitado diretamente pelo cliente.            |

Todas essas requisições possuem o campo "mensagem", que pode assumir os seguintes valores:

| Mensagem (Cliente)                        | Significado                                                 |
|-------------------------------------------|------------------------------------------------------------ |
| "[Origem], [Destino]”                     | Solicitando caminhos entre [Origem] e [Destino].            |
| ”[Cpf],[Caminho]”                         | Comprando uma passagem para o [Caminho].                    |
| “[Cpf]”                                   | Solicitando passagens compradas por [Cpf].                  |


De outro modo, Servidor → Servidor (servidor enviando mensagem para servidor):

Existem métodos GET com os endpoints "/passagens_servidor" e "/caminhos_servidor", que são usados para a comunicação entre servidores, quando um servidor solicita um determinado recurso a outro. Por exemplo, um cliente pode se conectar ao servidor A, e o servidor A, por sua vez, conecta-se aos outros para retornar todas as passagens daquele usuário. O /caminhos_servidor, por outro lado, é utilizado quando um servidor solicita caminhos a outro servidor. Por fim, existe um método POST com o endpoint /comprar_servidor, que é usado quando um servidor solicita a outro a compra de trechos pertecentes ao caminho escolhido pelo cliente para compra.

| **Endpoint**           | **Método HTTP** | **Descrição**                                                                                      |
|------------------------|-----------------|----------------------------------------------------------------------------------------------------|
| `/caminhos_servidor`   | GET             | Retorna os caminhos disponíveis de origem a destino, conforme solicitado por outro servidor.       |
| `/passagens_servidor`  | GET             | Verifica e retorna as passagens compradas de um cliente, conforme solicitado por outro servidor.   |
| `/comprar_servidor`    | POST            | Registra e verifica a compra de trechos solicitada por outro servidor                              |

Também possuem um campo mensagem e possui semelhança com as mensagens das requições cliente-servidor.

Para além dos GET e POST, ainda no protocolo de comunicação, existem mensagens de ''rollback'' ou seja, mensagens que buscam desfazer algum tipo de alteração que tinha sido feita anteriormente. É usada pela lógica das compras sempre começarem do servidor onde foi conectado e dispara Threads para os outros servidores se eles tiverem trechos a cederem. Se o cliente conectou no servidor A e tem trechos envolvendo esse servidor, a compra já é feita. Se tiver trechos de outros servidores, por exemplo do B, e está disponível, é feita a compra, porém se tiver um trecho no servidor C, e este não estiver disponível, é feito o rollback tanto em A quanto em B.

| Endpoint                   | Significado                                                                                                                                                                               |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/rollbaack        `       | Ordem de rollback (desfaz compra caso outro servidor não consiga realizar sua compra)                                                                                     |



**Roteamento**: 

Como é requerido o compartilhamento de trechos entre os servidores, a ideia do VendePASS precisou ser aprimorada para considerar a possibilidade de diferentes servidores oferecer seus trechos para completar um caminho, caso o servidor que o cliente conectou-se não tivesse tal trecho disponível. É importante salientar que os três servidores oferecem os mesmos trechos, com as mesmas cidades e com as mesmas distâncias. A diferença entre eles é o valor cobrado por 100km.

Depois de escolher a cidade origem e a cidade destino, o servidor conectado irá procurar pelo seus 10 melhores caminhos, ou seja, os caminhos mais curtos e com trechos com assentos disponíveis. A diferença agora, é que o servidor conectado também vai pedir aos outros dois servidores, os seus 10 melhores caminhos. No cenário perfeito, o servidor conectado vai retornar ao cliente 30 caminhos.

Essa somatória de caminhos, não é automaticamente exibida ao cliente. Primeiramente, os trechos desses caminhos, com marcações indicando a qual servidor pertence cada trecho, são misturados, tendo a possibilidade agora de formar novos caminhos com trechos de diferentes servidores. Por exemplo: o melhor caminho (mais curto e com assento) possível entre Salvador e Rio de Janeiro, não consegue ser formado no servidor A devido a falta de assento de um trecho desse caminho em questão; porém no servidor B, esse trecho está disponível em outro caminho e foi retornado. Ao procurar novamente os melhores caminhos, esse trecho do servidor B irá completar o melhor caminho possível que não podia ser formado no servidor A e esse caminho será disponibilizado ao cliente.

![Salvador-Rio de Janeiro](/imagens/meu_gif.gif)

Com a junção e mistura desses trechos, é necessário novamente separar os melhores caminhos, considerando agora duas métricas: os 5 caminhos mais curtos e os 5 caminhos mais baratos. Por decisão da equipe, caso um determinado trecho tenha sido retornado por mais de um servidor, é preciso escolher, ou seja, dar preferência a um servidor. Dessa forma, nos 5 caminhos mais baratos, caso tenha trechos retornados por diferentes servidores, irá usar o critério de servidor mais barato para determinar qual trecho será incorporado ao caminho e exibido ao cliente. Diferentemente, nos 5 caminhos mais curtos, irá usar o critério de dar preferência ao servidor conectado pelo cliente, visto que se um cliente conectou em um servidor n, ele quer a prioridade de comprar um trecho desse servidor. Caso o servidor conectado não tenha disponibilidade de tal trecho, o critério será o mesmo dos 5 caminhos mais baratos, visto que a distância de um trecho é igual em todos os servidores.

Seguindo essa lógica, um caminho pode ser encontrado misturando trechos dos três servidores, a depender da preferência. Assim, é possível encontrar de fato a melhor opção de compra para um cliente, utilizando e entrelaçando dados distribuídos entre os três servidores.

**Concorrência Distribuída**: 

Para lidar com a concorrência foi feito uso de um algorítmo que usava de Locks (responsáveis por travarem regiões críticas) e Threads para processarem requisições simultâneas à outros servidores. O Lock de um servidor é comum a todas requisições e endpoints. O algoritmo implementado que preza sempre pelo cenário ideal, recebe o nome de "One Phase Commit", pois se existe uma necessidade de trecho de um servidor, ele já inicia a compra, mesmo que o outro servidor nesse meio tempo possa ter perdido aquela vaga de alguma forma. Se esse cenário ocorrer, como já foi dito, é disparada uma ordem de "rollback".

<p align="center">
  <img src="/imagens/diagrama_sequencia_caso.png" width = "600" />
</p>
<p align="center"><strong> Figura 1. Fluxo de mensagens para uma compra bem sucedida envolvendo A e B </strong></p>
</strong></p>

Para os casos onde, por exemplo, uma ordem de rollback foi emitida para o servidor B, e esse cai antes de receber a alteração solicitada, o servidor que emitiu a ordem de rollback salva em um arquivo essa ordem, para posteriormente manda-lá novamente. A verificação de pendência de rollback é sempre emitida quando uma requisição - não importa se Get ou Post - ocorre, se a verificação acusar um ''rollback'' não realizado, a alteração é desfeita.

O diagrama de sequência abaixo, ilustra outros casos, como a compra ideal e trechos indisponíveis em outros servidores ou no próprio A.

<p align="center">
  <img src="/imagens/diagrama_sequencia.png" width = "600" />
</p>
<p align="center"><strong> Figura 2. Fluxo de mensagens para uma compra bem sucedida e não sucedida por falta de trechos </strong></p>
</strong></p>


**Confiabilidade da solução**: 

Se um cliente está fazendo uma compra no Servidor A e esse cai, é possível prosseguir com a compra a partir daquele momento. Isso se da pelo uso do paradigma Stateless provido pelo próprio HTTP.
Se um cliente está fazendo uma compra no Servidor A e essa compra tem trechos em outros servidores, e um desses não responde ou não tem mais trechos, a compra em A sofre rollback.
A priori, com a queda de servidores a consistência da concorrência distribuída se mantém, e mesmo que o servidor que o cliente se conectou (coordenador) tenha algum erro de conexão na requisição de compra, se manterá a persistência das ordens de rollbacks que devem ser realizadas por outros servidores.

Quando um servidor recebe uma requisição de compra de outro servidor, foi adicionado um loop para verificar "n" vezes se os trechos estão de fato indisponíveis. Esse "n" pode ser de 1 a 5, com um tempo de espera para verificar novamente que vai de 100ms a 300ms. Dessa forma, no "pior cenário", o proceso de verificação de disponibilidade de trechos pode demorar 1,5s (5 vezes x 300ms). Esta implementação foi adicionada, visando combater a situação em que, por exemplo, um cliente conectado no servidor A e outro cliente conectado no servidor B, iniciem uma compra com o mesmo caminho e nenhum dos dois consiga efetuar a compra, visto que ambos os servidores vão "comprar" os trechos em seu próprio servidor e depois vão verificar no servidor alheio se os trechos ainda estam disponíveis, porém como os servidores já "compraram" internamente os trechos, ambos vão retornar que não tem mais os trechos disponíveis e assim nenhum dos dois cliente vão efetuar a compra. Com a adição do loop essa situação é minimizada, tendo a possibilidade de ter o tempo necessário de um servidor "desistir" da compra e o outro conseguir finalizar.

**Avaliação da solução**: 
Foi criado um script para testes. 
* O primeiro cenário foi envolvendo somente um servidor A, de modo que 5 clientes tentam competir por 3 vagas, ocorreu tudo bem de modo que 2 clientes ficaram sem vagas, mas não foi computado nenhuma vaga que não existia.
* Já o segundo cenário envolvia agora três servidores A, B e C. O script se conectava ao Servidor B, e abria 5 terminais. O que ocorre é que para o Servidor A tinha 4 vagas para o trecho, e o B e C tinha 5 vagas para os respectivos trechos. A compra foi efetuada corretamente, e somente 4 passagens foram compradas, de modo que foi feito o rollback de uma delas.
* O Último script para testes envolveu uma magnitude muito grande de solicitações (100), onde no inicio das 100 solicitações ocorreu uma demora, mas conforme chegou na faixa dos 60-70 solicitações o fluxo aumentou rapidamente.
* O último, o script abria 20 terminais, sendo que os pares o cliente era conectado ao A e os impares o cliente era conectado ao B. O mesmo recursos eram solicitados, pelos testes o programa se comportou bem, apesar do número baixo de vagas (eram somente 10 para 20 clientes), assim como no primeiro caso, não houve incoerência relacionado ao número de vagas, seja por sobrecompra ou subcompra. Mais testes nesse cenário são necessários, para saber o quão balanceados estão sendo as compras feita em cada servidores e se será necessário algum sistema de Load balancing.

**Documentação do código**:
O código está completamente comentado e documentado.

**Emprego do Docker**:
Implementado. Foi criado Dockers para os servidor A, B e C e um para o cliente. Foi criado também um docker-compose, para orquestras o relacionamento das 4 entidades e o estabelecimento de uma rede entra elas no ambiente de testagem Docker.

## Conclusão

Por fim, foi possível criar um sistema de apostas online descentralizado utilizando tecnologias de ledger distribuído, como a blockchain do Ethereum, que apresentou uma solução segura para as apostas digitais. Ao eliminar a necessidade de intermediários e implementar contratos inteligentes, foi possível garantir maior transparência, integridade e eficiência nas transações e no gerenciamento das apostas.

Através do uso de odds dinâmicas e a comunicação eficiente entre a aplicação e os contratos inteligentes, o sistema garante uma experiência interativa, flexível e segura aos usuários, ao mesmo tempo em que mantém a descentralização e a resistência a falhas. A utilização de mecanismos como a Tolerância a Falhas Bizantinas (BFT) assegura que a plataforma continue operando de forma confiável, mesmo diante de adversidades ou tentativas de manipulação.

AQUI TU COLOCA PONTOS A MELHORAR OU QUALQUER OUTRA COISA SLA