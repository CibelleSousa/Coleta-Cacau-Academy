/**
 * Calcula e formata o semestre de ingresso com base em uma string de data ISO.
 * Considera os meses de janeiro a junho (0-5) como o 1º semestre (ex: "2023.1") 
 * e os meses de julho a dezembro (6-11) como o 2º semestre (ex: "2023.2").
 *
 * @param {string} createdAt - A string de data de criação/ingresso no formato ISO 8601.
 * @returns {string} Uma string representando o ano e o semestre (ex: `YYYY.1` ou `YYYY.2`), ou string vazia se a data for inválida.
 * 
 * @example
 * // Retorna "2023.1"
 * getEntrySemester('2023-03-15T10:00:00Z');
 * 
 * @example
 * // Retorna "2023.2"
 * getEntrySemester('2023-08-20T10:00:00Z');
 */
export function getEntrySemester(createdAt: string): string {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (month >= 0 && month <= 5) {
        return `${year}.1`;
    } 
    return `${year}.2`;
}