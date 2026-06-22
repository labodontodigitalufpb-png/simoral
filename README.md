# ExamOSim

Protótipo inicial do Simulador Inteligente de Anamnese Odontológica com IA.

## O que esta versão entrega

- Anamnese textual com paciente virtual.
- Banco de casos clínicos em JSON.
- 22 histórias clínicas de lesões e doenças bucais com idade, sexo, hábitos e perfil emocional específicos.
- Fotos de pacientes separadas por sexo e idade, recortadas da imagem de referência e associadas a cada caso.
- Cadastro simples do aluno com nome, matrícula e faculdade no relatório.
- Pacientes identificados apenas por iniciais para anonimização dos casos.
- Seletor de idioma para português, inglês e espanhol.
- Diálogos do paciente, voz sintetizada e hipóteses diagnósticas acompanham o idioma selecionado.
- Diálogo orientado por intenções clínicas ampliadas de HDA, história familiar, médica, odontológica e hábitos.
- Casos adicionais importados de `CASO CLÍNICO 1.docx`, com exame clínico físico estruturado.
- Exame físico bloqueado até completar o itinerário de anamnese e obter a maioria dos dados essenciais.
- Avanço entre etapas da anamnese condicionado a pelo menos 3 perguntas estruturadas por etapa, quando disponíveis.
- Roteiro de anamnese baseado no arquivo Word importado em `data/anamnesis-reference.txt`.
- Dados ocultos liberados por perguntas relevantes.
- Paciente com respostas evasivas ou progressivas.
- Voz do paciente por síntese de fala do navegador.
- Voz natural do paciente pela Cartesia Sonic, com síntese do navegador como fallback.
- Entrada por microfone para o profissional quando o navegador suportar reconhecimento de fala.
- Prontuário digital atualizado durante a consulta.
- Seleção de hipóteses diagnósticas.
- Seleção de exames e condutas.
- Avaliação final com nota, lacunas, alertas e SOAP automático.
- Campo de observações da OSCE e exportação de registros em CSV para planilha.
- Consultório odontológico visual em HTML/CSS como placeholder para a futura cena 3D.
- Avaliação da sequência lógica: história da doença atual, história familiar, história médica, história odontológica e hábitos/dependências.

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

## Cartesia opcional

Para ativar a voz natural do paciente, acrescente ao `.env`:

```text
CARTESIA_API_KEY=sua_chave
CARTESIA_MODEL=sonic-3.5
```

O servidor escolhe automaticamente uma voz pelo idioma e gênero do paciente. Para usar sempre uma voz específica, configure também `CARTESIA_VOICE_ID`. A chave permanece no backend e nunca é enviada ao navegador.

No GitHub Pages, o frontend usa o backend público em `https://simoral.onrender.com`. Em execução local, as chamadas continuam sendo feitas ao mesmo servidor que entrega a interface.

## Planilha OSCE

Na seção `Avaliação`, use:

- `Observações da OSCE`: comentários livres do avaliador.
- `Salvar OSCE`: guarda o registro no navegador.
- `CSV atual`: baixa a avaliação atual.
- `CSV geral`: baixa todos os registros salvos localmente.
- `Limpar`: apaga os registros OSCE do navegador.

O CSV abre em Excel, Google Sheets ou LibreOffice.

## Publicação na internet

Para publicar a versão estática no GitHub Pages, siga o guia em `DEPLOY_GITHUB_PAGES.md`.

## Casos disponíveis

- 2 casos de carcinoma espinocelular.
- 2 casos de leucoplasia oral.
- 2 casos de candidíase oral associada a prótese.
- 2 casos de líquen plano oral erosivo.
- 2 casos de estomatite aftosa recorrente menor.
- 2 casos de mucocele.
- 2 casos de gengivoestomatite herpética primária.
- 2 casos de pênfigo vulgar.
- 2 casos de gengivite ulcerativa necrosante.
- 2 casos de língua geográfica.
- 2 casos de queilite actínica.

## Áudio

O botão `Voz do paciente` ativa a leitura das respostas pela Cartesia quando configurada, com fallback automático para a síntese do navegador. O botão `Mic` tenta captar a pergunta do profissional e enviá-la automaticamente. O reconhecimento de fala depende do navegador e costuma funcionar melhor em Chrome ou Edge.

## Assets importados

As imagens dos pacientes ficam em `assets/patients/`:

- `adult_male.png`
- `adult_female.png`
- `older_male.png`
- `older_female.png`
- `child_male.png`
- `child_female.png`

O conteúdo textual extraído do Word está em `data/anamnesis-reference.txt` e serviu como base para organizar as respostas clínicas por blocos de anamnese.

## Próximas fases sugeridas

1. Migrar para Next.js + React.
2. Extrair o motor clínico para FastAPI.
3. Adicionar persistência em PostgreSQL/Supabase.
4. Substituir o placeholder visual por React Three Fiber + avatar VRM/GLB.
5. Integrar STT/TTS e LLM para linguagem natural.
6. Criar modo professor com editor de casos.
