# Liberdade Total em Todas as Páginas (Gerenciamento de Balões, Cards e Ícones)

Este plano expande o sistema de personalização para conceder controle irrestrito ao usuário em **todas as 6 lâminas** da proposta comercial. O usuário poderá excluir, ocultar, readicionar ou criar novos balões/cards customizados em qualquer página, além de remover ou alterar qualquer ícone diretamente na tela ou pela barra lateral.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas com o usuário na Etapa 1:**
> - **Controle de balões**: Botões de ação direta em cada balão/card (hover/visível com excluir e menu de opções) combinados com uma central de controle completa na aba lateral "Balões & Blocos" para ligar/desligar e restaurar qualquer elemento.
> - **Gestão de ícones**: Liberdade em todos os cards de pilares, métricas, infraestrutura e diferenciais para **ocultar o ícone** ou **trocar por outro ícone do catálogo** com um clique, sem deixar espaços vazios desagradáveis.

---

### 1. Overview & Core Concept

- **O que faz**:
  - Transforma todas as 6 lâminas (Capa, Conceito/Manifesto, Audiência/Métricas, Experiência/Estrutura, Cotas/Pacotes e Fechamento/Contatos) em um layout modular vivo.
  - Cada balão, card ou bloco informativo ganha controles de exclusão (`Trash2`), visibilidade (`Eye / EyeOff`), e suporte a novos balões customizados (`CustomSlideBlock`) adicionados pelo usuário.
  - Qualquer card com ícone (pilares da Lâmina 2, métricas da Lâmina 3, destaques de infraestrutura da Lâmina 4, entregáveis da Lâmina 5 e contatos da Lâmina 6) ganha controle de ícones: botão para desativar/ocultar o ícone ou escolher outro ícone relevante da biblioteca.
  - Barra lateral com seletor de lâmina ativo e painéis específicos para cada página, permitindo restaurar balões excluídos com 1 clique.
  - Exportação HTML autônoma (`generateSingleFileHtml`) sincronizada para respeitar todas as exclusões, customizações e preferências de ícones em todas as páginas.

- **Público-alvo**:
  - Produtores de eventos, agências e curadores comerciais que precisam de propostas enxutas ou completas, adaptadas sob medida para diferentes patrocinadores sem ficarem presos a blocos engessados.

---

### 2. User Experience & Visual Design

#### A. Experiência de Interação Direta nas Lâminas
1. **Controles Diretos no Balão (Inline Toolbar)**:
   - Ao passar o mouse sobre qualquer card/balão de qualquer lâmina, surge sutilmente no canto superior direito uma barra de ferramentas rápida:
     - Botão **Excluir Balão** (ícone de lixeira, remove da tela com animação suave).
     - Botão **Ícone** (nos cards que possuem ícones: alternar "Sem Ícone" ou abrir seletor rápido com ícones como Sparkles, Award, Shield, Check, Flame, Zap, Target, Users, etc.).
   - Quando um ou mais balões padrão de uma lâmina forem excluídos, surge na base ou topo da lâmina um botão discreto `"Readicionar Balões Excluídos"` e `"+ Adicionar Balão Personalizado"`.

2. **Distribuição Adaptativa de Espaço**:
   - Quando um card é excluído (ex: um dos pilares na Lâmina 2, ou canais de mídia na Lâmina 3, ou um indicador na Lâmina 4), os cards vizinhos adaptam automaticamente a grade (`grid-cols-1`, `grid-cols-2`, `grid-cols-3` dinâmicos) para manter o equilíbrio visual sem lacunas estranhas.

#### B. Painel Centralizado na Barra Lateral ("Balões & Blocos")
- Subdivisão clara por Lâmina:
  - **Lâmina 1 (Capa)**: Ocultar/exibir tag de categoria, data, local, subtítulo, estatística rápida da capa.
  - **Lâmina 2 (Conceito & Pilares)**: Interruptores para Balão de História, Balão de Manifesto/Citação, Pilares (com controle individual de cada pilar e interruptor de ícone), além de Balões Personalizados.
  - **Lâmina 3 (Audiência & Métricas)**: Controle dos 4 cards numéricos, Perfil Demográfico, Canais de Mídia e Balões Personalizados.
  - **Lâmina 4 (Experiência & Estrutura)**: Controle da galeria de atrações, cards de infraestrutura técnica (com interruptor de ícones) e Balões Personalizados.
  - **Lâmina 5 (Cotas de Patrocínio)**: Controle de cada cota (Master, Ouro, Prata), lista de entregáveis com ícones customizáveis e Balões Personalizados.
  - **Lâmina 6 (Fechamento & Contatos)**: Controle do card de contato direto, balão de prazos e próximos passos, e Balões Personalizados.

#### C. Estética Visual e Anti-Slop Discipline
- Tipografia premium baseada no tema ativo (Editorial Luxury, Cyber Neon, Festival Sunset, Tech Clean, etc.).
- Borda hairline discreta (`border border-neutral-800`), sem pílulas decorativas estáticas.
- Toolbars funcionais e minimalistas com contraste WCAG AA e feedback imediato (< 150ms).

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Controle Bidirecional (Tela + Barra Lateral)**
  - *Abordagem escolhida*: Botões contextuais de exclusão e edição de ícones direto sobre o balão na lâmina E interruptores detalhados na barra lateral.
  - *Por que*: Dá agilidade máxima para quem gosta de clicar diretamente no que deseja apagar, e visão panorâmica para quem quer restaurar ou gerenciar tudo centralizado.
  - *Alternativa descartada*: Deixar apenas na barra lateral (frustrante para o usuário) ou apenas no slide (dificulta restaurar itens apagados).

- **Decisão 2: Modelo de Dados Unificado para Blocos Customizados e Ícones**
  - *Abordagem escolhida*: Adicionar listas de `customBlocks` para cada lâmina (`customBlocksSlide1`, `customBlocksSlide2`, ..., `customBlocksSlide6`) e flags de visibilidade de ícones (`showIconsPillars`, `showIconsMetrics`, `showIconsStructure`, `showIconsDeliverables`, `showIconsContact`) + seletores de ícones personalizáveis.
  - *Por que*: Mantém a consistência com o restante do `EventData`, permite serialização perfeita para o LocalStorage e na exportação HTML autônoma.

---

### 4. Technical Architecture & Data Strategy

#### Arquitetura de Componentes e Fluxo de Dados

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│            (Mantém o estado central do EventData e Temas)              │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
       ┌─────────────────────────┐      ┌─────────────────────────┐
       │       Sidebar.tsx       │      │     SlideViewer.tsx     │
       │                         │      │                         │
       │  • Aba "Balões & Blocos"│      │  • Renderiza Lâminas 1-6│
       │  • Seletor de Lâmina    │      │  • Propaga callbacks de │
       │  • Toggles de cada card │      │    exclusão, restauração│
       │  • Toggles de ícones    │      │    e troca de ícones    │
       │  • Criador de balões    │      │                         │
       └─────────────────────────┘      └────────────┬────────────┘
                                                     │
               ┌───────────────────┬─────────────────┼───────────────────┐
               ▼                   ▼                 ▼                   ▼
     ┌───────────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
     │ Slide1Cover.tsx   │ │Slide2Concept  │ │Slide3Audience │ │Slide4Experi...│
     │  - Tags & Badge   │ │ - História    │ │ - 4 Métricas  │ │ - Atrações    │
     │  - Botão excluir  │ │ - Manifesto   │ │ - Demografia  │ │ - Estrutura   │
     │  - Balões Custom  │ │ - Pilares     │ │ - Canais Mídia│ │ - Ícones      │
     │                   │ │ - Ícones      │ │ - Balões Cust │ │ - Balões Cust │
     └───────────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
                                           │
                                           ▼
                                 ┌───────────────────┐
                                 │Slide5Tiers / 6End │
                                 │ - Cards de Cotas  │
                                 │ - Entregáveis     │
                                 │ - Contatos & Call │
                                 │ - Ícones & Custom │
                                 └───────────────────┘
```

#### Modificações no `types.ts`
- Inclusão dos campos de controle de balões e ícones em todas as páginas:
  - `showCoverBadges`, `showCoverDates`, `showCoverVenue`, `customBlocksSlide1`
  - `showConceptStory`, `showManifesto`, `showPillars`, `showPillarIcons`, `pillarIcons`, `customBlocksSlide2`
  - `showMetricAudience`, `showMetricImpressions`, `showMetricAge`, `showMetricPower`, `showMetricIcons`, `showDemographics`, `showMediaChannels`, `customBlocksSlide3`
  - `showAttractions`, `showStructureMetrics`, `showStructureIcons`, `customBlocksSlide4`
  - `showTiers`, `showTierIcons`, `customBlocksSlide5`
  - `showContactCard`, `showNextStepsCard`, `showContactIcons`, `customBlocksSlide6`

#### Modificações nos Componentes das Lâminas
- `Slide1Cover.tsx`: Suporte a ocultar balões de cabeçalho/data/local e renderização de blocos customizados.
- `Slide2Concept.tsx`: Botões de hover para excluir balões (História, Manifesto, Pilares individuais), botão para ocultar ou trocar ícones dos pilares, e bloco de balões customizados.
- `Slide3Audience.tsx`: Finalização completa com botões de hover para excluir e restaurar, e controle de ícones nas métricas.
- `Slide4Experience.tsx`: Exclusão de atrações, exclusão de cards de estrutura, toggle de ícones e suporte a balões customizados.
- `Slide5Tiers.tsx`: Exclusão de cotas individuais, personalização de entregáveis e blocos customizados.
- `Slide6Closing.tsx`: Exclusão e customização de balões de contatos, termos, prazos e blocos customizados.

#### Sincronização na Exportação (`proposalLogic.ts`)
- Atualização do `generateSingleFileHtml` para respeitar rigorosamente as visibilidades e customizações de todas as lâminas no HTML autônomo gerado.
