# Publicacao no GitHub Pages

Este projeto pode ser publicado como site estatico no GitHub Pages usando `index.html`, `styles.css`, `app.js`, `data/` e `assets/`.

## Passos

1. Crie um repositorio no GitHub, por exemplo `ExamOSim`.
2. Inicialize e envie os arquivos:

```bash
git init
git add .
git commit -m "Publica versao estatica do ExamOSim"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ExamOSim.git
git push -u origin main
```

3. No GitHub, abra `Settings > Pages`.
4. Em `Build and deployment`, escolha:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salve. O link ficara no formato:

```text
https://SEU_USUARIO.github.io/ExamOSim/
```

## Gemini no GitHub Pages

O GitHub Pages nao executa `server.js`; ele serve apenas arquivos estaticos. Por isso, a rota segura `/api/gemini-dialogue` nao funciona no Pages e a chave Gemini nao deve ser colocada em `app.js`, `index.html` ou qualquer arquivo publico.

Para usar Gemini com seguranca em acesso publico, publique tambem um backend separado para o `server.js` em um servico como Render, Railway, Fly.io, Cloud Run ou servidor institucional. Nesse caso, o site estatico pode chamar esse backend por HTTPS.

## Exportacao OSCE

O CSV atual continua sendo gerado no navegador. Os registros gerais, porém, são enviados ao backend configurado em `app.js` e o CSV geral é baixado pelo painel administrativo através de uma rota autenticada.

No serviço que hospeda `server.js`, configure obrigatoriamente:

```text
ADMIN_EMAIL=administrador@instituicao.br
ADMIN_PASSWORD=uma-senha-forte
SESSION_SECRET=uma-chave-aleatoria-longa
DATA_FILE=/caminho/do/volume/examosim-db.json
```

O caminho de `DATA_FILE` deve estar em um volume persistente. Sem isso, plataformas com sistema de arquivos efêmero podem perder os dados ao reiniciar ou publicar uma nova versão.

### Render gratuito

O `render.yaml` configura o backend Node no plano gratuito e solicita os segredos `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `GEMINI_API_KEY`. O `SESSION_SECRET` é gerado automaticamente pelo Render.

O plano gratuito é adequado para demonstração, mas entra em suspensão após períodos sem tráfego e não fornece disco persistente. Contas e avaliações armazenadas no arquivo JSON podem ser perdidas em reinicializações ou novos deploys. Para uso real, conecte o backend a um banco PostgreSQL externo ou utilize um serviço Render com disco persistente.
