# ExamOSim

Plataforma educacional de treinamento em raciocínio clínico com paciente virtual. O ExamOSim simula uma consulta em etapas — anamnese, exame físico, hipóteses diagnósticas, exames complementares e conduta — e não deve ser usado para diagnóstico autônomo de pacientes reais.

## O que esta versão entrega

- Consulta textual com paciente virtual e progressão clínica controlada.
- Página inicial pública com apresentação, instruções, login profissional, acesso administrativo e cadastro.
- Autenticação no servidor com senhas protegidas por PBKDF2 e sessões assinadas.
- Banco com 52 casos clínicos em JSON, sem programação individual da interface.
- Perfil odontológico com nome, uma ou mais especialidades, cidade, estado, e-mail, registro e instituição.
- Painel profissional com casos disponíveis, histórico centralizado, média e último desempenho.
- Painel administrativo protegido com busca, visualização completa dos preenchimentos e exportação CSV geral.
- Fotos de pacientes separadas por sexo e idade, recortadas da imagem de referência e associadas a cada caso.
- Pacientes identificados apenas por iniciais para anonimização dos casos.
- Seletor de idioma para português, inglês e espanhol.
- Diálogos do paciente e hipóteses diagnósticas acompanham o idioma selecionado.
- Diálogo orientado por intenções clínicas ampliadas de HDA, história familiar, médica, odontológica e hábitos.
- Casos adicionais importados de `CASO CLÍNICO 1.docx`, com exame clínico físico estruturado.
- Navegação por fases: Anamnese → Exame físico → Diagnóstico → Exames → Conduta.
- Exame físico liberado por suficiência clínica flexível: abordagem da doença atual, de dois outros blocos pertinentes e de 25% dos dados essenciais — ou cinco perguntas totais como alternativa.
- Seleção de regiões, sistemas e técnicas, com achados revelados sob solicitação.
- Perguntas amplas, específicas ou compostas são reconhecidas pelo conteúdo de cada item da anamnese, sem exigir critérios fixos de formulação na HDA.
- Roteiro de anamnese baseado no arquivo Word importado em `data/anamnesis-reference.txt`.
- Dados ocultos liberados por perguntas relevantes.
- Paciente com respostas evasivas ou progressivas.
- Interação com o paciente exclusivamente por texto.
- Uma fotografia clínica representativa por lesão é liberada durante a inspeção, escolhida preferencialmente pela correspondência com a descrição clínica do caso e sem antecipar o diagnóstico.
- Prontuário digital atualizado durante a consulta.
- Seleção ordenada de até cinco hipóteses, acompanhada de justificativa clínica.
- Exames complementares e condutas separados e liberados progressivamente.
- Classificação da urgência clínica.
- Avaliação multidimensional em 100 pontos, lacunas, alertas, feedback do tutor e SOAP automático.
- Envio automático da avaliação e da conversa completa ao servidor ao finalizar o atendimento.
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
ADMIN_EMAIL=admin@examosim.local
ADMIN_PASSWORD=defina-uma-senha-forte
SESSION_SECRET=defina-uma-chave-aleatoria-longa
DATA_FILE=.data/examosim-db.json
```

O Gemini recebe apenas a pergunta, a resposta-base segura e os dados clínicos já liberados pelo motor do caso. Ele não recebe permissão para revelar diagnóstico nem inventar informações.

> Observação: o Gemini via `/api/gemini-dialogue` depende do `server.js`. Em GitHub Pages, que é estático, essa rota não funciona. Para usar Gemini em acesso público, publique o backend Node separadamente e mantenha a chave fora dos arquivos públicos.

No GitHub Pages, o frontend usa o backend público em `https://simoral.onrender.com`. Em execução local, as chamadas continuam sendo feitas ao mesmo servidor que entrega a interface.

## Registros e planilha OSCE

Na seção `Avaliação`, use:

- `Observações da OSCE`: comentários livres do avaliador.
- `Finalizar atendimento`: gera a avaliação e a envia automaticamente ao servidor.
- `Salvar OSCE`: permite repetir manualmente o envio se necessário, atualizando a mesma tentativa sem duplicá-la.
- `CSV atual`: baixa a avaliação atual.

No acesso administrativo:

- A tabela apresenta os preenchimentos enviados por todos os profissionais.
- A busca filtra por profissional, e-mail, caso ou instituição.
- `Ver detalhes` apresenta todos os campos da avaliação e a conversa completa.
- `Baixar CSV geral` exporta os registros exibidos. A rota é protegida e exclusiva do administrador.

O CSV abre em Excel, Google Sheets ou LibreOffice e inclui também o identificador da tentativa e a conversa completa.

Os registros incluem perfil profissional, localização, duração da tentativa, perguntas, cobertura da anamnese, exame físico, hipóteses e justificativa, exames, condutas, urgência e pontuação por dimensão.

## Persistência e segurança

Contas, perfis e avaliações são armazenados centralmente pelo `server.js`. Por padrão, os dados ficam em `.data/examosim-db.json`, fora do Git. A escrita é atômica, as senhas usam PBKDF2 com salt individual e as rotas administrativas exigem uma sessão assinada com papel de administrador.

Defina `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `SESSION_SECRET` no ambiente de produção. Se `SESSION_SECRET` não for definido, o servidor cria uma chave temporária e as sessões são invalidadas quando o processo reinicia. Em produção, o login administrativo fica desabilitado quando `ADMIN_PASSWORD` não está configurado.

O arquivo JSON central atende a uma instalação única e elimina a limitação do `localStorage`. Para múltiplas instâncias, alto volume ou requisitos institucionais de auditoria e backup, configure `DATA_FILE` em um volume persistente ou substitua a camada de arquivo por PostgreSQL.

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
