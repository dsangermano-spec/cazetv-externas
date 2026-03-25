# Cazé TV — Deploy (retomar amanhã)

## O que já está pronto
- Sistema dark mode completo funcionando no chat do Claude
- Dados de Fevereiro e Março 2025 já carregados
- Repositório no GitHub: **github.com/dsangermano-spec/cazetv-externas**
- Projeto criado no Vercel: **cazetv-externas** (team: dsangermano-6476s-projects)

## Problema atual no GitHub
Existe uma pasta `app/app/` com um arquivo `page.jsx` vazio/corrompido que precisa ser removida.

**Como resolver:**
1. Acesse github.com/dsangermano-spec/cazetv-externas
2. Entre na pasta `app/` → depois na subpasta `app/`
3. Abra o `page.jsx` → clique no lápis ✏️ → apague tudo → salve com qualquer conteúdo vazio
4. OU: apague o repositório inteiro e recrie do zero com os 4 arquivos corretos

## Arquivos corretos (todos disponíveis nesta conversa)
| Arquivo | Artifact no chat |
|---|---|
| `package.json` | "package.json" (último gerado) |
| `app/layout.jsx` | "app/layout.jsx" |
| `app/page.jsx` | "app/page.jsx — parte 1 de 1 (completo)" |
| `app/api/data/route.js` | "app/api/data/route.js — versão final" |

## Depois do deploy: ativar o banco de dados
1. No painel do Vercel → **Storage → Marketplace → Upstash Redis**
2. Criar banco → conectar ao projeto `cazetv-externas`
3. Fazer **Redeploy**

## Alternativa mais simples para amanhã
**Apagar o repositório e recriar do zero:**
1. GitHub → Settings → Delete repository
2. Criar novo repositório `cazetv-externas`
3. Criar os 4 arquivos com os conteúdos corretos
4. Vercel detecta automaticamente e faz o deploy

## Enquanto isso
O sistema está funcionando no chat do Claude com dados salvos localmente. Pode usar normalmente!
