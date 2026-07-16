import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';
import { SeedModule } from './types';

export const module4: SeedModule = {
    title: '4. Realm DB',
    description: 'Persistência de dados offline-first com Realm DB no React Native.',
    order: 4,
    duration: 115,
    type: ModuleType.THEORY,
    lessons: [
        {
            title: 'Introdução, Definição e Schemas',
            slug: 'introducao-definicao-schemas',
            duration: '30 min',
            type: LessonType.READ,
            order: 1,
            content: `Para que o aplicativo Coleta Cacau seja uma ferramenta de campo verdadeiramente eficaz, ele precisa funcionar de forma confiável em áreas rurais, onde a conexão com a internet pode ser instável ou inexistente. A capacidade de persistir os dados recebidos da Plataforma Cacau localmente, de forma segura e rápida, não é um luxo, mas uma necessidade fundamental. É aqui que o Realm DB entra como a camada de persistência offline essencial do projeto.

            Ao avaliar as opções de armazenamento local para React Native, poderíamos ter considerado alternativas como o AsyncStorage, mas ele se mostrou inadequado por ser um simples sistema de chave-valor, ideal para guardar pequenas informações (como configurações do usuário ou tokens de autenticação), mas não para gerenciar os dados complexos e relacionados do Coleta Cacau, como propriedades e suas respectivas áreas homogêneas. Outra opção seria o SQLite, um banco de dados relacional poderoso, mas que introduz uma camada de complexidade significativa, exigindo a escrita de queries SQL e, muitas vezes, o uso de um ORM (Object-Relational Mapper) para traduzir os dados entre o formato de tabelas e os objetos TypeScript.

            O Realm foi escolhido por oferecer a robustez de um banco de dados completo com a simplicidade de trabalhar diretamente com objetos TypeScript, crucial para armazenar localmente os dados complexos vindos da API da Plataforma Cacau. Sua capacidade offline-first permite que o aplicativo Coleta Cacau continue funcionando sem internet, utilizando o banco local como um cache confiável dos dados. Embora o gerenciamento do estado da interface do usuário no Coleta Cacau seja primariamente realizado pelo Redux Toolkit (como veremos no próximo capítulo), o Realm atua como a camada de persistência essencial que garante a disponibilidade e a performance no acesso aos dados, mesmo offline.

            ## Objetivo 

            O objetivo deste capítulo é capacitar o leitor a compreender a arquitetura de dados do aplicativo Coleta Cacau. Ao final desta seção, o desenvolvedor será capaz de entender como os dados são modelados através de schemas, aprender a realizar as operações essenciais de CRUD (Create, Read, Update, Delete) no banco de dados local, compreender o conceito de objetos e coleções reativas e utilizar os Hooks do \`@realm/react\` para a base de dados aos componentes da interface de forma moderna e eficiente.

            ## Definição 

            Realm DB é um banco de dados mobile-first, orientado a objetos e reativo, projetado especificamente para o desenvolvimento de aplicativos móveis. Diferente dos bancos de dados relacionais que armazenam dados em tabelas com linhas e colunas, o Realm armazena dados como objetos, permitindo que os desenvolvedores interajam com os dados da mesma forma que interagem com qualquer outro objeto JavaScript/TypeScript.

            ## Conceitos Fundamentais 

            Um Schema (Esquema) é a definição formal da estrutura de um objeto que você pretende armazenar no Realm. Pense nele como uma “planta baixa” para seus dados. Ele descreve quais propriedades um objeto terá (como \`id\` e \`name\`) e qual o tipo de cada propriedade (\`string\`, \`number\`, \`Date\`, etc.).

            No ecossistema do Realm com TypeScript, a maneira moderna e recomendada de definir schemas é usando classes que estendem \`Realm.Object\`. Esta abordagem nos dá segurança de tipo e autocompletar, tornando o código muito mais robusto e fácil de manter.

            Vamos começar nos baseando nos dados mocados trabalhados no fim do capítulo anterior. Tínhamos definido uma Propriedade e uma Área Homogênea como:

            \`\`\`typescript
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

            Para modelar essa estrutura no Realm, criaremos duas classes, uma para \`Property\` e outra para \`HomogeneusArea\`:

            \`\`\`typescript
            import Realm, { ObjectSchema } from "realm";

            export default class HomogeneusArea extends Realm.Object<HomogeneusArea> {
                id!: string;
                name!: string;

                static schema: ObjectSchema = {
                    name: 'HomogeneusArea',
                    properties: {
                        id: 'string',
                        name: 'string'
                    },
                    primaryKey: 'id'
                };
            }
            \`\`\`

            \`\`\`typescript
            import Realm, {ObjectSchema} from "realm";

            export default class Properties extends Realm.Object<Properties> {
                id!: string;
                name!: string;
                // 'areas será uma lista de objetos do tipo HomogeneusArea que implementaremos depois

                static schema: ObjectSchema = {
                    name: 'Properties',
                    properties: {
                        id: 'string',
                        name: 'string',
                    },
                    primaryKey: 'id',
                };
            }
            \`\`\`

            Por padrão, todas as propriedades em um schema são obrigatórias. Para declarar uma propriedade como opcional (permitindo que ela seja \`null\` ou \`undefined\`), você pode indicá-la tanto no tipo da classe (com \`?\`) quanto no objeto do schema (com \`optional: true\`) sendo a segunda maneira mais indicada para tipos mais complexos.

            Você também pode definir um valor padrão para uma propriedade. Se você criar um objeto sem especificar um valor para esse campo, o Realm usará o padrão definido. Isso é feito no tipo da classe (com \`=\`) e no objeto do schema (com \`default\`).

            Ademais, se você realiza consultas frequentes em uma determinada propriedade (como buscar uma propriedade pelo nome), você pode indexá-la. Isso cria uma estrutura de dados interna que torna essas buscas muito mais rápidas.

            Vamos explorar nossas opções aumentando o nível de complexidade da nossa classe \`Property\`:

            \`\`\`typescript
            import Realm, {ObjectSchema} from "realm";
            import HomogeneusArea from "./homogeneusArea.schema";

            export default class Properties extends Realm.Object<Properties> {
                id!: string;
                name!: string; // vamos indexar essa propriedade
                notes?: string; // propriedade opcional
                createdAt: Date =  new Date(); // propriedade com valor padrão
                areas!: Realm.List<HomogeneusArea>; // relacionamento que veremos a seguir

                static schema: ObjectSchema = {
                    name: 'Properties',
                    properties: {
                        id: 'string',
                        name: {type: 'string', indexed: true},
                        notes: 'string?',
                        createdAt: {type: 'data', default: () => new Date()},
                        areas: 'HomogeneusArea[]'
                    },
                    primaryKey: 'id',
                };
            }
            \`\`\`

            Uma das maiores vantagens de um banco de dados orientado a objetos como o Realm é a capacidade de criar links diretos entre os objetos, em vez de gerenciar chaves estrangeiras manualmente como no SQL.

            O relacionamento de um para muitos (1 : N) é o tipo de relacionamento que já vimos, um objeto “pai” (\`Property\`) se conecta a uma lista de objetos “filhos” (\`HomogeneusArea\`).

            Na classe \`Properties\`, a propriedade \`areas\` é do tipo \`Realm.List<HomogeneusArea>\` e no schema a propriedade é do tipo \`HomogeneusArea[]\`.

            No relacionamento de um para um (1 : 1), um objeto se conecta a, no máximo, um outro objeto. Por exemplo, uma propriedade pode ter apenas uma localização (latitude, longitude). Vamos criar esse relacionamento com localização sendo uma propriedade opcional.

            \`\`\`typescript
            // arquivo location.schemas.ts
            import Realm, {ObjectSchema} from "realm";

            export default class Location extends Realm.Object<Location> {
                latitude!: number;
                longitude!: number;

                static schema: ObjectSchema = {
                    name: 'Location',
                    embedded: true,
                    properties: {
                        latitude: 'double',
                        longitude: 'double'
                    }
                };
            }
            \`\`\`

            O \`embedded\` sinaliza um objeto embarcado. Uma otimização que sinaliza \`Location\` como um objeto que só pode pertencer a um único objeto “pai” e será deletado se o seu “pai” for deletado. Agora no arquivo \`properties.schema.ts\`:

            \`\`\`typescript
            import Realm, {ObjectSchema} from "realm";
            import HomogeneusArea from "./homogeneusArea.schema";
            import Location from "./location.schema";

            export default class Properties extends Realm.Object<Properties> {
                id!: string;
                name!: string;
                notes?: string;
                createdAt: Date =  new Date();
                areas!: Realm.List<HomogeneusArea>;
                location?: Location

                static schema: ObjectSchema = {
                    name: 'Properties',
                    properties: {
                        id: 'string',
                        name: {type: 'string', indexed: true},
                        notes: 'string?',
                        createdAt: {type: 'data', default: () => new Date()},
                        location: {
                            type: 'object',
                            objectType: 'Location',
                            optional: true
                        },
                        areas: 'HomogeneusArea[]'
                    },
                    primaryKey: 'id'
                };
            }
            \`\`\`

            Relacionamentos inversos permitem que um objeto “filho” referenciar de volta o seu “pai” sem que você precise criar um link manual. Por exemplo, uma \`HomogeneusArea\` pode saber a qual \`Property\` ela pertence. Isso é feito no schema no objeto “filho”, usando a propriedade \`linkingObjects\`.

            \`\`\`typescript
            import Realm, { ObjectSchema } from "realm";
            import Properties from "./properties.schema";

            export default class HomogeneusArea extends Realm.Object<HomogeneusArea> {
                id!: string;
                name!: string;
                readonly owner!: Realm.Results<Properties>; // propriedade de relacionamento inverso é sempre readonly.

                static schema: ObjectSchema = {
                    name: 'HomogeneusArea',
                    properties: {
                        id: 'string',
                        name: 'string',
                        owner: {
                            type: 'linkingObjects', 
                            objectType: 'Properties', 
                            property: 'areas'
                        }
                    },
                    primaryKey: 'id'
                };
            }
            \`\`\`
            `
        },
        {
            title: 'Operações CRUD e Guia RQL',
            slug: 'operacoes-crud-guia-rql',
            duration: '40 min',
            type: LessonType.READ,
            order: 2,
            content: `O Realm torna as operações de banco de dados muito intuitivas, pois você trabalha diretamente com objetos. A regra de ouro, e a mais importante de todas, é: Qualquer operação que modifique o banco de dados (Criar, Atualizar ou Deletar) deve obrigatoriamente acontecer dentro de uma transação \`realm.write()\`.

Pense em uma transação como uma "caixa segura". Você abre a caixa (\`realm.write\`), faz todas as suas alterações lá dentro e, quando a função termina, o Realm salva tudo de uma vez, garantindo a integridade dos seus dados.

Para criar um novo objeto no banco de dados, usamos o método \`realm.create()\`. Para nosso primeiro exemplo, vamos supor que temos acesso à nossa instância do Realm (veremos como obter isso com hooks mais tarde, por enquanto, imagine que temos uma variável realm).

\`\`\`typescript
import Realm from "realm";
import Properties from "./schema/properties.schema";
import HomogeneusArea from "./schema/homogeneusArea.schema";

// (Imagine que 'realm' é a nossa instância aberta do banco de dados)

// Função para adicionar uma nova propriedade completa
const addNewProperty = () => {
    try {
        // 1. Abrimos a "caixa segura" para escrever no banco
        realm.write(() => {
            // 2. Criamos as Áreas Homogêneas primeiro.
            // Note que 'realm.create' retorna o objeto que foi criado.
            const area1 = realm.create<HomogeneusArea>('HomogeneusArea', {
                id: 'area-001',
                name: 'Talhão Principal',
            });

            const area2 = realm.create<HomogeneusArea>('HomogeneusArea', {
                id: 'area-002',
                name: 'Talhão da Sede',
            });

            // 3. Agora, criamos a Propriedade
            realm.create<Properties>('Properties', {
                id: 'prop-001',
                name: 'Fazenda Santa Maria',
                createdAt: new Date(),
                // 4. A MÁGICA: Para relacionamentos, passamos os objetos que acabamos de criar para a lista 'areas'.
                areas: [area1, area2]
            });

            console.log('Propriedade "Fazenda Santa Maria" criada com sucesso!');
        });
    } catch (error) {
        console.error("Falha ao criar a propriedade:", error);
    }
};
\`\`\`

Note que primeiro abrimos um bloco \`realme.write()\`. Isso garante que caso haja qualquer erro dentro deste, o Realm automaticamente desfaz todas as alterações, mantendo seu banco seguro.

Usamos \`realm.create<HomogeneusArea>('HomogeneusArea', ...)\` para criar os objetos "filhos" primeiro. O uso de \`<HomogeneusArea>\` é o TypeScript nos ajudando, garantindo que o objeto retornado (\`area1\`, \`area2\`) seja do tipo correto. E então usamos \`realm.create<Properties>('Properties', ...)\` para criar o objeto "pai".

No campo \`areas\`, que no nosso schema é uma lista (\`'HomogeneusArea[]'\`), nós simplesmente passamos um array com os objetos \`area1\` e \`area2\` que o Realm acabou de criar. O Realm entende esse array e cria os links do relacionamento automaticamente.

Você não "busca" dados no Realm da mesma forma que em um banco de dados SQL, onde você executa uma SELECT e obtém uma "foto" estática dos dados naquele momento. No Realm, você solicita uma visualização dos objetos, e o Realm te entrega uma Coleção "Viva" (uma \`Realm.Collection\`).

Uma \`Realm.Collection\` é um objeto que se atualiza automaticamente. Se você pedir ao Realm "me dê todas as Propriedades", ele te entrega uma coleção. Se, 10 minutos depois, você adicionar uma nova Propriedade em qualquer parte do seu aplicativo, aquela coleção que você buscou 10 minutos atrás se atualizará sozinha para incluir o novo item. Isso elimina quase toda a necessidade de gerenciamento de estado manual (como \`useState\` para listas) em React.

A forma mais básica de consulta é pedir todos os objetos de um determinado Schema:

\`\`\`typescript
// (Imagine que 'realm' é a nossa instância aberta do banco de dados)

// 1. Pedimos ao Realm todos os objetos do tipo 'Properties'
const todasAsPropriedades = realm.objects<Properties>('Properties');

console.log(\`Encontradas \${todasAsPropriedades.length} propriedades.\`);

// Se você adicionar uma nova propriedade DEPOIS desta linha...
// realm.write(() => {
//   realm.create('Properties', { id: 'prop-002', name: 'Nova Fazenda' });
// });
// ... a variável 'todasAsPropriedades' saberá da mudança,
// e 'todasAsPropriedades.length' aumentará.
\`\`\`

Quase nunca queremos todos os objetos. Para filtrar, usamos o método \`.filtered()\`, que utiliza uma sintaxe de query especial chamada Realm Query Language (RQL). Ela parece muito com SQL, mas é mais simples:

\`\`\`typescript
// 1. Buscando todas as propriedades
const todasAsPropriedades = realm.objects<Properties>('Properties');

// 2. Filtrando por um nome exato
// A sintaxe '$0' é um "placeholder" para o argumento que vem a seguir.
// Isso previne injeções de query e é a forma mais segura de filtrar.
const fazendaSantaMaria = todasAsPropriedades.filtered("name == $0", "Fazenda Santa Maria");

// 3. Filtrando por uma condição (ex: propriedades com notas)
const propriedadesComNotas = todasAsPropriedades.filtered("notes != null");

// 4. Filtrando propriedades que têm MAIS de 2 áreas homogêneas
const propriedadesGrandes = todasAsPropriedades.filtered("areas.@count > 2");

console.log(\`Propriedades com notas: \${propriedadesComNotas.length}\`);
\`\`\`

Você pode, também, encadear o método \`.sorted()\` para ordenar seus resultados.

\`\`\`typescript
// Buscando todas as propriedades e ordenando-as pelo nome,
// em ordem alfabética (A-Z).
const propriedadesOrdenadas = realm.objects<Properties>('Properties')
.sorted('name', false); // mas o argumento false já o default

// Para ordenar de Z-A (descendente), o segundo argumento seria 'false'.
\`\`\`

Se você sabe o id (a Chave Primária) do objeto que você quer, esta é uma forma de buscá-lo:

\`\`\`typescript
// Busca a propriedade com o ID exato 'prop-001'
const propriedadeEspecifica = realm.objectForPrimaryKey<Properties>('Properties', 'prop-001');

if (propriedadeEspecifica) {
    console.log(propriedadeEspecifica.name); // "Fazenda Santa Maria"
}
\`\`\`

Este é o núcleo da leitura no Realm. A chave é lembrar que \`realm.objects()\` não é uma operação pesada, na verdade, é super leve e instantânea, pois ela não "copia" os dados, apenas cria uma visualização para eles.

Assim como a criação, as operações de Atualizar (Update) e Deletar (Delete) são modificações no banco de dados e, portanto, também devem acontecer dentro de um bloco \`realm.write()\`.

Atualizar um objeto no Realm é incrivelmente simples. Como os objetos que lemos do Realm são "vivos", você não precisa executar um comando UPDATE complexo. Basta você: Encontrar o objeto que deseja modificar (usando \`objectForPrimaryKey\` ou \`.filtered()\`); Abrir uma transação \`realm.write()\`; Modificar as propriedades do objeto diretamente, como faria com qualquer objeto TypeScript.

\`\`\`typescript
// (Imagine que 'realm' é a nossa instância aberta do banco de dados)

const atualizarNomeDaPropriedade = (idDaPropriedade: string, novoNome: string) => {
    try {
        // 1. Primeiro, encontramos o objeto que queremos atualizar.
        // É mais eficiente buscar o objeto FORA da transação de escrita.
        const propriedade = realm.objectForPrimaryKey<Properties>('Properties', idDaPropriedade);

        if (!propriedade) {
            console.error("Propriedade não encontrada!");
            return;
        }

        // 2. Agora, abrimos a "caixa segura" para modificar o objeto
        realm.write(() => {
            // 3. Modificamos a propriedade diretamente.
            // O Realm detecta essa mudança e a salva no banco.
            propriedade.name = novoNome;
        });

        console.log(\`Propriedade \${idDaPropriedade} atualizada para "\${novoNome}"\`);

    } catch (error) {
        console.error("Falha ao atualizar a propriedade:", error);
    }
};

// Como chamar a função
atualizarNomeDaPropriedade('prop-001', 'Fazenda Santa Maria (Renomeada)');
\`\`\`

A mesma lógica se aplica a relacionamentos. Se você quiser adicionar uma nova \`HomogeneusArea\` a uma \`Properties\` existente:

\`\`\`typescript
// (Imagine que 'realm' é a nossa instância aberta do banco de dados)
// (E que as classes Properties e HomogeneusArea estão importadas)

const adicionarAreaAUmaPropriedade = (
    idDaPropriedade: string,
    idDaNovaArea: string,
    nomeDaNovaArea: string
) => {
    try {
        // 1. Encontramos a propriedade "pai" que queremos modificar.
        // É sempre melhor buscar objetos FORA da transação de escrita.
        const propriedade = realm.objectForPrimaryKey<Properties>('Properties', idDaPropriedade);

        if (!propriedade) {
            console.error(\`Propriedade com ID \${idDaPropriedade} não encontrada.\`);
            return;
        }

        // 2. Abrimos a "caixa segura" para modificar o banco
        realm.write(() => {
            // 3. CRIAMOS o novo objeto "filho" (HomogeneusArea)
            //    Note que isso também acontece DENTRO da transação.
            const novaArea = realm.create<HomogeneusArea>('HomogeneusArea', {
                id: idDaNovaArea,
                name: nomeDaNovaArea,
            });

            // 4. ATUALIZAMOS o relacionamento "pai"
            //    Basta usar métodos de array padrão do TypeScript na lista.
            propriedade.areas.push(novaArea);
        });

        console.log(\`Nova área "\${nomeDaNovaArea}" adicionada à propriedade "\${propriedade.name}"\`);

    } catch (error) {
        console.error("Falha ao adicionar a área:", error);
    }
};

// --- Como chamar a função ---

// Vamos supor que a 'prop-001' (Fazenda Santa Maria) já existe.
// (Ela tinha 2 áreas, 'area-001' e 'area-002')

// Agora, vamos adicionar uma terceira área a ela:
adicionarAreaAUmaPropriedade('prop-001', 'area-003', 'Talhão Novo');

// Se você buscar essa propriedade agora, ela terá 3 áreas na sua lista:
const propAtualizada = realm.objectForPrimaryKey<Properties>('Properties', 'prop-001');
console.log(propAtualizada.areas.length); // Saída: 3
\`\`\`

Para deletar dados, você usa o método \`realm.delete()\`. Você pode deletar um único objeto ou uma coleção inteira de objetos (resultado de um \`.filtered()\`).

\`\`\`typescript
// (Imagine que 'realm' é a nossa instância aberta do banco de dados)

const deletarPropriedade = (idDaPropriedade: string) => {
    try {
        // 1. Encontramos o objeto que queremos deletar
        const propriedadeParaDeletar = realm.objectForPrimaryKey<Properties>('Properties', idDaPropriedade);

        if (!propriedadeParaDeletar) {
            console.error("Propriedade não encontrada, não é possível deletar.");
            return;
        }

        // 2. Abrimos a "caixa segura" para a deleção
        realm.write(() => {
            // 3. Passamos o objeto para realm.delete()
            realm.delete(propriedadeParaDeletar);
        });

        console.log(\`Propriedade \${idDaPropriedade} deletada com sucesso.\`);

    } catch (error) {
        console.error("Falha ao deletar a propriedade:", error);
    }
};

// Como chamar a função
deletarPropriedade('prop-001');
\`\`\`

É importante notar como o Realm lida com relacionamentos. Se você deletar uma \`Properties\`, o Realm não deleta automaticamente as \`HomogeneusArea\` da lista \`areas\` (a menos que elas sejam "objetos embutidos", como o \`Location\` que discutimos). Você precisaria deletá-los manualmente se essa fosse a regra de negócio.

## Queries no Realm - Guia do RQL 

Quando utilizamos o método \`.filtered()\`, o primeiro argumento que passamos é uma string. Essa string não é JavaScript ; ela é escrita em Realm Query Language (RQL), uma linguagem de consulta criada pelo Realm para ser poderosa e segura.

A consulta é chamada de "predicado". A sintaxe é simples: \`nomeDaPropriedade OPERADOR valor\`. A forma mais segura de construir uma consulta é usando placeholders (marcadores de posição) como \`$0, $1, $2\`, etc, para queries parametrizadas. Isso evita erros de formatação e previne ataques de injeção de query.

\`\`\`typescript
// BOM (Inseguro se 'nome' vier do usuário):
propriedades.filtered(\`name == "\${nome}"\`);

// ÓTIMO (Seguro e recomendado):
propriedades.filtered("name == $0", nome);

// ÓTIMO (Com múltiplos argumentos):
propriedades.filtered("name == $0 AND areas.@count > $1", nome, 2);
\`\`\`

Ademais, você pode usar a notação de ponto para se referir a propriedades derivadas de um objeto. Você pode fazer referência até mesmo a propriedades de objetos embarcados e de relacionamentos com a notação de pontos.

\`\`\`typescript
propriedades.filtered("name == $0 AND areas.name > $1", nomePropriedade, nomeArea);
\`\`\`

A operação mais direta em uma pesquisa é a comparação de valores. Abaixo uma tabela com todos eles.

| Operador | Significado | Exemplo de Uso |
| --- | --- | --- |
| \`==\` | Igual a | <br>\`name == $0\` <br> |
| \`!=\` | Diferente de | <br>\`status != $0\` <br> |
| \`>\` | Maior que | <br>\`areas.@count > $0\` <br> |
| \`>=\` | Maior ou igual a | <br>\`createdAt >= $0\` <br> |
| \`<\` | Menor que | <br>\`preco < $0\` <br> |
| \`<=\` | Menor ou igual a | <br>\`lotes.@count <= $0\` <br> |
| \`IN\` | Está contido em uma lista | <br>\`status IN $0\` (onde \`$0\` é um array, ex: \`['ativo', 'pendente']\`) <br> |
| \`BETWEEN\` | Está dentro de um intervalo (inclusivo) | <br>\`createdAt BETWEEN {$0, $1}\` (onde \`$0\` é a data de início e \`$1\` é a data de fim) <br> |

Para predicados compostos utilize operadores lógicos:

| Operador | Significado | Exemplo de Uso |
| --- | --- | --- |
| \`AND\` ou \`&&\` | E (ambas as condições devem ser verdadeiras) | <br>\`name == $0 AND areas.@count > $1\` <br> |
| \`OR\` ou \` |  | \` | Ou (pelo menos uma condição deve ser verdadeira) | <br>\`name == $0 OR status == $1\` <br> |
| \`NOT\` ou \`!\` | NÃO (inverte a condição) | <br>\`NOT (name == $0)\` ou \`!(name == $0)\` <br> |

Você pode, também, comparar valores de string usando esses operadores de string.

| Operador | Significado | Exemplo de Uso |
| --- | --- | --- |
| \`==\` ou \`=\` | Igual a (correspondência exata) | <br>\`name == $0\` <br> |
| \`!=\` ou \`<>\` | Diferente de (correspondência exata) | <br>\`name != $0\` <br> |
| \`CONTAINS\` | Contém a substring | <br>\`name CONTAINS $0\` <br> |
| \`BEGINSWITH\` | Começa com a substring | <br>\`name BEGINSWITH $0\` <br> |
| \`ENDSWITH\` | Termina com a substring | <br>\`name ENDSWITH $0\` <br> |
| \`LIKE\` | Correspondência com "curingas" (\`*\` ou \`?\`) | <br>\`name LIKE $0\` <br> |

Você pode adicionar \`[c]\` ao final de qualquer operador de string para que ele ignore a diferença entre maiúsculas e minúsculas.

\`\`\`typescript
"name CONTAINS[c] $0", 'a'
\`\`\`

Os operadores de coleção são usados para fazer consultas baseadas em relacionamentos (como a nossa lista \`areas\` na \`Properties\`).

| Operador | Significado | Exemplo de Uso |
| --- | --- | --- |
| \`@count\` | Retorna o número de itens na lista | <br>\`areas.@count == $0\` <br> |
| \`ANY\` | Pelo menos um item na lista bate a condição | <br>\`ANY areas.name == $0\` <br> |
| \`SOME\` | Pelo menos um item na lista bate a condição (Alias para ANY) | <br>\`SOME areas.name == $0\` <br> |
| \`ALL\` | Todos os itens na lista batem a condição | <br>\`ALL areas.name BEGINSWITH $0\` <br> |
| \`NONE\` | Nenhum item na lista bate a condição | <br>\`NONE areas.name == $0\` <br> |

Neste documento, abordamos o que há de mais fundamental em RQL. Para mais operadores ou informações mais avançadas sobre o RQL consulte aqui.
            `
        },
        {
            title: 'Integração com React Native',
            slug: 'integracao-react-native',
            duration: '45 min',
            type: LessonType.READ,
            order: 3,
            content: `Nesta seção, exploraremos como construir um gerenciamento de estado usando a abordagem "nativa" do Realm com Hooks. Esta é uma arquitetura poderosa que é ideal para aplicações "Offline-First", onde os dados são criados e manipulados primariamente no dispositivo.

É importante notar que esta é uma abordagem alternativa à utilizada no projeto Coleta Cacau. No próximo capítulo (Redux Toolkit), veremos a arquitetura real do Coleta Cacau, que é "API-First". Lá, os dados vêm de um servidor, e o Redux gerencia o estado da aplicação, usando o Realm apenas como uma camada de cache para persistência offline.

A integração é feita através do pacote \`@realm/react\`, que nos dá um conjunto de Hooks poderosos. Eles automatizam a conexão com o banco e, o mais importante, tornam nossos componentes reativos aos dados. Comece digitando em seu terminal o comando: \`npm install @realm/react@^0.6.2\`.

Para usar o Realm em um aplicativo React, nós não abrimos e fechamos o banco de dados manualmente em cada tela. Em vez disso, "provemos" o acesso ao banco para todo o aplicativo usando um componente de contexto.

O \`<RealmProvider>\` é um componente que deve envolver toda a sua aplicação (ou pelo menos a parte dela que precisa de acesso ao banco). A função dele é: abrir a conexão com o Realm e disponibilizar a instância do realm para todos os componentes filhos que a solicitarem via hooks. Em \`App.tsx\` faça as seguintes modificações:

\`\`\`typescript
import React from 'react';
import TabNavigator from './routes/TabNavigator';
// 1. Comece os novos imports
import { RealmProvider } from '@realm/react';
import Properties from './data/schema/properties.schema';
import HomogeneusArea from './data/schema/homogeneusArea.schema';
import Location from './data/schema/location.schema';

export default function App() {
    return (
        // 2. Envolva sua aplicação com o RealmProvider
        // 3. Passe um array com todas suas classes de schema
        <RealmProvider
            schema={[Properties, HomogeneusArea, Location]}
        > //
            <TabNavigator/>
        </RealmProvider>
    );
}
\`\`\`

A partir deste ponto, qualquer componente dentro do \`<TabNavigator>\` pode usar os hooks do Realm.

Agora, crie uma nova tela chamada \`AddProperty.tsx\` dentro da pasta \`screens\`. Ela deve inicialmente estar assim:

\`\`\`tsx
import React from "react";
import { Text } from "react-native";
export default function AddProperty (){
    return (
        <Text>Tela será implementada em breve.</Text>
    );
}
\`\`\`

Precisamos ajustar nossa navegação uma vez que essa nova tela será acessada por meio da tela \`Property.tsx\`. No arquivo \`HomeStack.tsx\` faça as seguintes modificações:

\`\`\`tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Property from "../screens/Property";
import HomogeneusArea from "../screens/HomogeneusArea";
import AddProperty from "../screens/AddProperty"; // 1. Importe a tela nova
import mockedProperties from "../data/mockedProperty";

export type HomeStackParamList = {
    Property: undefined,
    HomogeneusArea: {propertyId: string},
    AddProperty: undefined // 2. Adicione a nova rota ao mapa
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
        > //
            <Stack.Screen
                name="Property"
                component={Property}
                options={{
                    title: 'Propriedades'
                }}
            />
            {/*3. Modifique o options dessa tela */}
            <Stack.Screen
                name="HomogeneusArea"
                component={HomogeneusArea}
                options={{title:'Carregando Áreas...'}}
            />
            {/*4. Adicione a nova tela à pilha */}
            <Stack.Screen
                name="AddProperty"
                component={AddProperty}
                options={{title: 'Adicionar Propriedade'}}
            />
        </Stack.Navigator>
    );
}
\`\`\`

Vamos criar um novo componente que estará na tela \`Property.tsx\`. Este novo componente será responsável por levar o usuário para nossa nova tela onde ele poderá cadastrar suas propriedades. Neste arquivo, utilizaremos o hook \`useQuery()\`.

Este hook substitui o \`realm.objects()\`. Ele executa uma consulta e retorna uma coleção de resultados "viva". Se os dados no banco mudarem, o \`useQuery\` detecta a mudança e automaticamente força o seu componente a re-renderizar com os novos dados. Dessa forma lemos os dados de forma reativa.

No arquivo \`Property.tsx\` realize as seguintes mudanças:

\`\`\`tsx
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"; // Atenção novos componentes aqui!
import ItemList from "../components/ItemList";
import { HomeStackParamList } from "../routes/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";
// 1. Comece pelos novos imports e apague o import dos dados mocados
import { useQuery } from "@realm/react"; // O Hook
import Properties from "../data/schema/properties.schema"; // Nosso schema
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // icone para novo componente
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

type Props = StackScreenProps<HomeStackParamList, 'Property'>;

export default function Property({navigation}: Props){
    // Operação Read (Leitura) do CRUD
    const properties = useQuery(Properties);

    const handleItemPress = (id: string) => {
        navigation.navigate('HomogeneusArea', {propertyId: id})
    }

    // handle para o novo botão
    const handleAddPress = () => {
        navigation.navigate('AddProperty');
    }

    // Agora verificamos primeiro se há propriedades cadastradas no nosso banco de dados local
    return (
        <View style={styles.container}>
            {properties.length === 0 ?(
                <Text style={styles.placeholder}>
                    Ainda não há propriedades cadastradas
                </Text>
            ) : (
                <ItemList
                    itens={properties}
                    onItemPress={handleItemPress}>
                </ItemList>
            )}
            {/* Novo componente */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleAddPress}
                activeOpacity={0.7}>
                <FontAwesomeIcon icon={faPlus} size={22} color="white"/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        maxWidth: 400,
        alignItems: 'center',
        marginTop: 20,
    },
    placeholder: {
        textAlign: 'center',
        marginTop: 325,
        fontSize: 15,
        fontWeight: '400',
        color: '#666'
    },
    button: {
        position: 'absolute', // Posição absoluta em relação ao 'container'
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2E4858',
        alignItems: 'center',
        justifyContent: 'center',
        right: 20, // Distância da direita
        bottom: 150, // Distância do fundo
        elevation: 8
    }
});
\`\`\`

O seu terminal deve estar apontando um problema em \`itens={properties}\` o que é completamente esperado. Acontece que precisamos modificar o type da props do nosso componente \`ItemList\` para lidar com o retorno de \`useQuery()\`. O nosso hook retorna \`Realm.Results<Properties>\`, que é uma “coleção viva” do realm. Um objeto especial do realm que se atualiza sozinho. O nosso componente \`ItemList\` está esperando um array padrão TypeScript e é isso que iremos modificar em \`ItemList.tsx\`:

\`\`\`tsx
import React from "react";
import { FlatList } from "react-native";
import ItemProvider from "./ItemProvider";

// itens agora é do tipo Array somente para Leitura, um tipo que consegue o Realm.Results consegue satisfazer
export type ItemListProps = {
    itens : ReadonlyArray<{ id: string, name: string }>,
    onItemPress?: (id: string) => void
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

Agora, se em qualquer outro lugar do app você adicionar uma nova \`Properties\` ao banco, esta tela irá se atualizar sozinha e mostrar o novo item, sem que você precise escrever nenhum \`useState\` ou \`useEffect\`.

Para Criar, Atualizar ou Deletar dados, precisamos da instância principal do Realm para chamar o \`realm.write()\`. O hook \`useRealm()\` nos dá acesso seguro a essa instância. Vamos modificar o arquivo \`AddProperty.tsx\` para implementarmos o Create do CRUD.

Comece pelos imports:

\`\`\`tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRealm } from '@realm/react';
import Properties from '../data/schema/properties.schema';
import HomogeneusArea from '../data/schema/homogeneusArea.schema';
import Realm from 'realm';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../routes/HomeStack';
\`\`\`

E então crie o type do props de nosso componente:

\`\`\`typescript
type AddPropertyProps = StackScreenProps<HomeStackParamList, 'AddProperty'>;
\`\`\`

E agora modifique a função principal do arquivo:

\`\`\`tsx
// Lembre-se de passar nosso props como parâmetro da função
export default function AddProperty ({ navigation } : AddPropertyProps){
    const realm = useRealm(); // Nosso hook para o Create do CRUD
    const [propertyName, setPropertyName] = useState('');

    const [areas, setAreas] = useState(['']); // Estado para gerenciar as áreas homogêneas

    // Função para adicionar um novo campo de área
    const handleAddAreaField = () => {
        setAreas([...areas, '']); // adiciona uma nova string vazia ao array
    };

    // Função para atualizar o nome de uma área específica
    const handleAreaNameChange = (text: string, index: number) => {
        const newAreas = [...areas];
        newAreas[index] = text;
        setAreas(newAreas);
    };

    // Função para salvar tudo no Realm
    const handleSaveProperty = () => {
        // Validação (Se há uma propriedade ela deve ter ao menos uma área homogênea)
        const validAreas = areas.filter(area => area.trim() !== '') // filtra campos vazios
        if(!propertyName.trim() || areas.length === 0){
            Alert.alert(
                'Erro',
                'Por favor, preencha o nome da propriedade e adicione pelo menos uma área homogênea.'
            );
            return;
        }

        try {
            // CRIAÇÃO (C) DO CRUD:
            realm.write(() => {
                // 1. Criar os objetos HomogeneusArea
                const createdAreas = validAreas.map((areaName) => {
                    return realm.create<HomogeneusArea>('HomogeneusArea', {
                        id: new Realm.BSON.UUID().toHexString(),
                        name: areaName.trim(),
                    });
                });

                // 2. Criar o objeto Properties
                realm.create<Properties>('Properties', {
                    id: new Realm.BSON.UUID().toHexString(),
                    name: propertyName.trim(),
                    areas: createdAreas, // Associa a lista de áreas criadas
                    createdAt: new Date(),
                });
            });

            Alert.alert('Sucesso', 'Propriedade salva com sucesso!');
            navigation.goBack(); // Volta para a tela de lista

        } catch (error) {
            Alert.alert('Erro ao Salvar', (error as Error).message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        > //
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nome da Propriedade</Text>
                <TextInput
                    style={styles.input}
                    value={propertyName}
                    onChangeText={setPropertyName}
                    placeholder="Ex: Fazenda Palmeiras"/>

                <Text style={styles.label}>Áreas Homogêneas</Text>
                {areas.map((areaName, index) => (
                    <TextInput
                        key={index}
                        style={styles.input}
                        value={areaName}
                        onChangeText={(text) => handleAreaNameChange(text, index)}
                        placeholder={\`Nome da Área \${index + 1}\`}
                    />
                ))}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonSecondary]} // Usamos um estilo secundário
                        onPress={handleAddAreaField}
                        activeOpacity={0.8}>
                        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                            Adicionar Áreas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSaveProperty}
                        activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Salvar Propriedade</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
\`\`\`

Aplique o estilo:

\`\`\`typescript
const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 120
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15
    },
    button: {
        backgroundColor: '#2E4858',
        width: 170,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#2E4858',
        elevation: 0,
    },
    buttonTextSecondary: {
        color: '#2E4858',
    }
});
\`\`\`

Com isso, ao preencher o formulário corretamente e clicar em Salvar Propriedade, o \`useRealm\` fará a escrita, e o \`useQuery\` detectará a mudança e irá renderizar o novo item na lista instantaneamente.

Em nossos schemas, tínhamos definido \`id\` como \`'string'\`. Mas no código acima, o código \`new Realm.BSON.UUID().toHexString()\` está sendo usado para gerar esse ID. Esta é a melhor prática. UUID é um formato de string que garante um identificador universalmente único. Isso é essencial em aplicativos que sincronizam dados, pois previne que um item criado no "Celular A" tenha o mesmo ID de um item criado no "Celular B".

Quando você só precisa de um objeto (pela sua chave primária), o \`useObject()\` é a ferramenta certa. Vamos utilizá-lo na tela \`HomogeneusArea.tsx\`, onde renderizamos a áreas homogêneas pelo \`id\` vinculado à propriedade. Ademais, precisamos atualizar o título da tela dentro de \`HomogeneousArea.tsx\`. utilizando um \`navigation.setOptions\` dentro de um \`useEffect()\`.

\`\`\`tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemList from "../components/ItemList";
import { HomeStackParamList } from "../routes/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";
// 1. Comece pelos imports
import { useObject } from "@realm/react"; // Hook para Realm
import Properties from "../data/schema/properties.schema"; // Schema
import { useEffect } from "react"; // Hook para título dinâmico da tela

type Props = StackScreenProps<HomeStackParamList, 'HomogeneusArea'>

// 2. Agora utilizamos o navigation nas props
export default function HomogeneusArea({ route, navigation } : Props){
    const {propertyId} = route.params;

    // 3. Use o hook para buscar a propriedade pelo ID
    const selectedProperty = useObject(Properties, propertyId);

    // 4. Para atualizar o título da tela
    useEffect(() => {
        if (selectedProperty){
            navigation.setOptions({
                title: \`\${selectedProperty.name} - Áreas Homogêneas\`
            });
        }
    } , [selectedProperty, navigation]);

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
        width: '100%',
        alignSelf: 'center',
        marginTop: 20,
    }
});
\`\`\`

Em resumo, a biblioteca \`@realm/react\`, através de componentes como \`<RealmProvider>\` e hooks essenciais como \`useRealm\`, \`useQuery\` e \`useObject\`, oferece uma solução robusta e elegante para integrar o Realm DB diretamente com os componentes React Native. Este padrão arquitetural brilha em cenários "Offline-First", onde o banco de dados local atua como a fonte primária dos dados e a interface do usuário precisa reagir de forma transparente e instantânea às mudanças nos dados. Embora o projeto Coleta Cacau adote uma estratégia de gerenciamento de estado diferente (utilizando Redux Toolkit, como será abordado no próximo capítulo) devido à sua natureza "API-First", dominar esta abordagem baseada em hooks é fundamental para explorar todo o potencial reativo do Realm em diversos contextos de desenvolvimento mobile.
            `
        }
    ],
    quiz: {
        title: 'Quiz: Persistência de Dados com Realm DB',
        description: 'Avalie seus conhecimentos sobre Schemas, operações CRUD, linguagem de consulta RQL e a integração do Realm DB com React Native.',
        passingScore: 70,
        questions: [
            {
                text: 'No Realm DB, o que é essencial ao realizar qualquer operação que modifique o banco de dados, como Criar, Atualizar ou Deletar objetos?',
                options: [
                    {
                        text: 'Buscar os dados primeiro utilizando o método `.filtered()`.',
                        isCorrect: false
                    },
                    {
                        text: 'Executar as operações estritamente dentro de uma transação `realm.write()`.',
                        isCorrect: true
                    },
                    {
                        text: 'Definir a propriedade `embedded: true` no schema do objeto.',
                        isCorrect: false
                    },
                    {
                        text: 'Utilizar queries SQL tradicionais através de um ORM.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual hook do pacote `@realm/react` é utilizado para ler uma coleção "viva" de objetos de um schema de forma reativa, fazendo com que o componente se re-renderize automaticamente quando os dados mudam?',
                options: [
                    {
                        text: 'useRealm()',
                        isCorrect: false
                    },
                    {
                        text: 'useObject()',
                        isCorrect: false
                    },
                    {
                        text: 'useQuery()',
                        isCorrect: true
                    },
                    {
                        text: 'useEffect()',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Ao utilizar o método `.filtered()` para criar consultas no Realm (RQL), qual é a abordagem recomendada e mais segura para passar variáveis externas para a string de consulta, evitando injeção de query?',
                options: [
                    {
                        text: 'Concatenar a string diretamente usando template literals, como por exemplo: `name == "${nome}"`.',
                        isCorrect: false
                    },
                    {
                        text: 'Usar placeholders como `$0`, `$1` e passar os argumentos em sequência após a string de consulta.',
                        isCorrect: true
                    },
                    {
                        text: 'Armazenar as variáveis no AsyncStorage antes de executar o filtro.',
                        isCorrect: false
                    },
                    {
                        text: 'Converter todos os parâmetros para números antes de passá-los para o filtro.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Como é definido um relacionamento inverso (por exemplo, um objeto "filho" referenciando de volta seu objeto "pai") na modelagem de Schemas do Realm?',
                options: [
                    {
                        text: 'Criando uma tabela intermediária manualmente e vinculando as chaves estrangeiras.',
                        isCorrect: false
                    },
                    {
                        text: 'Utilizando a propriedade `linkingObjects` dentro do schema do objeto "filho".',
                        isCorrect: true
                    },
                    {
                        text: 'Adicionando um array de chaves primárias no objeto "pai" e lendo-as no "filho".',
                        isCorrect: false
                    },
                    {
                        text: 'Utilizando o operador `@count` na linguagem de consulta RQL para buscar o pai.',
                        isCorrect: false
                    }
                ]
            }
        ]
    }
}