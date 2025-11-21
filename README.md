# 📘 Sistema de Notas — Visualizador de Boletins

Um visualizador moderno de notas escolares, com busca por aluno, filtro por status e painel de estatísticas.
Interface leve, responsiva e totalmente desenvolvida em **HTML, CSS e JavaScript**, utilizando dados em **JSON**.

---

## 🚀 Funcionalidades

* 🔍 **Busca por nome**
* 🎯 **Filtro por status** (Aprovado, Recuperação, Reprovado)
* 📊 **Cálculo automático da média geral**
* 🧮 **Exibição das notas por matéria**
* 🧱 **Modal detalhado** com todas as notas
* 👤 **Avatares automáticos** para alunos
* 📱 **Interface adaptada para celular e computador**
* 🎨 **UI moderna e escura (dark mode)**

---

## 🧑‍🏫 Como funciona?

O sistema usa um arquivo JSON contendo:

* Nome do aluno
* avatar
* notas de cada disciplina

O JavaScript processa esses dados, calcula médias e define o status do aluno:

* 🟢 **Aprovado** — média ≥ 7
* 🟡 **Recuperação** — média ≥ 5
* 🔴 **Reprovado** — média < 5

---

## 🗂️ Estrutura do projeto

```
/projeto
│── index.html
│── style.css
│── script.js
└── alunos.json
```

---

## 🖼️ Pré-visualização

<img width="1440" height="765" alt="image" src="https://github.com/user-attachments/assets/8213fbac-ca99-483b-8f15-349d9d29e177" />


```
📌 Card do aluno
📌 Modal com todas as notas
📌 Painel com estatísticas gerais
```

---

## 🛠️ Tecnologias usadas

* **HTML5**
* **CSS3**
* **JavaScript
* **JSON**
* **DiceBear Avatars** (Para a foto dos alunos)

---

## 📄 Licença

Este projeto foi feito Durante a imersão Dev da Alura
