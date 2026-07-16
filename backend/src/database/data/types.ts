import { ModuleType } from '../entities/course-module.entity';
import { LessonType } from '../entities/lesson.entity';

export interface SeedOption {
    text: string;
    isCorrect: boolean;
}

export interface SeedQuestion {
    text: string;
    options: SeedOption[];
}

export interface SeedQuiz {
    title: string;
    description: string;
    passingScore: number;
    questions: SeedQuestion[];
}

export interface SeedLesson {
    title: string;
    slug: string;
    duration: string;
    type: LessonType;
    order: number;
    content?: string; // For READ lessons (Paste DOCX text here)
    videoUrl?: string; // For VIDEO lessons (Paste YouTube embed URL here)
    description?: string // For VIDEO description lessons
}

export interface SeedModule {
    title: string;
    description: string;
    order: number;
    duration: number;
    type: ModuleType;
    lessons: SeedLesson[];
    quiz?: SeedQuiz;
}
