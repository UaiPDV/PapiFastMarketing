




# instalar dependências
npm install

# gerar conteúdo estático (busca no Firestore usando firebase-admin e grava public/content.json)
npm run generate-static

# build final (gera dist com caminhos relativos)
npm run build

# servir localmente a pasta dist (preview)
# opção 1 (vite):
npm run preview
# opção 2 (serve):
npx serve -s dist -l 5000
```

Observações:

-   O script `generate-static` usa `FIREBASE_SERVICE_ACCOUNT_BASE64` ou procura
    por `serviceAccountKey.json` na raiz.
-   O `vite.config.ts` está configurado com `base: './'` para permitir abrir
    `dist/index.html` por file://, Live Server ou qualquer servidor estático.

## Tornando o build realmente independente do Firebase

-   O gerador salva `public/content.json` e o build copia isso para
    `dist/content.json`. A aplicação front-end tentará carregar `./content.json`
    primeiro; se não existir, fará leitura do Firestore em runtime.
-   Para garantir funcionamento offline/sem internet, garantir que
    `dist/content.json` esteja presente (o `npm run build` já executa
    `generate-static` antes do build).
-   O gerador também baixou imagens externas e gravou em `dist/img/external/` e
    substituiu URLs por caminhos locais.

## Achados de segurança e recomendações

-   Encontrados no repositório:

    -   Arquivo de service account presente:
        `papifast-90f21-firebase-adminsdk-fbsvc-881c69942e.json` (arquivo
        sensível) — existe no workspace.
    -   Arquivo `.env` presente (contém `FIREBASE_SERVICE_ACCOUNT_BASE64`
        codificado) — **.env está listado em `.gitignore`**, então não será
        cometido por padrão.
    -   `.env.example` existe e está seguro para commitar (apenas placeholders).
    -   `firebase.ts` agora lê `import.meta.env`/`process.env` (ok).
    -   `scripts/generate-static.js` usa `firebase-admin` no Node (ok, deve
        rodar apenas em CI/build server).

-   Riscos e ações recomendadas:
    1. **Apagar o JSON da service account do repositório** (local):
        - Apague o arquivo localmente:
          `rm papifast-90f21-firebase-adminsdk-fbsvc-881c69942e.json`
        - Adicione o nome ao `.gitignore` para evitar commits futuros: adicione
          uma linha com o nome do arquivo.
        - Se o arquivo já foi comitado no Git, **rotacione a chave** na Google
          Cloud Console (revogue a chave antiga e gere uma nova). Em seguida,
          remova do histórico Git:
            ```bash
            git rm --cached papifast-90f21-firebase-adminsdk-fbsvc-881c69942e.json
            git commit -m "remove service account json"
            # Para purgar do histórico (opcional e destrutivo):
            # git filter-branch --force --index-filter "git rm --cached --ignore-unmatch papifast-90f21-firebase-adminsdk-fbsvc-881c69942e.json" --prune-empty --tag-name-filter cat -- --all
            ```
    2. **Rotacionar credenciais**: se o JSON já foi publicado (Git remoto
       público), considere revogar e criar nova service account.
    3. **Mínimo privilégio**: a service account usada pelo gerador deve ter a
       menor permissão necessária para ler os documentos do Firestore (ex.: role
       `Cloud Datastore Viewer`/Firestore Viewer). Não dê permissões extras.
    4. **Não colocar `FIREBASE_SERVICE_ACCOUNT_BASE64` em repositórios
       públicos** — use segredos do CI (GitHub Actions, GitLab CI, etc.).
    5. **Verificar histórico de commits** — se você suspeita que a chave foi
       exposta, rotacione imediatamente.

## Checklist (o que fazer agora)

-   [ ] Se ainda existir
        `papifast-90f21-firebase-adminsdk-fbsvc-881c69942e.json`, remova e
        adicione ao `.gitignore`.
-   [ ] Confirmar que `.env` não foi comitado (se foi, remova e rotacione
        chaves).
-   [ ] Use secrets do CI para `FIREBASE_SERVICE_ACCOUNT_BASE64` em pipelines.
-   [ ] Verifique permissões da service account (reduzir se necessário).

## Contatos / notas finais


Arquivo gerado automaticamente pelo assistente — se quiser que eu adicione ou
altere algo, diga qual seção ajustar.

**_ Segurança: esta documentação NÃO inclui a chave inteira; verifique seu
`.env` localmente. _**
