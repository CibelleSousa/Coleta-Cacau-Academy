import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';
import { SeedModule } from './types';

export const module6: SeedModule = {
    title: '6. API REST',
    description: 'Comunicação entre aplicativo e servidor via APIs RESTful.',
    order: 6,
    duration: 85,
    type: ModuleType.THEORY,
    lessons: [
        {
            title: 'Introdução e Arquitetura REST',
            slug: 'introducao-arquitetura-rest',
            duration: '30 min',
            type: LessonType.READ,
            order: 1,
            content: `No desenvolvimento do Coleta Cacau, vimos que o aplicativo precisa constantemente enviar e receber dados da Plataforma Cacau. Mas como essa comunicação acontece? 

            Uma API (Application Programming Interface) Web pode ser definida como uma interface remota que permite que aplicações se comuniquem através de uma rede. Ela funciona como uma "ponte" segura e padronizada entre o seu aplicativo (o cliente) e o servidor onde os dados vivem.

            Se não usássemos uma API, teríamos que recorrer a métodos que trariam sérios problemas de segurança e manutenção como: Acesso Direto ao Banco de Dados e Transferência de Arquivos.

            No problema do acesso direto ao banco de dados, o aplicativo móvel teria que ter as credenciais (login e senha) para conectar diretamente no banco de dados do servidor. Isso é uma falha gravíssima de segurança. Se alguém descompilar o aplicativo, teria acesso total aos dados de todos os usuários. Além disso, qualquer mudança na estrutura do banco quebraria o app. Já no problema de transferência de arquivos, o servidor poderia gerar arquivos (como CSV ou Excel) periodicamente para o aplicativo baixar. O que significaria que os dados não seriam em tempo real e o processo seria lento, consumindo muitos dados móveis.

            A API resolve isso criando uma camada de abstração. O aplicativo não precisa saber como o banco de dados funciona, qual a linguagem do servidor ou como os dados são processados ; ele só precisa saber como "pedir" o que quer.

            Vale ressaltar que existem vários tipos de APIs no mercado. Você pode ouvir falar de SOAP (mais antigo e burocrático, baseado em XML), GraphQL (muito flexível, onde o cliente monta a query exata) ou gRPC (focado em altíssima performance entre servidores). Entretanto, para o Coleta Cacau, e para a vasta maioria dos aplicativos móveis modernos, escolhemos o estilo REST (Representational State Transfer).

            Isso porque, em primeiro lugar, a API REST é baseada no protocolo HTTP. Isso significa que elas são compatíveis com praticamente qualquer linguagem de programação e funcionam nativamente na internet. Além disso, esse tipo de API usa verbos padronizados (como GET para buscar e POST para criar) que tornam a intenção do código clara. Por fim, no REST, não pensamos em "executar funções", mas sim em manipular "Recursos" (como Propriedades, Áreas, Usuários) e isso se alinha perfeitamente com a modelagem de dados que fizemos no capítulo de Realm e Redux.

            ## Objetivo 

            O objetivo deste capítulo é desmistificar o funcionamento das interfaces de comunicação web e demonstrar como o aplicativo Coleta Cacau troca informações com o mundo exterior. Ao final desta seção, o desenvolvedor será capaz de compreender os princípios do estilo arquitetural REST, aprendendo a identificar Recursos (como propriedades e usuários) e a mapeá-los para Rotas (URLs) organizizadas. O leitor entenderá como os Verbos HTTP (GET, POST, PUT, DELETE) traduzem as intenções do aplicativo (CRUD) e como os Códigos de Status informam o resultado dessas operações. Além disso, abordaremos como estruturar dados em formato JSON para envio e recebimento, e discutiremos boas práticas de eficiência (como paginação e filtros) e segurança básica, essenciais para o desempenho de um aplicativo mobile que opera em redes instáveis.

            ## Definição 

            Uma API REST (Representational State Transfer) não é uma tecnologia ou uma biblioteca, mas sim um estilo arquitetural para projetar aplicações em rede. Ela define um conjunto de restrições e padrões que, quando seguidos, permitem que sistemas diferentes (como um app React Native e um servidor backend) se comuniquem de forma escalável, independente e padronizada. Em uma API REST, o foco sai de "chamar funções" e passa para a manipulação de Recursos (entidades de negócio), que são acessados através de identificadores únicos (URIs) e manipulados utilizando os métodos padrão do protocolo HTTP. O resultado é uma interface uniforme onde o servidor transfere uma "representação" do estado atual de um recurso (geralmente um JSON) para o cliente.

            ## O Estilo Arquitetural REST 

            O acrônimo REST (Representational State Transfer) pode parecer intimidante, mas seu conceito central é simples e poderoso. Diferente de estilos mais antigos (como RPC ou SOAP), onde o foco estava em "chamar funções no servidor" (ex: getUsuario(), salvarFazenda()), o REST muda o foco para Recursos.

            No REST, um Recurso é qualquer conceito de negócio ou entidade sobre a qual queremos guardar informações. Pense neles como os "substantivos" do seu sistema.

            No contexto do Coleta Cacau, ao olharmos para o protótipo feito neste documento nos capítulos anteriores, identificamos claramente os nossos recursos: Propriedade, Área Homogênea e Usuário.

            O ponto central do REST é que cada recurso deve ser acessível de forma independente e padronizada. O servidor não diz ao aplicativo "como" fazer as coisas (as funções), ele apenas expõe o que existe (os recursos) e permite que o aplicativo interaja com eles.

            ## Identificando Recursos e Rotas (URLs) 

            Se os Recursos são "itens em um menu", as URLs (Uniform Resource Locators) são os endereços onde podemos encontrá-los. O design dessas URLs é crucial para que a API seja fácil de entender e usar (o que o livro chama de Consumer-Centric Design). Existem algumas regras que devemos seguir para desenhar rotas que se adequem à arquitetura REST de uma API.

            Regra 1: Use substantivos, não verbos. Como o verbo (a ação) já é definido pelo protocolo HTTP (GET, POST, etc.), a URL deve conter apenas o nome do recurso.

            \`\`\`text
            // Errado: https://api.plataformacacau.com.br/getProperties (Isso é RPC, focado na ação) //
            // Certo: https://api.plataformacacau.com.br/properties (Isso é REST, focado no recurso) //
            \`\`\`

            Regra 2: Use o plural para coleções. A URL raiz de um recurso geralmente representa a "coleção" inteira daquele item no banco de dados.

            \`\`\`text
            // https://api.plataformacacau.com.br/properties Representa todas as propriedades.
            // https://api.plataformacacau.com.br/users Representa todos os usuários.
            \`\`\`

            Regra 3: Use IDs para itens específicos. Para acessar um item único dentro da coleção, adicionamos o seu identificador único (ID) à URL.

            \`\`\`text
            // https://api.plataformacacau.com.br/properties/123 Acessa especificamente a propriedade com ID 123.
            \`\`\`

            Regra 4: hierarquia e relacionamentos. Quando um recurso "pertence" a outro (como as Áreas Homogêneas pertencem a uma Propriedade), a URL deve refletir essa hierarquia. Isso torna a API intuitiva.

            \`\`\`text
            // O Recurso Pai: https://api.plataformacacau.com.br/properties/123 (A Fazenda Palmeiras)
            // O Recurso Filho: https://api.plataformacacau.com.br/properties/123/homogeneous-areas (As áreas da Fazenda Palmeiras)
            \`\`\`

            Com base nessas regras e no protótipo feito neste documento, podemos desenhar as seguintes rotas: 

            | Ação Desejada | Rota (URL) | Descrição |
            | --- | --- | --- |
            | Listar Propriedade | <br>\`/properties\` <br> | Retorna a lista de todas as propriedades do usuário. <br> |
            | Detalhes da Propriedade | <br>\`/properties/{id}\` <br> | Retorna os dados completos de uma única propriedade. <br> |
            | Áreas de uma Fazenda | <br>\`/properties/{id}/homogeneous-areas\` <br> | Retorna a lista de áreas homogêneas pertencentes àquela propriedade específica. <br> |
            | Dados do Usuário | <br>\`/me\` <br> | Uma rota especial comum em APIs para retornar os dados do usuário logado (baseado no token). <br> |
            `
        },
        {
            title: 'Verbos HTTP e Códigos de Status',
            slug: 'verbos-http-codigos-status',
            duration: '25 min',
            type: LessonType.READ,
            order: 2,
            content: `No estilo REST, a URL identifica o que você está manipulando (o Recurso), mas é o Verbo HTTP que identifica a ação que você deseja realizar. Isso é fundamental para manter a interface uniforme e previsível.

Podemos traduzir diretamente as operações de banco de dados que aprendemos no capítulo do Realm para Verbos HTTP. Essa tabela é o seu "dicionário de tradução": 

| Operação (CRUD) | HTTP | Descrição | Exemplo de Uso |
| --- | --- | --- | --- |
| Create (Criar) | POST | Envia dados novos para o servidor processar e salvar. | Cadastrar uma nova fazenda. |
| Read (Ler) | GET | Recupera dados do servidor. É uma operação segura (não altera nada). | Baixar a lista de propriedades. |
| Update (Atualizar) | PUT | Substitui um recurso inteiro por uma nova versão. | Atualizar todos os dados do perfil. |
| Update (Atualizar) | PATCH | Atualiza apenas campos específicos de um recurso. | Mudar apenas o nome da fazenda. |
| Delete (Deletar) | DELETE | Remove um recurso do servidor. | Excluir uma área homogênea. |

Podemos imaginar como seriam essas chamadas em um serviço TypeScript genérico, utilizando uma biblioteca comum como o axios. Para baixar uma lista, fazemos uma chamada simples para a rota da coleção.

\`\`\`typescript
// Exemplo: Buscando todas as propriedades
async function getProperties() {
    // GET em /properties
    // O servidor entende que queremos LER a lista
    const response = await api.get('/properties');
    return response.data;
}
\`\`\`

Para criar, precisamos enviar os dados no "corpo" (body) da requisição.

\`\`\`typescript
// Exemplo: Criando uma nova propriedade
async function createProperty(name: string, city: string) {
    // POST em /properties
    // Enviamos um objeto JSON com os dados da nova fazenda
    const newFarmData = { name: "Fazenda Sol", city: "Ilhéus" };
    const response = await api.post('/properties', newFarmData);
    return response.data;  // O servidor geralmente retorna o item criado com o ID gerado
}
\`\`\`

Para edições rápidas onde não queremos reenviar o formulário inteiro, temos: 

\`\`\`typescript
// Exemplo: Corrigindo apenas o nome da propriedade de ID 123
async function updatePropertyName(id: string, newName: string) {
    // PATCH em /properties/123
    const updateData = { name: newName };
    await api.patch(\`/properties/\${id}\`, updateData);
}
\`\`\`

## Comunicação de Resultados - Códigos de Status 

Quando o "garçom" (API) volta da cozinha, ele não traz apenas o prato (dados), ele traz também a "conta" ou um aviso se algo deu errado. Na Web, isso é feito através dos HTTP Status Codes.

Em um aplicativo mobile, usamos esses códigos para decidir a "reação" da interface (ex: mostrar um pop-up de sucesso, redirecionar para o login ou exibir um erro).

Temos os códigos de status para sucesso. Eles são do formato 2xx, sendo 200(OK) que confirma que a requisição padrão funcionou. (Comum em GET e PUT) . O status 201(Created) significa que o recurso foi criado com sucesso. (Comum em POST) .

Para erros do cliente temos os status no formato 4xx.

* Quando dados enviados estão inválidos (ex: enviou texto num campo de data) temos o status 400 (Bad Request).


* Quando o usuário não está logado ou o token expirou temos o status 401(Unauthorized).


* Quando o usuário está logado, mas não tem permissão para acessar aquele recurso específico, retornamos o status 403 (Forbidden).


* E por fim, quando o recurso pedido (ex: \`/properties/999\`) não existe retornamos o status 404 (Not Found).

Para erros por parte do servidor temos status no formato 5xx, sendo o mais comum 500 (Internal Server Error) que reporta um erro inesperado que ocorreu no código do servidor.
            `
        },
        {
            title: 'Dados JSON, Performance e Segurança',
            slug: 'dados-json-performance-seguranca',
            duration: '35 min',
            type: LessonType.READ,
            order: 3,
            content: `Já sabemos onde buscar (a URL) e qual ação realizar (o Verbo). Mas onde vão os dados? Se eu quiser criar uma fazenda chamada "Bela Vista", onde eu escrevo esse nome? 

Na comunicação Web, a troca de dados acontece estruturada em duas partes principais: a Requisição (o que o App envia) e a Resposta (o que o Servidor devolve).

Antes de tudo, precisamos falar a mesma língua. O padrão da indústria para APIs REST é o JSON (JavaScript Object Notation). Ele é leve, legível por humanos e, o mais importante, é nativo do JavaScript/TypeScript. Isso significa que um objeto no seu código React Native pode ser transformado em texto JSON e enviado pela rede sem esforço.

\`\`\`json
{
    "id": 123,
    "name": "Fazenda Bela Vista",
    "city": "Ilhéus",
    "active": true
}
\`\`\`

Quando o aplicativo faz uma chamada à API, ele pode enviar informações em quatro lugares diferentes: URL Path Parameters (Parâmetros de Caminho), Query Parameters (Parâmetros de Consulta), Headers (Cabeçalhos) e Body (Corpo).

* 
**URL Path Parameters (Parâmetros de Caminho):** Usados para identificar um recurso específico.

\`\`\`text
// GET /properties/123 (O 123 é o ID).
\`\`\`

* 
**Query Parameters (Parâmetros de Consulta):** Usados para filtrar, ordenar ou paginar. Eles vêm depois do ? na URL.

\`\`\`text
// Retorna uma lista de propriedades que estejam em Ilhéus ordenado pelo nome
// GET /properties?city=Ilhéus&sort=name
\`\`\`

* 
**Headers (Cabeçalhos):** São "metadados" invisíveis para o usuário. Enviam informações sobre a requisição, não sobre o negócio. O mais importante é o Authorization, é aqui que enviamos o nosso Token (o crachá de identificação) para provar que estamos logados.

\`\`\`text
// Authorization: Bearer abc123xyz...
\`\`\`

* 
**Body (Corpo):** Usado apenas em métodos que enviam dados (POST, PUT, PATCH). É aqui que vai o objeto JSON com as informações a serem salvas.

\`\`\`json
// Criando uma fazenda
{
    "name": "Nova Fazenda",
    "owner": "João Silva"
}
\`\`\`

Quando o servidor responde, ele devolve um pacote contendo: Status Code e Response Body (Corpo de Resposta). Nós já discutimos sobre os Status Codes na seção anterior, mas o Response Body é onde se encontra os dados que pedimos. Por exemplo, se for um GET \`/properties\`, o corpo será uma lista de objetos, enquanto que se for um POST, o corpo geralmente é o objeto que acabou de ser criado, agora contendo o id gerado pelo banco de dados.

Vamos visualizar uma operação completa de cadastro, usando nossa API hipotética. No cenário, o usuário preencheu o formulário "Adicionar Propriedade" no App e clicou em Salvar.

O App irá enviar o Request. O verbo HTTP será o POST, a URL ficará \`https://api.exemplo-agro.com/properties\`, no header teremos \`Authorization: Bearer token_do_usuario\`. E no Body o JSON: 

\`\`\`json
{
    "name": "Sítio do Pica-Pau Amarelo",
    "city": "Itabuna"
}
\`\`\`

A API processa e envia o Response com Status 201 (Created) e no Body o JSON: 

\`\`\`json
{
    "id": 5050,   // O servidor gerou este ID!
    "name": "Sítio do Pica-Pau Amarelo",
    "city": "Itabuna",
    "createdAt": "2023-10-27T10:00:00Z"  // O servidor marcou a data/hora
}
\`\`\`

O Redux recebe esse objeto novo (com ID 5050) e o adiciona à lista local, atualizando a tela instantaneamente.

## Eficiência e Performance 

Em um ambiente de desenvolvimento local com Wi-Fi rápido, é fácil esquecer que nossos usuários podem estar no meio de uma plantação, usando uma conexão 3G instável ou com bateria fraca. Por isso, uma boa API não deve apenas entregar dados; ela deve entregá-los de forma eficiente.

Não queremos baixar uma lista com 5.000 fazendas se o usuário só precisa ver as 10 primeiras. Para resolver isso, utilizamos Query Parameters na URL.

A filtragem permite que o aplicativo peça apenas os dados que atendem a certos critérios. Imaginemos um cenário onde o usuário deseja ver apenas propriedades em Ilhéus. Como já vimos teríamos algo como: 

\`\`\`text
// Retorna uma lista de propriedades que estejam em Ilhéus
// GET /properties?city=Ilhéus
\`\`\`

Mas temos a possibilidade da paginação. Nesta em vez de enviar todo o banco de dados de uma vez, a API "fatia" os dados em páginas.

\`\`\`text
// Retorna apenas os primeiros 20 itens. Quando o usuário rola a tela até o final, o App faz uma nova chamada para page=2
// GET /properties?page=1&limit=20
\`\`\`

No contexto do Coleta Cacau, a eficiência é levada um passo além. Como vimos na arquitetura com Realm, o aplicativo baixa os dados para o banco local. Para evitar baixar gigabytes de dados repetidos toda vez que o app abre, APIs modernas utilizam estratégias como "Delta Sync": 

\`\`\`text
// A API retorna apenas as propriedades que foram criadas ou modificadas depois dessa data. Se nada mudou, a API pode retornar um status 304 Not Modified ("Nada mudou"), e o App não baixa nada.
// GET /properties?last_sync=2023-10-27
\`\`\`

## Segurança Básica - HTTPS e Tokens 

Segurança em APIs é um tópico vasto, mas existem dois pilares fundamentais que todo desenvolvedor mobile deve conhecer.

Você notou que todas as URLs dos sites atuais começam com https://? O "S" significa Secure (Seguro). Isso garante que a conexão entre o celular e o servidor é criptografada.

Sem HTTPS, enviar dados é como mandar um cartão-postal pelo correio: qualquer carteiro (ou hacker na rede Wi-Fi) pode ler o que está escrito. Com HTTPS, é como enviar o cartão dentro de um cofre blindado que só o servidor tem a chave para abrir. Não é seguro enviar o email e a senha do usuário em toda requisição (imagine enviar sua senha do banco a cada clique).

Em vez disso, usamos um sistema de troca. O App envia email/senha uma única vez (via POST \`/login\`). Se a senha estiver correta, o servidor responde com um Token (geralmente um código longo e ilegível, como um crachá digital). A partir desse momento, para buscar as fazendas ou salvar dados, o App envia apenas o Token no Header da requisição. Depois de um tempo, ele expira e o usuário precisa realizar o login novamente.
            `
        },
    ],
    quiz: {
        title: 'Quiz: Comunicação via APIs REST',
        description: 'Avalie seus conhecimentos sobre arquitetura REST, verbos HTTP, códigos de status, formatação JSON e segurança em aplicações móveis.',
        passingScore: 70,
        questions: [
            {
                text: 'Segundo as regras de design de rotas no estilo arquitetural REST, qual das seguintes URLs é a mais adequada e padronizada para listar todas as áreas homogêneas pertencentes à propriedade com ID 123?',
                options: [
                    {
                        text: 'https://api.exemplo-agro.com/getProperties/123/areas',
                        isCorrect: false
                    },
                    {
                        text: 'https://api.exemplo-agro.com/properties/123/homogeneous-areas',
                        isCorrect: true
                    },
                    {
                        text: 'https://api.exemplo-agro.com/listAreasForProperty/123',
                        isCorrect: false
                    },
                    {
                        text: 'https://api.exemplo-agro.com/areas?propertyId=123',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual verbo HTTP deve ser utilizado para realizar uma atualização parcial em um recurso, como por exemplo, corrigir apenas o nome de uma propriedade já existente, sem enviar o objeto completo?',
                options: [
                    {
                        text: 'POST',
                        isCorrect: false
                    },
                    {
                        text: 'GET',
                        isCorrect: false
                    },
                    {
                        text: 'PUT',
                        isCorrect: false
                    },
                    {
                        text: 'PATCH',
                        isCorrect: true
                    }
                ]
            },
            {
                text: 'Um usuário do aplicativo tenta acessar os dados de uma propriedade específica usando a rota `/properties/99999`, mas esse ID não existe no banco de dados do servidor. Qual código de status HTTP o servidor deve retornar?',
                options: [
                    {
                        text: '401 Unauthorized',
                        isCorrect: false
                    },
                    {
                        text: '403 Forbidden',
                        isCorrect: false
                    },
                    {
                        text: '404 Not Found',
                        isCorrect: true
                    },
                    {
                        text: '500 Internal Server Error',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Em uma aplicação que segue boas práticas de segurança para APIs REST, como o aplicativo mobile geralmente comprova que o usuário está autenticado para realizar requisições após o login inicial?',
                options: [
                    {
                        text: 'Enviando o e-mail e a senha do usuário no corpo (Body) de cada nova requisição.',
                        isCorrect: false
                    },
                    {
                        text: 'Incluindo um Token de autenticação no Header (Cabeçalho) da requisição, geralmente na chave Authorization.',
                        isCorrect: true
                    },
                    {
                        text: 'Armazenando as credenciais no banco de dados local e enviando-as via Query Parameters na URL.',
                        isCorrect: false
                    },
                    {
                        text: 'Desativando o protocolo HTTPS para permitir a leitura direta das credenciais pelo servidor.',
                        isCorrect: false
                    }
                ]
            }
        ]
    }
}