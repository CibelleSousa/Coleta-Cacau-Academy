import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';
import { SeedModule } from './types';

export const module8: SeedModule = {
  title: 'Projeto Cacau-Beta',
  description: 'Configuração do ambiente RN, projeto prático e exibição de dados.',
  order: 7,
  duration: 252,
  type: ModuleType.PRACTICAL,
  lessons: [
    {
      title: '1. Criando seu primeiro projeto React-Native',
      slug: 'primeiro-projeto-rn',
      duration: '13:31',
      type: LessonType.VIDEO,
      order: 1,
      videoUrl: 'https://youtu.be/xO7sm09bGTg?si=ZM3J4F_jSMtECbpB',
      description:`Neste vídeo, conhecemos o resultado final do projeto proposto por esta série e aprendemos como criar um projeto React-Native do zero.\n\nRequisitos de Ambiente :\nVSCode\nNodeJS\nJDK 17\nAndroid Studio\n\nLink para download das pastas: https://drive.google.com/drive/folders/1KF7aa3T4-aAnu0yd05Yy4OH7oWw3kYGk?usp=sharing`
    },
    {
      title: '2. Criando seu primeiro componente',
      slug: 'primeiro-componente',
      duration: '10:48',
      type: LessonType.VIDEO,
      order: 2,
      videoUrl: 'https://youtu.be/ax5VhbKF0Rg?si=DIwDAkEt0F1NsBwQ',
      description: `Neste vídeo damos continuação a construção de um componente React Native, agora focando na estilização deste.`
    },
    {
      title: '3. Estilizando seu primeiro componente',
      slug: 'estilizar-componente',
      duration: '10:49',
      type: LessonType.VIDEO,
      order: 3,
      videoUrl: 'https://youtu.be/sjm2Jk2DoCE?si=Zu9k0PjKBKqPIuq6',
      description: `Neste vídeo damos continuação a construção de um componente React Native, agora focando na estilização deste.`
    },
    {
      title: '4. Criando um item de lista',
      slug: 'item-de-lista',
      duration: '11:23',
      type: LessonType.VIDEO,
      order: 4,
      videoUrl: 'https://youtu.be/O0LFV_ymabk?si=yw6uoDqlWN_zJ8ZC',
      description: `Neste vídeo, aprendemos como construir um componente para uma item de uma lista.`
    },
    {
      title: '5. Estilizando um item de lista',
      slug: 'estilizar-item-de-lista',
      duration: '11:13',
      type: LessonType.VIDEO,
      order: 5,
      videoUrl: 'https://youtu.be/FJU9KSTntTY?si=r4AuNohiG9X7uvPM',
      description: `Neste vídeo, estilizamos um componente que representa o item de uma lista.`
    },
    {
      title: '6. Trabalhando com arquivos SVG',
      slug: 'arquivos-svg',
      duration: '14:24',
      type: LessonType.VIDEO,
      order: 6,
      videoUrl: 'https://youtu.be/uUMx9e6J3bs?si=n7ZiAh34IcUazJIj',
      description: `Neste vídeo abordamos como lidar com arquivos SVG num projeto React Native e aprendemos como utilizar seus assets como um componente.`
    },
    {
      title: '7. Intalando bibliotecas para arquivos SVG',
      slug: 'bibliotecas-svg',
      duration: '04:41',
      type: LessonType.VIDEO,
      order: 7,
      videoUrl: 'https://youtu.be/KMkNeGLVBEk?si=v_fWC5Yk5nS7Gb3J',
      description: `Neste vídeo finalizamos com os componentes ItemList e Icon. Além disso, instalamos as bibliotecas que nos permite lidar com arquivos SVG em um projeto React Native.`
    },
    {
      title: '8. Criando um Input Numérico',
      slug: 'input-numerico',
      duration: '13:25',
      type: LessonType.VIDEO,
      order: 8,
      videoUrl: 'https://youtu.be/Ikse7ZxF6Vg?si=cdl1R_LJqasJAERr',
      description: `Nesta aula finalizamos a criação dos componentes do nosso projeto React Native.`
    },
    {
      title: '9. Conhecendo uma FlatList',
      slug: 'flat-list',
      duration: '13:45',
      type: LessonType.VIDEO,
      order: 9,
      videoUrl: 'https://youtu.be/Ikse7ZxF6Vg?si=Z6KcWJkvcxCF_mzI',
      description: `Nesse vídeo aprendemos o que é uma FlatList e como criar uma função _keyExtrector para evitar duplicações em uma lista de itens.`
    },
    {
      title: '10. Tratando nossos dados mocados',
      slug: 'dados-mocados-processamento',
      duration: '10:03',
      type: LessonType.VIDEO,
      order: 10,
      videoUrl: 'https://youtu.be/lVXz-spHuPU?si=cERMtFHmn-xaCsHV',
      description: `Neste vídeo aprendemos como podemos tratar nossos dados mocados para fins de desenvolvimento de nossas interfaces.`
    },
    {
      title: '11. Aprenda a utilizar um Hooks',
      slug: 'hooks',
      duration: '17:53',
      type: LessonType.VIDEO,
      order: 11,
      videoUrl: 'https://youtu.be/Z1azWcZKtWM?si=nRSuj_vMsXujoD_m',
      description: `Neste vídeo aprendemos o que é um Hooks, como e porquê o utilizamos em nossos projetos React Native.`
    },
    {
      title: '12. Criando nossa tela de coleta de dados',
      slug: 'criar-tela-coleta-dados',
      duration: '09:10',
      type: LessonType.VIDEO,
      order: 12,
      videoUrl: 'https://youtu.be/JDQPMdgFay8?si=_HTC44wqnYeB3sL1',
      description: `Neste vídeo criamos nosso primeiro formulário de coleta de dados com React Native.`
    },
    {
      title: '13. Finalizando a tela de coleta de dados',
      slug: 'finalizar-tela-coleta-dados',
      duration: '16:46',
      type: LessonType.VIDEO,
      order: 13,
      videoUrl: 'https://youtu.be/T_MMGmRSYLo?si=ecKywj_S2XtSUKks',
      description: `Neste vídeo estaremos finalizando nossa tela de Coleta de Dados e utilizaremos um ScrollView pela primeira vez.`
    },
    {
      title: '14. Instalando a biblioteca React Navigation',
      slug: 'biblioteca-react-navigation',
      duration: '07:48',
      type: LessonType.VIDEO,
      order: 14,
      videoUrl: 'https://youtu.be/cs4tbR9B_fE?si=r5D9skMc7KiSmuWT',
      description: `Neste vídeo instalamos todas as dependências de projeto para que possamos construir a navegação de nosso aplicativo por meio da biblioteca React Navigation. Além disso, estabelecemos o contrato de dados da nossa navegação.\n\nCOMANDO:\nnpm install @react-navigation/native @react-navigation/native-stack @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler`
    },
    {
      title: '15. Construindo as rotas da navegação',
      slug: 'rotas-navegacao',
      duration: '10:47',
      type: LessonType.VIDEO,
      order: 15,
      videoUrl: 'https://youtu.be/z-8o95M4Q4o?si=46yIVY42fhclq6_2',
      description: `Neste vídeo aprendemos a criar uma Pilha de Navegação com a biblioteca React Navigation.`
    },
    {
      title: '16. Finalizando a navegação do aplicativo',
      slug: 'finalizar-navegacao',
      duration: '16:26',
      type: LessonType.VIDEO,
      order: 16,
      videoUrl: 'https://youtu.be/Qgd1BysxIYQ?si=8uUBkSOgpq5BZoAi',
      description: `Neste vídeo finalizamos e testamos a navegação do aplicativo.`
    },
    {
      title: '17. Criando o serviço de armazenamento',
      slug: 'servico-armazenar',
      duration: '16:49',
      type: LessonType.VIDEO,
      order: 17,
      videoUrl: 'https://youtu.be/YEHi4L37_FQ?si=Cw9LtSMfNAn1Ly0l',
      description: `Neste vídeo aprendemos como criar um serviço de armazenamento simples para uma aplicação móvel.`
    },
    {
      title: '18. Criando o serviço de exportação',
      slug: 'servico-expotar',
      duration: '15:22',
      type: LessonType.VIDEO,
      order: 18,
      videoUrl: 'https://youtu.be/dlE-SClUh_A?si=WuW9LZC18VWoQwDj',
      description: `Neste vídeo criamos para nossa aplicação móvel o serviço que cria um arquivo excel e o exporta.`
    },
    {
      title: '19. Finalizando seu primeiro aplicativo',
      slug: 'finalizar-aplicativo-rn',
      duration: '26:49',
      type: LessonType.VIDEO,
      order: 19,
      videoUrl: 'https://youtu.be/MAKE5fO5Rd4?si=ZjnlO7VH_R4Ow78N',
      description: `Neste vídeo importamos nas telas os serviços de armazenamento e exportação de arquivos do aplicativo e testamos o projeto.`
    },
  ],
};
