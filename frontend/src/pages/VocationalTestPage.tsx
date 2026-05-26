import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  FileText,
  Lightbulb,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import {
  createVocationalTest,
  deleteVocationalTest,
  listVocationalTests,
} from '../services/vocationalTestService';
import type { VocationalTestType } from '../types/vocationalTest';

type ViewType = 'home' | 'taking-test' | 'viewing-result';
const historyPageSize = 4;

const questions = [
  {
    question: 'Qual dessas atividades voce mais gosta de fazer no tempo livre?',
    options: [
      'Resolver problemas de logica e quebra-cabecas',
      'Criar arte, musica, texto ou design',
      'Conversar, orientar ou ajudar pessoas',
      'Realizar experimentos ou observar a natureza',
      'Praticar atividades fisicas ou executar tarefas praticas',
    ],
  },
  {
    question: 'Em um trabalho em grupo, qual papel voce prefere assumir?',
    options: [
      'Analisar dados e organizar a solucao',
      'Propor ideias novas e caminhos criativos',
      'Mediar conversas e manter o grupo alinhado',
      'Pesquisar informacoes para embasar decisoes',
      'Colocar o plano em pratica com agilidade',
    ],
  },
  {
    question: 'Qual tipo de desafio te motiva mais?',
    options: [
      'Resolver um problema matematico ou tecnologico',
      'Desenvolver um projeto original',
      'Ajudar alguem a superar uma dificuldade',
      'Entender como algo funciona em profundidade',
      'Competir, produzir e alcancar metas concretas',
    ],
  },
  {
    question: 'Como voce prefere aprender algo novo?',
    options: [
      'Com exercicios logicos e passo a passo',
      'Experimentando formatos visuais e criativos',
      'Conversando e trocando experiencias',
      'Pesquisando causas, evidencias e teorias',
      'Fazendo na pratica ate dominar',
    ],
  },
  {
    question: 'O que mais te deixa satisfeito em uma atividade?',
    options: [
      'Encontrar a solucao mais eficiente',
      'Ver uma ideia ganhar forma',
      'Perceber impacto positivo nas pessoas',
      'Descobrir uma explicacao para um fenomeno',
      'Entregar um resultado visivel',
    ],
  },
  {
    question: 'Qual area escolar mais chama sua atencao?',
    options: [
      'Matematica, fisica ou tecnologia',
      'Artes, literatura ou comunicacao',
      'Historia, sociologia ou filosofia',
      'Biologia, quimica ou ciencias',
      'Educacao fisica, oficinas ou projetos manuais',
    ],
  },
  {
    question: 'Quando surge um problema, o que voce tende a fazer primeiro?',
    options: [
      'Separar as variaveis e comparar possibilidades',
      'Imaginar uma solucao diferente do comum',
      'Ouvir as pessoas envolvidas',
      'Pesquisar referencias confiaveis',
      'Agir, testar e ajustar rapidamente',
    ],
  },
  {
    question: 'O que voce mais valoriza em uma carreira?',
    options: [
      'Desafios intelectuais constantes',
      'Liberdade para criar e inovar',
      'Contribuir diretamente com pessoas',
      'Investigar, descobrir e aprender sempre',
      'Resultados concretos e rotina dinamica',
    ],
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function toCreateAnswers(answers: number[]) {
  return answers.map((answer, index) => ({
    questionId: String(index),
    answer,
  }));
}

export function VocationalTestPage() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedHistoryTest, setSelectedHistoryTest] =
    useState<VocationalTestType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(undefined)
  );
  const [testHistory, setTestHistory] = useState<VocationalTestType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState('');
  const [historyPage, setHistoryPage] = useState(0);

  const latestTest = testHistory[0];
  const userId = user?.id;
  const maxHistoryPage = Math.max(
    Math.ceil(testHistory.length / historyPageSize) - 1,
    0
  );
  const visibleHistoryTests = testHistory.slice(
    historyPage * historyPageSize,
    historyPage * historyPageSize + historyPageSize
  );

  async function loadTests() {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setPageError('');
      const data = await listVocationalTests(userId);
      setTestHistory(data);
    } catch (error) {
      console.error(error);
      setPageError('Nao foi possivel carregar seus testes vocacionais.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTests();
  }, [userId]);

  useEffect(() => {
    if (historyPage > maxHistoryPage) {
      setHistoryPage(maxHistoryPage);
    }
  }, [historyPage, maxHistoryPage]);

  const selectedOption = answers[currentQuestion];
  const progress = useMemo(
    () => ((currentQuestion + 1) / questions.length) * 100,
    [currentQuestion]
  );

  function handleAnswer(optionIndex: number) {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  }

  async function finishTest(testAnswers: number[]) {
    if (!userId) {
      setPageError('Faca login para salvar o teste vocacional.');
      setCurrentView('home');
      return;
    }

    try {
      setIsSubmitting(true);
      setPageError('');

      const createdTest = await createVocationalTest({
        userId,
        answers: toCreateAnswers(testAnswers),
      });

      setTestHistory((history) => [createdTest, ...history]);
      setSelectedHistoryTest(createdTest);
      setCurrentView('viewing-result');
    } catch (error) {
      console.error(error);
      setPageError('Nao foi possivel salvar o teste. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    if (selectedOption === undefined || isSubmitting) {
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((question) => question + 1);
      return;
    }

    finishTest(answers);
  }

  function handlePrevious() {
    setCurrentQuestion((question) => Math.max(question - 1, 0));
  }

  function handleStartNewTest() {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(undefined));
    setSelectedHistoryTest(null);
    setCurrentView('taking-test');
  }

  function handleViewTestResult(test: VocationalTestType) {
    setSelectedHistoryTest(test);
    setCurrentView('viewing-result');
  }

  async function handleDeleteTest(testId: string) {
    if (!userId || !confirm('Tem certeza que deseja excluir este teste?')) {
      return;
    }

    try {
      await deleteVocationalTest(testId, userId);
      setTestHistory((history) => history.filter((test) => test.id !== testId));
      setSelectedHistoryTest((test) => (test?.id === testId ? null : test));
      setCurrentView('home');
    } catch (error) {
      console.error(error);
      setPageError('Nao foi possivel excluir o teste.');
    }
  }

  function handleBackToHome() {
    setCurrentView('home');
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(undefined));
    setSelectedHistoryTest(null);
  }

  if (currentView === 'taking-test') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <Card>
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="mb-1 text-2xl">Teste Vocacional</h2>
                  <p className="text-sm text-muted-foreground">
                    Questao {currentQuestion + 1} de {questions.length}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBackToHome}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-6 text-xl">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(index)}
                    className={`w-full rounded-lg border-2 p-5 text-left transition-all ${
                      selectedOption === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-accent/20 hover:border-primary/50 hover:bg-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                          selectedOption === index
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30'
                        }`}
                      >
                        {selectedOption === index && (
                          <div className="h-3 w-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                <div className="hidden gap-2 sm:flex">
                  {questions.map((question, index) => (
                    <div
                      key={question.question}
                      className={`h-2 rounded-full transition-all ${
                        index === currentQuestion
                          ? 'w-6 bg-primary'
                          : index < currentQuestion
                            ? 'w-2 bg-primary/60'
                            : 'w-2 bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <Button onClick={handleNext} disabled={selectedOption === undefined || isSubmitting}>
                  {currentQuestion === questions.length - 1
                    ? isSubmitting
                      ? 'Salvando...'
                      : 'Finalizar'
                    : 'Proxima'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Nao existem respostas certas ou erradas. Responda com honestidade.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'viewing-result' && selectedHistoryTest) {
    const isNewTest = selectedHistoryTest.id === latestTest?.id;

    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={handleBackToHome} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao inicio
          </Button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Award className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl">
                  {isNewTest ? 'Teste concluido' : 'Detalhes do teste'}
                </h1>
                <p className="text-muted-foreground">
                  Realizado em {formatDate(selectedHistoryTest.date)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleStartNewTest}>
                Fazer novo teste
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteTest(selectedHistoryTest.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        </div>

        {isNewTest && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span>Seu teste foi concluido e salvo no historico.</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-primary/20 bg-primary/5">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-primary">
                  <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-2xl">Perfil principal</h2>
                  <p className="mb-6 text-muted-foreground">
                    {selectedHistoryTest.result?.primaryLabel ||
                      'Resultado registrado para analise futura.'}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoTile
                      icon={<FileText className="h-5 w-5 text-primary" />}
                      label="Perguntas respondidas"
                      value={String(selectedHistoryTest.totalQuestions)}
                    />
                    <InfoTile
                      icon={<Calendar className="h-5 w-5 text-secondary" />}
                      label="Data de realizacao"
                      value={formatDate(selectedHistoryTest.date)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Afinidade por area" icon={<TrendingUp className="h-5 w-5" />}>
              <div className="space-y-4">
                {selectedHistoryTest.result?.scores.map((score) => (
                  <div key={score.area}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span>{score.label}</span>
                      <span className="text-muted-foreground">{score.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${score.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="Proximos passos" icon={<Lightbulb className="h-5 w-5" />}>
              <div className="space-y-3 text-sm">
                {[
                  'Converse com o Mentor IA usando este resultado.',
                  'Registre interesses relacionados no diario.',
                  'Procure eventos ligados a sua area principal.',
                  'Refaca o teste depois de novas experiencias.',
                ].map((step, index) => (
                  <div key={step} className="rounded-lg bg-accent/30 p-3">
                    <span className="mr-2 text-primary">{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Informacoes" icon={<FileText className="h-5 w-5" />}>
              <div className="space-y-3 text-sm">
                <InfoRow label="Status" value="Completo" />
                <InfoRow label="Perguntas" value={String(selectedHistoryTest.totalQuestions)} />
                <InfoRow label="Data" value={formatDate(selectedHistoryTest.date)} />
              </div>
            </Card>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <ClipboardList className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl">Teste Vocacional</h1>
            <p className="text-muted-foreground">
              Descubra suas aptidoes e areas de interesse profissional.
            </p>
          </div>
        </div>
      </div>

      {pageError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <span>{pageError}</span>
        </div>
      )}

      {!userId && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <span>Visualizacao liberada, mas e preciso login para salvar o historico.</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <Card className="border-primary/20 bg-primary/5">
            <div className="flex flex-col gap-8 p-2 sm:flex-row sm:items-start">
              <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl bg-primary">
                <Sparkles className="h-16 w-16 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="mb-5 text-3xl">Realizar novo teste</h2>
                <p className="mb-8 text-muted-foreground">
                  Responda 8 perguntas rapidas para descobrir suas principais areas de aptidao.
                  O teste leva poucos minutos e o resultado fica salvo no seu historico.
                </p>

                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <InfoTile
                    icon={<FileText className="h-7 w-7 text-primary" />}
                    label="8 perguntas"
                    value="Multipla escolha"
                  />
                  <InfoTile
                    icon={<Clock className="h-7 w-7 text-secondary" />}
                    label="Aproximadamente 3 minutos"
                    value="Resultado imediato"
                  />
                </div>

                <Button size="lg" onClick={handleStartNewTest}>
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Comecar teste agora
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl">O que voce descobrira?</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  'Suas areas de maior afinidade profissional.',
                  'Percentuais por perfil de interesse.',
                  'Historico para comparar sua evolucao.',
                  'Dados para futuras recomendacoes do Mentor IA.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg leading-none text-primary">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/20">
                  <Lightbulb className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl">Dica importante</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  'Seja honesto nas respostas e nao pense demais.',
                  'Sua primeira impressao costuma refletir melhor suas inclinacoes atuais.',
                  'Refaca o teste depois de novas experiencias ou a cada 2 meses.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg leading-none text-secondary">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <aside className="space-y-6">
          <Card
            title="Historico de testes"
            icon={<Calendar className="h-5 w-5" />}
            className="min-h-[500px]"
          >
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Carregando testes...
              </p>
            ) : testHistory.length === 0 ? (
              <div className="flex min-h-[390px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <ClipboardList className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Nenhum teste realizado ainda
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {visibleHistoryTests.map((test) => (
                  <div
                    key={test.id}
                    className="rounded-lg border border-border bg-accent/30 p-4"
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(test.date)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewTestResult(test)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTest(test.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  ))}
                </div>

                {testHistory.length > historyPageSize && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
                    <span className="text-center text-sm text-muted-foreground">
                      Pagina {historyPage + 1} de {maxHistoryPage + 1}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={historyPage === 0}
                        onClick={() =>
                          setHistoryPage((page) => Math.max(page - 1, 0))
                        }
                      >
                        Voltar Pagina
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={historyPage >= maxHistoryPage}
                        onClick={() =>
                          setHistoryPage((page) =>
                            Math.min(page + 1, maxHistoryPage)
                          )
                        }
                      >
                        Proxima Pagina
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>

          {testHistory.length > 0 && (
            <Card>
              <h4 className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Suas estatisticas
              </h4>
              <div className="space-y-4">
                <InfoTile label="Testes realizados" value={String(testHistory.length)} />
                <InfoTile label="Ultimo teste" value={formatDate(latestTest.date)} />
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

interface InfoTileProps {
  icon?: ReactNode;
  label: string;
  value: string;
}

function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-3">
        {icon}
        <h4 className="text-sm">{label}</h4>
      </div>
      <p className="text-lg text-muted-foreground">{value}</p>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
