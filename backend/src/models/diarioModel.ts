// Define a estrutura obrigatória de cada relato
export interface Relato {
  id: number;
  data: string;
  hora: string;
  texto: string;
  tags: string[];
  emoji: string;
}

// Simulação temporária do banco de dados tipada como um array de Relatos
export let bancoDeDadosRelatos: Relato[] = [];