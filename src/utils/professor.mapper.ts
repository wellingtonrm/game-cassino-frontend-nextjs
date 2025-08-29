import { Professor as ApiProfessor } from '@/types';

export interface ProfessorTable {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  materias: string[];
  foto?: string;
  horasSemanais: number;
  dataCadastro?: Date;
  ultimaAtualizacao?: Date;
}

export const mapApiProfessorToTable = (professor: ApiProfessor): ProfessorTable => {
  return {
    id: professor.id,
    nome: professor.name,
    email: professor.account?.email || '',
    telefone: professor.telefone || '',
    materias: [], // Inicializa vazio, pode ser preenchido posteriormente
    horasSemanais: 0, // Valor padrão, pode ser ajustado conforme necessário
    dataCadastro: new Date(), // Pode ser ajustado se a API fornecer essa informação
    ultimaAtualizacao: new Date() // Pode ser ajustado se a API fornecer essa informação
  };
};

export const mapApiProfessoresToTable = (professores: ApiProfessor[]): ProfessorTable[] => {
  return professores.map(mapApiProfessorToTable);
};
