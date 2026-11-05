import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const ATTRIBUTE = 'data-theme';
const DEFAULT_THEME: Theme = 'dark';

/**
 * Assina as duas origens que podem mudar o tema:
 *
 * - MutationObserver no atributo `data-theme` do <html>, que cobre qualquer
 *   instância do hook chamando toggleTheme;
 * - evento `storage`, que o navegador dispara em OUTRAS abas quando o
 *   localStorage muda, mantendo as abas em sincronia.
 */
function subscribe(onStoreChange: () => void): () => void {
    const observer = new MutationObserver(onStoreChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [ATTRIBUTE],
    });

    const onStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY || !event.newValue) return;
        // Replica em outra aba: escrever o atributo dispara o observer acima.
        document.documentElement.setAttribute(ATTRIBUTE, event.newValue);
    };
    window.addEventListener('storage', onStorage);

    return () => {
        observer.disconnect();
        window.removeEventListener('storage', onStorage);
    };
}

/** Lê o tema do DOM — a fonte da verdade, definida pelo script anti-flash. */
function getSnapshot(): Theme {
    return document.documentElement.getAttribute(ATTRIBUTE) === 'light'
        ? 'light'
        : DEFAULT_THEME;
}

/**
 * No servidor não há DOM. Devolve o mesmo padrão que o script anti-flash
 * usa como fallback, para que a marcação renderizada no servidor e a
 * primeira renderização no cliente não divirjam.
 */
function getServerSnapshot(): Theme {
    return DEFAULT_THEME;
}

/**
 * Hook para ler e alternar o tema (dark/light) da aplicação.
 *
 * O tema NÃO é estado do React: ele vive no atributo `data-theme` do
 * elemento <html> e é persistido no localStorage. A versão anterior mantinha
 * uma cópia em useState por instância do hook — como toggleTheme escreve em
 * destinos globais mas só atualizava o estado da instância chamada, duas
 * instâncias simultâneas exibiriam temas diferentes.
 *
 * useSyncExternalStore faz toda instância ler a mesma fonte e ser notificada
 * junto, eliminando a cópia e, com ela, a possibilidade de dessincronia.
 *
 * @returns O tema atual e a função para alterná-lo.
 *
 * @example
 * const { theme, toggleTheme } = useTheme();
 * <button onClick={toggleTheme}>Trocar tema</button>
 */
export function useTheme() {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const toggleTheme = useCallback(() => {
        // Lê do DOM em vez de depender do valor capturado no closure: evita
        // inverter para um tema desatualizado se algo mais tiver mudado.
        const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute(ATTRIBUTE, next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Modo privado ou armazenamento cheio: o tema ainda muda na
            // sessão atual, apenas não persiste.
        }
    }, []);

    return { theme, toggleTheme };
}
