import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { FlyerFormData } from '@/app/flyer';

export const runtime = 'nodejs';
export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

async function gerarFlyer(data: FlyerFormData): Promise<string> {
  // Groq só gera a frase de destaque
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `Crie UMA frase de destaque curta e impactante (máximo 10 palavras) para divulgar o concurso "${data.nomeConc}" do órgão "${data.orgao}". Retorne APENAS a frase, sem aspas, sem explicação.`,
      },
    ],
    max_tokens: 50,
  });

  const frase =
    completion.choices?.[0]?.message?.content?.trim() ||
    data.fraseDestaque ||
    'Sua aprovação começa aqui!';

  const vaga = data.vagas?.[0];
  const salario = vaga?.salario ? `R$ ${vaga.salario}` : '—';
  const numVagas = vaga?.numVagas ? `${vaga.numVagas} vagas` : '—';

  const formatarData = (dt: string) => {
    if (!dt) return '—';
    const [ano, mes, dia] = dt.split('-');
    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return `${dia} ${meses[parseInt(mes) - 1]} ${ano}`;
  };

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center; }
.flyer {
  width: 390px;
  height: 693px;
  position: relative;
  overflow: hidden;
  background: #0d0d1a;
}
.bg-image {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(80,0,120,0.7) 0%, rgba(20,0,40,0.95) 60%, #0d0d1a 100%)${data.logoBase64 ? `, url('${data.logoBase64}') center/cover no-repeat` : ''};
}
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(13,13,26,0.98) 70%);
}
.content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 28px 24px 24px;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: auto;
}
.logo-badge {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 11px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.tag {
  background: linear-gradient(135deg, ${data.corPrincipal}, ${data.corDestaque});
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 11px;
  color: #fff;
  font-weight: 700;
}
.main { margin-top: auto; }
.orgao {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.titulo {
  font-size: 52px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -1px;
}
.subtitulo {
  font-size: 18px;
  font-weight: 700;
  color: ${data.corPrincipal};
  margin-bottom: 20px;
}
.divisor {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, ${data.corPrincipal}, ${data.corDestaque});
  border-radius: 2px;
  margin-bottom: 20px;
}
.destaque-box {
  background: linear-gradient(135deg, rgba(192,38,211,0.2), rgba(124,58,237,0.2));
  border: 1px solid ${data.corPrincipal}66;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 16px;
}
.destaque-label {
  font-size: 10px;
  color: ${data.corPrincipal};
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.destaque-valor {
  font-size: 28px;
  font-weight: 900;
  color: #fff;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}
.info-item {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 10px 12px;
}
.info-label {
  font-size: 9px;
  color: rgba(255,255,255,0.5);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.info-valor {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}
.frase {
  font-size: 14px;
  color: rgba(255,255,255,0.75);
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  font-style: italic;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 14px;
}
.footer-handle {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  font-weight: 600;
}
.footer-site {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  font-weight: 600;
}
.cta-btn {
  background: linear-gradient(135deg, ${data.corPrincipal}, ${data.corDestaque});
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}
</style>
</head>
<body>
<div class="flyer">
  <div class="bg-image"></div>
  <div class="overlay"></div>
  <div class="content">
    <div class="top-bar">
      <div class="logo-badge">${data.orgao}</div>
      <div class="tag">${data.tipoEvento || 'Concurso'}</div>
    </div>
    <div class="main">
      <div class="orgao">${data.orgao}</div>
      <div class="titulo">${data.nomeConc}</div>
      <div class="subtitulo">${data.tipoEvento} 🚨</div>
      <div class="divisor"></div>
      <div class="destaque-box">
        <div class="destaque-label">Salário inicial</div>
        <div class="destaque-valor">${salario}</div>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Data da prova</div>
          <div class="info-valor">${formatarData(data.dtProva)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Vagas</div>
          <div class="info-valor">${numVagas}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Inscrições até</div>
          <div class="info-valor">${formatarData(data.dtEncerramento)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Taxa</div>
          <div class="info-valor">${data.taxa || '—'}</div>
        </div>
      </div>
      ${
        data.temProfessor && data.professores?.length > 0
          ? `
<div style="display:flex; gap:10px; margin-bottom:14px; align-items:center;">
  ${data.professores
    .slice(0, 3)
    .map(
      (p) => `
    <div style="display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:8px 12px; flex:1;">
      ${p.fotoBase64 ? `<img src="${p.fotoBase64}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; flex-shrink:0;" />` : `<div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,${data.corPrincipal},${data.corDestaque}); flex-shrink:0;"></div>`}
      <div>
        <div style="font-size:11px; font-weight:700; color:#fff;">${p.nome || 'Professor'}</div>
        <div style="font-size:9px; color:rgba(255,255,255,0.5);">${p.especialidade || ''}</div>
      </div>
    </div>
  `,
    )
    .join('')}
</div>`
          : ''
      }
<div class="frase">"${frase}"</div>
      <div class="footer">
        <div class="footer-handle">@${data.orgao.toLowerCase().replace(/\s/g, '')}</div>
        <div class="cta-btn">Inscreva-se</div>
        <div class="footer-site">${data.site || ''}</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}

async function htmlParaJpg(html: string): Promise<string> {
  const res = await fetch('https://hcti.io/v1/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.HCTI_USER_ID}:${process.env.HCTI_API_KEY}`,
        ).toString('base64'),
    },
    body: JSON.stringify({
      html,
      viewport_width: 800,
      viewport_height: 1000,
    }),
  });

  const data = await res.json();
  console.log('🖼️ HCTI resposta:', data);

  if (!data.url) throw new Error('HCTI não retornou URL da imagem');
  return data.url;
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: 'API online' });
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        console.log('📤 SSE:', payload);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      };

      try {
        const data: FlyerFormData = await req.json();
        console.log('✅ JSON lido:', data.nomeConc, data.orgao);

        if (!data.nomeConc || !data.orgao) {
          send({ step: 'error', msg: 'Nome e órgão obrigatórios' });
          controller.close();
          return;
        }

        send({ step: 'start', msg: 'Dados recebidos, iniciando...' });

        console.log('🤖 Chamando Groq...');
        send({ step: 'ai', msg: 'Gerando flyer com IA...' });
        const htmlContent = await gerarFlyer(data);
        console.log('✅ Groq respondeu!');
        send({ step: 'ai_done', msg: 'Flyer gerado!' });

        console.log('🖼️ Convertendo para JPG...');
        send({ step: 'drive', msg: 'Convertendo para JPG...' });
        const jpgUrl = await htmlParaJpg(htmlContent);
        console.log('✅ JPG gerado:', jpgUrl);
        send({ step: 'drive_done', msg: 'JPG pronto!' });

        send({ step: 'done', msg: 'Concluído!', jpgUrl, htmlContent });
      } catch (err: unknown) {
        console.error('❌ ERRO:', err);
        const message = err instanceof Error ? err.message : 'Erro interno';
        send({ step: 'error', msg: message });
      } finally {
        console.log('🔚 Fechando stream');
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
