export interface Vaga {
  cargo: string
  numVagas: number
  salario: string
}

export interface Materia {
  nome: string
  numQuestoes: number
}

export interface Professor {
  nome: string
  especialidade: string
  titulacao: string
  fotoBase64?: string
  linkDrive?: string
}

export interface FlyerFormData {
  nomeConc: string
  orgao: string
  dtAbertura: string
  dtEncerramento: string
  dtProva: string
  modalidade: string
  taxa: string
  site: string
  nivelMin: string
  areaFormacao: string
  dtSimulado: string
  temProfessor: boolean
  tituloPersonalizado?: string
  programacaoExcel?: File  
  dtEvento?: string 
  hrAplicacao?: string
  hrCorrecao?: string
  imagemEbookBase64?: string
  tipoEventoOutro?: string 
  vertical: string;
  subVertical?: string;  
  tipoEvento: string;

  vagas: Vaga[]
  temProg: boolean
  materias: Materia[]
  temCurso: boolean
  nomeCurso: string
  cargaCurso: string
  valorCurso: string

  professores: Professor[]

  corPrincipal: string
  corDestaque: string
  estilo: string
  formato: string
  fraseDestaque: string
  obsRodape: string
  logoBase64?: string
}

export interface FlyerResponse {
  pngBase64: string
  driveUrl: string
  htmlContent: string
}