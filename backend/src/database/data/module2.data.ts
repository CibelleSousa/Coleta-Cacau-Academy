import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';
import { SeedModule } from './types';

export const module2: SeedModule = {
    title: '2. TypeScript',
    description: 'Tipagem estática, interfaces, types e recursos avançados do TypeScript.',
    order: 2,
    duration: 100,
    type: ModuleType.THEORY,
    lessons: [
        {
            title: 'Introdução e Tipagem Estática',
            slug: 'typescript-introducao-tipagem',
            duration: '30 min',
            type: LessonType.READ,
            order: 1,
            content: `O TypeScript foi escolhido como a linguagem principal para o desenvolvimento do aplicativo Coleta Cacau por oferecer uma camada de segurança e robustez sobre o JavaScript. Em um projeto de React Native como este, que tende a crescer em complexidade, o uso de um superset tipado é crucial. A principal aplicação do TypeScript no nosso código é garantir que os dados que fluem através dos componentes, funções e estado da aplicação tenham um formato previsível e consistente. Isso se traduz em menos bugs em tempo de execução, um código mais fácil de refatorar e uma experiência de desenvolvimento significativamente melhor, com autocompletar e verificação de erros diretamente no editor.

Embora o aplicativo pudesse ter sido desenvolvido utilizando JavaScript puro, essa alternativa foi descartada por não oferecer a segurança de tipos, o que aumenta o risco de erros comuns (ex: undefined is not a function) e dificulta a manutenção a longo prazo. Outra alternativa seria o Flow, também um verificador de tipos para JavaScript, mas o TypeScript foi preferido por ter uma comunidade maior, mais suporte da indústria e uma integração mais madura com o ecossistema do React Native.

## Objetivo 

Solidificar conceitos primordiais na principal linguagem de programação utilizada no React Native, facilitando a leitura e produção do código.

## Definição 

O TypeScript é um superset tipado do JavaScript, o que significa que ele engloba tudo o que o JavaScript faz e adiciona novas funcionalidades por cima, sendo a principal delas a verificação estática de tipos. Essa camada de tipos ajuda a prevenir bugs em tempo de compilação (antes mesmo de rodar o código) e melhora a manutenção do projeto.

## Tipagem Estática 

A principal característica do TypeScript é a tipagem estática, onde os tipos das variáveis, parâmetros de funções e retornos são verificados em tempo de compilação (o processo que transforma o código TS em JS). Isso contrasta com o JavaScript, que possui tipagem dinâmica, onde os erros de tipo só são descobertos em tempo de execução, muitas vezes quando o programa já está nas mãos do usuário.

\`\`\`typescript
const myName = "Cibelle" // JavaScript

const myName2: string = "Cibelle" // TypeScript
\`\`\`

Temos os tipos primitivos como string, number e boolean.

\`\`\`typescript
const myName: string = "Cibelle"
const myAge: number = 24
const myState: boolean = true
\`\`\`

Temos o tipo any que permite uma maior flexibilidade para o que o programador pode passar como valor da variável. (Não recomendável de forma geral) .

\`\`\`typescript
const myVariable: any = 'Nome'
const myVariable2: any = -11
const myVariable3: any = false
const myVariable4: any = {}
const myVariable5: any = []
\`\`\`

O motivo pelo qual o any é desaconselhado é que ele efetivamente desliga o verificador de tipos do TypeScript para aquela variável, removendo todas as garantias de segurança que a linguagem oferece. Ao usar any, você diz ao compilador para "confiar em você", o que pode levar aos mesmos erros que o TypeScript foi projetado para evitar.

Quando você realmente não sabe o tipo de um valor (por exemplo, vindo de uma API externa ou do conteúdo de um arquivo), a alternativa correta é o unknown. Diferente do any, o unknown não permite que você faça qualquer operação com o valor até que você verifique qual é o seu tipo.

\`\`\`typescript
let valor: unknown = "Isso pode ser qualquer coisa";

// Linha abaixo daria erro, pois o TypeScript não sabe se valor é uma string
//console.log(valor.toUpperCase());

// Para usar valor, primeiro verificamos seu tipo
if (typeof valor === 'string') {
    console.log(valor.toLocaleUpperCase());
}
\`\`\`

O tipo unknown força o desenvolvedor a escrever um código mais seguro e explícito.

Como nem sempre trabalhamos com dados concretos temos também os tipos null e undefined.

\`\`\`typescript
const myVariable: undefined = undefined
const myVariable2: null = null
\`\`\`

A sintaxe da declaração de uma variável em TypeScript sempre obedece a regra: Nome_da_Variável + : + Tipo_da_Variável.

\`\`\`typescript
const Nome_da_Variavel : string = "String"
\`\`\`

Podemos usar a tipagem para definir o tipo esperado nos argumentos de uma função, bem como o tipo de retorno esperado da função.

\`\`\`typescript
function sum(a: number, b: number) :  number{
    return a + b
}
\`\`\`

Podemos tornar opcionais os argumentos de uma função ao utilizarmos o “?”. Observação: os argumentos opcionais só podem ser declarados como os últimos argumentos de uma função.

\`\`\`typescript
function greet(name: string, age?: number){
    return console.log(\`Hello, \${name}.\`)
}

greet('Cibelle')
\`\`\`

O TypeScript é capaz de realizar a inferência de tipo de uma variável, mesmo que você não a declare explicitamente. A inferência ocorre quando o compilador analisa o valor que está sendo atribuído a uma variável e deduz ("infere") seu tipo.

\`\`\`typescript
const animal = {
    name: "Gato",
    age: 3
}

// animal. Identifier expected. (property) age: number, name: string
\`\`\`

No exemplo acima, ao declarar o objeto animal, o TypeScript infere que ele possui as propriedades name (string) e age (number), oferecendo autocompletar e segurança sem a necessidade de uma declaração de tipo explícita para variáveis simples.

Às vezes, você, como desenvolvedor, sabe mais sobre o tipo de um valor do que o TypeScript. A asserção de tipo (Type Assertions) é uma forma de dizer ao compilador "confie em mim, eu sei que este valor é deste tipo". É muito comum interagir com o DOM ou com APIs que não são totalmente tipadas.

\`\`\`typescript
const data: unknown = { nome: "Cacau em pó", preco: 25.00 };

const produto = data as {nome: string; preco: number};

console.log(produto.nome.toUpperCase());
\`\`\`

TypeScript possui uma sintaxe especial para remover tipos null e undefined sem realizar uma verificação explícita (Non-null Assertion Operator). Escrever “!” após qualquer expressão é uma asserção de tipo eficiente para que o valor não seja null nem undefined em um determinado ponto, mesmo que o tipo dela permita isso. Use com cuidado, pois você está garantindo ao compilador que o valor existe.

\`\`\`typescript
type User = {
    name: string;
    email?: string;
};

function createUser(name: string): User {
    const email: string = name.toLowerCase() + '@email.com';
    const user: User = {name, email};
    console.log(\`Usuário \${name} criado com sucesso. Email: \${email}\`);
    return user;
}

function sendEmail(email:string): void {
    console.log('\\nEmail enviado com sucesso para: ' + email + '\\n');
}

function contactUser(user:User): void {
    sendEmail(user.email!)
}
const user1: User = createUser('Cibelle')
contactUser(user1)
\`\`\`

## Tabela Tipos em TypeScript 

| Categoria | Tipo | Descrição e Exemplo de Uso |
| --- | --- | --- |
| **Primitivos Básicos** | \`string\` | Representa texto. <br><br> \`const name: string = "Cacau";\` |
|  | \`number\` | Representa números, tanto inteiros quanto de ponto flutuante. <br><br> \`const price: number = 15.50;\` |
|  | \`boolean\` | Representa os valores true ou false. <br><br> \`const isAvailable: boolean = true;\` |
| **Primitivos Especiais** | \`null\` | Representa a ausência intencional de um valor de objeto. <br><br> \`let value: null = null;\` |
|  | \`undefined\` | Representa uma variável que foi declarada, mas não inicializada. <br><br> \`let description: undefined;\` |
|  | \`any\` | Desliga a verificação de tipos. Deve ser evitado ao máximo. <br><br> \`let data: any = "pode ser qualquer coisa";\` |
| **Estruturais** | \`object\` | Refere-se a qualquer valor em JavaScript com propriedades. <br><br> \`let user : {id: number; name: string };\` |
|  | \`array\` | Representa uma lista de valores de um mesmo tipo. <br><br> \`const prices: number[] = [10, 20, 30];\` |
|  | \`tuple\` | Representa um array com um número fixo de elementos, cujos tipos são conhecidos. <br><br> \`const farmer: [string, number] = ["João", 45];\` |
|  | \`enum\` | Permite que o desenvolvedor defina um conjunto de constantes. <br><br> \`enum Status { Pending, Approved, Rejected };\` |
| **Avançados** | \`unknown\` | Representa qualquer valor. Alternativa mais segura ao any. Exige verificação de tipo antes de ser usado. <br><br> \`function f1(a: unknown): void {a.b();}\` |
|  | \`void\` | Representa o retorno de uma função que não retorna valor. <br><br> \`function logMessage(message: string): void { console.log(message); }\` |
|  | \`never\` | Representa o tipo de valores que nunca ocorrem. Sendo um retorno isso significa que a função lança uma exceção ou encerra a execução do programa. <br><br> \`function error(message: string): never { throw new Error(message); }\` |
            `
        },
        {
            title: 'Interfaces e Type Aliases',
            slug: 'typescript-interfaces-types',
            duration: '30 min',
            type: LessonType.READ,
            order: 2,
            content: `As Interfaces servem para definir a estrutura de um objeto ou o tipo de uma função.

Imaginemos que desejamos criar uma função que cria um usuário a partir de uma string passada como parâmetro que representa o nome desse usuário. Em JavaScript podemos simplesmente escrever: 

\`\`\`javascript
function createUser(name){
    return {name, createdAt: new Date()}
}
const cibelle = createUser(22)
\`\`\`

Observe que apesar de originalmente desejar que a função recebesse uma string como parâmetro, estou passando um number ao realizar a chamada da função. Para prevenirmos esse tipo de erro, podemos reescrever a função em TypeScript com: 

\`\`\`typescript
function createUser(name: string){
    return {name, createdAt: new Date()}
}
const cibelle = createUser("cibelle")
\`\`\`

Observe que a nossa função \`createUser\` retorna um objeto que possui uma propriedade chamada name e outra chamada createdAt. Entretanto, que objeto seria esse? Quais suas propriedades e quais os tipos destas propriedades? Utilizamos então o conceito de Interfaces para definir melhor a natureza do nosso objeto User.

\`\`\`typescript
interface User{
    name: string,
    createdAt: Date,
    wallet?: {
        coins?: number,
        credits?: number
    }
}
\`\`\`

Agora podemos também definir melhor o retorno de nossa função. Afinal ela não retorna um objeto qualquer e sim nosso objeto de natureza bem definida chamado User.

\`\`\`typescript
function createUser(name: string): User{
    return {name, createdAt: new Date()}
}
\`\`\`

Observemos que a propriedade wallet é um objeto. Sendo assim, podemos criar uma Interface para a mesma e defini-la como o tipo da propriedade wallet em User.

\`\`\`typescript
interface Wallet{
    coins?: number,
    credits?: number
}

interface User{
    name: string,
    createdAt: Date,
    wallet?: Wallet
}
\`\`\`

As Interfaces são também chamadas de contratos. Ou seja, ao definir uma Interface você está firmando um contrato acerca da natureza do objeto. Suponhamos que desejamos criar uma função que atualize a carteira do nosso usuário.

\`\`\`typescript
function updateWallet(user: User, wallet: Wallet){
    user.wallet = {...user}
}
\`\`\`

Mas dessa forma logo o compilador apontará o erro: Type '{ name: string; createdAt: Date; wallet?: Wallet | undefined; }' has no properties in common with type 'Wallet'. Isso acontece pois, ao criarmos uma Interface para a propriedade wallet, definimos um contrato de que ela seria um objeto com os atributos coins e credits. Ou seja, user.wallet espera receber os atributos de Wallet e não de User.

\`\`\`typescript
function updateWallet(user: User, wallet: Wallet){
    user.wallet = {...user.wallet, ...wallet}
}
updateWallet(cibelle, {coins: 10})
\`\`\`

É possível adicionar novos campos a uma interface existente através de um recurso chamado Declaration Merging. Ao declarar a mesma interface novamente no mesmo escopo, o TypeScript funde as duas declarações. Isso é muito útil para adicionar propriedades a tipos de bibliotecas externas.

\`\`\`typescript
interface User{
    talk(): void
}
function createUser(name: string): User{
    return {
        name, 
        createdAt: new Date(), 
        talk() {
            console.log('Usuário ' + name + ' criado com sucesso!')
        },
    }
}
\`\`\`

Imaginemos que desejamos criar um usuário administrador que possua permissões exclusivas. Ou seja, ele possui todas as propriedades de User, mas possuiria propriedades/métodos próprios também. O que precisamos é estender a Interface.

\`\`\`typescript
interface Admin extends User{
    ban(user: User) : void;
    kick(user: User) : void;
}
\`\`\`

Podemos então criar uma função que promove um usuário como administrador . 

\`\`\`typescript
function promoteUser(user: User) : Admin{
    return{
        ...user,
        ban(userToBan) {
            console.log(userToBan.name + ' foi banido por ' + this.name)
        },
        kick(userToKick) {
            console.log(userToKick.name + ' foi banido por ' + this.name)
        },
    }
}

const admin1 = promoteUser(cibelle)
\`\`\`

## Types Aliases 

O type, mais conhecido como Type Alias (Apelido de Tipo), permite criar um novo nome para qualquer tipo existente. Enquanto as interfaces são focadas em definir a forma de objetos, os Types Aliases são mais genéricos e podem ser usados para apelidar tipos primitivos, uniões, interseções e qualquer outra construção de tipo.

\`\`\`typescript
type Input = string
function prompt(input : Input) {
    console.log(input)
}
prompt('Cibelle')
\`\`\`

Até aí podemos considerar que não há nada de novo, na verdade o que foi feito é bem parecido com a tipagem comum feita até agora. Mas e se quiséssemos que além de string nosso parâmetro input da função prompt também pudesse ser do tipo number? 

\`\`\`typescript
type Input = string | number
function prompt(input : Input) {
    console.log(input)
}
prompt('Cibelle')
prompt(22)
\`\`\`

Podemos utilizar o Type Alias em conjunto com as Interfaces como no código abaixo.

\`\`\`typescript
interface Dog {
    name: string,
    breed: string,
    bark() : string
}
interface Cat {
    name: string,
    color: string,
    meow() : string
}
interface Cow {
    name: string,
    weight: number,
    moo() : string
}
type Animal = Dog | Cat | Cow

function createAnimal(animal: Animal){}
createAnimal({
    name: "Josevaldo",
    color: "Laranja",
    meow() {
        return 'Miau, miau!'
    },
})
\`\`\`

Podemos também usar do mesmo conceito de extensão que utilizamos para Interfaces em Types Aliases, mas com leves diferenciações.

\`\`\`typescript
type Wallet = {
    coins?: number,
    credits?: number
}
type User = {
    name: string,
    createdAt: Date,
    wallet?: Wallet
}
type Admin = User & {
    ban(user: User) : void;
    kick(user: User) : void
}
\`\`\`

## Types Intersections 

Denotado por “&”, permite que combinemos vários tipos em um só. Funciona como o operador and.

\`\`\`typescript
interface Robot {
    material: string,
    fuel: string
}

interface Human{
    name: string,
    age: number
}

type Cyborg = Robot & Human
\`\`\`

Apesar de poderoso, o Type Intersections requer cuidado ao ser utilizado pois possui limitações. Suponha que tentemos criar um o seguinte Type: 

\`\`\`typescript
type CustomString = string & number & boolean
\`\`\`

A princípio parece correto, mas não está. Não é possível criarmos uma variável que seja ao mesmo tempo string, number e booleano. Assim que tentarmos criar uma variável do tipo CustomString o compilador apontará o erro: Type 'any' is not assignable to type 'never'. Isto significa que nunca acontecerá de uma variável ser booleano, número e string ao mesmo tempo.

## Types Unions 

Diferentemente do Intersection, o Union funciona como o operador or e é denotado por “ | ”. Permite que um Type Alias possua diferentes naturezas, mas apenas um por vez.

\`\`\`typescript
type Primitives = string | number | boolean
\`\`\`

Uma aplicação poderosa dos union types é a criação de Tipos Literais, onde restringimos uma variável a um conjunto fixo de valores de string ou number.

\`\`\`typescript
type Status = 'notFound' | 404 |'Ok' | 200 | 'forbiden'

function sendStatus(status: Status){
    console.log(status)
}
sendStatus("Ok")
\`\`\`

Podemos também criar Types Aliases recursivos.

\`\`\`typescript
type JSONValue = string | number | boolean | JSONValue[] | {
    [key : string] : JSONValue
}
\`\`\`

## Interface vs. Type Alias 

Tanto em Interfaces quanto em Type Aliases, podemos usar o modificador readonly para marcar uma propriedade como imutável. Isso garante que as propriedades de um objeto não possam ser alteradas após sua criação.

\`\`\`typescript
interface ProductInterface {
    readonly id: number; // Este id não pode ser alterado
    name: string;
    price: number;
}

type Product = {
    readonly id: number, // Este id não pode ser alterado
    name: string,
    price: number
}
\`\`\`

Embora Interfaces e Types Aliases possam ser usados para os mesmos fins em muitos casos, como definir a forma de um objeto, eles possuem diferenças importantes que guiam sua utilização.

Interfaces podem ser definidas múltiplas vezes no mesmo escopo, e o TypeScript irá juntar ("fundir") suas definições. Isso é especialmente útil para estender tipos de bibliotecas externas. Types Aliases não podem ser declarados mais de uma vez com o mesmo nome.

Os Types Aliases são mais flexíveis. Eles podem representar não apenas a forma de um objeto, mas também tipos uniões (|), interseções (&), tuplas e tipos primitivos.

**Recomendação Geral:** Use Interface sempre que estiver definindo a "forma" de um objeto ou a estrutura de uma classe. A capacidade de fusão de declarações é uma vantagem poderosa. E use Type Alias quando precisar criar um nome para tipos uniões, interseções ou qualquer tipo que não seja um objeto.

## Tipagem de Funções 

A tipagem de funções é essencial no desenvolvimento com TypeScript. Já sabemos que em TypeScript é essencial a tipagem dos argumentos de uma função e de seu retorno.

\`\`\`typescript
type Args = string | number | boolean
function bootstrap(dirname: string, args?: Args[] ) : boolean {
    return true
}
\`\`\`

Mas podemos também criar um Type que descreve uma função. Dessa forma, por vezes a declaração explícita da tipagem dos argumentos pode ser omitida posteriormente.

\`\`\`typescript
type MainFunction = (args: string[]) => void
const main : MainFunction = (args) => { }
\`\`\`
            `
        },
        {
            title: 'Classes, Overload, Generics e Tipos Utilitários',
            slug: 'typescript-classes-overload-generics-utilitarios',
            duration: '40 min',
            type: LessonType.READ,
            order: 3,
            content: `Em TypeScript podemos proteger os atributos de nossas classes por meio dos modificadores de acesso, garantindo uma maior segurança. Além disso, podemos utilizar uma classe como uma tipagem.

\`\`\`typescript
export class Player {
    private name : string
    private health: number
    constructor(name: string) {
        this.name = name
        this.health = 100
    }
    public getName(){
        return this.name
    }
    public getHealth(){
        return this.health
    }
    public damage(amount: number, damager?: Player){
        const updateHealth = this.health - amount
        console.log(damager
        ? \`\${damager.getName()} deu \${amount} de dano em \${this.name}.\`
        : \`\${this.name} tomou \${amount} de dano.\`)
        if (updateHealth <= 0){
            this.health = 0
            this.die(damager)
            return
        }
        this.health = updateHealth
    }
    private die(damager?: Player){
        if (damager) {
            console.log(\`\${damager.getName} matou \${this.name}!\`)
        }
        console.log(\`\${this.name} morreu!\`)
    }
}
\`\`\`

Em TypeScript podemos utilizar interfaces para definir as tipagens das classes.

\`\`\`typescript
interface Drivable {
    startEngine() : void
    drive() : void
}
class Car implements Drivable{
    startEngine(): void {
        console.log('Engine started.')
    }
    drive(): void {
        console.log("You're driving.")
    }
}
\`\`\`

Podemos também criar classes abstratas que servem como modelo para outras classes. Ou ainda, criar métodos abstratos que servem como modelo para que sejam implementados nas classes filhas.

\`\`\`typescript
abstract class Shape {
    abstract area() : number
    describe(): void {
        console.log('Isso é uma forma.')
    }
}
class Circle extends Shape{
    radius : number
    constructor(radius: number){
        super()
        this.radius = radius
    }
    area(): number {
        return Math.PI * this.radius ** 2
    }
    describe(): void {
        console.log('Isso é um círculo.')
    }
}
const circle = new Circle(5)
console.log(\`Área do círculo: \${circle.area()}\`)
circle.describe()
\`\`\`

Em TypeScript temos um modificador de acesso chamado protected. Este modificador priva o atributo/método para a instância, mas pode ser “visto” pelas classes que as herdam.

\`\`\`typescript
class Person {
    protected age: number
    constructor(age: number){
        this.age = age
    }
    protected getAge(){
        return this.age
    }
}

class Employee extends Person {
    private name: string
    constructor(name: string, age: number){
        super(age)
        this.name = name
    }
    public introduce(): void{
        console.log('Eu sou ' + this.name + ' e tenho ' + this.getAge() + ' anos.')
    }
}
const emp = new Employee('Cibelle', 18)
emp.introduce()
\`\`\`

Membros estáticos pertencem à classe em si, e não a uma instância da classe. São perfeitos para criar funções utilitárias ou propriedades que são compartilhadas por todas as instâncias, como contadores ou métodos de "fábrica" (factory methods).

\`\`\`typescript
class MathHelper {
    static readonly PI: number = 3.14159;
    static circleArea(radius: number): number { return this.PI * radius ** 2;}
}

// Acessamos diretamente pela classe, sem precisar criar uma instância
console.log(MathHelper.PI);
console.log(MathHelper.circleArea(10));
\`\`\`

O TypeScript oferece uma sintaxe especial para transformar um parâmetro de construtor em uma propriedade de classe com o mesmo nome e valor. Essas propriedades são chamadas de propriedades de parâmetro e são criadas prefixando um argumento de construtor com um dos modificadores de visibilidade: public, private, protected ou readonly.

\`\`\`typescript
// Forma tradicional (verbosa)
class User_V1 {
    public name: string;
    private age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// Usando o atalho do TypeScript (conciso)
class User_V2 {
    constructor(public name: string, private age: number) {}
}

const user = new User_V2("Cibelle", 24);
console.log(user.name);
\`\`\`

É uma sintaxe exclusiva do TypeScript que reduz drasticamente a verbosidade ao declarar e inicializar propriedades de uma classe.

## Overload 

É um recurso do TypeScript que permite que definamos múltiplas versões de uma função/método com o mesmo nome. Um exemplo nativo é o objeto Date. Ele possui diversas opções de parâmetros em seu construtor.

\`\`\`typescript
// Overload 1/4 Date(value: number | string | Date): Date
new Date()

// Overload 3/4 Date(value: number | string): Date
new Date()
\`\`\`

Podemos criar nossos próprios overloads de uma maneira simples.

\`\`\`typescript
/**
 * Criar uma nova data a partir de outra
 */
function createDate(value: Date) : Date
/**
 * Criar uma nova data a partir de um número
 */
function createDate(value: number) : Date
/**
 * Criar uma nova data a partir de uma string
 */
function createDate(value: string) : Date
function createDate(value: Date | number | string) : Date{
    return new Date(value)
}
\`\`\`

No exemplo acima, apesar de termos diferentes opções de entrada de parâmetro, o retorno da função é sempre o mesmo independentemente. Mas e se quisermos que o retorno da nossa função mude conforme a versão da função também muda? 

A resposta é sim, o retorno pode mudar. As sobrecargas de função (overloads) são perfeitas para isso. Cada assinatura de sobrecarga pode definir um tipo de retorno diferente. A implementação final deve, então, ser compatível com todos os retornos possíveis.

\`\`\`typescript
function reverse(value: string): string;

function reverse(value: number[]): number[];

function reverse(value: string | number[]): string | number[] {
    if (typeof value === 'string') {
        return value.split('').reverse().join('');
    } else {
        return value.slice().reverse();
    }
}
\`\`\`

## Tipos Genéricos 

Um dos recursos mais poderosos do TypeScript são os Tipos Genéricos. Eles nos permitem criar componentes, funções e classes que são reutilizáveis porque podem trabalhar com uma variedade de tipos, em vez de estarem presos a um único tipo. O objetivo é criar código flexível e, ao mesmo tempo, manter a segurança de tipo.

Pense nos Generics como "variáveis para tipos". Usamos a notação \`<T>\` (onde T é um nome comum para "Type") para definir um tipo genérico.

Imagine uma função que recebe um argumento e o retorna. Sem generics, teríamos duas opções ruins.

\`\`\`typescript
// Opção 1: Tipagem específica (não reutilizável)
function identity_v1(arg: number): number{
    return arg;
}

// Opção 2: Usando 'any' (perdemos a segurança de tipo)
function identityAny_v2(arg: any): any{
    return arg;
}
\`\`\`

Com generics, podemos capturar o tipo do argumento e usá-lo para definir o tipo do retorno, mantendo a flexibilidade e a segurança.

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}

// O TypeScript infere os tipos automaticamente
let outputString = identity("minhaString"); // O tipo de 'outputString' é 'string'
const outputNumber = identity(100);          // O tipo de 'outputNumber' é 'number'
console.log(outputString);
console.log(outputNumber);
\`\`\`

Um caso de uso muito comum é criar uma função genérica para buscar dados de uma API, onde não sabemos de antemão se a resposta será um User, um Product ou outro tipo.

\`\`\`typescript
interface User {
    name: string;
    email: string;
}

async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return await response.json() as Promise<T>;
}

// Uso da função genérica
async function getUser() {
    try {
        const user = await fetchData<User>('/api/users/1');
        console.log(user.name); // O TS sabe que 'user' tem a propriedade 'name'
    } catch (error) {
        console.error("Falha ao buscar o usuário:", error);
    }
}
\`\`\`

## Tipos Utilitários 

O TypeScript inclui um conjunto de Tipos Utilitários que facilitam transformações de tipos comuns. Eles são como "funções" que recebem um tipo e retornam um novo tipo modificado. Conhecê-los pode economizar muito tempo e evitar a criação de tipos redundantes.

O tipo \`Partial<T>\` constrói um tipo com todas as propriedades de T definidas como opcionais. É perfeito para funções de atualização, onde você pode enviar apenas os campos que deseja alterar.

\`\`\`typescript
interface Task {
    id: number;
    title: string;
    completed: boolean;
}

function updateTask(id: number, fieldsToUpdate: Partial<Task>) {
    return {id, ...fieldsToUpdate};
}

let task1: Task = {
    id: 1,
    title: 'Arrumar o quarto',
    completed: false
}

// Podemos passar apenas 'completed', sem erros.
updateTask(1, { completed: true });
\`\`\`

O tipo \`Pick<T, K>\` constrói um tipo escolhendo um conjunto de propriedades K do tipo T. Útil para criar tipos menores e mais específicos a partir de tipos maiores.

\`\`\`typescript
interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

// Cria um novo tipo apenas com 'name' e 'avatarUrl'
type UserPreview = Pick<User, "name" | "avatarUrl">;

const preview: UserPreview = {
    name: "Cibelle",
    avatarUrl: "http://...",
};
\`\`\`

O tipo \`Omit<T, K>\` faz o oposto de Pick. Constrói um tipo removendo um conjunto de propriedades K do tipo T. Útil para, por exemplo, criar o tipo de um objeto que será enviado para a API, omitindo campos gerados pelo banco de dados como id.

\`\`\`typescript
interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

// Cria um tipo para um novo usuário, omitindo o 'id' que ainda não existe
type NewUser = Omit<User, "id">;

const newUser: NewUser = {
    name: "Novo Usuário",
    email: "novo@email.com",
    avatarUrl: "http://...",
};
\`\`\`

O tipo \`Readonly<T>\` constrói um tipo onde todas as propriedades de T são marcadas como readonly, o que significa que não podem ser reatribuídas.

\`\`\`typescript
interface Task {
    id: number;
    title: string;
    completed: boolean;
}

const config: Readonly<Task> = {
    id: 1,
    title: "Configuração inicial",
    completed: true,
};

// A linha abaixo causaria um erro de compilação
// config.id = 2;
\`\`\`
            `
        }
    ],
    quiz: {
        title: 'Quiz: TypeScript e Tipagem Estática',
        description: 'Avalie seus conhecimentos sobre tipos, interfaces, classes, generics e tipos utilitários do TypeScript.',
        passingScore: 70,
        questions: [
            {
                text: 'No TypeScript, qual é a principal diferença entre os tipos `any` e `unknown`?',
                options: [
                    {
                        text: 'O tipo `any` desativa a verificação de tipos do compilador, enquanto `unknown` exige que você verifique o tipo do valor antes de utilizá-lo.',
                        isCorrect: true
                    },
                    {
                        text: 'Ambos desativam a verificação de tipos, mas `unknown` é processado mais rapidamente em tempo de execução.',
                        isCorrect: false
                    },
                    {
                        text: 'O tipo `unknown` desativa a verificação de tipos, enquanto `any` exige uma verificação explícita.',
                        isCorrect: false
                    },
                    {
                        text: 'Não há diferença prática; ambos são usados exclusivamente para variáveis que vêm de APIs externas.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Em qual cenário o uso de Type Aliases (`type`) é mais adequado do que o uso de Interfaces?',
                options: [
                    {
                        text: 'Sempre que precisarmos definir a estrutura de uma classe, pois Interfaces não suportam classes.',
                        isCorrect: false
                    },
                    {
                        text: 'Quando precisamos criar tipos uniões (`|`), interseções (`&`) ou apelidar tipos primitivos, já que Interfaces são focadas apenas na forma de objetos.',
                        isCorrect: true
                    },
                    {
                        text: 'Quando desejamos que um tipo de objeto possa ser declarado múltiplas vezes no mesmo escopo para sofrer "fusão de declarações".',
                        isCorrect: false
                    },
                    {
                        text: 'Type Aliases e Interfaces são totalmente intercambiáveis e não há cenários que exijam a preferência por um ou outro.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Você tem uma interface `User` com várias propriedades, incluindo `id`, e precisa criar um novo tipo para representar os dados de um novo usuário a serem enviados para uma API, omitindo o campo `id`. Qual Tipo Utilitário do TypeScript você deve utilizar?',
                options: [
                    {
                        text: 'Partial<User>',
                        isCorrect: false
                    },
                    {
                        text: 'Pick<User, "id">',
                        isCorrect: false
                    },
                    {
                        text: 'Omit<User, "id">',
                        isCorrect: true
                    },
                    {
                        text: 'Readonly<User>',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual é a principal vantagem de utilizar Tipos Genéricos (Generics) ao criar funções ou classes no TypeScript?',
                options: [
                    {
                        text: 'Eles permitem que a função ou classe trabalhe com uma variedade de tipos mantendo a segurança de tipagem, sem a necessidade de usar `any`.',
                        isCorrect: true
                    },
                    {
                        text: 'Eles permitem que uma função retorne múltiplos tipos simultaneamente, como `string | number`, sem causar erros de compilação.',
                        isCorrect: false
                    },
                    {
                        text: 'Eles criam uma nova interface automaticamente que herda todas as propriedades de outra interface.',
                        isCorrect: false
                    },
                    {
                        text: 'Eles garantem que as propriedades de um objeto não possam ser alteradas após a sua criação.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'No TypeScript, o que acontece quando prefixamos um argumento do construtor de uma classe com um modificador de visibilidade (como `public` ou `private`)?',
                options: [
                    {
                        text: 'Torna o argumento acessível apenas dentro do escopo do construtor, impossibilitando seu uso no restante da classe.',
                        isCorrect: false
                    },
                    {
                        text: 'Cria automaticamente e inicializa uma propriedade de classe com o mesmo nome e modificador de acesso, reduzindo a verbosidade do código.',
                        isCorrect: true
                    },
                    {
                        text: 'Define o argumento como um membro estático da classe, permitindo seu acesso direto sem a necessidade de instanciar a classe.',
                        isCorrect: false
                    },
                    {
                        text: 'Impede que a classe seja instanciada sem fornecer todos os argumentos obrigatórios definidos na Interface.',
                        isCorrect: false
                    }
                ]
            }
        ]
    }
};