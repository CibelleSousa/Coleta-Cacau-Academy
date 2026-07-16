import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';
import { SeedModule } from './types';

export const module3: SeedModule = {
  title: '3. React Native',
  description: 'Conceitos fundamentais, Core Components, Navegação e Aplicação Prática.',
  order: 3,
  duration: 150,
  type: ModuleType.THEORY,
  lessons: [
        {
            title: 'Introdução e Conceitos Fundamentais',
            slug: 'react-native-introducao-conceitos',
            duration: '25 min',
            type: LessonType.READ,
            order: 1,
            content: `React Native é o framework que dá vida ao aplicativo Coleta Cacau, permitindo que a lógica escrita em JavaScript e TypeScript se transforme em uma experiência de usuário totalmente nativa para Android e iOS. Ele funciona como uma ponte (bridge) que traduz os componentes e a lógica declarados no código em seus equivalentes nativos da plataforma. No cenário de desenvolvimento multiplataforma, seu principal concorrente é o Flutter, um framework do Google que utiliza a linguagem Dart. Embora ambos os frameworks sejam excelentes em produzir aplicativos de alta performance, a grande vantagem do React Native para o nosso contexto é o aproveitamento do ecossistema JavaScript. Para uma equipe que já possui experiência com desenvolvimento web e React, a curva de aprendizado é significativamente menor, permitindo um desenvolvimento mais rápido e a utilização de uma vasta gama de bibliotecas e ferramentas já consolidadas na comunidade JavaScript. 

            ## Objetivo: 

            O objetivo desta seção é fornecer ao leitor os conceitos fundamentais do React aplicados ao desenvolvimento mobile, bem como apresentar os componentes e as ferramentas específicas do ecossistema React Native que foram utilizadas na construção do aplicativo. Ao final, o desenvolvedor deverá ser capaz de identificar os principais padrões de arquitetura do projeto e compreender como a lógica da aplicação se conecta com a interface do usuário. 

            ## Definição: 

            É crucial diferenciar React de React Native, pois não são a mesma coisa. O React, em sua essência, é uma biblioteca JavaScript agnóstica de plataforma, cujo único propósito é construir interfaces de usuário de forma declarativa e eficiente. Ele é o "cérebro" responsável por gerenciar componentes, estado e props. Já o React Native é o framework que pega todo o poder do React e o aplica ao universo mobile, fornecendo os componentes nativos (\`<View>\`, \`<Text>\`, etc.) e a camada de comunicação (a "ponte") que interage diretamente com o sistema operacional do celular, fornecendo a camada de renderização que traduz a lógica declarativa em componentes de interface de usuário nativos e performáticos para cada sistema operacional. 

            ## Conceitos Fundamentais: 

            A ideia central do React é a de que interfaces de usuário complexas podem ser quebradas em pequenas peças isoladas e reutilizáveis, chamadas Componentes. Pense em uma tela de aplicativo: em vez de construí-la como um arquivo monolítico, nós a dividimos em componentes como Cabecalho, ListaDeItens, ItemDaLista e Botao. 

            \`\`\`javascript
            function MyButton() {
                return (
                    <button>I'm a button</button>
                );
            }
            \`\`\`

            Cada componente gerencia seu próprio estado e lógica, e pode ser combinado com outros para formar telas completas. No React Native, a abordagem padrão e moderna é a criação de Componentes Funcionais. São, essencialmente, funções JavaScript que recebem dados (veremos isso em "Props") e retornam o que deve ser renderizado na tela. Abaixo, veja um exemplo de componente em React Native. 

            \`\`\`typescript
            import React from 'react';
            import { Text, View } from 'react-native';

            // Este é um componente funcional simples chamado 'BoasVindas'.
            // Ele recebe 'props' e retorna um elemento de UI.
            type Name = {
                name: string
            }

            function BoasVindas(props: Name) {
                return (
                    <View>
                        <Text>Seja bem-vindo ao Coleta Cacau, {props.name}!</Text>
                    </View>
                );
            }
            \`\`\`

            A sintaxe que se parece com HTML no exemplo acima é chamada de JSX (JavaScript XML). Ela nos permite escrever a estrutura da nossa UI de forma declarativa e familiar, diretamente no código JavaScript. 

            É importante entender que o JSX não é HTML e não é executado diretamente pelo dispositivo. Ele é um "facilitador", ou seja, um atalho que é convertido para chamadas de funções \`React.createElement()\` durante o processo de compilação. 

            \`\`\`javascript
            const elemento = <Text>Olá, produtor!</Text>;

            // Por debaixo dos panos:
            const elemento = React.createElement(Text, null, 'Olá, produtor!');
            \`\`\`

            Você pode injetar qualquer expressão JavaScript (variáveis, funções, etc.) dentro do JSX ao envolvê-la com chaves. 

            \`\`\`javascript
            const nomeProdutor = "João";
            const elemento = <Text>Produtor: {nomeProdutor.toUpperCase()}</Text>;
            \`\`\`

            Um componente deve sempre retornar um único elemento pai. Se precisar retornar múltiplos elementos sem um \`<View>\` para envolvê-los, você pode usar um Fragmento (\`<>...</>\`). 

            \`\`\`javascript
            // Correto
            return (
                <View>
                    <Text>Título</Text>
                    <Text>Subtítulo</Text>
                </View>
            );

            // Correto usando Fragmento
            return (
                <>
                    <Text>Título</Text>
                    <Text>Subtítulo</Text>
                </>
            );
            \`\`\`

            Se os Componentes são como funções JavaScript, as Props (abreviação de "propriedades") são seus argumentos. É a maneira como um componente pai passa dados para um componente filho, tornando-os dinâmicos e reutilizáveis. 

            As props são recebidas como um único objeto no primeiro argumento da função do componente e a regra de ouro é: as props são somente leitura (read-only).  Um componente nunca deve modificar as próprias props. Elas vêm de cima para baixo (do pai para o filho), e essa regra garante que a aplicação seja previsível. 

            Veja o nosso componente BoasVindas sendo usado por um componente "pai" chamado App: 

            \`\`\`typescript
            import React from 'react';
            import { Text, View } from 'react-native';

            // Definimos a "forma" das nossas props usando um 'type' do TypeScript.
            type BoasVindasProps = {
                nome: string;
            };

            // O componente filho que recebe os dados
            function BoasVindas(props: BoasVindasProps) {
                return (
                    <View>
                        <Text>Seja bem-vindo(a) ao Coleta Cacau, {props.nome}!</Text>
                    </View>
                );
            }

            // O componente pai que envia os dados
            export default function App() {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Usamos o componente BoasVindas duas vezes, com props diferentes */}
                        <BoasVindas nome="Cibelle" />
                        <BoasVindas nome="Produtor Anônimo" />
                    </View>
                );
            }
            \`\`\`

            Dica de código: É muito comum usar a desestruturação para extrair as props diretamente nos parâmetros da função, deixando o código mais limpo. 

            \`\`\`typescript
            import React from 'react';
            import { Text, View } from 'react-native';

            // Definimos a "forma" das nossas props usando um 'type' do TypeScript.
            type BoasVindasProps = {
                nome: string;
            };

            // O componente filho que recebe os dados
            function BoasVindas({nome}: BoasVindasProps) {
                return (
                    <View>
                        <Text>Seja bem-vindo(a) ao Coleta Cacau, {nome}!</Text>
                    </View>
                );
            }

            // O componente pai que envia os dados
            export default function App() {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Usamos o componente BoasVindas duas vezes, com props diferentes */}
                        <BoasVindas nome="Cibelle" />
                        <BoasVindas nome="Produtor Anônimo" />
                    </View>
                );
            }
            \`\`\`

            Enquanto as props são dados que vêm de fora do componente, o State (estado) é a memória interna do componente. É um conjunto de informações que o componente gerencia e que pode mudar ao longo do tempo, geralmente como resultado de uma interação do usuário. É o que torna os aplicativos interativos. 

            Em componentes funcionais, não podemos simplesmente criar uma variável com \`let\` e esperar que a tela se atualize quando ela mudar. Para gerenciar o estado, usamos Hooks. 

            O principal hook é o \`useState\`. Você chama \`useState\` passando um valor inicial para o seu estado e ele te retorna um array com exatamente dois itens: o valor do estado atual e uma função para atualizar esse estado. 

            Nunca modifique o estado diretamente. Sempre use a função de atualização fornecida pelo \`useState\`. É ao chamar essa função que você informa ao React que o estado mudou, e ele se encarrega de "re-renderizar" o componente na tela com o novo valor. 

            \`\`\`javascript
            import React, { useState } from 'react';
            import { Text, View, Button } from 'react-native';

            function Contador() {
                // 1. Chamamos useState com o valor inicial 0.
                // 2. Ele retorna 'likes' (o valor atual) e 'setLikes' (a função para atualizá-lo).
                const [likes, setLikes] = useState(0);

                return (
                    <View>
                        <Text style={{ fontSize: 24, margin: 10 }}>Likes: {likes}</Text>
                        <Button
                            title="👍 Curtir"
                            onPress={() => {
                            // 3. Ao clicar, chamamos a função 'setLikes' para atualizar o estado.
                            // O React irá re-renderizar o componente com o novo valor.
                            setLikes(likes + 1);
                            }}
                        />
                    </View>
                );
            }
            \`\`\`

            Até agora, vimos como um componente renderiza a UI com base em suas props e state. Mas e se um componente precisar fazer algo que não está diretamente relacionado à renderização? Como por exemplo: buscar dados de uma API quando a tela carrega, configurar uma assinatura (como um timer ou a localização do GPS), mudar o título de uma tela e etc. 

            Essas operações são chamadas de Efeitos Colaterais (Side Effects), pois afetam coisas fora do escopo do componente. O lugar correto para lidar com eles é no hook \`useEffect\`. Ele permite que executemos uma função "ao lado", após a renderização do componente. 

            Este hook recebe dois argumentos: uma função (o efeito) e um array de dependências (opcional). O array de dependências é a parte mais importante, pois ele controla quando o efeito deve ser executado novamente. 

            Se o array estiver vazio, o efeito roda apenas uma vez, logo após a primeira renderização do componente. Perfeito para buscar dados iniciais. Com dependências, o efeito roda na primeira renderização e sempre que qualquer valor dentro do array mudar. Útil para, por exemplo, buscar novos dados quando um ID de usuário (que vem via props) muda. 

            Sem array, o efeito roda após toda e qualquer renderização. Use com muito cuidado, pois pode causar loops infinitos. 

            \`\`\`typescript
            import React, { useState, useEffect } from 'react';
            import { Text, View, ActivityIndicator } from 'react-native';

            interface User {
                nome: string;
                email: string;
            }

            type PerfilDoUsuarioProps = {
                idDoUsuario : number
            }

            function PerfilDoUsuario({ idDoUsuario } : PerfilDoUsuarioProps) {
                const [usuario, setUsuario] = useState<User | null>(null); // verifique os Types Generics na sessão TypeScript
                const [carregando, setCarregando] = useState(true);

                useEffect(() => {
                    // Este código será executado depois que o componente for renderizado
                    console.log(\`Buscando dados para o usuário com ID: \${idDoUsuario}\`);

                    // Simula uma chamada de API
                    fetch(\`https://api.ficticia.com/users/\${idDoUsuario}\`)
                    .then(response => response.json())
                    .then(data => {
                        setUsuario(data); // Atualiza o estado com os dados recebidos
                        setCarregando(false); // Para de mostrar o loading
                    });

                }, [idDoUsuario]); // Array de dependências: refaz a busca se o idDoUsuario mudar

                if (carregando) {
                    return <ActivityIndicator size="large" color="#0000ff" />;
                }

                if (!usuario) {
                    return <Text>Não foi possível carregar os dados do usuário.</Text>;
                }

                return (
                    <View>
                        <Text>Nome do Usuário: {usuario.nome}</Text>
                        <Text>Email: {usuario.email}</Text>
                    </View>
                );
            }
            \`\`\`
            `
        },
        {
            title: 'Core Components, Estilização e Context API',
            slug: 'react-native-core-components-context',
            duration: '30 min',
            type: LessonType.READ,
            order: 2,
            content: `Agora que já compreendemos os conceitos fundamentais do React, vamos focar nas “peças” que usamos para construir a interface visual do aplicativo. 

No desenvolvimento web, estamos acostumados a usar tags HTML como \`<div>\`, \`<p>\`, \`<img>\` e \`<input>\`.  No React Native, não usamos essas tags. Em vez disso, o framework nos fornece um conjunto de componentes essenciais, chamados Core Components, que são traduzidos para os elementos de interface nativos de cada plataforma. 

Isso garante que, embora a lógica seja escrita em JavaScript, a aparência e o desempenho do aplicativo sejam verdadeiramente nativos. Os principais componentes que você usará 99% do tempo são: 

* 
**\`<View>\`:** É o bloco de construção mais fundamental, usado para criar layouts e agrupar outros componentes. Pense nele como a \`<div>\` do React Native. 


* **\`<Text>\`:** O único componente para renderizar texto. Toda e qualquer string que você queira exibir na tela precisa estar dentro de um componente \`<Text>\`. É o equivalente ao \`<p>\` ou \`<span>\`. 


* 
**\`<Image>\`:** Usado para exibir imagens, tanto de arquivos locais no projeto quanto de uma URL. É a \`<img>\` do React Native. 


* **\`<TextInput>\`:** Um componente para entrada de texto pelo usuário através do teclado. É o \`<input type="text">\`. 


* 
**\`<TouchableOpacity>\` e \`<Pressable>\`:** São componentes especiais usados para envolver outras \`<View>\`’s ou componentes e capturar interações de toque (como um clique). \`<Pressable>\` é a versão mais moderna e flexível, mas \`<TouchableOpacity>\` (que dá um efeito de opacidade ao ser pressionado) ainda é muito comum. São a base para criar botões. 


* 
**\`<ScrollView>\`:** Um container genérico que permite rolar seu conteúdo. Ele renderiza todos os seus componentes filhos de uma vez, sendo ideal para telas com poucos itens. 


* **\`<FlatList>\`:** Um componente de lista de alta performance. Ele renderiza os itens de forma "preguiçosa" (lazy loading), ou seja, apenas os itens visíveis (e alguns ao redor) são renderizados. É a escolha correta para listas longas de dados, como um feed de notícias ou uma lista de produtos. 


Não escrevemos arquivos \`.css\` no React Native. A estilização é feita diretamente no JavaScript, usando uma abordagem "CSS-in-JS". A forma recomendada de fazer isso é com a API \`StyleSheet\`. Você cria um objeto de estilos usando \`StyleSheet.create()\` e o aplica aos seus componentes através da prop \`style\`. 

Apesar de ser muito similar ao CSS que utilizamos em desenvolvimento web, o CSS aqui é um tanto diferente. Suas principais diferenças são: 

* 
**Nomenclatura:** As propriedades são escritas em camelCase (ex: \`backgroundColor\` em vez de \`background-color\`). 


* 
**Sem Cascata:** Estilos não são herdados de um componente pai para um filho da mesma forma que no CSS (com exceção de algumas propriedades de texto dentro de um \`<Text>\`). Cada componente é estilizado de forma explícita. 


* 
**Layout com Flexbox:** Flexbox é o principal sistema de layout no React Native. Ele funciona de forma muito similar ao Flexbox da web, mas com uma grande diferença: a direção padrão (\`flexDirection\`) é 'column' (de cima para baixo) em vez de 'row' (da esquerda para a direita). 


Aqui as propriedades são as props dos componentes e você pode consultar para saber mais por aqui na seção Props. Abaixo um exemplo simples do uso da função \`StyleSheet.create()\` a fim de estilizar nossa tela. 

\`\`\`javascript
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

function CardProdutor() {
    return (
        <View style={styles.card}>
            <Image
                style={styles.imagem}
                source={{ uri: 'https://marketplace.canva.com/EAFqNrAJpQs/2/0/1600w/canva-nHZ1TkZ0aGk.jpg' }}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.nome}>Maria Clara Da Silva</Text>
                <Text style={styles.fazenda}>Fazenda Boa Esperança</Text>
            </View>
        </View>
    );
}

export default function Index() {
    return (
        <>
            <CardProdutor />
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        margin: 10,
        flexDirection: 'row', // Alinha os itens lado a lado
        alignItems: 'center', // Centraliza os itens verticalmente
        // Sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 3,
    },
    imagem: {
        width: 60,
        height: 60,
        borderRadius: 30, // Deixa a imagem redonda
        marginRight: 16,
    },
    infoContainer: {
        flex: 1, // Ocupa o espaço restante
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    fazenda: {
        fontSize: 14,
        color: '#666',
    },
});
\`\`\`

## O Uso de Contextos na Criação de um Tema: 

Até agora, vimos como estilizar um componente individual. No entanto, em um aplicativo real, precisamos garantir que o estilo seja consistente e fácil de manter. Para isso, precisamos resolver um problema comum antes: como compartilhar dados de estilo sem poluir nosso código? 

Imagine que você tem um objeto theme com as cores e fontes do seu aplicativo. Para que um componente pequeno e alinhado (como um ícone dentro de um botão) use a cor primária, você teria que passar esse objeto theme como prop por toda a cadeia de componentes. 

\`\`\`javascript
// Em App.tsx
<TelaPrincipal theme={meuTema} />
<Card theme={props.theme} />
<Botao theme={props.theme} />
<Icone theme={props.theme} /> // Finalmente!
\`\`\`

Isso é ineficiente e torna a refatoração um pesadelo. É para resolver isso que usamos a Context API do React. 

Contextos permitem passar informações profundamente sem a necessidade de passar manualmente as props em cada nível. Um componente "pai" envia uma informação através do context, e qualquer componente "filho", não importa o quão distante, pode acessar essa informação diretamente. Ele funciona com três peças: \`createContext()\`, \`<Contexto>\` e \`useContext()\`. 

Invoque \`createContext\` fora de qualquer componente para criar um ou mais contextos. É um objeto que conterá nosso provedor e consumidores. 

O objeto de contexto em si, não possui nenhuma informação. Ele representa qual contexto outros componentes irão consumir ou fornecer. Geralmente, você vai usar \`<Contexto>\` em um componente acima para especificar um valor para o contexto, e invocar \`useContext(Contexto)\` em componentes abaixo para consumi-lo. 

O \`useContext(Contexto)\` é o hook que um componente filho usa para receber a informação do context. 

O \`<Contexto>\` é o componente que "emite" a informação. Tudo que estiver dentro dele terá acesso ao dado. Ele tem uma prop obrigatória chamada \`value\`, que é a informação que queremos compartilhar. 

Agora, podemos usar o Context para resolver nosso problema de estilo. Primeiro, centralizamos nossas variáveis de design e criamos o nosso context para o tema. 

\`\`\`typescript
// arquivo: theme.tsx
import { createContext } from 'react';

export const themeConfig = {
    colors: {
        primary: '#2A5B3D',
        background: '#F5F5F5',
        card: '#FFFFFF',
        text: '#333333',
        subtext: '#666666',
    },
    spacing: {
        medium: 16,
    },
    typography: {
        title: 18,
        body: 14,
    },
};

// Criamos um TIPO para o nosso objeto de tema
export type ThemeType = typeof themeConfig;

// Criamos o Contexto, informando a ele o tipo do dado que ele irá carregar
export const ThemeContext = createContext<ThemeType>(themeConfig);
\`\`\`

Em seguida, devemos prover o tema para o aplicativo. Assim, devemos envolver tudo com o provedor do nosso contexto em nosso arquivo principal. Com isso, nosso exemplo anterior poderia ser feito assim com o uso do theme: 

\`\`\`typescript
import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, ThemeType, themeConfig } from './theme'; // Importamos o Contexto e o TIPO

function CardProdutor() {
    // O hook 'useContext' lê o valor do Provider e, como nosso Contexto é tipado,
    // a variável 'theme' aqui terá o tipo 'ThemeType' automaticamente.
    const theme = useContext(ThemeContext);

    // Criamos os estilos baseados no tema recebido.
    // Colocar a função de estilos fora do componente evita que ela seja recriada a cada renderização.
    const styles = getStyles(theme);

    return (
        <View style={styles.card}>
            <Image
                style={styles.imagem}
                source={{ uri: 'https://marketplace.canva.com/EAFqNrAJpQs/2/0/1600w/canva-nHZ1TkZ0aGk.jpg' }}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.nome}>João da Silva</Text>
                <Text style={styles.fazenda}>Fazenda Boa Esperança</Text>
            </View>
        </View>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        padding: theme.spacing.medium,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imagem: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: theme.spacing.medium,
    },
    infoContainer: {
        flex: 1,
    },
    nome: {
        fontSize: theme.typography.title,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    fazenda: {
        fontSize: theme.typography.body,
        color: theme.colors.subtext,
    },
});

export default function Index() {
    return (
        // O 'value' do Provider é o nosso objeto de tema
        <SafeAreaProvider>
            <ThemeContext value={themeConfig}>
                <SafeAreaView style={styles.container}>
                {/* Agora, CardProdutor e qualquer outro componente aqui dentro
                    têm acesso ao themeConfig sem precisar de props. */}
                <CardProdutor />
                </SafeAreaView>
            </ThemeContext>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeConfig.colors.background, // Podemos usar o tema aqui também
    },
});
\`\`\`

## Estilos Específicos por Plataforma: 

Apesar do React Native nos permitir escrever um código único, em alguns casos, queremos que o visual do nosso aplicativo se alinhe perfeitamente às convenções de design de cada sistema operacional. O exemplo mais clássico é a sombra: o iOS utiliza propriedades como \`shadowColor\` e \`shadowOpacity\`, enquanto o Android usa uma propriedade simples chamada \`elevation\`. 

O React Native exporta um módulo chamado \`Platform\` que nos permite identificar em qual sistema o aplicativo está rodando e aplicar estilos de forma condicional. A forma mais organizada de fazer isso é com o método \`Platform.select()\`. 

Ao darmos um \`import {Platform} from 'react-native'\`, por exemplo, em nosso arquivo principal, podemos mudar nossa função \`getStyles\` para usar a sombra correta de cada plataforma da seguinte maneira: 

\`\`\`typescript
const getStyles = (theme: ThemeType) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        padding: theme.spacing.medium,
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        android: {
            elevation: 3,
        },
        }),
    },
    imagem: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: theme.spacing.medium,
    },
    infoContainer: {
        flex: 1,
    },
    nome: {
        fontSize: theme.typography.title,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    fazenda: {
        fontSize: theme.typography.body,
        color: theme.colors.subtext,
    },
});
\`\`\`

Dessa forma, o mesmo componente terá uma aparência nativa e adequada em ambos os sistemas. 

## Design Responsivo: 

O seu aplicativo poderá vir a ser executado em uma grande variedade de tamanhos de tela, desde celulares menores até tablets. Definir larguras e alturas com valores fixos (ex: \`width: 350\`) pode fazer com que seu layout "quebre" em telas muito pequenas ou pareça perdido em telas muito grandes. Design responsivo é a prática de criar layouts que se adaptam a diferentes dimensões. 

A abordagem moderna para obter as dimensões da tela é o hook \`useWindowDimensions\`. Ele fornece a \`width\` e a \`height\` da tela e, o mais importante, atualiza esses valores automaticamente se o usuário girar o dispositivo (mudando de retrato para paisagem). 

\`\`\`typescript
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

function LayoutResponsivo() {
    // O hook nos dá acesso às dimensões da janela do app
    const { width, height } = useWindowDimensions();

    // Podemos criar uma lógica baseada no tamanho da tela
    const isTablet = width > 768;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Dimensões da Tela: {Math.round(width)}x{Math.round(height)}
            </Text>

            {/* O layout do container de conteúdo muda se for um tablet */}
            <View style={[
                styles.contentContainer,
                isTablet && styles.tabletContentContainer // Aplica estilo extra se for tablet
            ]}>
                <View style={styles.box} />
                <View style={styles.box} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    contentContainer: {
        // Em celulares, o padrão é uma coluna
        flexDirection: 'column',
        width: '100%',
    },
    tabletContentContainer: {
        // Em telas maiores (tablets), mudamos para uma linha
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    box: {
        width: 150,
        height: 150,
        backgroundColor: '#2A5B3D',
        margin: 10,
    },
});

export default LayoutResponsivo;
\`\`\`
            `
        },
        {
            title: 'Estilos por Plataforma e Navegação',
            slug: 'react-native-plataforma-navegacao',
            duration: '35 min',
            type: LessonType.READ,
            order: 3,
            content: `Um aplicativo é uma coleção de telas, e a navegação é o que permite ao usuário se mover entre elas. O React Native não possui um sistema de navegação embutido, delegando essa tarefa para a comunidade. A solução mais popular, robusta e considerada o padrão de fato é a biblioteca React Navigation. Ela adota a filosofia do React, permitindo-nos declarar a estrutura de navegação da nossa aplicação de forma componentizada e intuitiva. 

O React Navigation é modular. Para uma navegação básica, precisamos de um conjunto de pacotes: O \`@react-navigation/native\` é o núcleo que conecta a biblioteca ao React Native; Bibliotecas para o tipo de navegação desejado (ex: \`@react-navigation/stack\` para navegação em pilha); Dependências que fornecem as peças nativas para a navegação funcionar. 

O componente fundamental que envolve toda a estrutura de navegação é o \`<NavigationContainer>\`. Ele é o responsável por gerenciar o estado da navegação (o histórico de telas visitadas) e deve ser renderizado na raiz da aplicação. 

O navegador mais comum é o Stack Navigator. Ele funciona como uma pilha de cartas: cada nova tela é colocada no topo da pilha, e o botão "voltar" remove a tela do topo, revelando a anterior. 

Vamos construir, passo a passo, um aplicativo com duas telas: Home e Perfil. Um botão na Home nos levará para a tela Perfil. 

Primeiro criamos nossas telas individualmente, sem considerarmos toda a questão de navegação. 

\`\`\`typescript
// Arquivo Home.tsx
import React from "react";
import { View, Text, Button, Alert } from "react-native";

export default function Home () {
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{marginTop: 100, fontSize:18}}>Tela Inicial</Text>
            <View style={{flex: 0.6}}>
                <Button
                title="Ir Para Perfil"
                onPress={() => Alert.alert('Botão de Perfil Pressionado')}/>
            </View>
        </View>
    );
}

// Arquivo Perfil.tsx
import React from "react";
import {View, Text, Button, Alert} from 'react-native';

export default function Perfil (){
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent:'space-between'}}>
            <Text style={{marginTop: 100, fontSize:18}}>Tela de Perfil</Text>
            <View style={{flex:0.6}}>
                <Button title="Voltar" onPress={() => Alert.alert('Botão de Voltar Pressionado.')}/>
            </View>
        </View>
    );
}
\`\`\`

Note que a priori o nosso handler nos botões se preocupa em apenas alertar o usuário de que o botão foi pressionado. 

Agora, temos que adaptar nossas telas para que lidem com a navegação. Para isso garantimos que cada “tela” receba como parâmetro uma prop especial chamada navigation. 

\`\`\`typescript
// Arquivo Home.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { StackScreenProps } from "@react-navigation/stack" //Props para navegação stack
import { RootStackParamList } from "../App"; // Importamos um type definido em App.tsx

// Definindo a Props de Home
type Props = StackScreenProps<RootStackParamList, 'Home'>

// Agora nosso handler de fato navega para a tela de Perfil
export default function Home ({navigation}: Props) {
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{marginTop: 100, fontSize:18}}>Tela Inicial</Text>
            <View style={{flex: 0.6}}>
                <Button
                title="Ir Para Perfil"
                onPress={() => navigation.navigate('Perfil')}/>
            </View>
        </View>
    );
}

// Arquivo Perfil.tsx
import React from "react";
import {View, Text, Button} from 'react-native';
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type Props = StackScreenProps<RootStackParamList, 'Perfil'>

export default function Perfil ({navigation}: Props){
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent:'space-between'}}>
            <Text style={{marginTop: 100, fontSize:18}}>Tela de Perfil</Text>
            <View style={{flex:0.6}}>
                <Button title="Voltar" onPress={() => navigation.goback()}/>
            </View>
        </View>
    );
}
\`\`\`

Agora em nosso arquivo principal nós importamos as telas e definimos a estrutura da navegação. 

\`\`\`typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Container de navegação
import { createStackNavigator } from '@react-navigation/stack'; // Cria as pilhas de navegação
import Home from './screens/Home';
import Perfil from './screens/Perfil';

// 1. Tipagem: Criamos um "mapa" das nossas rotas.
// 'undefined' significa que a rota não precisa de parâmetros.
export type RootStackParamList = {
    Home: undefined;
    Perfil: undefined;
};

// 2. Criação: Instanciamos o navegador de pilha com nosso mapa de tipos.
const Stack = createStackNavigator<RootStackParamList>();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen
                    name='Home'
                    component={Home}
                    options={{title: 'Bem-vindo!'}}>
                </Stack.Screen>
                <Stack.Screen name='Perfil' component={Perfil}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
\`\`\`

Como trabalhamos quando queremos passar parâmetros entre Telas? Raramente uma tela não precisa de detalhes/dados e para passá-los nós os incluímos no nosso “mapa” de rotas criada em nosso arquivo \`App.tsx\`. 

Primeiro informamos que a tela Perfil agora espera receber um parâmetro \`usuarioID\` do tipo string. 

\`\`\`typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Perfil from './screens/Perfil';

// Modificamos nosso tipo para que a tela Perfil receba usuarioId.
export type RootStackParamList = {
    Home: undefined;
    Perfil: {usuarioId: string};
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen
                    name='Home'
                    component={Home}
                    options={{title: 'Bem-vindo!'}}>
                </Stack.Screen>
                <Stack.Screen name='Perfil' component={Perfil}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
\`\`\`

Na tela Home, modificamos nosso handler para enviar os dados. 

\`\`\`typescript
import React from "react";
import { View, Text, Button } from "react-native";
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParamList } from "../App";

type Props = StackScreenProps<RootStackParamList, 'Home'>

// Agora nosso handler além de navegar, enviar usuarioID
export default function Home ({navigation}: Props) {
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{marginTop: 50, fontSize:18}}>Tela Inicial</Text>
            <View style={{flex: 0.6}}>
                <Button
                    title="Ir Para Perfil"
                    onPress={() => navigation.navigate('Perfil', {usuarioId: 'user-123'})}/>
            </View>
        </View>
    );
}
\`\`\`

Na tela Perfil, usamos a segunda props que a navegação nos fornece: route. O objeto \`route.params\` contém os dados que foram enviados. 

\`\`\`typescript
// Usamos a segunda props para receber usuarioID
export default function Perfil ({route, navigation}: Props){
    const {usuarioId} = route.params
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent:'space-between'}}>
            <Text style={{marginTop: 50, fontSize:18}}>Perfil do Usuário ID: {usuarioId}</Text>
            <View style={{flex:0.6}}>
                <Button title="Voltar" onPress={() => navigation.goBack()}/>
            </View>
        </View>
    );
}
\`\`\`

Em 90% dos casos você utilizará a navegação do tipo pilha. Entretanto, o React Navigation nos fornece outras ferramentas interessantes. Depois de dominar a navegação em pilha, o próximo passo natural é organizar as seções principais do seu aplicativo. É para isso que serve o Tab Navigator. 

O Tab Navigator renderiza uma barra de abas, geralmente na parte inferior da tela, que permite ao usuário alternar entre diferentes rotas de forma rápida e persistente. 

Primeiro, vamos criar mais uma tela simples: Configurações. 

\`\`\`typescript
import React from "react";
import {View, Text} from "react-native";

export default function Configuracoes() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <Text>Configurações Gerais</Text>
        </View>
    );
}
\`\`\`

Vamos também simplificar o que temos em nossa tela Home. 

\`\`\`typescript
import React from "react";
import { View, Text, Button } from "react-native";

export default function Home () {
    return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{marginTop: 50, fontSize:18}}>Tela Inicial</Text>
        </View>
    );
}
\`\`\`

Agora, em nosso arquivo principal \`App.tsx\`, configuramos o navegador de abas. 

\`\`\`typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Cria o Tab Navigator
import Ionicons from "react-native-vector-icons/Ionicons" // Biblioteca externa de Icons
import Home from './screens/Home';
import Configuracoes from './screens/Configuracoes';

// 1. Tipagem: Criamos o mapa de rotas para as abas.
export type RootTabParamList = {
    Home: undefined,
    Configuracoes: undefined
}

// 2. Criação: Instanciamos o navegador de abas.
const Tab = createBottomTabNavigator<RootTabParamList>();

// 3. Customização: Usamos screenOptions para configurar todas as abas.
function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions = {({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName = '';
                    if (route.name === 'Home'){
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Configuracoes'){
                        iconName = focused ? 'settings' : 'setting-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>
                },
                tabBarActiveTintColor: '#2A5B3D',
                tabBarInactiveTintColor: 'gray',
            })}>
                {/* 4. Telas: Declaramos cada aba e o componente correspondente. */}
                <Tab.Screen name='Home' component={Home}/>
                <Tab.Screen name='Configuracoes' component={Configuracoes}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default App;
\`\`\`

Perceba que a parte mais complicada do código na verdade é a configuração de \`screenOptions\` que mais tem relação com o uso de ícones para customização da nossa Tab Bar que com a navegação em si. 

Outra forma de navegação muito útil é o Drawer Navigator que oferece um menu lateral que desliza a partir da borda da tela. É uma ótima alternativa à abas, principalmente se há muitas seções para listar. 

O processo é muito semelhante ao que fizemos para o Tab Navigator, portanto, iremos modificar apenas nosso arquivo \`App.tsx\` do exemplo anterior. 

\`\`\`typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Cria o DrawerNavigator
import Home from './screens/Home';
import Configuracoes from './screens/Configuracoes';

// 1. Tipagem: Criamos o mapa de rotas para as abas.
export type RootDrawerParamList = {
    Home: undefined,
    Configuracoes: undefined
};

// 2. Criação: Instanciamos o navegador de gavetas
const Drawer = createDrawerNavigator<RootDrawerParamList>();

function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Home}></Drawer.Screen>
                <Drawer.Screen name="Configuracoes" component={Configuracoes}></Drawer.Screen>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default App;
\`\`\`

Raramente usamos apenas um tipo de navegador. O mais comum é aninhá-los, ou seja, colocar um navegador dentro de uma tela de outro navegador. O padrão mais comum para quando desejamos aninhar os diferentes tipos de navegação é usar um TabNavigator para as seções principais onde cada aba é, na verdade, um StackNavigator inteiro. 

Primeiramente, vamos criar quatro arquivos em branco dentro de nossa pasta screens. Nomeie-as de: \`Home.tsx\`, \`Detalhes.tsx\`, \`Perfil.tsx\` e \`EditarPerfil.tsx\`. Não se preocupe com o conteúdo dessas telas agora. 

Após criarmos os arquivos em branco, devemos criar uma pasta chamada “routes”, onde iremos criar os arquivos responsáveis pelas rotas de pilha do nosso exemplo. Dentro dessa pasta criamos um arquivo responsável pela pilha da seção Home e outro responsável pela pilha da seção Perfil. 

\`\`\`typescript
// Arquivo HomeStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack"; // Para criar as pilhas de navegação
import Home from "../screens/Home";
import Detalhes from "../screens/Detalhes";

// Mapa das nossas rotas
export type HomeStackParamList = {
    Home: undefined,
    Detalhes: {itemId: string, nameItem: string}
};

// Instanciamos o navegador de pilha com nosso mapa de tipos.
const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator (){
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
            <Stack.Screen name="Detalhes" component={Detalhes}></Stack.Screen>
        </Stack.Navigator>
    );
}
\`\`\`

\`\`\`typescript
// Arquivo PerfilStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack"; // Para criar as pilhas de navegação
import Perfil from "../screens/Perfil";
import EditarPerfil from "../screens/EditarPerfil";

// Mapa das nossas rotas
export type PerfilStackParamList ={
    Perfil: undefined,
    EditarPerfil: undefined
}

// Instanciamos o navegador de pilha com nosso mapa de tipos.
const Stack = createStackNavigator<PerfilStackParamList>();

export default function PerfilStackNavigator(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="Perfil" component={Perfil}></Stack.Screen>
            <Stack.Screen name="EditarPerfil" component={EditarPerfil}></Stack.Screen>
        </Stack.Navigator>
    );
}
\`\`\`

Agora modificamos os arquivos responsáveis pela construção de nossas telas. 

\`\`\`typescript
// Arquivo EditarPerfil.tsx
import React from "react";
import { View, Text, StyleSheet } from 'react-native'; // Componentes que vamos utilizar

// Tela
export default function EditarPerfil(){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editando Perfil...</Text>
        </View>
    );
}

// Criação do estilo da tela
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});
\`\`\`

\`\`\`typescript
// Arquivo Detalhes.tsx
import React from "react";
import { View, Text, StyleSheet } from 'react-native'; // Componentes que vamos utilizar
import { StackScreenProps } from '@react-navigation/stack'; // Cria as Props para uma tela que está em uma pilha de navegação
import { HomeStackParamList } from '../routes/HomeStack' // Contrato da nossa Lista de Parâmetros da nossa Pilha na seção Home

// Criando a Props
type Props = StackScreenProps<HomeStackParamList, 'Detalhes'>;

// A Props irá permitir extrair o ID e Nome do Usuário
export default function Detalhes({route}: Props){
    const {itemId, nameItem} = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalhes do Item</Text>
            <View style={styles.content}>
                <Text style={styles.text}>ID: {itemId}</Text>
                <Text style={styles.text}>Nome: {nameItem}</Text>
            </View>
        </View>
    );
}

// Criação do estilo da tela
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 45,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 50,
        alignSelf: 'center'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignSelf: 'center'
    },
    text: {
        fontSize: 18,
    },
});
\`\`\`

\`\`\`typescript
// Arquivo Perfil.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from 'react-native'; // Componentes que vamos utilizar
import { StackScreenProps } from "@react-navigation/stack"; // Cria as Props para uma tela que está em uma pilha de navegação
import { PerfilStackParamList } from "../routes/PerfilStack"; // Contrato da nossa Lista de Parâmetros da nossa Pilha na seção Perfil

// Criando a Props
type Props = StackScreenProps<PerfilStackParamList, 'Perfil'>

// A Props irá permitir que naveguemos para Editar Perfil através do Botão
export default function Perfil({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>
            <View style={styles.infoContainer}>
                <Text>Nome: Cibelle</Text>
                <Text>Email: cibelle@email.com</Text>
            </View>
            <View style={styles.btnContainer}>
                <Button title="Editar Perfil" onPress={() => navigation.navigate('EditarPerfil')}/>
            </View>
        </View>
    );
}

// Criação do estilo da tela
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 45,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 50,
        alignSelf: 'center'
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 14,
        marginLeft: 50,
        marginBottom: 400
    },
    btnContainer: {
        alignSelf: 'center'
    }
});
\`\`\`

\`\`\`typescript
// Arquivo Home.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native"; // Componentes que vamos utilizar
import { StackScreenProps } from "@react-navigation/stack"; // Cria as Props para uma tela que está em uma pilha de navegação
import { HomeStackParamList } from "../routes/HomeStack"; // Contrato da nossa Lista de Parâmetros da nossa Pilha na seção Home

// Criando a Props
type Props = StackScreenProps<HomeStackParamList, 'Home'>

// A Props irá permitir que naveguemos para Editar Perfil através do Botão
export default function Home ({ navigation }: Props) {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao Coleta Cacau</Text>
            <View style={styles.content}>
                <Text style={styles.subtitle}>Lista de Lotes (Simulada)</Text>
                <View style={styles.btnContainer}>
                    <Button
                        title="Ver Detalhes do Lote #88"
                        onPress={() => navigation.navigate('Detalhes', {
                        itemId: '88',
                        nameItem: 'Cacau Forasteiro - Safra 2025'
                        })}
                    />
                </View>
            </View>
        </View>
    );
}

// Criação do estilo da tela
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 50,
        alignSelf: 'center'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
        alignSelf: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        alignSelf: 'center'
    },
    btnContainer: {
        alignSelf: 'center'
    },
});
\`\`\`

Note que até aqui, apenas repetimos o que fizemos anteriormente para navegação em pilha. É no arquivo \`App.tsx\` que aplicamos o conceito de “nesting” (aninhar os navegadores). Vamos aninhar nossas duas pilhas de navegação em um Tab Navigator. 

\`\`\`typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Container de navegação
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Cria a Barra de Navegação Inferior
import HomeStackNavigator from './routes/HomeStack'; // Importa a pilha de navegação da seção Home
import PerfilStackNavigator from './routes/PerfilStack'; // Importa a pilha de navegação da seção Perfil

// Instanciamos a Barra de Navegação
const Tab = createBottomTabNavigator();

function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown: false}}>
                <Tab.Screen name="Home" component={HomeStackNavigator} />
                <Tab.Screen name="Perfil" component={PerfilStackNavigator} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default App;
\`\`\`
            `
        },
        {
            title: 'Exercício Prático: Consolidando o React Native',
            slug: 'react-native-exercicio-pratico',
            duration: '60 min',
            type: LessonType.READ,
            order: 4,
            content: `Até aqui vimos conceitos essenciais no desenvolvimento de aplicativos em React-Native. A fim de garantir que você consolide todos os conceitos trabalhados, esta seção é a aplicação dos conceitos tendo como referência o aplicativo Coleta-Cacau. 

Neste tutorial estaremos começando um projeto React-Native sem o uso de um framework (Expo) a fim de rodarmos o projeto no Android Studio. Por isso, é necessário seguir o guia de Configuração de Ambiente disponível na documentação oficial do React-Native antes de continuar a leitura desta seção. 

Abra seu terminal dentro do Disco Local de seu computador. Digite o comando: \`npx @react-native-community/cli init exemplo1 y\` e aguarde a instalação das dependências. 

Após sucesso digite o comando: \`cd exemplo1\` e em seguida \`code\`. 

O Visual Studio Code deve abrir um template de projeto em React-Native que foi criado em seu Disco Local. Abaixo uma imagem para referência.

![Visual Studio Code com template do React Native](COLE_A_URL_DA_IMAGEM_AQUI)

O primeiro passo é garantir que você irá conseguir rodar esse template no Android Studio. Então abra-o, clique em “More Actions” e “Virtual Device Manager”. Você deve criar um AVD (tenha sempre em mente as recomendações oficiais da documentação do React-Native). 

Após criar seu AVD, clique em “Start” e aguarde. 

Em seu VSCode já aberto com o template, você deve abrir um novo terminal e digitar o comando: \`npm start\` e aguardar o êxito do comando. 

Abra um novo terminal, ainda no VSCode, e digite o comando: \`npm run android\`.  O primeiro build é sempre demorado, fique tranquilo. Os futuros builds do projeto serão mais velozes. 

Caso você tenha seguido todos os passos corretamente até aqui, você deve estar vendo o template rodar sem problemas num simulador Android. Imagem de referência abaixo.

![Template rodando no simulador Android](COLE_A_URL_DA_IMAGEM_AQUI)

Em seguida, digite em seu terminal o comando: \`md src && cd src && md components screens routes types\`. Este comando deve criar a pasta “src” e as subpastas “components”, “screens”, “routes” e “types” dentro desta.  (Certifique-se de estar dentro da pasta exemplo1 para rodar este comando). 

No terminal que está rodando o servidor do aplicativo, tecle “Ctrl” + C e aguarde o encerramento do servidor.  Digite em seu terminal: \`move "C:\ReactN\exemplo1\App.tsx" "C:\ReactN\exemplo1\src"\`. Este comando moverá o arquivo \`App.tsx\` para dentro da pasta “src”. 

Na pasta raiz do projeto, modifique o arquivo \`index.js\` pelo VSCode na linha que contém \`import App from "./App"\` para \`import App from "./src/App"\`. 

Crie na pasta screens os arquivos: \`About.tsx\`, \`HomogeneusArea.tsx\`, \`Profile.tsx\` e \`Property.tsx\`. Por enquanto deixe esses arquivos em branco. 

Em seu terminal digite o comando: \`npm install @react-navigation/native\`. Depois digite: \`npm install react-native-screens react-native-safe-area-context\`. 

Agora é preciso instalar as bibliotecas específicas das navegações que utilizaremos. Primeiramente, instale as bibliotecas para uma navegação de pilha digitando em seu terminal: \`npm install @react-navigation/stack react-native-gesture-handler\`. 

Em seguida, instale as dependências para a Barra de Navegação digitando no terminal: \`npm install @react-navigation/bottom-tabs\`. 

Dentro do arquivo \`Property.tsx\` crie o esqueleto da nossa função principal: 

\`\`\`typescript
export default function Property(){} 
\`\`\`

Faremos o mesmo dentro do arquivo \`HomogeneusArea.tsx\`: 

\`\`\`typescript
export default function HomogeneusArea(){} 
\`\`\`

Dentro da pasta “routes” crie o arquivo: \`HomeStack.tsx\`. Nesta pasta devemos criar a navegação em pilha que leva a tela Property para a tela HomogeneusArea. 

Realize os imports necessários dentro deste arquivo: 

\`\`\`typescript
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Property from "../screens/Property";
import HomogeneusArea from "../screens/HomogeneusArea";
\`\`\`

Crie o mapa dessa rota: 

\`\`\`typescript
export type HomeStackParamList = {
    Property: undefined,
    HomogeneusArea: undefined
}
\`\`\`

Instancie a pilha: 

\`\`\`typescript
const Stack = createStackNavigator<HomeStackParamList>(); 
\`\`\`

Agora construa a navegação em pilha na função principal do arquivo: 

\`\`\`typescript
export default function HomeStackNavigator(){
    return (
        <Stack.Navigator initialRouteName="Property">
            <Stack.Screen name="Property" component={Property}/>
            <Stack.Screen name="HomogeneusArea" component={HomogeneusArea}/>
        </Stack.Navigator>
    );
}
\`\`\`

É normal que o VSCode aponte um erro na props “component” de cada \`Stack.Screen\`. Essa props espera receber um componente e por enquanto nossas funções nos arquivos \`Property.tsx\` e \`HomeStack.tsx\` retornam void. 

Vamos começar a desenvolver essas telas então. Olhando nossa imagem de referência, podemos notar que a tela Property contém uma lista de itens que representam as propriedades(fazendas) de um usuário.  Cada propriedade desta possui uma lista de áreas homogêneas. Assim, o primeiro passo é criar os componentes destas telas. 

Dentro da pasta “components” crie o arquivo \`ItemProvider.tsx\`. Dentro desse arquivo faça os imports: 

\`\`\`typescript
import React from "react";
import {StyleSheet, Text, TouchableOpacity } from 'react-native';
\`\`\`

Este componente será composto inicialmente por um \`TouchableOpacity\` e um \`Text\`. 

\`\`\`typescript
export default function ItemProvider(){
    return (
        <TouchableOpacity>
            <Text>Fazenda Palmeiras</Text>
        </TouchableOpacity>
    );
} 
\`\`\`

Agora aplique um pouco de estilo aos componentes com: 

\`\`\`typescript
const styles = StyleSheet.create ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2E4858',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 10,
        width: 375,
        height: 45,
        alignItems: 'center'
    },
    title: {
        flex: 1,
        color: '#ffffff'
    }
}); 
\`\`\`

Modifique o \`ItemProvider()\` para aplicar os estilos. A props \`activeOpacity\` modifica a intensidade da opacidade do componente ao ser pressionado. 

\`\`\`typescript
export default function ItemProvider(){
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} >
            <Text style={ styles.title }>Fazenda Palmeiras</Text>
        </TouchableOpacity>
    );
} 
\`\`\`

Agora vamos modificar o arquivo \`Property.tsx\` para que este retorne o componente que acabamos de criar. 

Comece realizando os imports: 

\`\`\`typescript
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemProvider from "../components/ItemProvider";
\`\`\`

Construa a função principal: 

\`\`\`typescript
export default function Property(){
    return (
        <View style={styles.container}>
            <ItemProvider/>
        </View>
    );
}
\`\`\`

Construa uma folha de estilo simples: 

\`\`\`typescript
const styles = StyleSheet.create ({
    container: {
        display: 'flex',
        maxWidth: 400,
        marginLeft: 5,
        alignItems: 'center',
        marginTop: 75
    }
}); 
\`\`\`

Na tela do seu simulador deve ter algo como: 

![Lista de propriedades no simulador](COLE_A_URL_DA_IMAGEM_AQUI)

Entretanto, nessa tela desejamos criar uma lista de propriedades do usuário.  Então, precisamos de uma “base de dados” para simular essa lista. Por enquanto, vamos utilizar um arquivo com dados mocados. Crie uma pasta chamada “data” e dentro dela crie os arquivos: \`mockedProperty.type.ts\` e \`mockedProperty.ts\`. 

Dentro do arquivo \`mockedProperty.type.ts\` crie o type dos nossos dados mocados como: 

\`\`\`typescript
export type PropertyProvider = {
    id: string,
    name: string
}; 

\`\`\`

Dentro do arquivo \`mockedProperty.ts\` crie uma lista do tipo \`PropertyProvider\` e preencha com dados de sua preferência. Lembre-se de seguir o contrato pré-definido no arquivo anterior. 

\`\`\`typescript
import { PropertyProvider } from "./mockedProperty.types";
const mockedProperties: PropertyProvider[] = [
    {id: '1234', name: 'Fazenda Palmeiras'},
    {id: '1235', name: 'Arrendamento Uruçuca'},
    {id: '1236', name: 'Monte Claro'},
    {id: '1237', name: 'Fazenda Felícia'},
    {id: '1238', name: 'Fazenda Sião'},
    {id: '1239', name: 'Arrendamento de Bom Jesus'}
];
export default mockedProperties; 
\`\`\`

Vamos modificar nosso componente \`ItemProvider\` para que ele receba nossos dados mocados. Crie uma Props para nosso componente, passe-o como parâmetro na função e utilize-o no lugar de “Fazenda Palmeiras” dentro do componente \`Text\`. 

\`\`\`typescript
import React from "react";
import {StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PropertyProvider } from "../data/mockedProperty.types";
export type ItemProviderProps = {
    item: PropertyProvider
};
export default function ItemProvider({ item }: ItemProviderProps){
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} >
            <Text style={ styles.title}>{item.name}</Text>
        </TouchableOpacity>
    );
}
\`\`\`

Agora devemos construir um componente que irá renderizar uma lista de itens. Dentro da pasta components crie o arquivo \`ItemList.tsx\`. Comece pelos imports: 

\`\`\`typescript
import React from "react";
import { FlatList } from "react-native";
import ItemProvider from "./ItemProvider";
import { PropertyProvider } from "../data/mockedProperty.types";
\`\`\`

Crie uma Props para nosso componente e passe-o como parâmetro na função do arquivo. Utilize o componente \`FlatList\` para utilizar nossos dados mocados. 

\`\`\`typescript
export type ItemListProps = {
    itens: PropertyProvider[]
};
export default function ItemList ({ itens }: ItemListProps){
    return (
        <FlatList
            data={itens}
            renderItem={({item}) => <ItemProvider item={item}/>}
            keyExtractor={item => item.id}
            style={{width: '100%'}}
        />
    );
} 
\`\`\`

No arquivo \`Property.tsx\` remova o import do \`ItemProvider\` e adicione o import do \`ItemList\` e do \`mockedProperties\`. 

\`\`\`typescript
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemList from "../components/ItemList";
import mockedProperties from "../data/mockedProperty"; 
\`\`\`

Modifique a função do arquivo para que o \`ItemProvider\` seja renderizado em sua tela do simulador. Lembre-se de passar os dados mocados como parâmetro da Props de \`ItemProvider\`. 

\`\`\`typescript
export default function Property(){
    return (
        <View style={styles.container}>
            <ItemList itens={mockedProperties}></ItemList>
        </View>
    );
}
\`\`\`

Apenas por questões estéticas vamos mudar o estilo do \`ItemProvider\` para diminuir o espaçamento entre os cards.  Além disso, vamos adicionar um ícone no card. Comece digitando em seu terminal o comando: 

\`\`\`shell
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/react-native-fontawesome
npm install @fortawesome/free-solid-svg-icons
npm install react-native-svg 
\`\`\`

No arquivo \`ItemProvider.tsx\`, realize os imports necessários e faça uma leve alteração nas margens no styles: 

\`\`\`typescript
import React from "react";
import {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PropertyProvider } from "../data/mockedProperty.types";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';  // biblioteca que utilizaremos para os ícones
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";  // o ícone que estamos utilizando

export type ItemProviderProps = {
    item: PropertyProvider
};
export default function ItemProvider({ item }: ItemProviderProps){
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} >
            <Text style={ styles.title}>{item.name}</Text>
            <FontAwesomeIcon icon= {faChevronRight} size={15} color="white"/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2E4858',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        marginBottom: 12, // mudança na margem
        width: 'auto', //preenche respeitando a margem
        height: 45,
        alignItems: 'center',
    },
    title: {
        flex: 1,
        color: '#ffffff'
    }
}); 
\`\`\`

Seu simulador deve estar parecido com a tela abaixo: 

![Simulador com lista de fazendas e ícones](COLE_A_URL_DA_IMAGEM_AQUI)

Agora, vamos montar a tela \`HomogeneusArea\`. Para isso, vamos precisar alterar os dados mocados para que agora as áreas homogêneas sejam representadas. Além disso, algumas mudanças serão necessárias em \`ItemList\` e \`ItemProvider\` para que eles lidem com os dados de uma maneira mais genérica, afinal, esses componentes devem renderizar tanto a lista de propriedades quanto a lista de áreas homogêneas. 

Então comecemos alterando os arquivos \`mockedProperty.types\` e \`mockedProperty\`: 

\`\`\`typescript
// Arquivo mockedProperty.types
export type HomogeneusAreaProvider = {
    id: string,
    name: string
}
export type PropertyProvider = {
    id: string,
    name: string,
    areas: HomogeneusAreaProvider[]
}; 
\`\`\`

\`\`\`typescript
// Arquivo mockedProperty
import { PropertyProvider } from "./mockedProperty.types";
const mockedProperties: PropertyProvider[] = [
    {
        id: '1234', 
        name: 'Fazenda Palmeiras',
        areas: [
            {id: '1231', name: 'Área Homogênea 1'},
            {id: '1232', name: 'Área Homogênea 2'}
        ]
    },
    {
        id: '1235', 
        name: 'Arrendamento Uruçuca',
        areas: [
            {id: '1233', name: 'Área Homogênea 1'},
        ]
    },
    {
        id: '1236', 
        name: 'Monte Claro',
        areas: [
            {id: '1234', name: 'Área Homogênea 1'},
            {id: '1235', name: 'Área Homogênea 2'}
        ]
    },
    {
        id: '1237', 
        name: 'Fazenda Felícia',
        areas: [
            {id: '1236', name: 'Área Homogênea 1'},
            {id: '1237', name: 'Área Homogênea 2'},
            {id: '1238', name: 'Área Homogênea 3'}
        ]
    },
    {
        id: '1238', 
        name: 'Fazenda Sião',
        areas: [
            {id: '1239', name: 'Área Homogênea 1'},
        ]
    },
    {
        id: '1239', 
        name: 'Arrendamento de Bom Jesus',
        areas: [
            {id: '1240', name: 'Área Homogênea 1'},
        ]
    }
];
export default mockedProperties; 
\`\`\`

Agora, alteremos o \`ItemProvider.tsx\` e o \`ItemList.tsx\`. A principal mudança será nas Props: 

\`\`\`typescript
// Arquivo ItemProvider
import React from "react";
import {StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
export type ItemNameProps = {
    id: string,
    name: string
};
export default function ItemProvider({ id, name }: ItemNameProps){
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} >
            <Text style={styles.title}>{name}</Text>
            <FontAwesomeIcon icon= {faChevronRight} size={15} color="white"/>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2E4858',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        marginBottom: 12,
        width: 'auto',
        height: 45,
        alignItems: 'center',
    },
    title: {
        flex: 1,
        color: '#ffffff'
    }
}); 
\`\`\`

\`\`\`typescript
// Arquivo ItemList
import React from "react";
import { FlatList } from "react-native";
import ItemProvider from "./ItemProvider";
export type ItemListProps = {
    itens : {
        id: string,
        name: string
    }[]
};
export default function ItemList ({ itens }: ItemListProps){
    return (
        <FlatList
            data={itens}
            renderItem={({item}) => <ItemProvider id={item.id} name={item.name}/>}
            keyExtractor={item => item.id}
            style={{width: '100%'}}
        />
    );
} 
\`\`\`

Por fim, montamos a \`HomogeneusArea.tsx\`. Comece pelos imports: 

\`\`\`typescript
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemList from "../components/ItemList";
import mockedProperties from "../data/mockedProperty"; 
\`\`\`

Essa tela precisa saber qual fazenda foi clicada para mostrar apenas as áreas dela.  Ela vai receber essa informação via parâmetros de navegação. Por enquanto, vamos simular que recebemos um ID “1234” da Fazenda Palmeiras. 

\`\`\`typescript
const PROPERTY_ID = '1234';  // Temporário, utilizaremos as props de navegação depois
export default function HomogeneusArea(){
const selectedProperty = mockedProperties.find(
    (propriedade) => propriedade.id === PROPERTY_ID
);
const propertyHomogeneusArea = selectedProperty?.areas || [];
return (
        <View style={styles.container}>
            <ItemList itens={propertyHomogeneusArea}></ItemList>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        display: 'flex',
        maxWidth: 400,
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 75,
    }
}); 
\`\`\`

A partir de agora vamos finalmente voltar a abordar a navegação deste exercício. O objetivo é criar uma navegação em pilha entre as telas Property e HomogeneusArea. Para que isso funcione, precisamos fazer mudanças em \`ItemProvider\` e \`ItemList\`. 

Em \`ItemProvider\`, vamos adicionar um atributo opcional na Props de nosso componente.  Sua função é alertar quando nosso componente for pressionado. Criamos também uma função justamente para lidar com o componente ativado pelo toque. 

\`\`\`typescript
export type ItemNameProps = {
    id: string,
    name: string,
    onPress?: (id: string) => void
};
export default function ItemProvider({ id, name, onPress }: ItemNameProps){
    const handlePress = () => {
        if (onPress) {
            onPress(id);  // Chama a função passando o próprio ID
        }
    }
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={handlePress}>
            <Text style={styles.title}>{name}</Text>
            <FontAwesomeIcon icon= {faChevronRight} size={15} color="white"/>
        </TouchableOpacity>
    );
} 
\`\`\`

Em \`ItemList\`, vamos adicionar um atributo opcional na Props de nosso componente para que o alerta possa ser repassado. 

\`\`\`typescript
export type ItemListProps = {
    itens : { id: string, name: string }[],
    onItemPress? : (id: string) => void
};
export default function ItemList ({ itens, onItemPress }: ItemListProps){
    return (
        <FlatList
            data={itens}
            renderItem={({item}) => <ItemProvider id={item.id} name={item.name} onPress={onItemPress}/>}
            keyExtractor={item => item.id}
            style={{width: '100%'}}
        />
    );
}
\`\`\`

Agora vamos fazer com que a navegação em pilha funcione. No arquivo \`HomeStack.tsx\`, modifique o tipo do atributo HomogeneusArea em \`HomeStackParamList\`. Precisamos do id das propriedades para que a nossa navegação em pilha funcione da maneira esperada e é isso que estamos fazendo aqui. 

\`\`\`typescript
export type HomeStackParamList = {
    Property: undefined,
    HomogeneusArea: {propertyId: string}
}; 
\`\`\`

No arquivo \`Property.tsx\` importe a \`HomeStackParamList\` e a \`StackScreenProps\`. Depois crie e tipifique a Props dessa tela. Passe-a como parâmetro para nossa função do arquivo e crie uma função que deve realizar a navegação para quando o usuário pressionar um \`ItemProvider\`. 

\`\`\`typescript
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemList from "../components/ItemList";
import mockedProperties from "../data/mockedProperty";
import { HomeStackParamList } from "../routes/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<HomeStackParamList, 'Property'>;
export default function Property({navigation}: Props){
    const handleItemPress = (id: string) => {
        navigation.navigate('HomogeneusArea', {propertyId: id})
    }   
    return (
        <View style={styles.container}>
            <ItemList 
                itens={mockedProperties} 
                onItemPress= {handleItemPress}>
            </ItemList>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        maxWidth: 400,
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 20,
    }
}); 
\`\`\`

No arquivo \`HomogeneusArea.tsx\` importe a \`HomeStackParamList\` e a \`StackScreenProps\`. Depois crie e tipifique a Props dessa tela.  Passe-a como parâmetro para nossa função do arquivo. Além disso, vamos modificar nossa função principal para que ela pare de usar o \`PROPERTY_ID\` fixo e comece a usar o id que recebemos da navegação. 

\`\`\`typescript
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemList from "../components/ItemList";
import mockedProperties from "../data/mockedProperty";
import { HomeStackParamList } from "../routes/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<HomeStackParamList, 'HomogeneusArea'>
export default function HomogeneusArea({ route } : Props){
    const {propertyId} = route.params;
    const selectedProperty = mockedProperties.find( (proprierty) => proprierty.id === propertyId);
    const propertyHomogeneusArea = selectedProperty?.areas || [];
    return (
        <View style={styles.container}>
            <ItemList itens={propertyHomogeneusArea}></ItemList>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        maxWidth: 400,
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 20,
    }
}); 
\`\`\`

Em \`App.tsx\` importe a \`HomeStackNavigator\` e utilize-a. 

\`\`\`typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigator from './routes/HomeStack';
export default function App() {
    return (
        <NavigationContainer>
            <HomeStackNavigator/>
        </NavigationContainer>
    );
} 
\`\`\`

Ademais, realizei umas mudanças de estilo em \`ItemProvider\` e aumentei o tamanho do ícone utilizado para 16. 

\`\`\`typescript
const styles = StyleSheet.create ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#2E4858',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        marginBottom: 10,
        width: 'auto',
        height: 50,
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff'
    }
}); 
\`\`\`

Se tudo tiver corrido bem, você deve obter telas parecidas como as imagens abaixo: 

![Telas de Propriedades e Áreas Homogêneas funcionando](COLE_A_URL_DA_IMAGEM_AQUI)

Perceba que apesar de funcional, a navegação ainda precisa de melhorias, afinal, o ideal é que o usuário veja em sua tela a quem aquelas áreas homogêneas pertencem para que não se perca em meio a navegação. 

Para isso vamos customizar visualmente o Header da Navegação. Toda customização visual do navegador acontece na Prop options de cada componente \`Stack.Screen\` ou na Prop \`screenOptions\` do componente \`Stack.Navigator\` para que apliquemos o estilo de uma única vez em todas as telas da pilha. Vamos optar por utilizar a \`screenOptions\` aqui já que ambas as telas da nossa pilha são esteticamente iguais. 

Em \`HomeStack.tsx\`, importe os dados mocados. Adicione a Prop \`screenOptions\` ao \`Stack.Navigator\` e a prop options para cada \`Stack.Screen\` para mudar o título nos headers. 

\`\`\`typescript
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Property from "../screens/Property";
import HomogeneusArea from "../screens/HomogeneusArea"
import mockedProperties from "../data/mockedProperty";

export type HomeStackParamList = {
    Property: undefined,
    HomogeneusArea: {propertyId: string}
};
const Stack = createStackNavigator<HomeStackParamList>();
export default function HomeStackNavigator(){
    return (
        <Stack.Navigator 
            initialRouteName="Property"
            screenOptions={{
                headerStyle: {
                    height: 80,
                    backgroundColor: '#fff1'
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 16,
                },
                headerTitleAlign: 'center',
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen 
                name="Property" 
                component={Property} 
                options={{
                    title: 'Propriedades'
                }}
            />
            <Stack.Screen 
                name="HomogeneusArea" 
                component={HomogeneusArea}
                options={({ route }) => {
                    const { propertyId } = route.params;
                    const propertyName = mockedProperties.find(
                        property => property.id === propertyId
                    )?.name;
                    return {
                        title: \`\${propertyName} - Áreas Homogêneas\`
                    };
                }}
            />
        </Stack.Navigator>
    );
} 
\`\`\`

Observe que o título da tela de áreas homogêneas é feito de forma que a Prop options se torna uma função que recebe \`{route}\`, utilizada para passar o id da propriedade e assim garantir que iremos utilizar o nome correto da propriedade que estamos acessando na pilha. 

Essa solução que adotamos não é a melhor possível, pois enfrentaremos problemas quando o título for muito grande.  Mas por enquanto é suficiente para os nossos objetivos. Se tudo tiver corrido bem o resultado será semelhante às telas abaixo: 

![Header customizado nas telas de navegação](COLE_A_URL_DA_IMAGEM_AQUI)

Nosso próximo passo será implementar a barra de navegação inferior que nos permitirá navegar para as telas Profile e About de nosso aplicativo. 

Primeiramente faça as telas Profile e About. Lembre-se que estamos trabalhando com dados mocados nesse exercício, então para pôr em prática o uso de Props para passar os dados para um componente, crie um arquivo de dados mocados para um usuário fictício.  Por enquanto, não nos preocuparemos em ligar esses novos dados mocados aos dados de propriedades. Abaixo imagens para referência: 

![Telas Profile e About com dados mocados](COLE_A_URL_DA_IMAGEM_AQUI)

Uma vez que tenha feito-as, vamos começar a implementar nossa navegação principal por meio de uma barra de navegação inferior.  Comece criando o arquivo \`TabNavigator.tsx\` dentro da pasta routes. Iremos criar nossa barra de navegação dentro deste arquivo e esta irá aninhar nossa stack criada anteriormente e as telas \`About.tsx\` e \`Profile.tsx\`. 

Mas vamos dar um passo atrás aqui antes mesmo de escrevermos nossas primeiras linhas dentro \`TabNavigator.tsx\`. Nossa barra de navegação utilizará ícones customizados para poder assemelhar-se à referência. Então, dentro da pasta components crie o arquivo \`CustomIcons.tsx\`. 

Iremos utilizar uma biblioteca externa para facilitar nosso trabalho aqui: A fontAwsomeIcons. Ela disponibiliza uma série de ícones que podemos utilizar em nossa aplicação. No seu terminal escreva o comando: \`npm install @fortawesome/react-native-fontawesome @fortawesome/free-solid-svg-icons react-native-svg @fortawesome/fontawesome-svg-core@^6.5.2\`. 

Dentro de \`CustomIcons.tsx\` faça os imports. 

\`\`\`typescript
import React from "react";
import { View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCircleInfo, faCircleUser } from "@fortawesome/free-solid-svg-icons"; 
\`\`\`

Crie a Props que utilizaremos em alguns de nossos componentes. 

\`\`\`typescript
export type IconsProps ={
    focused: boolean
} 
\`\`\`

Crie os componentes \`CustomHome()\`, \`CustomAbout()\`, \`CustomProfile()\`: 

\`\`\`typescript
export function CustomHome(){
    return (
        <View style={{position: 'relative', width:60, height:60, backgroundColor: '#2E4858', alignItems: 'center', borderRadius: 100, paddingVertical: 16, marginBottom: 40}}>
            <FontAwesomeIcon icon={faHome} size={28} color="#fff"/>
        </View>
    );
}
export function CustomAbout({focused}: IconsProps){
    const tintColor = focused? '#2E4858': 'gray';
    return (
        <View style={{marginTop: 25}}>
            <FontAwesomeIcon icon={faCircleInfo} size={28} style={{color:tintColor}}/>
            <Text style={{fontSize: 11, color: tintColor, fontWeight:'600'}}>Sobre</Text>
        </View>
    );
}
export function CustomProfile({focused}: IconsProps){
    const tintColor = focused? '#2E4858': 'gray';
    return (
        <View style={{marginTop: 25}}>
            <FontAwesomeIcon icon={faCircleUser} size={28} style={{color:tintColor}}/>
            <Text style={{fontSize: 11, color: tintColor, fontWeight:'600', alignSelf:'center'}}>Perfil</Text>
        </View>
    );
} 
\`\`\`

Note que \`focused\` é um booleano que quando verdadeiro muda a cor de dois de nossos ícones, enquanto que nosso ícone Home sempre estará em destaque. 

Voltando à \`TabNavigator.tsx\`, comece importando tudo que necessitamos para o funcionamento da nossa navegação. 

\`\`\`typescript
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeStackNavigator from "./HomeStack";
import Profile from "../screens/Profile";
import About from "../screens/About";
import mockedUser from "../data/mokedUser";
import { CustomAbout, CustomHome, CustomProfile } from "../components/customIcons"; 
\`\`\`

Crie a barra de navegação. 

\`\`\`typescript
const Tab = createBottomTabNavigator(); 
\`\`\`

E finalmente crie o nosso componente. 

\`\`\`typescript
export default function TabNavigator(){
    return(
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Home" 
                screenOptions={{
                    headerShown: false, 
                    tabBarStyle:{
                        position: 'absolute',
                        bottom: 25,
                        left: 20,
                        right: 20,
                        elevation: 5,
                        backgroundColor: '#fff',
                        borderRadius: 15,
                        height: 70,
                        width: '90%',
                        marginLeft: 20
                    },
                    tabBarShowLabel: false,
                }}
            >
                <Tab.Screen 
                    name="Sobre" 
                    component={About}
                    options={{
                        tabBarIcon: ({focused}) => {
                        return <CustomAbout focused={focused}/> 
                        }
                    }}
                />
                <Tab.Screen 
                    name="Home" 
                    component={HomeStackNavigator}
                    options={{
                        tabBarIcon: () => {
                            return <CustomHome/>
                        }
                    }}
                />
                <Tab.Screen 
                    name="Perfil" 
                    component={() => <Profile user={mockedUser}/>}
                    options={{
                        tabBarIcon: ({focused}) => {
                            return <CustomProfile focused={focused}/>
                        }
                    }} 
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
} 
\`\`\`

Note que \`screenOptions\` é justamente a propriedade que nos permite estilizar nossa barra de navegação. Ademais, options é uma propriedade com a mesma função, mas que aplica estilos específicos para cada sessão na nossa barra. 

Outra coisa importante de notar é que é aqui que passamos o booleano utilizado por nossos componentes em \`CustomIcons.tsx\`. Isso garante que a troca de cor dos nossos ícones conforme estejamos ou não naquela navegando aquela seção da barra. 

Se tudo tiver corrido bem, você deve ter uma aplicação parecida com as imagens abaixo. 

![Aplicação final com Tab Navigator e ícones customizados](COLE_A_URL_DA_IMAGEM_AQUI)

Este projeto está disponível neste repositório. (inserir link depois)
`
        }
    ],
    quiz: {
        title: 'Quiz: Fundamentos e Navegação no React Native',
        description: 'Teste seus conhecimentos sobre componentes, estado, estilização e navegação entre telas no React Native.',
        passingScore: 70,
        questions: [
            {
                text: 'No desenvolvimento com React Native, não utilizamos tags HTML tradicionais como `<div>` ou `<p>`. Qual é o Core Component equivalente à tag `<div>` do desenvolvimento web, utilizado para criar layouts e agrupar outros componentes?',
                options: [
                    {
                        text: '<Container>',
                        isCorrect: false
                    },
                    {
                        text: '<Layout>',
                        isCorrect: false
                    },
                    {
                        text: '<View>',
                        isCorrect: true
                    },
                    {
                        text: '<Box>',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Como gerenciamos o estado interno de um componente funcional no React Native para que a interface seja re-renderizada corretamente quando o valor muda?',
                options: [
                    {
                        text: 'Declarando uma variável com `let` e alterando seu valor diretamente no código.',
                        isCorrect: false
                    },
                    {
                        text: 'Utilizando o hook `useState`, que fornece o valor atual do estado e uma função para atualizá-lo.',
                        isCorrect: true
                    },
                    {
                        text: 'Passando o estado via Props para o componente pai e forçando o pai a re-renderizar.',
                        isCorrect: false
                    },
                    {
                        text: 'Utilizando o hook `useEffect` para modificar variáveis locais.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Ao utilizar o Stack Navigator do React Navigation, como uma tela de destino pode acessar parâmetros (como um ID) enviados pela tela de origem durante a navegação?',
                options: [
                    {
                        text: 'Através do objeto `route.params`, que contém os dados passados na função `navigation.navigate()`.',
                        isCorrect: true
                    },
                    {
                        text: 'Através do objeto `navigation.params`, acessível diretamente na prop de navegação.',
                        isCorrect: false
                    },
                    {
                        text: 'Os parâmetros devem ser salvos obrigatoriamente no Context API antes de trocar de tela.',
                        isCorrect: false
                    },
                    {
                        text: 'Através de Props padrão passadas diretamente na declaração do componente `<Stack.Screen>`.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Precisamos renderizar uma lista muito longa de dados no aplicativo. Qual componente do React Native é a escolha mais adequada para garantir alta performance, renderizando apenas os itens visíveis na tela (lazy loading)?',
                options: [
                    {
                        text: '<ScrollView>',
                        isCorrect: false
                    },
                    {
                        text: '<VirtualListView>',
                        isCorrect: false
                    },
                    {
                        text: '<FlatList>',
                        isCorrect: true
                    },
                    {
                        text: '<ListView>',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual é a principal diferença do comportamento padrão do Flexbox no React Native em comparação com o Flexbox utilizado no desenvolvimento Web?',
                options: [
                    {
                        text: 'No React Native, o Flexbox não pode ser utilizado para criar layouts; é necessário usar Grid layout.',
                        isCorrect: false
                    },
                    {
                        text: 'No React Native, a direção padrão (`flexDirection`) é "column" (de cima para baixo), enquanto na web é "row" (da esquerda para a direita).',
                        isCorrect: true
                    },
                    {
                        text: 'No React Native, não é possível centralizar itens usando `justifyContent` e `alignItems`.',
                        isCorrect: false
                    },
                    {
                        text: 'No React Native, as propriedades de estilo devem ser escritas em kebab-case (ex: `background-color`), assim como no CSS comum.',
                        isCorrect: false
                    }
                ]
            }
        ]
    }
};