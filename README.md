# ⛺ ProjectParoquia (Sistema de Gestão de Acampamentos)

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-warning?style=for-the-badge&logo=git)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

> **Projeto de Estágio:** Sistema centralizado para gestão administrativa, financeira e logística dos acampamentos e retiros da Paróquia São Miguel Arcanjo.

---

## 📖 Sobre o Projeto

O **ProjectParoquia** nasceu da necessidade de modernizar e centralizar a organização dos acampamentos paroquiais. O sistema substitui planilhas manuais e fichas de papel por uma plataforma integrada, garantindo rastreabilidade de patrimônio, transparência financeira e organização ágil das equipes de trabalho (quadrantes) e campistas.

A arquitetura de banco de dados foi rigorosamente normalizada para suportar fluxos complexos, como formulários dinâmicos (fichas médicas) e histórico de movimentação de estoque.

---

## ✨ Principais Funcionalidades

O sistema é dividido em grandes módulos operacionais:

| Módulo | Funcionalidades |
| :--- | :--- |
| 🧑‍🤝‍🧑 **RH & Inscrições** | Cadastro de Servos, Campistas e Pastorais. Controle de lotação, lista de espera e geração automática do Quadrante (alocação de equipes). |
| 📦 **Logística** | CRUD de Patrimônio. Registro de movimentação de estoque (Check-in/Check-out) vinculada a cada acampamento com controle de avarias. |
| 💰 **Financeiro** | Fluxo de caixa independente por evento. Registro de pagamentos de inscrições, entradas de doações, saídas/gastos e balanço final. |
| 📝 **Formulários** | Motor de formulários dinâmicos para criação de Fichas Médicas e questionários personalizados, sem necessidade de alteração no código fonte. |
| 📸 **Mural Digital** | Galeria de fotos organizada por evento, preservando o histórico da comunidade. |

---

## 🛠️ Tecnologias Utilizadas

*(Substitua ou adicione as tecnologias exatas que você vai usar no desenvolvimento)*

* **Backend:** Java, Spring Boot
* **Frontend:** JavaScript / TypeScript, Next.js 
* **Banco de Dados:** PostgreSQL
* **Modelagem:** UML (Diagramas de Classe) e MER (MySQL Workbench)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Git](https://git-scm.com/)
* [PostgreSQL](https://www.postgresql.org/)
* Ambiente de execução (ex: JDK 17+, Node.js)
