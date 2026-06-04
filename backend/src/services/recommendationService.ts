import { PrismaClient } from '@prisma/client';
import Groq from 'groq-sdk';
import { HfInference } from '@huggingface/inference';

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// Inicialização do HuggingFace (gratuito) para embeddings
// Se a chave não for fornecida, ele ainda consegue fazer algumas requisições anônimas.
const hf = new HfInference(process.env.HF_API_KEY);

// Formato JSON esperado (Congelado para evitar mutações acidentais ou propositais no código)
const EXPECTED_JSON_FORMAT = Object.freeze({
  status: "success",
  recommendations: [
    {
      courseName: "Nome do Curso",
      affinity: 0.95,
      reason: "Justificativa analítica baseada nos dados..."
    }
  ]
});

export class RecommendationService {
  async generateRecommendation(userId: string) {
    // 1. Get user profile
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

    // 2. Cold Start Verification
    // Regra: Pelo menos 3 logs de diário e 2 registros acadêmicos para gerar recomendação
    if (profile.dailyLogs.length < 3 || profile.academicRecords.length < 2) {
      return {
        status: "insufficient_data",
        message: "Ainda não conhecemos você o suficiente! Para gerarmos uma recomendação precisa e não genérica, precisamos que você preencha mais o seu diário ou adicione mais notas das suas provas.",
        requiredActions: ["add_daily_logs", "add_academic_records"]
      };
    }

    // 3. Busca RAG (Vector Search) no Supabase pgvector
    const grades = profile.academicRecords.map(r => `${r.academicDiscipline}: ${r.score}`).join(', ');
    
    // Constrói uma query baseada nos interesses e contexto geral do aluno
    const searchIntent = `Aspirações, habilidades e relatos relacionados a: ${profile.interests.join(', ')}`;

    let similarLogsText = "";
    try {
      const queryEmbeddingResponse = await hf.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        inputs: searchIntent,
      });
      
      const queryEmbedding = queryEmbeddingResponse as number[];

      // Busca os 10 relatos mais relevantes do diário deste perfil
      const similarLogs = await prisma.$queryRaw<{ text: string, date: string }[]>`
        SELECT text, date 
        FROM daily_logs 
        WHERE profile_id = ${profile.id}
        ORDER BY embedding <-> ${queryEmbedding}::vector 
        LIMIT 10
      `;

      similarLogsText = similarLogs.map(l => `${l.date} - ${l.text}`).join('\\n');
    } catch (error) {
      console.error("Erro na busca vetorial, caindo para fallback de texto:", error);
      // Fallback pegando os textos diretamente caso o embedding ou query falhem
      similarLogsText = profile.dailyLogs.map(l => `${l.date} - ${l.text}`).join('\\n');
    }
    
    // A variável prompt usa a constante congelada para o exemplo JSON.
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
