[**Coleta-Cacau Academy - Core Logic**](../../../README.md)

***

[Coleta-Cacau Academy - Core Logic](../../../README.md) / [utils/formateDate](../README.md) / getEntrySemester

# Function: getEntrySemester()

> **getEntrySemester**(`createdAt`): `string`

Calcula e formata o semestre de ingresso com base em uma string de data ISO.
Considera os meses de janeiro a junho (0-5) como o 1º semestre (ex: "2023.1") 
e os meses de julho a dezembro (6-11) como o 2º semestre (ex: "2023.2").

## Parameters

### createdAt

`string`

A string de data de criação/ingresso no formato ISO 8601.

## Returns

`string`

Uma string representando o ano e o semestre (ex: `YYYY.1` ou `YYYY.2`), ou string vazia se a data for inválida.

## Examples

```ts
// Retorna "2023.1"
getEntrySemester('2023-03-15T10:00:00Z');
```

```ts
// Retorna "2023.2"
getEntrySemester('2023-08-20T10:00:00Z');
```
