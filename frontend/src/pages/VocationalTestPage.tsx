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
const answerOptions = [
  '0 Discordo totalmente',
  '1',
  '2',
  '3',
  '4',
  '5 Concordo totalmente',
];

const questions = [
  'Eu entendo melhor as coisas quando gosto da pessoa que está explicando',
  'Gosto de analisar as situações por meio de números, estatísticas e fatos concretos',
  'Na solução de um problema, é melhor partir para a prática do que ficar discutindo e analisando',
  'As pessoas me acham um bom ouvinte',
  'Gosto de registrar e manter meu material escolar organizado',
  'Sou prático e rápido nas minhas decisões',
  'Eu prefiro abrir mão da minha opinião a criar um conflito entre as pessoas',
  'Eu gosto quando posso criticar uma ideia ou processo',
  'Eu entendo melhor as coisas quando vejo sua aplicação prática',
  'Eu valorizo as críticas, sugestões e opiniões dos outros quando são ditas de maneira amigável',
  'Prefiro que me apreciem por ser uma pessoa racional do que por ser uma pessoa amiga',
  'Eu gosto de trabalhar com ferramentas e máquinas',
  'Procuro ver o lado positivo das pessoas',
  'Gosto de relacionar as causas das coisas com os seus efeitos',
  'Eu me sinto mais confortável em atividades que eu possa fazer com as minhas próprias mãos',
  'Numa discussão é mais importante, para mim, manter a harmonia entre as pessoas do que ganhar a discussão',
  'Gosto de pesquisar, analisar, classificar, calcular, estudar',
  'Numa discussão com muitas opiniões diferentes a melhor alternativa para resolver rapidamente é fazer uma votação',
  'Tenho facilidade para compreender os motivos das pessoas',
  'Prefiro analisar com detalhes antes de decidir',
  'Gosto de construir, consertar e criar coisas',
  'Eu me interesso pelo bem-estar de pessoas e animais',
  'Eu me sinto mais confortável quando tenho tempo de estudar uma situação para achar uma solução',
  'Gosto de agir, transportar, embalar, desmontar, construir, agilizar',
  'Eu não meço esforços para ajudar um amigo',
  'Gosto de ser justo, de criticar com fatos e dados, mesmo que isso desagrade as pessoas',
  'Sinto-me mais confortável lidando com coisas rotineiras e previsíveis',
  'Gosto de cuidar, aconselhar, ensinar, influenciar, encorajar',
  'Gosto de trabalhar com ideias, teorias e informação',
  'Gosto de atividades dinâmicas e com ação',
].map((question) => ({
  question,
  options: answerOptions,
}));

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function toCreateAnswers(answers: number[]) {
  return answers.map((answer, index) => ({
    questionId: String(index),
    answer,
  }));
}

function getQuestionIndicators(currentQuestion: number, totalQuestions: number) {
  const visibleCount = Math.min(5, totalQuestions);
  const halfWindow = Math.floor(visibleCount / 2);
  const start = Math.min(
    Math.max(currentQuestion - halfWindow, 0),
    totalQuestions - visibleCount
  );
  const indicators = Array.from(
    { length: visibleCount },
    (_, index) => start + index
  );

  return {
    indicators,
    hasPreviousQuestions: start > 0,
    hasNextQuestions: start + visibleCount < totalQuestions,
  };
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
      setPageError('Não foi possível carregar seus testes vocacionais.');
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
      setPageError('Faça login para salvar o teste vocacional.');
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
      setPageError('Não foi possível salvar o teste. Tente novamente.');
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
      setPageError('Não foi possível excluir o teste.');
    }
  }

  function handleBackToHome() {
    setCurrentView('home');
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(undefined));
    setSelectedHistoryTest(null);
  }

  if (currentView === 'taking-test') {
    const {
      indicators: questionIndicators,
      hasPreviousQuestions,
      hasNextQuestions,
    } = getQuestionIndicators(
      currentQuestion,
      questions.length
    );

    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <Card>
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="mb-1 text-2xl">Teste Vocacional</h2>
                  <p className="text-sm text-muted-foreground">
                    Questão {currentQuestion + 1} de {questions.length}
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

            <div className="pt-6">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex min-w-0 items-center justify-center gap-1.5">
                  {hasPreviousQuestions && (
                    <span className="px-1 text-xs text-muted-foreground">
                      ...
                    </span>
                  )}
                  {questionIndicators.map((indicator) => (
                    <span
                      key={indicator}
                      className={`h-2 rounded-full transition-all ${
                        indicator === currentQuestion
                          ? 'w-6 bg-primary'
                          : indicator < currentQuestion
                            ? 'w-2 bg-primary/60'
                            : 'w-2 bg-muted'
                      }`}
                    />
                  ))}
                  {hasNextQuestions && (
                    <span className="px-1 text-xs text-muted-foreground">
                      ...
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={selectedOption === undefined || isSubmitting}
                >
                  {currentQuestion === questions.length - 1
                    ? isSubmitting
                      ? 'Salvando...'
                      : 'Finalizar'
                    : 'Próxima'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Não existem respostas certas ou erradas. Responda com honestidade.
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
            Voltar ao início
          </Button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Award className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl">
                  {isNewTest ? 'Teste concluído' : 'Detalhes do teste'}
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
            <span>Seu teste foi concluído e salvo no histórico.</span>
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
                      'Resultado registrado para análise futura.'}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoTile
                      icon={<FileText className="h-5 w-5 text-primary" />}
                      label="Perguntas respondidas"
                      value={String(selectedHistoryTest.totalQuestions)}
                    />
                    <InfoTile
                      icon={<Calendar className="h-5 w-5 text-secondary" />}
                      label="Data de realização"
                      value={formatDate(selectedHistoryTest.date)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Afinidade por área" icon={<TrendingUp className="h-5 w-5" />}>
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
            <Card title="Próximos passos" icon={<Lightbulb className="h-5 w-5" />}>
              <div className="space-y-3 text-sm">
                {[
                  'Converse com o Mentor IA usando este resultado.',
                  'Registre interesses relacionados no diário.',
                  'Procure eventos ligados à sua área principal.',
                  'Refaça o teste depois de novas experiências.',
                ].map((step, index) => (
                  <div key={step} className="rounded-lg bg-accent/30 p-3">
                    <span className="mr-2 text-primary">{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Informações" icon={<FileText className="h-5 w-5" />}>
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
              Descubra suas aptidões e áreas de interesse profissional.
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
          <span>Visualização liberada, mas é preciso login para salvar o histórico.</span>
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
                  Responda 30 questões para descobrir suas principais áreas de aptidão.
                  O teste leva poucos minutos e o resultado fica salvo no seu histórico.
                </p>

                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <InfoTile
                    icon={<FileText className="h-7 w-7 text-primary" />}
                    label="30 questões"
                    value="Escala de concordância"
                  />
                  <InfoTile
                    icon={<Clock className="h-7 w-7 text-secondary" />}
                    label="Aproximadamente 3 minutos"
                    value="Resultado imediato"
                  />
                </div>

                <Button size="lg" onClick={handleStartNewTest}>
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Começar teste agora
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
                <h3 className="text-xl">O que você descobrirá?</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  'Suas áreas de maior afinidade profissional.',
                  'Percentuais por perfil de interesse.',
                  'Histórico para comparar sua evolução.',
                  'Dados para futuras recomendações do Mentor IA.',
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
                  'Seja honesto nas respostas e não pense demais.',
                  'Sua primeira impressão costuma refletir melhor suas inclinações atuais.',
                  'Refaça o teste depois de novas experiências ou a cada 2 meses.',
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
            title="Histórico de testes"
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
                      Página {historyPage + 1} de {maxHistoryPage + 1}
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
                        Voltar Página
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
                        Próxima Página
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
                Suas estatísticas
              </h4>
              <div className="space-y-4">
                <InfoTile label="Testes realizados" value={String(testHistory.length)} />
                <InfoTile label="Último teste" value={formatDate(latestTest.date)} />
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
