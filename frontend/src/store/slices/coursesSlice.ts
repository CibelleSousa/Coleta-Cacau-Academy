import { createSlice } from '@reduxjs/toolkit';

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
  /** Tipo de conteúdo da lição. */
  type: 'read' | 'video';
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
  type: 'THEORY' | 'PRACTICAL';
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