import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar o tema (Dark/Light) da aplicação.
 * Lê o tema atual da tag `<html>` ao montar e permite alternar entre temas,
 * persistindo a escolha no `localStorage` do navegador.
 *
 * @returns Um objeto contendo o tema atual (`theme`) e a função para alterná-lo (`toggleTheme`).
 * 
 * @example
 * const { theme, toggleTheme } = useTheme();
 * <button onClick={toggleTheme}>Trocar tema</button>
 */
export function useTheme() {
    const [theme, setTheme] = useState<string>('dark');

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(currentTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return { theme, toggleTheme };
}