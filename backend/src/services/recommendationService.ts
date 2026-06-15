import 'dotenv/config';
import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';
import { prisma } from '../database/prisma';

const EXPECTED_JSON_FORMAT = Object.freeze({
  status: "success",
  recommendations: [
    {
      courseName: "Nome do Curso",
      affinity: 0.95,
      reason: "Justificativa analítica baseada nos dados..."
    }
  ],
  materials: [
    {
      type: "Curso online",
      title: "Introdução à Programação",
      detail: "Fundamentos de lógica, algoritmos...",
      level: "Iniciante"
    }
  ],
  nextSteps: [
    "Pesquisar grades curriculares...",
    "Participar de palestra da área..."
  ]
});

export class RecommendationService {
  async generateRecommendation(userId: string) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const hf = new HfInference(process.env.HF_API_KEY);

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        dailyLogs: true,
        academicRecords: true,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.dailyLogs.length < 3 || profile.academicRecords.length < 2) {
      return {
        status: "insufficient_data",
        message: "Ainda não conhecemos você o suficiente! Para gerarmos uma recomendação precisa e não genérica, precisamos que você preencha mais o seu diário ou adicione mais notas das suas provas.",
        requiredActions: ["add_daily_logs", "add_academic_records"]
      };
    }

    const grades = profile.academicRecords.map(r => `${r.academicDiscipline}: ${r.score}`).join(', ');
    
    const searchIntent = `Aspirações, habilidades e relatos relacionados a: ${profile.interests.join(', ')}`;

    let similarLogsText = "";
    try {
      const queryEmbeddingResponse = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: searchIntent,
      });
      
      const queryEmbedding = queryEmbeddingResponse as number[];
      const queryEmbeddingString = JSON.stringify(queryEmbedding);

      const similarLogs = await prisma.$queryRaw<{ text: string, date: string }[]>`
        SELECT text, date 
        FROM daily_logs 
        WHERE profile_id = ${profile.id}
        ORDER BY embedding <-> ${queryEmbeddingString}::vector 
        LIMIT 10
      `;

      similarLogsText = similarLogs.map(l => `${l.date} - ${l.text}`).join('\\n');
    } catch (error) {
      console.error("Erro na busca vetorial, caindo para fallback de texto:", error);
      
      similarLogsText = profile.dailyLogs.map(l => `${l.date} - ${l.text}`).join('\\n');
    }
    
    const prompt = `Você é um orientador vocacional. Com base nos seguintes dados de um estudante do ensino médio, recomende EXATAMENTE 3 cursos superiores compatíveis. Responda ESTRITAMENTE em formato JSON seguindo este modelo exato:

${JSON.stringify(EXPECTED_JSON_FORMAT, null, 2)}

Dados do Estudante:
- Idade: ${profile.age}
- Interesses: ${profile.interests.join(', ')}
- Notas Escolares: ${grades}
- Relatos Relevantes do Diário:
${similarLogsText}
`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Você é um assistente JSON que retorna APENAS JSON válido, sem markdown.' },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const responseContent = chatCompletion.choices[0]?.message?.content;
      if (!responseContent) throw new Error("Resposta vazia do Groq");

      return JSON.parse(responseContent);
    } catch (error) {
      console.error("Erro na API do Groq:", error);
      throw new Error("Falha ao gerar a recomendação com a Inteligência Artificial.");
    }
  }
}
