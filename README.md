# 🌊 Smart Drain Web | UPX Smart Cities - Facens

O **Smart Drain** é uma solução de monitoramento inteligente para galerias pluviais urbanas, desenvolvida como projeto de UPX (Usinagem de Projetos Experimentais) para o curso de **Engenharia da Computação** da **Facens Sorocaba (1º Semestre)**.

O objetivo central é a prevenção de desastres naturais e enchentes através da detecção precoce do nível da água em bueiros e galerias, utilizando tecnologias de IoT e análise de dados em tempo real.

---

## 🚀 O Projeto
Este repositório contém o **Dashboard de Apresentação e Visualização de Dados** do sistema. O site serve como interface pública para a população e técnicos de Sorocaba/SP, exibindo alertas críticos e níveis reais baseados no histórico de inundações da cidade.

### Funcionalidades do Dashboard:
- **Dados Reais de Sorocaba:** Contextualização baseada em eventos históricos, como o recorde de **148mm de chuva em 2h** (Jan/2024) e o transbordamento da **Avenida Dom Aguirre**.
- **Visualização em Tempo Real:** Interface técnica que simula (e futuramente receberá via MQTT/API) dados de sensores ultrassônicos.
- **Alertas Dinâmicos:** Sistema de status (Normal, Alerta, Crítico) baseado na profundidade da galeria (ex: Praça Lions).
- **Design Industrial:** Estética focada em engenharia, com grid de projeto e tipografia técnica (moderna e responsiva).

---

## 🛠️ Stack Tecnológica
- **Framework:** [Vinext](https://github.com/AquaSquirel/vinext) (Vite + React Server Components)
- **Engine:** [Vite 6](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)

---

## 🏗️ Arquitetura do Sistema (Hardware + Web)
O ecossistema completo do Smart Drain envolve:
1. **Hardware:** Microcontrolador **ESP32-WROOM-32** instalado nas galerias.
2. **Sensor:** Sensor Ultrassônico **JSN-SR04T** (IP67 - Transdutor à prova d'água).
3. **Nuvem:** Processamento via **Vercel Edge Functions**.
4. **Interface:** Este site (Vinext) que consome e exibe os dados processados em < 50ms.

---

## 👥 Equipe (Facens - Eng. Computação)
- Mateus Sonnenberg Amaral (Engenharia & Dev)
- Victor Hugo Nastri Proença (Hardware & IoT)
- Samuel Barbosa de Souza (Sistemas Embarcados)
- Daniel Morone Barbosa (Backend & Cloud)
- Kaike Magalhães de Souza (Frontend & UX)

---

## ⚙️ Desenvolvimento Local

Para rodar o projeto localmente:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Vite)
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001) no seu navegador.

---
*Este projeto faz parte da grade curricular da Facens - Sorocaba/SP. Dados históricos extraídos de fontes como Jornal Cruzeiro do Sul e G1 Sorocaba.*
