import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';
import { SeedModule } from './types';

export const module1: SeedModule = {
    title: '1. JavaScript (Fundamentos)',
    description: 'Fundamentos da linguagem JavaScript para o desenvolvimento em React Native.',
    order: 1,
    duration: 40,
    type: ModuleType.THEORY,
    lessons: [
        {
            title: 'Introdução e Definição',
            slug: 'javascript-introducao-e-definicao',
            duration: '10 min',
            type: LessonType.READ,
            order: 1,
            content: `O JavaScript é a linguagem de programação fundamental sobre a qual o React Native foi construído. No contexto do aplicativo Coleta Cacau, o JavaScript atua como o cérebro que comanda a lógica, gerencia o estado dos componentes e manipula os dados. Embora o código seja escrito em TypeScript, ele é primeiramente transpilado para JavaScript antes de ser executado. É o JavaScript que, através da "ponte" (bridge) do React Native, envia as instruções para renderizar os componentes nativos de Android e iOS. A alternativa principal seria o desenvolvimento puramente nativo (Kotlin para Android, Swift para iOS), mas a abordagem com JavaScript via React Native foi escolhida pela eficiência no desenvolvimento multiplataforma.

## Objetivo 

O objetivo desta seção não é esgotar todos os aspectos do JavaScript, mas sim consolidar o conhecimento sobre os recursos da linguagem que são utilizados de forma intensiva no desenvolvimento com React Native. A compreensão destes conceitos é um pré-requisito para entender as decisões de código no projeto Coleta Cacau e para assimilar com mais facilidade os padrões apresentados na seção de TypeScript.

## Definição 

JavaScript (JS) é uma linguagem de programação de alto nível, dinâmica, interpretada (ou compilada em tempo real, just-in-time) e multi-paradigma. Embora seja mais conhecida por ser a linguagem dos navegadores web, sua aplicação se expandiu para servidores (Node.js) e, como neste projeto, para o desenvolvimento de aplicativos móveis.
            `
        },
        {
            title: 'Fundamentos Essenciais e ES6+',
            slug: 'javascript-fundamentos-essenciais',
            duration: '15 min',
            type: LessonType.READ,
            order: 2,
            content: `Em JavaScript moderno, evitamos o uso de \`var\` devido ao seu escopo de função, que pode causar comportamentos inesperados. Em vez disso, usamos \`let\` e \`const\`.

Utilizamos \`const\` para declarar constantes, ou seja, variáveis cujo valor não pode ser reatribuído. É a escolha padrão para garantir a imutabilidade.

\`\`\`javascript
const framework = "React Native"; 
// framework = "Flutter"; // Erro: Não se pode reatribuir uma constante.
\`\`\`

Utilizamos \`let\` para declarar variáveis que precisam ter seu valor reatribuído.

\`\`\`javascript
let versao = 17;
versao = 18;
\`\`\`

## JavaScript Moderno (ES6+) 

O React Native utiliza intensivamente os recursos introduzidos a partir da versão ES2015 (ES6) do JavaScript.

As Arrow Functions são uma forma mais concisa de escrever funções e possuem um comportamento diferente e muito útil com a palavra-chave \`this\`.

\`\`\`javascript
// Função tradicional
function soma(a, b) {
    return a + b;
}

// Arrow Function [cite: 31]
const somaArrow = (a, b) => a + b;
\`\`\`

Diferente das funções tradicionais, as arrow functions não possuem seu próprio \`this\`. Elas herdam o \`this\` do contexto em que foram criadas, o que resolve muitos problemas comuns em classes e callbacks.

Desestruturação é uma sintaxe que permite extrair valores de arrays ou propriedades de objetos em variáveis distintas.

\`\`\`javascript
const produtor = {
    nome: "João Silva",
    fazenda: "Boa Esperança",
    hectares: 50
};

const { nome, hectares } = produtor;
console.log(nome);
console.log(hectares);

const coordenadas = [-14.79, -39.28];
const [latitude, longitude] = coordenadas;
console.log(latitude);
\`\`\`

O operador Spread “espalha” os elementos de um array ou as propriedades de um objeto em outro. É fundamental para criar cópias e manter a imutabilidade.

\`\`\`javascript
const usuario = { nome: "Cibelle", idade: 24 };
const usuarioComCidade = { ...usuario, cidade: "Rio de Janeiro" };
console.log(usuarioComCidade);
\`\`\`

Enquanto isso, a sintaxe de parâmetros Rest “junta” múltiplos elementos em um único array. Útil em funções que aceitam um número indefinido de argumentos.

\`\`\`javascript
function registrarPontos(...pontosDeColeta) {
    console.log(pontosDeColeta); // Será um array com todos os argumentos
}
registrarPontos("Ponto A", "Ponto B", "Ponto C");
\`\`\`

Os módulos \`import\` e \`export\` permitem dividir o código em arquivos reutilizáveis.

O \`export default\` exporta um único valor principal do arquivo.

\`\`\`javascript
// Arquivo Botao.js
const Botao = () => { /* ... */ };
export default Botao;

\`\`\`

O \`export\` nomeado exporta múltiplos valores do arquivo.

\`\`\`javascript
// Arquivo utils.js
export const somar = (a, b) => a + b;
export const subtrair = (a, b) => a - b;
\`\`\`

Por fim, \`import\` importa os valores para usar em outro arquivo.

\`\`\`javascript
import Botao from './Botao.js';
import { somar, subtrair } from './utils.js';
\`\`\`
            `
        },
        {
            title: 'Lógica Assíncrona e Arrays',
            slug: 'javascript-logica-assincrona-arrays',
            duration: '15 min',
            type: LessonType.READ,
            order: 3,
            content: `Aplicações móveis raramente são síncronas. Elas precisam buscar dados de APIs, ler o armazenamento do dispositivo, etc. Por isso, precisamos aprender a desenvolver sob a lógica assíncrona.

Uma Promise é um objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona. O \`async/await\` é uma sintaxe moderna para lidar com Promises de uma forma que parece síncrona, tornando o código muito mais limpo.

\`\`\`javascript
// Função que simula a busca de dados de um produtor
async function buscarProdutor(id) {
    try {
        const resposta = await fetch(\`https://api.nomedaapi.com/produtores/\${id}\`);
        const dadosDoProdutor = await resposta.json();
        console.log(dadosDoProdutor.nome);
        return dadosDoProdutor;
    } catch (erro) {
        console.error("Falha ao buscar produtor:", erro);
    }
}
\`\`\`

No React Native, manipulamos listas de dados para gerar listas de componentes. Para isso, usamos métodos funcionais de array.

Usamos \`.map()\` para transformar cada item de um array em um novo item, retornando um novo array com os itens transformados.

\`\`\`javascript
const sacas = [{ id: 1, peso: 60 }, { id: 2, peso: 62 }, { id: 3, peso: 59 }];
const pesos = sacas.map(saca => saca.peso); // Retorna [60, 62, 59]
\`\`\`

Usamos \`.filter()\` para criar um novo array contendo apenas os elementos que passam em um teste de condição.

\`\`\`javascript
const sacas = [{ id: 1, peso: 60 }, { id: 2, peso: 62 }, { id: 3, peso: 59 }];
const sacasAprovadas = sacas.filter(saca => saca.peso >= 60);
// Retorna [{ id: 1, peso: 60 }, { id: 2, peso: 62 }]
\`\`\`

Usamos \`.find()\` para retornar o primeiro elemento de um array que satisfaz a condição. Se nenhum for encontrado, retorna \`undefined\`.

\`\`\`javascript
const sacas = [{ id: 1, peso: 60 }, { id: 2, peso: 62 }, { id: 3, peso: 59 }];
const sacaEspecifica = sacas.find(saca => saca.id === 2);
// Retorna { id: 2, peso: 62 }
\`\`\`

Usamos \`.reduce()\` para executar uma função "redutora" para cada elemento do array, resultando em um único valor de retorno. É útil para calcular totais ou agrupar dados.

\`\`\`javascript
const sacas = [{ id: 1, peso: 60 }, { id: 2, peso: 62 }, { id: 3, peso: 59 }];
// Calculando o peso total das sacas
const pesoTotal = sacas.reduce((acumulador, sacaAtual) => {
    return acumulador + sacaAtual.peso;
}, 0); // 0 é o valor inicial do acumulador

console.log(pesoTotal);
\`\`\`
            `
        }
    ],
    quiz: {
        title: 'Quiz: Fundamentos de JavaScript para React Native',
        description: 'Teste seus conhecimentos sobre os fundamentos de JavaScript, recursos do ES6+ e lógica assíncrona essenciais para o desenvolvimento mobile.',
        passingScore: 70,
        questions: [
            {
                text: 'Por que no JavaScript moderno evitamos o uso de `var` e preferimos `let` e `const`?',
                options: [
                    {
                        text: 'Porque `var` possui escopo de função, o que pode causar comportamentos inesperados, enquanto `let` e `const` possuem escopo de bloco.',
                        isCorrect: true
                    },
                    {
                        text: 'Porque `var` não permite declarar variáveis, apenas constantes.',
                        isCorrect: false
                    },
                    {
                        text: 'Porque `let` e `const` são processados mais lentamente em tempo de execução do que `var`.',
                        isCorrect: false
                    },
                    {
                        text: 'Porque `var` não é suportado nativamente pelo React Native.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual é a principal característica das Arrow Functions em relação à palavra-chave `this`?',
                options: [
                    {
                        text: 'Elas criam um novo escopo de `this` a cada vez que são chamadas.',
                        isCorrect: false
                    },
                    {
                        text: 'Elas exigem que o `this` seja passado explicitamente como um parâmetro na função.',
                        isCorrect: false
                    },
                    {
                        text: 'Elas herdam o `this` do contexto léxico em que foram criadas, não possuindo um `this` próprio.',
                        isCorrect: true
                    },
                    {
                        text: 'Elas não podem acessar a palavra-chave `this` de forma alguma.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual método de array utilizamos para transformar todos os itens de um array em novos itens, retornando obrigatoriamente um novo array com o mesmo tamanho do original?',
                options: [
                    {
                        text: '.filter()',
                        isCorrect: false
                    },
                    {
                        text: '.map()',
                        isCorrect: true
                    },
                    {
                        text: '.find()',
                        isCorrect: false
                    },
                    {
                        text: '.reduce()',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'No contexto de lógica assíncrona, o que a palavra-chave `await` faz quando utilizada dentro de uma função `async`?',
                options: [
                    {
                        text: 'Ela pausa a execução da função até que a Promise seja resolvida, retornando o valor resolvido.',
                        isCorrect: true
                    },
                    {
                        text: 'Ela encerra a função imediatamente e retorna um erro caso a Promise demore mais de 1 segundo.',
                        isCorrect: false
                    },
                    {
                        text: 'Ela cria uma nova Promise encadeada automaticamente.',
                        isCorrect: false
                    },
                    {
                        text: 'Ela converte a função assíncrona em uma função síncrona tradicional, bloqueando a thread principal.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual é a diferença entre `export default` e `export` nomeado em módulos JavaScript?',
                options: [
                    {
                        text: '`export default` é usado apenas para declarar variáveis, enquanto `export` nomeado é usado exclusivamente para funções.',
                        isCorrect: false
                    },
                    {
                        text: '`export default` exporta um único valor principal do arquivo, enquanto `export` nomeado pode exportar múltiplos valores.',
                        isCorrect: true
                    },
                    {
                        text: '`export default` oferece melhor performance na importação do que o `export` nomeado.',
                        isCorrect: false
                    },
                    {
                        text: 'Não há diferença prática; são apenas nomenclaturas diferentes para a mesma funcionalidade.',
                        isCorrect: false
                    }
                ]
            }
        ]
    }
};