import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import Groq from 'groq-sdk';
import { Readable } from 'stream';
import { FlyerFormData } from '@/app/flyer';

export const runtime = 'nodejs';
export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  return google.drive({ version: 'v3', auth });
}

async function gerarHTMLFlyer(data: FlyerFormData): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: `Crie um flyer HTML profissional para concurso público.
Nome: ${data.nomeConc}
Órgão: ${data.orgao}
Cor principal: ${data.corPrincipal}
Cor destaque: ${data.corDestaque}
Retorne SOMENTE HTML puro, sem markdown.` }],
    max_tokens: 3000,
  });

  const text = completion.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('Groq retornou vazio');
  return text.replace(/```html|```/g, '').trim();
}

async function uploadHTMLParaDrive(html: string, nomeArquivo: string): Promise<string> {
  const drive = getDriveClient();
  const buffer = Buffer.from(html);

  const res = await drive.files.create({
    requestBody: { name: `${nomeArquivo}.html`, mimeType: 'text/html',  parents: ['1Jr1RIVxVN3QKTS5QgtswMEEXKty6NaKL']  },
    media: { mimeType: 'text/html', body: Readable.from(buffer) },
    fields: 'id, webViewLink',
  });

  if (!res.data.id) throw new Error('Falha ao criar arquivo no Drive');

  await drive.permissions.create({
    fileId: res.data.id,
    requestBody: { role: 'reader', type: 'anyone',
     },
  });

  return res.data.webViewLink || '';
}

export async function GET() {
  try {
    return NextResponse.json({ data: 'sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: object) => {
        console.log('📤 SSE:', payload);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
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
        const htmlContent = await gerarHTMLFlyer(data);
        console.log('✅ Groq respondeu!');
        send({ step: 'ai_done', msg: 'Flyer gerado!' });

        // Sem Drive — manda o HTML direto pro frontend fazer download
        send({ step: 'done', msg: 'Concluído!', driveUrl: null, htmlContent });

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
      'Connection': 'keep-alive',
    },
  });
}