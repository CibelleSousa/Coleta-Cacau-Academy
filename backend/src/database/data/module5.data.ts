import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';
import { SeedModule } from './types';

export const module5: SeedModule = {
    title: '5. Redux Toolkit',
    description: 'Gerenciamento de estado global e lógica assíncrona com Redux Toolkit.',
    order: 5,
    duration: 110,
    type: ModuleType.THEORY,
    lessons: [
        {
            title: 'Introdução e Pilares do Redux Toolkit',
            slug: 'introducao-pilares-redux',
            duration: '40 min',
            type: LessonType.READ,
            order: 1,
            content: `Como vimos na conclusão do capítulo anterior, a arquitetura do aplicativo Coleta Cacau difere da abordagem "offline-first" pura que os hooks do Realm proporcionam. A fonte primária dos dados do Coleta Cacau reside na Plataforma Cacau, que define o aplicativo móvel como um consumidor "API-First". Neste cenário, simplesmente reagir aos dados do banco local não é suficiente ; precisamos de um sistema robusto para gerenciar o fluxo de dados que vêm do servidor, lidar com estados intermediários (como carregamento e erros) e manter um estado consistente em toda a aplicação.

            No ecossistema React/React Native, existem diversas ferramentas para gerenciar o estado global. Uma opção seria usar a Context API nativa do React em conjunto com o hook \`useReducer\`. Embora eficaz para compartilhar estado em partes menores da aplicação ou para estados menos complexos, ela pode se tornar difícil de gerenciar e otimizar em aplicações de grande escala com muitas atualizações de estado interconectadas. Outras bibliotecas populares como Zustand ou Jotai oferecem abordagens mais modernas e com menos código repetitivo que o Redux clássico, focando em simplicidade e APIs baseadas em hooks.

            No entanto, para um aplicativo como o Coleta Cacau, que lida com um fluxo de dados vindo de uma API externa, necessita de rastreabilidade clara das mudanças de estado e pode crescer em complexidade, a escolha do Redux, e especificamente sua versão moderna Redux Toolkit (RTK), se justifica. O Redux Toolkit foi criado pela própria equipe do Redux para ser a forma oficial, opinativa e eficiente de usar Redux. Ele mitiga a verbosidade do Redux clássico e oferece ferramentas poderosas otimizadas para lidar com a lógica assíncrona de chamadas de API. Sua arquitetura bem definida e as poderosas ferramentas de depuração (Redux DevTools) proporcionam um controle explícito e uma rastreabilidade inigualável do estado, fatores cruciais em um projeto "API-First". O RTK inclui utilitários que simplificam drasticamente a configuração da store, a criação de reducers e actions, e o tratamento de lógica assíncrona, promovendo as melhores práticas desde o início.

            ## Objetivo 

            O objetivo deste capítulo é desmistificar o Redux Toolkit e demonstrar como ele orquestra o estado global do aplicativo Coleta Cacau. Ao final desta seção, o desenvolvedor será capaz de compreender os princípios fundamentais do Redux, como a Store, Actions e Reducers, e estará apto a configurar uma store utilizando o \`configureStore\` do Toolkit. O leitor aprenderá a modelar fatias (slice) do estado e sua lógica de atualização com \`createSlice\`, a disparar ações síncronas e assíncronas – especialmente para buscar dados da API – através dos hooks \`useDispatch\` e da função \`createAsyncThunk\`, e a ler dados do estado global nos componentes React Native de forma eficiente com o hook \`useSelector\`. Além disso, esta seção visa elucidar a arquitetura real do Coleta Cacau, detalhando como o Redux atua como a fonte de dados para a Interface do Usuário enquanto o Realm serve como camada de persistência offline, concluindo com um comparativo entre esta abordagem e a alternativa de usar os hooks do Realm diretamente.

            ## Definição 

            Redux Toolkit (RTK) é o conjunto de ferramentas oficial e recomendado para o desenvolvimento eficiente com Redux. Ele foi projetado para simplificar as tarefas mais comuns do Redux, reduzir o código repetitivo e ajudar os desenvolvedores a seguir as melhores práticas. Suas principais APIs incluem \`configureStore\` (para configurar a store com padrões sensatos), \`createSlice\` (para gerar automaticamente reducers, actions e action types a partir de uma definição de estado e "mini-reducers"), e \`createAsyncThunk\` (para abstrair o padrão comum de requisições assíncronas). Essencialmente, o RTK não muda os princípios do Redux, mas torna sua aplicação muito mais simples e prazerosa.

            ## Pilares do Redux Toolkit 

            O Redux opera com base em alguns princípios fundamentais que o Redux Toolkit ajuda a implementar de forma mais simples e eficiente.

            O primeiro e mais importante princípio do Redux é que todo o estado da sua aplicação reside em um único objeto, chamado **Store**. Não importa o tamanho do seu aplicativo, desde a informação do usuário logado até os dados das propriedades, tudo está contido nesta única árvore de estado. Essa centralização traz benefícios como:

            * 
            **Previsibilidade.** O estado só pode mudar de forma controlada, seguindo regras específicas.


            * 
            **Depuração Facilitada.** Como todo o estado está em um só lugar, ferramentas como o Redux DevTools podem depurar o código, mostrando como o estado evoluiu a cada ação disparada.


            * 
            **Consistência.** Garante que diferentes partes da sua UI estejam sempre exibindo a mesma informação atualizada.

            O Redux Toolkit simplifica enormemente a criação da store com a função \`configureStore\`. Ela já vem pré-configurada com as melhores práticas e middlewares essenciais.

            Comece criando uma pasta dentro da pasta “src” chamada “store” e nela crie um arquivo chamado \`store.ts\`. Vamos criar um exemplo bem básico de uma store nesse arquivo, apenas para nos familiarizar com o conceito.

            Agora digite em seu terminal o comando: \`npm install @reduxjs/toolkit react-redux\`. Abaixo o código do nosso exemplo bem básico (e ainda incompleto) de uma store:

            \`\`\`typescript
            import { configureStore } from '@reduxjs/toolkit';

            // (Futuramente, importaremos nossos 'reducers' aqui) //

            export const store = configureStore({
                // O campo 'reducer' recebe um objeto onde cada chave
                // representa uma "fatia" (slice) do nosso estado global.
                reducer: {
                    // Exemplo:
                    // properties: propertiesReducer,
                    // user: userReducer,
                    // ...outras fatias do estado
                },

                // configureStore já inclui middlewares úteis por padrão, como:
                // - redux-thunk: Para lidar com lógica assíncrona (veremos depois).
                // - immer: Para permitir escrita "mutável" nos reducers (veremos depois).
                // - E verificações de desenvolvimento para detectar erros comuns.
            });

            // Tipos úteis para usar em toda a aplicação //
            export type RootState = ReturnType<typeof store.getState>;
            export type AppDispatch = typeof store.dispatch;
            \`\`\`

            O \`configureStore()\` recebe um objeto de configuração. A propriedade mais importante é a propriedade “reducer”, que combina todos os reducers da sua aplicação (veremos o que são a seguir), ele já embute ferramentas essenciais, simplificando o setup. Ademais, exportamos os tipos \`RootState\` e \`AppDispatch\` para garantir a segurança de tipo ao interagir com a store em outros arquivos.

            Com a store configurada (mesmo que ainda vazia), temos o container central do nosso estado. O próximo passo é entender como esse estado é organizado e como ele pode ser modificado. É aí que entram os **Reducers** e **Slices**.

            No Redux, a única forma de alterar o estado na Store é despachando (dispatching) uma **Ação** (veremos o que é isso a seguir). Um **Reducer** é uma função pura que recebe o estado atual e uma ação, e retorna o novo estado. Significa que, para a mesma entrada (estado atual + ação), ela sempre retorna a mesma saída, e não causa "efeitos colaterais" (como chamar uma API ou modificar variáveis fora do seu escopo).

            No Redux clássico, escrever reducers era verboso, envolvendo switch statements e a necessidade de garantir a imutabilidade manualmente (ex: usando o operador spread \`...\`). O Redux Toolkit introduz o conceito de Slice (fatia). É uma forma de organizar sua lógica Redux. Um slice representa uma porção do seu estado global, juntamente com os reducers que definem como essa porção pode ser atualizada. Por exemplo, em vez de um único reducer gigante, você teria um \`propertiesSlice\`, um \`userSlice\`, um \`settingsSlice\`, etc.

            A função \`createSlice\` é a mágica do Redux Toolkit. Ela simplifica radicalmente a criação de reducers e actions. Você chama \`createSlice\` com um objeto de configuração que inclui: \`name\`, uma string que nomeia o slice (ex: 'properties') que é usado para gerar os tipos das ações; \`initialState\`, o valor inicial para esta fatia do estado; \`reducers\`, um objeto onde cada chave é o nome de uma ação que você quer definir, e o valor é a função reducer correspondente.

            Para cada função reducer que você define, o \`createSlice\` gera automaticamente a action creator correspondente. Ele também gera as strings de tipo de ação (ex: 'properties/addProperty'), evitando erros de digitação.

            Outra grande vantagem é que “por debaixo dos panos” o \`createSlice\` usa Immer. Ou seja, dentro das funções reducer do \`createSlice\`, você pode escrever código que parece estar mutando o estado diretamente (ex: \`state.items.push(newItem)\`). O Immer detecta essas "mutações" e as transforma em atualizações imutáveis seguras nos bastidores. Isso torna o código muito mais fácil de ler e escrever.

            Vamos criar um slice para gerenciar nossa lista de propriedades. Dentro da pasta store crie uma pasta chamada **slices** é nela que organizaremos as slices do estado global do nosso caso de estudo.

            Dentro da pasta slices crie um arquivo chamado \`propertiesSlices.ts\`. Dentro dele teremos o código abaixo.

            \`\`\`typescript
            import { createSlice, PayloadAction } from "@reduxjs/toolkit";
            import { PropertyProvider } from "../../types/property.types";

            // 1. Primeiro definimos o tipo deste slice do nosso estado global
            interface PropertiesState {
                items: PropertyProvider[]; // Nossa lista de propriedades
                status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status de carregamento da lista
                error: string | null; // Eventual erro que possa dar no carregamento
            }

            // 2. Definimos o estado inicial deste slice
            const initialState: PropertiesState = {
                items: [],
                status: 'idle',
                error: null
            };

            // 3. Criamos nosso slice
            const propertiesSlice = createSlice({
                name: 'properties', // Nome do slice
                initialState,
                reducers:{
                    // Ação para definir todas as propriedades (ex: após buscar da API)
                    setProperties: (state, action: PayloadAction<PropertyProvider[]>) => {
                        // Graças ao Immer, podemos "mutar" o state diretamente aqui.
                        state.items = action.payload;
                        state.status = 'succeeded';
                        state.error = null;
                    },

                    // Exemplo: Ação para adicionar uma ÚNICA propriedade (ex: após salvar no formulário)
                    addProperty: (state, action: PayloadAction<PropertyProvider>) => {
                        state.items.push(action.payload); // Immer cuida da imutabilidade!
                    },

                    // Outros reducers poderiam ser: removeProperty, updateProperty, etc

                    // Reducer para quando a busca de propriedades começa
                    propertiesLoading: (state) => {
                        state.status = 'loading';
                        state.error = null;
                    },

                    // Reducer para quando a busca falha
                    propertiesFailed: (state, action: PayloadAction<string>) => {
                        state.status = 'failed';
                        state.error = action.payload;
                    }

                    // (Veremos outros reducers mais tarde, para lidar com ações assíncronas)
                }
            });

            // 5. Exportamos as actions geradas automaticamente
            export const {
                setProperties,
                addProperty,
                propertiesLoading,
                propertiesFailed
            } = propertiesSlice.actions;

            // 6. Exportamos o reducer do slice
            export default propertiesSlice.reducer;
            \`\`\`

            Observe que, dentro de \`reducers\`, criamos funções como \`setProperties\`. A função recebe o \`state\` atual (apenas desta fatia) e a \`action\`. \`PayloadAction<T>\` é um tipo do Toolkit para tipar o \`action.payload\`. Escrevemos toda a lógica como se estivéssemos mutando o state.

            O \`createSlice\` nos devolve um objeto com \`.actions\`. Ao exportarmos as action creators geradas (\`setProperties\`, \`addProperty\` e etc) e chamar \`setProperties(minhaLista)\` o RTK criará a ação \`{ type: 'properties/setProperties', payload: minhaLista }\` automaticamente.

            Por fim, note que exportamos o \`propertiesSlice.reducer\` pois, ele será combinado em \`store.ts\`. Atualize esse arquivo com o código abaixo:

            \`\`\`typescript
            import { configureStore } from '@reduxjs/toolkit';
            import propertiesReducer from './slices/properties' // 1. Importe o reducer que criamos na slice de propriedades

            export const store = configureStore({
                reducer: {
                    // 2. Adicione o reducer ao objeto, dando um nome para esta fatia do nosso estado global
                    properties: propertiesReducer,
                    // user: userReducer,
                    // ...outras fatias do estado
                },
            });

            export type RootState = ReturnType<typeof store.getState>;
            export type AppDispatch = typeof store.dispatch;
            \`\`\`

            Com isso, nossa store agora tem uma fatia chamada \`properties\`, gerenciada pelo reducer que criamos com \`createSlice\`.

            O que é uma Ação? Uma Ação é um objeto JavaScript simples que descreve o que aconteceu. É a única fonte de informação para a Store. Ela deve ter uma propriedade \`type\` (uma string) e, opcionalmente, um \`payload\` (os dados).

            \`\`\`javascript
            // Exemplo de uma Ação (no Redux clássico)
            function addProperty(id, name) {
                return {
                    type: 'properties/addProperty',
                    payload: {id: '123', name:'Nome da Fazenda', ... }
                }
            }
            \`\`\`

            Como vimos, o \`createSlice\` já criou as action creators para nós. Então, em vez de montar esse objeto manualmente, nós apenas chamamos a função: \`addProperty({ id: '123', ... })\`.

            O que é o \`useDispatch\`? O hook \`useDispatch\` é a ferramenta que nos dá a função \`dispatch\`. Pense na \`dispatch\` como um "mensageiro". Você entrega uma Ação para ela, e ela a leva até a Store, que por sua vez a entrega ao Reducer correto.

            Vamos revisitar nosso formulário \`AddProperty.tsx\`. Em vez de usar \`realm.write()\`, agora vamos despachar uma Ação do Redux.

            \`\`\`tsx
            import React, { useState } from 'react';
            import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
            import { StackScreenProps } from '@react-navigation/stack';
            import { HomeStackParamList } from '../routes/HomeStack';

            // 1. Imports para uso do RTK
            import { useDispatch } from 'react-redux';
            import { addProperty } from '../store/slices/properties';
            import { PropertyProvider } from '../types/property.types';

            type AddPropertyProps = StackScreenProps<HomeStackParamList, 'AddProperty'>;

            export default function AddProperty ({ navigation } : AddPropertyProps){
                // 2. Pegar a função dispatch
                const dispatch = useDispatch(); // Novo hook para o Creat do CRUD

                const [propertyName, setPropertyName] = useState('');

                const [areas, setAreas] = useState(['']); // Estado para gerenciar as áreas homogêneas continua aqui

                // Função para adicionar um novo campo de área continua a mesma
                const handleAddAreaField = () => {
                    setAreas([...areas, '']);
                };

                // Função para atualizar o nome de uma área específica continua a mesma
                const handleAreaNameChange = (text: string, index: number) => {
                    const newAreas = [...areas];
                    newAreas[index] = text;
                    setAreas(newAreas);
                };

                // Função para salvar a alteração do estado no Redux
                const handleSaveProperty = () => {
                    // Validação (Se há uma propriedade ela deve ter ao menos uma área homogênea)
                    const validAreas = areas.filter(area => area.trim() !== '') // filtra campos vazios
                    if(!propertyName.trim() || validAreas.length === 0){
                        Alert.alert(
                            'Erro',
                            'Por favor, preencha o nome da propriedade e adicione pelo menos uma área homogênea.'
                        );
                        return;
                    }

                    // 3. Criar o novo objeto Propriedade
                    // (Por enquanto, vamos usar dados simples,
                    // pois o Realm não está envolvido aqui)
                    const newProperty: PropertyProvider = {
                        id: new Date().toISOString(), // Um ID simples
                        name: propertyName.trim(),
                        areas: validAreas.map((areaName, index) => ({
                            id: \`area-\${index}\`,
                            name: areaName.trim(),
                        })),
                    };

                    try {
                        // 4. Aqui despachamos a ação!
                        // Em vez de realm.write(), chamamos dispatch()
                        // e passamos o resultado da nossa action creator
                        // com o payload (newProperty).
                        dispatch(addProperty(newProperty));

                        Alert.alert('Sucesso', 'Propriedade salva no Redux!');
                        navigation.goBack(); // Volta para a tela de lista

                    } catch (error) {
                        console.error("Erro detalhado ao salvar:", error);
                        Alert.alert('Erro ao Salvar', (error as Error).message);
                    }
                };

                // Resto do arquivo sem alterações
                // com relação ao código anterior
            \`\`\`

            Quando \`dispatch(addProperty(newProperty))\` é chamado, o Redux executa o reducer \`addProperty\` que você definiu no \`propertiesSlice\`, e o \`state.items.push(newProperty)\` é executado. Assim, o estado na Store é atualizado.

            Agora, como a tela \`Property.tsx\` (a lista) sabe que uma nova propriedade foi adicionada?  Ela precisa "ler" o estado da Store. É para isso que serve o hook \`useSelector\`.

            O \`useSelector\` recebe uma função (chamada de "função seletora") que recebe o \`RootState\` (o estado global) como argumento e retorna a "fatia" específica de dados que o componente precisa. O código em \`Property.tsx\` ficaria assim:

            \`\`\`tsx
            import React from "react";
            import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
            import ItemList from "../components/ItemList";
            import { HomeStackParamList } from "../routes/HomeStack";
            import { StackScreenProps } from "@react-navigation/stack";
            import { faPlus } from "@fortawesome/free-solid-svg-icons"; // icone para novo componente
            import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

            // 1. Imports para uso do RTK
            import { useSelector, useDispatch } from 'react-redux';
            import { RootState, AppDispatch } from "../store/store";

            type Props = StackScreenProps<HomeStackParamList, 'Property'>;

            export default function Property({navigation}: Props){
                // 2. Lendo o estado com useSelector
                // Passamos uma função que recebe o estado global (RootState) e retorna APENAS a fatia que nos interessa.
                const properties = useSelector((state: RootState) => state.properties.items);
                const status = useSelector((state: RootState) => state.properties.status);

                // (Também pegamos o dispatch se quisermos disparar ações, como deletar ou buscar dados)
                // const dispatch = useDispatch<AppDispatch>();

                // A parte de navegação permanece igual
                const handleItemPress = (id: string) => {
                    navigation.navigate('HomogeneusArea', {propertyId: id})
                }

                const handleAddPress = () => {
                    navigation.navigate('AddProperty');
                }

                return (
                    <View style={styles.container}>
                        {/* Renderizamos com base no estado lido do Redux */}
                        {status === 'loading' && <Text>Carregando...</Text>}
                        {status === 'succeeded' && properties.length === 0 && (
                            <Text style={styles.placeholder}>
                                Ainda não há propriedades cadastradas
                            </Text>
                        )}
                        {status === 'succeeded' && properties.length > 0 && (
                            <ItemList
                                // 3. Passamos os dados do Redux para o ItemList
                                // O ItemList precisa aceitar ReadonlyArray<T> como fizemos para o Realm
                                itens={properties}
                                onItemPress={handleItemPress}
                            />
                        )}
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
                    width: '100%',
                    alignSelf: 'center',
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

            O \`useSelector\` automaticamente "assina" o seu componente àquela fatia do estado. Quando o \`dispatch(addProperty(...))\` é chamado na outra tela, a Store avisa ao \`useSelector\` na tela \`Property.tsx\` que o estado \`state.properties.items\` mudou. O \`useSelector\` então força a re-renderização do componente \`Property.tsx\` com a nova lista de propriedades.

            Ao dominar esses pilares, você agora compreende o fluxo de dados unidirecional completo do Redux Toolkit e como ele se integra ao React. Vimos como a store, criada com \`configureStore\`, age como fonte única para todo o estado da aplicação. Aprendemos como \`createSlice\` é a ferramenta que define as "fatias" desse estado, gerando automaticamente os reducers (as regras de atualização) e as actions (os eventos que disparam essas atualizações). Por fim, conectamos tudo aos nossos componentes: usamos o hook \`useDispatch\` para "despachar" ações e solicitar mudanças no estado, e o hook \`useSelector\` para "ler" dados da store e garantir que nossa interface reaja automaticamente a qualquer alteração. Este ciclo de selecionar o estado, despachar uma ação e ter a UI atualizada é o coração de um aplicativo gerenciado pelo Redux.
            `
        },
        {
            title: 'Lógica Assíncrona e Custom Hooks',
            slug: 'logica-assincrona-custom-hooks',
            duration: '40 min',
            type: LessonType.READ,
            order: 2,
            content: `Até agora, nossas ações (\`addProperty\`, \`setProperties\`) eram síncronas. O componente despachava, o reducer atualizava, fim. Mas como fazemos para buscar os dados da API primeiro? 

Aqui esbarramos numa regra fundamental: **Reducers nunca devem conter lógica assíncrona**. Um reducer deve ser uma "função pura": 100% previsível. Ele recebe um estado e uma ação, e imediatamente retorna o novo estado. Ele não pode fazer uma chamada de API, esperar uma resposta e depois retornar o estado. Isso quebraria todo o princípio de previsibilidade do Redux.

Então, onde colocamos nossa chamada fetch? A resposta é: em um Thunk.

Um "thunk" é apenas um nome complicado para uma função que faz um trabalho assíncrono e depois despacha as ações. O Redux Toolkit nos dá uma ferramenta fantástica chamada \`createAsyncThunk\` para automatizar isso.

Você chama \`createAsyncThunk\` e passa duas coisas: Um nome único para a ação (ex: 'properties/fetchProperties'); Uma função "criadora de payload" que faz a lógica assíncrona (a chamada fetch) e retorna os dados (a "payload").

O \`createAsyncThunk\` automaticamente cria e despacha três ações para você, com base no ciclo de vida da sua chamada.

* O **pending** (ex: 'properties/fetchProperties/pending'): Despachado quando a chamada começa. É aqui que você ativa seu "loading...".

* O **fulfilled** (ex: 'properties/fetchProperties/fulfilled'): Despachado se a chamada for bem-sucedida. O payload desta ação são os dados que você retornou (a lista de propriedades!).

* O **rejected** (ex: 'properties/fetchProperties/rejected'): Despachado se a chamada falhar. O payload desta ação é o erro.

Já que essas ações (pending, fulfilled, rejected) são criadas fora do nosso slice, não podemos colocá-las no objeto reducers. Em vez disso, nós as tratamos em um campo especial chamado \`extraReducers\`.

Para o exemplo prático dessa sessão, primeiramente crie uma pasta chamada \`services\` dentro da pasta src. Em seguida, dentro da pasta criada, crie o arquivo \`api.ts\`. Você não precisa compreender o código desse arquivo agora, pois, mais para frente abordaremos o assunto API neste caso de estudo. Por enquanto, saiba que este código simula o funcionamento de uma API real.

\`\`\`typescript
import { PropertyProvider } from '../types/property.types';
import mockedProperties from '../data/mockedProperty';

/**
 * Esta é a nossa API simulada.
 * * Ela retorna uma Promise que, após 3 segundos (simulando a demora da rede),
 * resolve e retorna um objeto com uma chave 'data', que contém
 * nossa lista de propriedades mocadas.
 */
export const fetchPropertiesAPI = (): Promise<{ data: PropertyProvider[] }> => {

    console.log("Chamando API simulada... (aguarde 3s)");

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("API simulada respondeu!");
            resolve({ data: mockedProperties });
        }, 3000); // 3000ms = 3 segundos de delay
    });
};
\`\`\`

Isto posto, vamos para o nosso exemplo prático. Já que as ações (pending, fulfilled, rejected) são criadas fora do nosso slice, não podemos colocá-las no objeto \`reducers\`. Em vez disso, nós as tratamos em um campo especial chamado \`extraReducers\`. Atualize seu arquivo \`properties.ts\` dentro da pasta slices para:

\`\`\`typescript
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropertyProvider } from "../../types/property.types";

// 1. importamos o serviço da nossa API simulada
import { fetchPropertiesAPI } from "../../services/api";

interface PropertiesState {
    items: PropertyProvider[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PropertiesState = {
    items: [],
    status: 'idle',
    error: null
};

// 2. Criamos o THUNK
// O primeiro argumento é o nome da nossa ação base.
// O segundo argumento é a função assíncrona que busca os dados.
export const fetchProperties = createAsyncThunk(
    'properties/fetchProperties',
    async () => {
        const response = await fetchPropertiesAPI(); // Chamda da API
        // O retorno dessa função assíncrona será o 'action.payload' da ação fulfilled
        return response.data as PropertyProvider[];
    }
)

// 3. Atualizamos o campo reducers no nosso slice
const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    // Reducers lidam apenas com ações síncronas (Ex.: adicionar uma propriedade manualmente)
    reducers:{
        // (Podemos remover setProperties, propertiesLoading, propertiesFailed
        // pois o thunk vai cuidar disso)
        addProperty: (state, action: PayloadAction<PropertyProvider>) => {
            state.items.push(action.payload); // Immer cuida da imutabilidade!
        }
    },
    // 'extraReducers' lida com ações externas, como as do nosso thunk
    extraReducers: (builder) => {
        builder
            // 4. O que fazer quando a busca COMEÇAR (pending)
            .addCase(fetchProperties.pending, (state) => {
                state.status = 'loading';
                state.error = null
            })
            // 5. O que fazer quando a busca TERMINAR (fulfilled)
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // O payload são os dados da API
            })
            // 6. O que fazer quando a busca FALHAR (rejected)
            .addCase(fetchProperties.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Falha ao buscar a propriedade.';
            });
    }
});

// 7. Agora exportamos apenas o addProperty
export const { addProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;
\`\`\`

Agora, em vez de despachar uma ação síncrona, despachamos o thunk que acabamos de criar. Em \`Property.tsx\` dentro da pasta screens, atualize seu código:

\`\`\`tsx
import React, { useEffect, ReactNode } from "react"; // importamos o useEffect e ReactNode
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import ItemList from "../components/ItemList";
import { HomeStackParamList } from "../routes/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from "../store/store";

// 1. Importe o THUNK
import { fetchProperties } from "../store/slices/properties";

type Props = StackScreenProps<HomeStackParamList, 'Property'>;

export default function Property({navigation}: Props){
    const properties = useSelector((state: RootState) => state.properties.items);
    const status = useSelector((state: RootState) => state.properties.status);
    const dispatch = useDispatch<AppDispatch>(); // precisamos do dispatch para buscar dados

    // 2. Usamos o useEffect para buscar os dados quando a tela carregar
    useEffect(() => {
        // só realizamos uma busca se ela ainda não tiver sido feita
        if(status === 'idle') {dispatch(fetchProperties());}

    }, [status, dispatch]);

    // A parte de navegação permanece igual
    const handleItemPress = (id: string) => {
        navigation.navigate('HomogeneusArea', {propertyId: id})
    }

    const handleAddPress = () => {
        navigation.navigate('AddProperty');
    }

    // 3. Lógica de renderização com base no status
    // (Aqui é basicamente o que fizemos anteriormente mas feita de forma mais legível)
    let content: ReactNode;
    if (status === 'loading') {
        content = <Text style={styles.placeholder}>Carregando propriedades...</Text>;
    } else if (status === 'succeeded') {
        content = properties.length === 0 ? (
            <Text style={styles.placeholder}>Ainda não há propriedades cadastradas</Text>
        ) : (
            <ItemList itens={properties} onItemPress={handleItemPress} />
        );
    } else if (status === 'failed') {
        content = <Text style={styles.placeholder}>Erro ao buscar dados.</Text>;
    }

    return (
        <View style={styles.container}>
            {content}
            <TouchableOpacity
                style={styles.button}
                onPress={handleAddPress}
                activeOpacity={0.7}>
                <FontAwesomeIcon icon={faPlus} size={22} color="white"/>
            </TouchableOpacity>
        </View>
    );
}

// styles permanece igual
\`\`\`

## Custom Hooks - Abstraindo o Redux 

Até agora, na nossa tela \`Property.tsx\`, nós importamos \`useSelector\`, \`useDispatch\`, \`RootState\` e as ações do slice diretamente. Embora funcione, isso acopla nossa tela aos detalhes internos do Redux. Se precisarmos mudar a estrutura do estado amanhã, teremos que editar todas as telas que acessam esses dados. Para resolver isso e deixar nosso código mais limpo, vamos criar um Custom Hook. Ele funcionará como uma "camada de serviço", escondendo a complexidade do Redux.

Vamos criar um hook que centraliza tudo relacionado a propriedades: ler a lista, ler o status e disparar as ações de busca e adição. Primeiro, crie em \`/src\` uma pasta chamada \`hooks\` e dentro dela crie um arquivo chamado \`useProperties.ts\`. Este arquivo deve ficar assim:

\`\`\`typescript
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { addProperty, fetchProperties } from "../store/slices/properties";
import { PropertyProvider } from "../types/property.types";

export const useProperties = () => {
    const dispatch = useDispatch<AppDispatch>();

    // 1. Centralizamos os seletores aqui
    const properties = useSelector((state: RootState) => state.properties.items);
    const status = useSelector((state: RootState) => state.properties.status);
    const error = useSelector((state: RootState) => state.properties.error);

    // 2. Criamos funções para disparar as ações (encapsulando o dispatch)
    // chamamos os thunks criados no slice de propriedades aqui

    // Função para buscar dados
    const loadProperties = useCallback(() => {
        dispatch(fetchProperties());
    }, [dispatch]);

    // Função para adicionar (Ação síncrona)
    const addNewProperty = useCallback((property: PropertyProvider) =>{
        dispatch(addProperty(property));
    }, [dispatch]);

    // 3. Retronamos apenas os dados e funções que a UI precisa
    return {
        properties,
        status,
        error,
        loadProperties,
        addNewProperty
    }

}
\`\`\`

Agora, veja como nossa tela ficará muito mais limpa. Ela não sabe mais que o Redux existe, ela apenas "usa propriedades".

\`\`\`tsx
import React, { useEffect, ReactNode } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import ItemList from "../components/ItemList";
import { HomeStackParamList } from "../routes/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// 1. Importe o hook customizado e apague todos os imports do redux/store
import { useProperties } from "../hooks/useProperties";


type Props = StackScreenProps<HomeStackParamList, 'Property'>;

export default function Property({navigation}: Props){
    // 2. Usamos o hook customizado
    const { properties, status, loadProperties } = useProperties();


    // 3. O useEffect fica mais semântico: "carregar propriedades"
    useEffect(() => {
        if(status === 'idle') {
            loadProperties();
        }
    }, [status, loadProperties]);

    // A parte de navegação permanece igual
    const handleItemPress = (id: string) => {
        navigation.navigate('HomogeneusArea', {propertyId: id})
    }

    const handleAddPress = () => {
        navigation.navigate('AddProperty');
    }

    // Mantemos a lógica de renderização
    let content: ReactNode;
    if (status === 'loading') {
        content = <Text style={styles.placeholder}>Carregando propriedades...</Text>;
    } else if (status === 'succeeded') {
        content = properties.length === 0 ? (
            <Text style={styles.placeholder}>Ainda não há propriedades cadastradas</Text>
        ) : (
            <ItemList itens={properties} onItemPress={handleItemPress} />
        );
    } else if (status === 'failed') {
        content = <Text style={styles.placeholder}>Erro ao buscar dados.</Text>;
    }

    return (
        <View style={styles.container}>
            {content}
            <TouchableOpacity
                style={styles.button}
                onPress={handleAddPress}
                activeOpacity={0.7}>
                <FontAwesomeIcon icon={faPlus} size={22} color="white"/>
            </TouchableOpacity>
        </View>
    );
}

// styles permanece igual
\`\`\`

Dessa forma seu código fica infinitamente mais limpo, flexível e melhor para futuras manutenções.
            `
        },
        {
            title: 'RTK Query - Modernizando a Camada de Dados',
            slug: 'rtk-query-modernizando-dados',
            duration: '30 min',
            type: LessonType.READ,
            order: 3,
            content: `Como discutimos, o uso de Thunks manuais é a abordagem clássica para lidar com a lógica assíncrona de uma aplicação. Para novos projetos (ou refatorações modernas), o RTK Query é a escolha padrão para buscar dados. Ele elimina a necessidade de escrever thunks, reducers de loading/error e gerenciamento de cache manual. Nesta sessão veremos como nosso exemplo de buscar propriedades ficaria usando essa tecnologia.

            Em vez de um Slice, criamos uma "API Slice". Definimos a URL base e os "endpoints" (as rotas que queremos acessar). Dentro da pasta \`/service\` crie um arquivo chamado \`propertiesApi.ts\`. Este arquivo deve ficar assim:

            \`\`\`typescript
            import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
            import { PropertyProvider } from "../types/property.types";

            // Definimos a API nesse caso usaremos uma falsa url
            export const propertiesApi = createApi({
                reducerPath: 'propertiesApi',
                baseQuery: fetchBaseQuery({baseUrl: 'https://api.plataformacacau.com.br/'}),
                endpoints: (builder) => ({
                    // Definimos o endpoint 'getProperties'
                    getProperties: builder.query<PropertyProvider[], void>({
                        query: () => 'properties', // O caminho da URL (ex: /properties)
                    }),
                }),
            });

            // O RTK Query gera o hook automaticamente!
            // O nome segue o padrão: use + NomeDoEndpoint + Query
            export const {useGetPropertiesQuery} = propertiesApi;
            \`\`\`

            Agora precisamos adicionar essa “API Slice” à nossa store. Em \`store.ts\` faça as alterações abaixo.

            \`\`\`typescript
            import { configureStore } from '@reduxjs/toolkit';
            import propertiesReducer from './slices/properties'

            // 1. Importe o propertiesApi
            import { propertiesApi } from '../services/propertiesApi';


            export const store = configureStore({
                reducer: {
                    // reducer antigo
                    properties: propertiesReducer,

                    // 2. Adicione o reducer gerado pela API
                    [propertiesApi.reducerPath]: propertiesApi.reducer
                },
                // 3. Adicione o middleware da API (necessário para o cache, polling, etc)
                middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(propertiesApi.middleware)
            });

            export type RootState = ReturnType<typeof store.getState>;
            export type AppDispatch = typeof store.dispatch;
            \`\`\`

            Agora nossa tela \`Property.tsx\` ficará ainda mais simples. Não precisaremos do \`useEffect\`, nem de \`dispatch\`, nem gerenciar o estado do loading manualmente. O hook criado automaticamente faz tudo isso por nós.

            \`\`\`tsx
            import React, { ReactNode } from "react";
            import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
            import ItemList from "../components/ItemList";
            import { HomeStackParamList } from "../routes/HomeStack";
            import { StackScreenProps } from "@react-navigation/stack";
            import { faPlus } from "@fortawesome/free-solid-svg-icons";
            import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

            // 1. Importe o hook gerado automaticamente e apague o hook customizado
            import { useGetPropertiesQuery } from "../services/propertiesApi";


            type Props = StackScreenProps<HomeStackParamList, 'Property'>;

            export default function Property({navigation}: Props){
                // 2. Usamos o hook e apagamos o useEffect
                const {data: properties = [], isLoading, isError} = useGetPropertiesQuery();

                // A parte de navegação permanece igual
                const handleItemPress = (id: string) => {
                    navigation.navigate('HomogeneusArea', {propertyId: id})
                }

                const handleAddPress = () => {
                    navigation.navigate('AddProperty');
                }

                // Mantemos a lógica de redenrização (observe as variáveis utilizadas dentro dos ifs)
                let content: ReactNode;
                if (isLoading) {
                    content = <Text style={styles.placeholder}>Carregando propriedades...</Text>;
                } else if (isError) {
                    content = <Text style={styles.placeholder}>Erro ao buscar dados.</Text>;
                } else {
                    content = properties.length === 0 ? (
                        <Text style={styles.placeholder}>Ainda não há propriedades cadastradas</Text>
                    ) : (
                        <ItemList itens={properties} onItemPress={handleItemPress} />
                    );
                }

                return (
                    <View style={styles.container}>
                        {content}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleAddPress}
                            activeOpacity={0.7}>
                            <FontAwesomeIcon icon={faPlus} size={22} color="white"/>
                        </TouchableOpacity>
                    </View>
                );
            }

            // styles permanece igual
            \`\`\`

            Você verá que se tentar rodar o exemplo anterior, você obterá um erro. Isso é esperado, afinal, ainda não construímos nenhuma API para este caso de estudo. Faremos então uma adaptação em \`propertiesApi.ts\` a fim de utilizar aquele código que simula uma API de verdade.

            O RTK Query é flexível o suficiente para não depender apenas de fetch ou axios. Existe uma funcionalidade poderosa chamada \`queryFn\` (Query Function) que nos permite "ignorar" a URL e executar qualquer código assíncrono que quisermos para obter os dados. Vamos reescrever o arquivo \`propertiesApi.ts\` para torná-lo 100% testável com o código que já temos.

            \`\`\`typescript
            import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
            import { PropertyProvider } from "../types/property.types";

            // 1. Importamos nossa função que simula uma API
            import { fetchPropertiesAPI } from "./api";

            export const propertiesApi = createApi({
                reducerPath: 'propertiesApi',
                // O 'baseQuery' é obrigatório, mas como usaremos 'queryFn'
                // podemos passar uma configuração "dummy" ou vazia aqui.
                baseQuery: fetchBaseQuery({baseUrl: '/'}),
                endpoints: (builder) => ({
                    // 2. Substituímos 'query' por 'queryFn'.
                    getProperties: builder.query<PropertyProvider[], void>({
                        async queryFn(_arg, _api, _extraOptions, _baseQuery) {
                            try {
                                // 3. Chamamos nossa simulação
                                const result = await fetchPropertiesAPI();
                                // O RTK Query espera que retornemos um objeto com a chave 'data'
                                // Como nossa simulação já retorna { data: [...] }, podemos retorná-la direto.
                                // Ou ser explícito: return { data: result.data };
                                return {data: result.data}
                            } catch (error) {
                                return { error: { status: 500, data: 'Erro na simulação' } };
                            }
                        },
                    }),
                }),
            });
            export const {useGetPropertiesQuery} = propertiesApi;
            \`\`\`

            Isso demonstra que o RTK Query não é apenas um "cliente HTTP", mas um gerenciador de estado assíncrono. Você poderia usar esse mesmo padrão \`queryFn\` para ler dados do Firebase, do Realm, do SQLite ou de qualquer outra fonte assíncrona.

            Com o RTK Query, reduzimos drasticamente a quantidade de código "boilerplate" e ganhamos cache automático e revalidação de dados "de graça". Dominar o RTK Query é uma habilidade muito útil para o desenvolvedor React Native moderno.
            `
        },
    ],
    quiz: {
        title: 'Quiz: Gerenciamento de Estado com Redux Toolkit',
        description: 'Avalie seus conhecimentos sobre Store, Slices, Actions, lógica assíncrona com Thunks e a modernização da camada de dados com RTK Query.',
        passingScore: 70,
        questions: [
            {
                text: 'No ecossistema Redux, qual é a regra fundamental sobre as funções Reducers em relação à lógica assíncrona (como chamadas de API)?',
                options: [
                    {
                        text: 'Reducers devem conter toda a lógica assíncrona para garantir que o estado seja sempre atualizado com os dados mais recentes.',
                        isCorrect: false
                    },
                    {
                        text: 'Reducers nunca devem conter lógica assíncrona; eles devem ser funções puras que recebem o estado atual e uma ação, retornando o novo estado de forma imediata e previsível.',
                        isCorrect: true
                    },
                    {
                        text: 'Reducers podem conter lógica assíncrona apenas se forem criados usando a função `createAsyncThunk`.',
                        isCorrect: false
                    },
                    {
                        text: 'Reducers só podem executar lógica assíncrona se estiverem declarados dentro do campo `extraReducers`.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual é a principal vantagem de utilizar a função `createSlice` do Redux Toolkit em comparação com a criação manual de reducers e actions do Redux clássico?',
                options: [
                    {
                        text: 'Ela permite que os reducers sejam funções assíncronas nativas e executem chamadas de API diretamente.',
                        isCorrect: false
                    },
                    {
                        text: 'Ela elimina a necessidade de uma Store global, permitindo que cada componente gerencie seu próprio estado isoladamente.',
                        isCorrect: false
                    },
                    {
                        text: 'Ela gera automaticamente os action creators e os tipos de ações, e utiliza a biblioteca Immer para permitir escrever código que parece "mutar" o estado de forma segura e imutável.',
                        isCorrect: true
                    },
                    {
                        text: 'Ela substitui completamente a necessidade de usar os hooks `useSelector` e `useDispatch` nos componentes React.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Ao utilizar o `createAsyncThunk` para lidar com requisições assíncronas, como o Redux Toolkit gerencia o ciclo de vida da requisição (início, sucesso e falha)?',
                options: [
                    {
                        text: 'O desenvolvedor precisa despachar manualmente as ações de `pending`, `fulfilled` e `rejected` dentro do componente React.',
                        isCorrect: false
                    },
                    {
                        text: 'O `createAsyncThunk` despacha automaticamente as ações `pending`, `fulfilled` e `rejected`, que devem ser tratadas no campo `extraReducers` do slice.',
                        isCorrect: true
                    },
                    {
                        text: 'O `createAsyncThunk` só despacha uma única ação ao final da requisição, ignorando estados intermediários de carregamento e erro.',
                        isCorrect: false
                    },
                    {
                        text: 'As ações do ciclo de vida são despachadas diretamente para o banco de dados local (Realm) antes de chegarem ao Redux.',
                        isCorrect: false
                    }
                ]
            },
            {
                text: 'Qual característica torna o RTK Query uma abordagem mais moderna e eficiente em comparação com o uso de thunks manuais para buscar dados de uma API?',
                options: [
                    {
                        text: 'Ele elimina a necessidade de escrever thunks manuais, reducers de loading/error e gerenciamento de cache manual, fornecendo hooks gerados automaticamente.',
                        isCorrect: true
                    },
                    {
                        text: 'Ele obriga o uso de um banco de dados relacional (SQL) como middleware entre a API e o Redux.',
                        isCorrect: false
                    },
                    {
                        text: 'Ele remove a necessidade de configurar uma Store central no Redux, atuando de forma totalmente independente do estado global.',
                        isCorrect: false
                    },
                    {
                        text: 'Ele permite apenas requisições síncronas, garantindo que a interface do usuário nunca entre em estado de carregamento.',
                        isCorrect: false
                    }
                ]
            }
        ]
    }
}