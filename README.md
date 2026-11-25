# Treino de Entrevista em Inglês

App de **uma página só**, em português, para quem tem inglês básico praticar entrevista
de emprego em inglês. Abre no navegador, sem instalar nada. Toda a inteligência roda com
a **sua** chave da API Anthropic, que fica salva só no seu navegador e vai direto para a
Anthropic — nada passa por servidor nosso.

👉 **Use agora:** <https://iagoadriano.github.io/treino-entrevista/>

## O que ele faz

| Aba | Para quê |
|-----|----------|
| **Treinar** | Um entrevistador de IA faz perguntas, uma a uma. Você responde (digitando ou falando), recebe **nota de 0 a 10**, correção em português, uma **versão melhorada** em inglês simples e a **pronúncia** escrita do jeito que se lê. Guarda seu progresso. |
| **Respostas STAR** | Monta um banco de 4 a 6 histórias no formato **S**ituação · **T**arefa · **A**ção · **R**esultado, usando **só os fatos do seu perfil** — nunca inventa experiência. Você edita e decora. |
| **Perguntas difíceis** | Prepara as perguntas que pegam ("qual sua maior fraqueza?", "você não tem X"). Para o que falta, usa o padrão **ponte**: reconhece a lacuna → liga à experiência mais próxima → mostra que está aprendendo. Também gera **perguntas pra você fazer** ao entrevistador. |
| **Kit de preparação** | 10 perguntas prováveis com respostas modelo, a partir do seu currículo. Dá pra copiar tudo. |
| **Intérprete** | Traduz a pergunta do entrevistador e passa **fielmente** pro inglês o que **você** disse — sem acrescentar nada. |

O **estágio da entrevista** (triagem / técnica / rodada final) molda as perguntas e a
preparação em todas as abas.

## Honestidade primeiro

O app **nunca inventa** experiências, números ou empresas que não estejam no seu perfil.
Ele ajuda você a dizer melhor o que é verdade — não a mentir. Plataformas como a micro1
proíbem respostas geradas durante a entrevista: o **Intérprete** só traduz o que você
mesmo escreveu, e serve para treinar antes, não para colar na hora.

## Como usar

1. Abra o link acima (ou o arquivo `index.html`).
2. Crie uma chave em [console.anthropic.com](https://console.anthropic.com) e cole no campo do topo.
3. Ajuste **seu perfil e a vaga** e escolha o **estágio**.
4. Treine. Fale em voz alta. Repita até sair de memória.

> A voz (ouvir a pronúncia e falar no microfone) usa recursos nativos do navegador e
> funciona melhor no Chrome. A chave da API é sua e tem custo de uso na Anthropic — o
> app usa o modelo mais barato e rápido (Claude Haiku).

## Privacidade

- A chave da API e todos os seus dados (perfil, histórico, banco STAR, kit) ficam **só no
  seu navegador** (`localStorage`). Nada é enviado para nenhum servidor além da Anthropic.
- Limpar os dados do site apaga tudo.

## Rodar / hospedar

É um único arquivo estático. Qualquer uma destas opções serve:

```bash
# local, só abrir o arquivo
xdg-open index.html        # ou dê duplo-clique

# ou servir localmente
python3 -m http.server 8000   # acesse http://localhost:8000
```

Publicado via **GitHub Pages** a partir da branch padrão (pasta raiz). Veja
`.github/workflows/pages.yml`.

## Créditos

O **método de preparação** (banco STAR, padrão ponte para lacunas, perguntas pra fazer ao
entrevistador, prep por estágio) foi inspirado no fluxo `/interview` do projeto
[ai-job-search](https://github.com/ai-job-search-dev/ai-job-search), adaptado para um app
de navegador voltado a quem está começando no inglês.

Licença: MIT.
