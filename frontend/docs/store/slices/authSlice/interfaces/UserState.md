[**Coleta-Cacau Academy - Core Logic**](../../../../README.md)

***

[Coleta-Cacau Academy - Core Logic](../../../../README.md) / [store/slices/authSlice](../README.md) / UserState

# Interface: UserState

Interface que define a estrutura do estado do usuário autenticado na Store.

## Properties

### avatarUrl

> **avatarUrl**: `string` \| `null`

URL do avatar/foto de perfil do usuário.

***

### createdAt

> **createdAt**: `string` \| `null`

Data de criação da conta do usuário no formato ISO.

***

### email

> **email**: `string` \| `null`

Endereço de e-mail do usuário.

***

### id

> **id**: `string` \| `null`

Identificador único do usuário (UUID) ou null se não estiver logado.

***

### name

> **name**: `string` \| `null`

Nome completo do usuário.

***

### role

> **role**: `string` \| `null`

Papel do usuário no sistema (ex: 'student', 'admin').

***

### streakCount

> **streakCount**: `number` \| `null`

Contagem de dias consecutivos de acesso (streak).
