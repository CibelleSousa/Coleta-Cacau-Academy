[**Coleta-Cacau Academy - Core Logic**](../../../README.md)

***

[Coleta-Cacau Academy - Core Logic](../../../README.md) / [hooks/useTheme](../README.md) / useTheme

# Function: useTheme()

> **useTheme**(): `object`

Hook personalizado para gerenciar o tema (Dark/Light) da aplicação.
Lê o tema atual da tag `<html>` ao montar e permite alternar entre temas,
persistindo a escolha no `localStorage` do navegador.

## Returns

`object`

Um objeto contendo o tema atual (`theme`) e a função para alterná-lo (`toggleTheme`).

### theme

> **theme**: `string`

### toggleTheme

> **toggleTheme**: () => `void`

#### Returns

`void`

## Example

```ts
const { theme, toggleTheme } = useTheme();
<button onClick={toggleTheme}>Trocar tema</button>
```
