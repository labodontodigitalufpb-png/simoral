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

A exportacao OSCE em CSV funciona no GitHub Pages porque roda localmente no navegador. Os registros salvos ficam no `localStorage` do navegador usado pelo avaliador ate serem exportados ou limpos.
