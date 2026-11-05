import { createSlice } from '@reduxjs/toolkit';

/**
 * Tipo de conteúdo de uma lição, espelhando o enum `LessonType` do backend
 * (backend/src/database/entities/lesson.entity.ts).
 *
 * Mantenha os valores idênticos aos do backend: o RTK Query não valida a
 * resposta em tempo de execução, então um tipo divergente aqui compila
 * normalmente e só falha quando o usuário clica.
 */
export type LessonType = 'READ' | 'VIDEO';

/** Tipo de um módulo: trilha teórica ou projeto prático. */
export type ModuleType = 'THEORY' | 'PRACTICAL';

/**
 * Interface representando uma Lição (Aula) dentro de um módulo do curso.
 */
export interface Lesson {
  /** Identificador único da lição. */
  id: string;
  /** Título exibido da lição. */
  title: string;
  /** Slug para construção de URLs amigáveis. */
  slug: string;
  /** Duração estimada da lição (ex: "10 min"). */
  duration: string;
  /**
   * Tipo de conteúdo da lição.
   *
   * Em MAIÚSCULAS porque é exatamente o que a API devolve — o enum
   * `LessonType` do backend (`READ` | `VIDEO`). Já esteve declarado em
   * minúsculas aqui, o que fazia `type === 'video'` ser sempre falso e
   * levava toda videoaula para a página de texto, em branco.
   */
  type: LessonType;
  /** Ordem de exibição dentro do módulo. */
  order: number;
  /** Indica se a lição foi concluída pelo usuário atual. */
  done: boolean;
}

/**
 * Interface representando um Módulo (Trilha) de curso contendo múltiplas lições.
 */
export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  type: ModuleType;
  lessons: Lesson[];
}

// Minimal slice retained for potential future synchronous state needs
const initialState = {};

/**
 * Slice do Redux Toolkit destinado ao armazenamento síncrono de dados de cursos.
 * Atualmente vazio, mas mantido para futuras necessidades de controle de estado local síncrono.
 */
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
});

export default coursesSlice.reducer;