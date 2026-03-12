# 🌊 Smart Drain Web | UPX Smart Cities - Facens

O **Smart Drain** é uma solução de monitoramento inteligente para galerias pluviais urbanas, desenvolvida como projeto de UPX (Usinagem de Projetos Experimentais) para o curso de **Engenharia da Computação** da **Facens Sorocaba (1º Semestre)**.

O objetivo central é a prevenção de desastres naturais e enchentes através da detecção precoce do nível da água em bueiros e galerias, utilizando tecnologias de IoT e análise de dados em tempo real.

---

## 🚀 O Projeto
Este repositório contém o **Dashboard de Apresentação e Visualização de Dados** do sistema. O site foi projetado para servir como interface pública para a população e técnicos da cidade, exibindo alertas críticos e níveis atuais de inundação.

### Funcionalidades do Dashboard:
- **Visualização em Tempo Real:** Interface técnica que simula (e futuramente receberá) dados de sensores ultrassônicos.
- **Alertas Dinâmicos:** Sistema de status (Normal, Alerta, Crítico) baseado na profundidade da galeria.
- **Design Industrial:** Estética focada em engenharia, com grid de projeto e tipografia técnica.
- **Responsividade Total:** Adaptado para visualização em telões públicos, desktops e dispositivos móveis.

---

## 🛠️ Stack Tecnológica
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Deploy Sugerido:** [Vercel](https://vercel.com/)

---

## 🏗️ Arquitetura do Sistema (Hardware + Web)
O ecossistema completo do Smart Drain envolve:
1. **Hardware:** Microcontrolador **ESP32** instalado nas galerias.
2. **Sensor:** Sensor Ultrassônico **JSN-SR04T** (IP67 - À prova d'água).
3. **Conectividade:** Transmissão de dados via Wi-Fi/LoRa para a nuvem.
4. **Interface:** Este site (Next.js) que consome e exibe os dados processados.

---

## 👥 Equipe (Facens - Eng. Computação)
- Mateus Sonnenberg Amaral
- Victor Hugo Nastri Proença
- Samuel Barbosa de Souza
- Daniel Morone Barbosa
- Kaike Magalhães de Souza

---

## ⚙️ Desenvolvimento Local

Para rodar o projeto localmente:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---
*Este projeto faz parte da grade curricular da Facens - Sorocaba/SP.*
