# ExamOSim

Plataforma educacional de treinamento em raciocínio clínico com paciente virtual. O ExamOSim simula uma consulta em etapas — anamnese, exame físico, hipóteses diagnósticas, exames complementares e conduta — e não deve ser usado para diagnóstico autônomo de pacientes reais.

## O que esta versão entrega

- Consulta textual com paciente virtual e progressão clínica controlada.
- Página inicial pública com apresentação, instruções, login profissional, acesso administrativo e cadastro.
- Sessão local com bloqueio da interface clínica até a autenticação e opção de logout.
- Banco com 52 casos clínicos em JSON, sem programação individual da interface.
- Perfil multiprofissional com nome, profissão, cidade, estado, e-mail, registro e instituição.
- Painel local com casos disponíveis, casos concluídos, média e último desempenho.
- Fotos de pacientes separadas por sexo e idade, recortadas da imagem de referência e associadas a cada caso.
- Pacientes identificados apenas por iniciais para anonimização dos casos.
- Seletor de idioma para português, inglês e espanhol.
- Diálogos do paciente e hipóteses diagnósticas acompanham o idioma selecionado.
- Diálogo orientado por intenções clínicas ampliadas de HDA, história familiar, médica, odontológica e hábitos.
- Casos adicionais importados de `CASO CLÍNICO 1.docx`, com exame clínico físico estruturado.
- Navegação por fases: Anamnese → Exame físico → Diagnóstico → Exames → Conduta.
- Exame físico liberado por suficiência clínica: 3 perguntas na HDA cobrindo ao menos 2 dimensões, passagem por 3 blocos complementares e 45% dos dados essenciais — ou 8 perguntas totais como alternativa quando a formulação livre não for classificada perfeitamente.
- Seleção de regiões, sistemas e técnicas, com achados revelados sob solicitação.
- Perguntas compostas podem cobrir mais de uma dimensão da HDA, e os demais blocos exigem apenas uma abordagem relevante para o avanço.
- Roteiro de anamnese baseado no arquivo Word importado em `data/anamnesis-reference.txt`.
- Dados ocultos liberados por perguntas relevantes.
- Paciente com respostas evasivas ou progressivas.
- Interação com o paciente exclusivamente por texto.
- Fotografias clínicas do livro de referência liberadas durante a inspeção da região correspondente, sem antecipar o diagnóstico.
- Prontuário digital atualizado durante a consulta.
- Seleção ordenada de até cinco hipóteses, acompanhada de justificativa clínica.
- Exames complementares e condutas separados e liberados progressivamente.
- Classificação da urgência clínica.
- Avaliação multidimensional em 100 pontos, lacunas, alertas, feedback do tutor e SOAP automático.
- Campo de observações da OSCE e exportação de registros em CSV para planilha.
- Consultório virtual visual em HTML/CSS como placeholder para uma futura cena 3D.
- Blocos de anamnese acessíveis em qualquer ordem, sem aviso ou penalidade por sequência.
- História odontológica aberta a perguntas sobre qualquer tratamento ou procedimento, como restaurações, extrações, canal, próteses, implantes, ortodontia, cirurgia, periodontia, limpeza e clareamento.

## Como abrir

Use o servidor Node local. Ele serve os arquivos estáticos e também cria a rota segura `/api/gemini-dialogue` para humanizar as respostas do paciente sem expor a chave da API no navegador.

```bash
node server.js
```

Depois acesse:

```text
http://localhost:5173
```

Também é possível iniciar com:

```bash
npm start
```

Se a porta 5173 estiver ocupada:

```bash
PORT=5174 node server.js
```

## Gemini API opcional

O app funciona sem Gemini usando o motor local de diálogo. Para ativar respostas mais naturais, livres e variadas com segurança:

1. Crie uma chave em Google AI Studio.
2. Copie `.env.example` para `.env`.
3. Preencha:

```text
GEMINI_API_KEY=sua_chave
GEMINI_MODEL=gemini-2.5-flash
PORT=5173
```

O Gemini recebe apenas a pergunta, a resposta-base segura e os dados clínicos já liberados pelo motor do caso. Ele não recebe permissão para revelar diagnóstico nem inventar informações.

> Observação: o Gemini via `/api/gemini-dialogue` depende do `server.js`. Em GitHub Pages, que é estático, essa rota não funciona. Para usar Gemini em acesso público, publique o backend Node separadamente e mantenha a chave fora dos arquivos públicos.

No GitHub Pages, o frontend usa o backend público em `https://simoral.onrender.com`. Em execução local, as chamadas continuam sendo feitas ao mesmo servidor que entrega a interface.

## Registros e planilha OSCE

Na seção `Avaliação`, use:

- `Observações da OSCE`: comentários livres do avaliador.
- `Salvar OSCE`: guarda o registro no navegador.
- `CSV atual`: baixa a avaliação atual.
- `CSV geral`: baixa todos os registros salvos localmente.
- `Limpar`: apaga os registros OSCE do navegador.

O CSV abre em Excel, Google Sheets ou LibreOffice.

Os registros incluem perfil profissional, localização, duração da tentativa, perguntas, cobertura da anamnese, exame físico, hipóteses e justificativa, exames, condutas, urgência e pontuação por dimensão.

## Escopo de persistência atual

Esta versão mantém conta, perfil e histórico no navegador. A senha profissional é armazenada apenas como hash SHA-256 no `localStorage`, e a sessão usa `sessionStorage`; isso atende à demonstração local, mas não substitui autenticação segura de produção. Credenciais administrativas não são exibidas na página pública. Antes de publicar para uso real, o acesso local deve ser substituído por backend, banco de dados, hash com salt, recuperação de senha e controle de acesso por papéis.

## Publicação na internet

Para publicar a versão estática no GitHub Pages, siga o guia em `DEPLOY_GITHUB_PAGES.md`.

## Casos disponíveis

O arquivo `data/cases.json` contém 52 casos. Trinta já possuem achados de exame físico estruturados; nos demais, a interface sinaliza quando um resultado específico ainda precisa ser enriquecido no roteiro. A arquitetura da interface lê os casos dinamicamente e está pronta para receber novas especialidades e sistemas clínicos.

## Assets importados

As imagens dos pacientes ficam em `assets/patients/`:

- `adult_male.png`
- `adult_female.png`
- `older_male.png`
- `older_female.png`
- `child_male.png`
- `child_female.png`

O conteúdo textual extraído do Word está em `data/anamnesis-reference.txt` e serviu como base para organizar as respostas clínicas por blocos de anamnese.

As fotografias clínicas extraídas de `doenças de boca.pdf` ficam em `assets/lesions/book/`. O vínculo entre diagnóstico, arquivo, legenda e página de origem está em `data/lesion-images.json`; a atribuição bibliográfica também consta em `assets/lesions/book/README.md`.

Foram vinculadas imagens exatas a 40 dos 52 casos. Quando o livro não trazia uma fotografia diretamente correspondente ao diagnóstico do caso, nenhuma imagem aproximada foi usada, evitando uma ilustração clinicamente enganosa.

## Próximas fases sugeridas

1. Substituir a autenticação local de demonstração por autenticação centralizada e autorização por papéis.
2. Adicionar persistência central em PostgreSQL/Supabase e trilha completa de tentativas.
3. Criar painel administrativo, filtros, comparação de tentativas e exportações XLSX/PDF.
4. Criar editor estruturado de casos e catálogo multiprofissional.
5. Estruturar resultados específicos de sinais vitais, exame físico e exames complementares em todos os casos.
6. Substituir o placeholder visual por React Three Fiber + avatar VRM/GLB.
