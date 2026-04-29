'use client';

import { useState, useRef } from 'react';
import { FlyerFormData, Vaga, Materia, Professor } from '@/app/flyer';
import styles from '@/app/page.module.css';
import Image from 'next/image';
import Logo from '@/public/images.png';

const TITULACOES = ['Graduado', 'Especialista', 'Mestre', 'Doutor'];

const ESTILOS = [
  'Formal / Governamental',
  'Moderno / Jovem',
  'Minimalista',
  'Colorido / Chamativo',
];
const FORMATOS = [
  'A4 Vertical',
  'A4 Horizontal',
  'Stories (9:16)',
  'Post Quadrado (1:1)',
];
const VERTICAIS = [
  {
    label: 'Concursos',
    value: 'concursos',
    cor: '#7C3AED',
    subVerticais: [
      { label: 'Saúde', value: 'saude', cor: '#06B6D4' },
      { label: 'Educação', value: 'educacao', cor: '#1E3A5F' },
      { label: 'Engenharia', value: 'engenharia', cor: '#3B82F6' },
      { label: 'CFC', value: 'cfc', cor: '#1E2D6B' },
      { label: 'Policial', value: 'policial', cor: '#111' },
    ],
  },
  {
    label: 'Carreira Jurídica',
    value: 'juridica',
    cor: '#F97316',
    subVerticais: [],
  },
  {
    label: 'OAB',
    value: 'oab',
    cor: '#DC2626',
    subVerticais: [
      { label: 'Prática Jurídica', value: 'pratica', cor: '#6B1A1A' },
    ],
  },
];

const TIPOS_EVENTO = [
  'Hora da Verdade',
  'Revisão de Véspera',
  'Gabarito Extraoficial',
  'Simulado',
  'Webnário',
  'Termômetro Pós Prova',
  'Reta Final',
  'Ebook',
  'Outro',
];

const TABS = ['Concurso', 'Vagas', 'Professores', 'Visual'];

const defaultForm = (): FlyerFormData => ({
  nomeConc: '',
  orgao: '',
  dtAbertura: '',
  dtEncerramento: '',
  dtProva: '',
  modalidade: '',
  dtSimulado: '',
  taxa: '',
  site: '',
  nivelMin: '',
  areaFormacao: '',
  vagas: [{ cargo: '', numVagas: 0, salario: '' }],
  temProg: false,
  materias: [],
  temCurso: false,
  nomeCurso: '',
  cargaCurso: '',
  valorCurso: '',
  professores: [{ nome: '', especialidade: '', titulacao: 'Especialista' }],
  corPrincipal: '#1D4ED8',
  corDestaque: '#F59E0B',
  estilo: '',
  formato: 'A4 Vertical',
  fraseDestaque: '',
  obsRodape: '',
  temProfessor: false,
  tituloPersonalizado: '',
  programacaoExcel: undefined,
  dtEvento: '',
  hrAplicacao: '',
  hrCorrecao: '',
  tipoEvento: '',
  imagemEbookBase64: '',
  tipoEventoOutro: '',
  vertical: '',
  subVertical: '',
});

export default function GerarFlyerPage() {
  const [tab, setTab] = useState(0);
  const [simulado, setSimulado] = useState(false);
  const [temprofessor, setTemProfessor] = useState(false);
  const [form, setForm] = useState<FlyerFormData>(defaultForm());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    msg: string;
  }>({ type: 'idle', msg: '' });
  const [resultado, setResultado] = useState<{
    pngBase64: string;
    driveUrl: string;
  } | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const ebookRef = useRef<HTMLInputElement>(null);
  const excelRef = useRef<HTMLInputElement>(null);

  const verticalAtual = VERTICAIS.find((v) => v.value === form.vertical);

  const handleExcel = (file: File) => set('programacaoExcel', file);

  const handleEbook = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => set('imagemEbookBase64', e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const set = (field: keyof FlyerFormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updateVaga = (i: number, field: keyof Vaga, value: string | number) =>
    setForm((f) => {
      const v = [...f.vagas];
      v[i] = { ...v[i], [field]: value };
      return { ...f, vagas: v };
    });

  const addVaga = () =>
    setForm((f) => ({
      ...f,
      vagas: [...f.vagas, { cargo: '', numVagas: 0, salario: '' }],
    }));
  const removeVaga = (i: number) =>
    setForm((f) => ({ ...f, vagas: f.vagas.filter((_, idx) => idx !== i) }));

  const updateMateria = (
    i: number,
    field: keyof Materia,
    value: string | number,
  ) =>
    setForm((f) => {
      const m = [...f.materias];
      m[i] = { ...m[i], [field]: value };
      return { ...f, materias: m };
    });

  const addMateria = () =>
    setForm((f) => ({
      ...f,
      materias: [...f.materias, { nome: '', numQuestoes: 0 }],
    }));
  const removeMateria = (i: number) =>
    setForm((f) => ({
      ...f,
      materias: f.materias.filter((_, idx) => idx !== i),
    }));

  const updateProf = (i: number, field: keyof Professor, value: string) =>
    setForm((f) => {
      const p = [...f.professores];
      p[i] = { ...p[i], [field]: value };
      return { ...f, professores: p };
    });

  const addProf = () =>
    setForm((f) => ({
      ...f,
      professores: [
        ...f.professores,
        { nome: '', especialidade: '', titulacao: 'Especialista' },
      ],
    }));
  const removeProf = (i: number) =>
    setForm((f) => ({
      ...f,
      professores: f.professores.filter((_, idx) => idx !== i),
    }));

  const handleFotoProf = (i: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      updateProf(i, 'fotoBase64', e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => set('logoBase64', e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const navTab = (dir: number) => {
    const next = tab + dir;
    if (next >= 0 && next < TABS.length) setTab(next);
  };

  const handleGerar = async () => {
    if (!form.nomeConc || !form.orgao) {
      setStatus({
        type: 'error',
        msg: 'Preencha o nome do concurso e o órgão (aba 1).',
      });
      return;
    }
    setLoading(true);
    setStatus({ type: 'loading', msg: 'Gerando flyer com IA...' });
    setResultado(null);

    try {
      const res = await fetch('/api/gerar-flyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido');

      setResultado({ pngBase64: data.pngBase64, driveUrl: data.driveUrl });
      setStatus({
        type: 'success',
        msg: 'Flyer gerado e salvo no Google Drive!',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro ao gerar flyer';
      setStatus({ type: 'error', msg: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Image
        src={Logo}
        width={180}
        height={180}
        alt="Logo"
        style={{ padding: '8px' }}
      />
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Gerador de flyer — concurso público</h1>
          <p>
            Preencha as informações, gere o arte e exporte para o Google Drive
          </p>
        </div>

        <div className={styles.tabRow}>
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`${styles.tabBtn} ${tab === i ? styles.active : ''}`}
              onClick={() => setTab(i)}
            >
              <span className={`${styles.badge} ${i < tab ? styles.done : ''}`}>
                {i < tab ? '✓' : i + 1}
              </span>
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <>
            <div className={styles.card}>
              <div className={styles.sectionTitle}>Informações gerais</div>
              <div className={styles.grid2}>
                <Field label="Vertical *">
                  <select
                    value={form.vertical}
                    onChange={(e) => {
                      set('vertical', e.target.value);
                      set('subVertical', '');
                    }}
                  >
                    <option value="">Selecionar...</option>
                    {VERTICAIS.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </Field>

                {verticalAtual && verticalAtual.subVerticais.length > 0 && (
                  <Field label="Sub-vertical">
                    <select
                      value={form.subVertical}
                      onChange={(e) => set('subVertical', e.target.value)}
                    >
                      <option value="">Selecionar área...</option>
                      {verticalAtual.subVerticais.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>

              <div className={styles.grid2}>
                <Field label="Tipo de evento *">
                  <select
                    value={form.tipoEvento}
                    onChange={(e) => set('tipoEvento', e.target.value)}
                  >
                    <option value="">Selecionar...</option>
                    {TIPOS_EVENTO.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {(form.tipoEvento === 'Revisão de Véspera' ||
                form.tipoEvento === 'Gabarito Extraoficial') && (
                <Field label="Programação do evento (.xlsx)">
                  <div
                    className={styles.uploadBox}
                    style={{ width: '100%', height: 60 }}
                  >
                    <input
                      type="file"
                      ref={excelRef}
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) =>
                        e.target.files && handleExcel(e.target.files[0])
                      }
                    />
                    <span className={styles.uploadHint}>
                      {form.programacaoExcel
                        ? `📄 ${(form.programacaoExcel as File).name}`
                        : '📊 Importar planilha Excel'}
                    </span>
                  </div>
                </Field>
              )}

              {form.tipoEvento === 'Simulado' && (
                <div className={styles.grid3}>
                  <Field label="Data do evento">
                    <input
                      type="date"
                      value={form.dtEvento}
                      onChange={(e) => set('dtEvento', e.target.value)}
                    />
                  </Field>
                  <Field label="Horário de aplicação">
                    <input
                      type="time"
                      value={form.hrAplicacao}
                      onChange={(e) => set('hrAplicacao', e.target.value)}
                    />
                  </Field>
                  <Field label="Horário de correção">
                    <input
                      type="time"
                      value={form.hrCorrecao}
                      onChange={(e) => set('hrCorrecao', e.target.value)}
                    />
                  </Field>
                </div>
              )}

              {form.tipoEvento === 'Webnário' && (
                <Field label="Título personalizado do webnário">
                  <input
                    value={form.tituloPersonalizado}
                    onChange={(e) => set('tituloPersonalizado', e.target.value)}
                    placeholder="Ex: Webnário Direito Constitucional ao Vivo"
                  />
                </Field>
              )}

              {form.tipoEvento === 'Ebook' && (
                <Field label="Imagem da capa do ebook">
                  <div
                    className={styles.uploadBox}
                    style={{ width: '100%', height: 80 }}
                  >
                    <input
                      type="file"
                      ref={ebookRef}
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && handleEbook(e.target.files[0])
                      }
                    />
                    {form.imagemEbookBase64 ? (
                      <img
                        src={form.imagemEbookBase64}
                        alt="capa"
                        style={{
                          maxHeight: 60,
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <span className={styles.uploadHint}>
                        📖 Enviar capa do ebook
                      </span>
                    )}
                  </div>
                </Field>
              )}

              {form.tipoEvento === 'Outro' && (
                <Field label="Descreva o tipo de evento">
                  <input
                    value={form.tipoEventoOutro}
                    onChange={(e) => set('tipoEventoOutro', e.target.value)}
                    placeholder="Ex: Live de encerramento..."
                    maxLength={80}
                  />
                </Field>
              )}

              {/* Nome do concurso + Órgão */}
              <div className={styles.grid2} style={{ marginTop: 12 }}>
                <Field label="Nome do concurso *">
                  <input
                    value={form.nomeConc}
                    onChange={(e) => set('nomeConc', e.target.value)}
                    placeholder="Ex: Concurso Público SEMED 2025"
                    className={styles.inputlarge}
                    required
                  />
                </Field>
                <Field label="Órgão *">
                  <input
                    value={form.orgao}
                    onChange={(e) => set('orgao', e.target.value)}
                    placeholder="Ex: TJ SP, PC BA, DPE BA"
                    required
                  />
                </Field>
              </div>

              {form.tipoEvento !== 'Ebook' && (
                <div className={styles.grid3}>
                  {!simulado && (
                    <>
                      <Field label="Data de abertura">
                        <input
                          type="date"
                          value={form.dtAbertura}
                          onChange={(e) => set('dtAbertura', e.target.value)}
                        />
                      </Field>
                      <Field label="Data de encerramento">
                        <input
                          type="date"
                          value={form.dtEncerramento}
                          onChange={(e) =>
                            set('dtEncerramento', e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Data da prova">
                        <input
                          type="date"
                          value={form.dtProva}
                          onChange={(e) => set('dtProva', e.target.value)}
                        />
                      </Field>
                    </>
                  )}
                  <div className={styles.checkRow}>
                    <input
                      type="checkbox"
                      onClick={() => setSimulado((p) => !p)}
                      className={styles.simuladocheck}
                    />
                    Simulado?
                  </div>
                  {simulado && (
                    <Field label="Data do simulado">
                      <input
                        type="date"
                        value={form.dtSimulado}
                        onChange={(e) => set('dtSimulado', e.target.value)}
                      />
                    </Field>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 1 && (
          <>
            <div className={styles.card}>
              <div className={styles.sectionTitle}>Vagas e remuneração</div>
              {form.vagas.map((v, i) => (
                <div key={i} className={styles.rowEntry}>
                  <Field label="Cargo">
                    <input
                      value={v.cargo}
                      onChange={(e) => updateVaga(i, 'cargo', e.target.value)}
                      placeholder="Ex: Professor"
                    />
                  </Field>
                  <Field label="Nº de vagas">
                    <input
                      type="number"
                      min={0}
                      value={v.numVagas}
                      onChange={(e) =>
                        updateVaga(i, 'numVagas', Number(e.target.value))
                      }
                    />
                  </Field>
                  <Field label="Salário">
                    <input
                      value={v.salario}
                      onChange={(e) => updateVaga(i, 'salario', e.target.value)}
                      placeholder="R$ 0,00"
                    />
                  </Field>
                  <button
                    className={styles.btnRemove}
                    onClick={() => removeVaga(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button className={styles.btnAdd} onClick={addVaga}>
                + Adicionar cargo
              </button>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitle}>Programação / conteúdo</div>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={form.temProg}
                  onChange={(e) => set('temProg', e.target.checked)}
                />
                Este concurso tem programação de matérias
              </label>
              {form.temProg && (
                <div className={styles.subSection}>
                  {form.materias.map((m, i) => (
                    <div key={i} className={styles.rowEntry}>
                      <Field label="Matéria">
                        <input
                          value={m.nome}
                          onChange={(e) =>
                            updateMateria(i, 'nome', e.target.value)
                          }
                          placeholder="Ex: Português"
                        />
                      </Field>
                      <Field label="Questões">
                        <input
                          type="number"
                          value={m.numQuestoes}
                          onChange={(e) =>
                            updateMateria(
                              i,
                              'numQuestoes',
                              Number(e.target.value),
                            )
                          }
                        />
                      </Field>
                      <button
                        className={styles.btnRemove}
                        onClick={() => removeMateria(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button className={styles.btnAdd} onClick={addMateria}>
                    + Adicionar matéria
                  </button>
                </div>
              )}

              <label className={styles.checkRow} style={{ marginTop: 12 }}>
                <input
                  type="checkbox"
                  checked={form.temCurso}
                  onChange={(e) => set('temCurso', e.target.checked)}
                />
                Oferecer curso preparatório vinculado
              </label>
              {form.temCurso && (
                <div className={styles.subSection}>
                  <div className={styles.grid3}>
                    <Field label="Nome do curso">
                      <input
                        value={form.nomeCurso}
                        onChange={(e) => set('nomeCurso', e.target.value)}
                        placeholder="Ex: Preparatório SEMED 2025"
                      />
                    </Field>
                    <Field label="Carga horária">
                      <input
                        value={form.cargaCurso}
                        onChange={(e) => set('cargaCurso', e.target.value)}
                        placeholder="Ex: 40h"
                      />
                    </Field>
                    <Field label="Valor">
                      <input
                        value={form.valorCurso}
                        onChange={(e) => set('valorCurso', e.target.value)}
                        placeholder="R$ 0,00 ou Gratuito"
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 2 && (
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Professores / instrutores</div>
            <div className={styles.checkprof}>
              <input
                type="checkbox"
                checked={form.temProfessor}
                onChange={(e) => set('temProfessor', e.target.checked)}
                onClick={() => setTemProfessor((prev) => !prev)}
              />
              Tem Professor?
            </div>
            {temprofessor === true && (
              <>
                {form.professores.map((p, i) => (
                  <div key={i} className={styles.profCard}>
                    <div className={styles.grid3}></div>
                    <div className={styles.profPhotoRow}>
                      <div className={styles.uploadBox}>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,.psd"
                          onChange={(e) =>
                            e.target.files &&
                            handleFotoProf(i, e.target.files[0])
                          }
                        />
                        {p.fotoBase64 ? (
                          <img
                            src={p.fotoBase64}
                            alt="foto"
                            className={styles.profThumb}
                          />
                        ) : (
                          <span className={styles.uploadHint}>📷 Foto</span>
                        )}
                      </div>
                      <Field
                        label="Ou link do Drive da foto"
                        style={{ flex: 1 }}
                      >
                        <input
                          type="url"
                          value={p.linkDrive || ''}
                          onChange={(e) =>
                            updateProf(i, 'linkDrive', e.target.value)
                          }
                          placeholder="https://drive.google.com/..."
                        />
                      </Field>
                      <button
                        className={styles.btnRemove}
                        onClick={() => removeProf(i)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button className={styles.btnAdd} onClick={addProf}>
                  + Adicionar professor
                </button>
              </>
            )}
          </div>
        )}

        {tab === 3 && (
          <>
            <div className={styles.card}>
              <div className={styles.sectionTitle}>Identidade visual</div>
              <div className={styles.grid2}>
                <Field label="Cor principal">
                  <input
                    type="color"
                    value={form.corPrincipal}
                    onChange={(e) => set('corPrincipal', e.target.value)}
                    style={{ height: 36 }}
                  />
                </Field>
                <Field label="Cor de destaque">
                  <input
                    type="color"
                    value={form.corDestaque}
                    onChange={(e) => set('corDestaque', e.target.value)}
                    style={{ height: 36 }}
                  />
                </Field>
              </div>
              <div className={styles.grid2}>
                <Field label="Estilo">
                  <select
                    value={form.estilo}
                    onChange={(e) => set('estilo', e.target.value)}
                  >
                    <option value="">Selecionar...</option>
                    {ESTILOS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Formato">
                  <select
                    value={form.formato}
                    onChange={(e) => set('formato', e.target.value)}
                  >
                    {FORMATOS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Logo do órgão">
                <div
                  className={styles.uploadBox}
                  style={{ width: '100%', height: 80 }}
                >
                  <input
                    type="file"
                    ref={logoRef}
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleLogo(e.target.files[0])
                    }
                  />
                  {form.logoBase64 ? (
                    <img
                      src={form.logoBase64}
                      alt="logo"
                      style={{
                        maxHeight: 60,
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <span className={styles.uploadHint}>
                      🏛️ Clique para enviar logo
                    </span>
                  )}
                </div>
              </Field>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitle}> Adicionais </div>
              <Field label="Observações no rodapé" style={{ marginTop: 10 }}>
                <textarea
                  value={form.obsRodape}
                  onChange={(e) => set('obsRodape', e.target.value)}
                  placeholder="Ex: Concurso regido pelo Edital nº 001/2025..."
                />
              </Field>
            </div>
          </>
        )}

        <div className={styles.footerBtns}>
          {tab > 0 && (
            <button className={styles.btnSecondary} onClick={() => navTab(-1)}>
              ← Voltar
            </button>
          )}
          {tab < 3 && (
            <button className={styles.btnPrimary} onClick={() => navTab(1)}>
              Próximo →
            </button>
          )}
          {tab === 3 && (
            <button
              className={styles.btnPrimary}
              onClick={handleGerar}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner} /> : '✦'} Gerar e
              exportar flyer
            </button>
          )}
        </div>

        {status.type !== 'idle' && (
          <div className={`${styles.statusBar} ${styles[status.type]}`}>
            {status.type === 'loading' && <span className={styles.spinner} />}
            {status.msg}
          </div>
        )}

        {resultado && (
          <div className={styles.card} style={{ marginTop: '1rem' }}>
            <div className={styles.sectionTitle}>Preview do flyer</div>
            <img
              src={`data:image/png;base64,${resultado.pngBase64}`}
              alt="Flyer gerado"
              style={{
                width: '100%',
                borderRadius: 8,
                border: '0.5px solid var(--color-border-tertiary)',
              }}
            />
            <a
              href={resultado.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.driveLink}
            >
              ↗ Abrir no Google Drive
            </a>
          </div>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="field"
      style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}
    >
      <label
        style={{
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
