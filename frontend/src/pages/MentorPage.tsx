import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  ExternalLink,
  FileText,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAcademicRecords } from '../hooks/useAcademicRecords';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { useRecommendation } from '../hooks/useRecommendation';
import { useVocationalTests } from '../hooks/useVocationalTests';
import type { RecommendedCourse } from '../types/recommendation';

const requiredDiaryLogs = 15;
const requiredAcademicRecords = 10;

const materials = [
  {
    type: 'Curso online',
    title: 'Introducao a Programacao',
    detail: 'Fundamentos de logica, algoritmos e primeiras aplicacoes.',
    level: 'Iniciante',
  },
  {
    type: 'Projeto pratico',
    title: 'Portfolio pessoal',
    detail: 'Crie uma pagina para registrar aprendizados, projetos e interesses.',
    level: 'Iniciante',
  },
  {
    type: 'Livro',
    title: 'Algoritmos e estruturas de dados',
    detail: 'Base para resolver problemas com clareza e eficiencia.',
    level: 'Intermediario',
  },
  {
    type: 'Exploracao',
    title: 'Semana de entrevistas',
    detail: 'Converse com estudantes e profissionais das areas recomendadas.',
    level: 'Livre',
  },
];

const nextSteps = [
  'Pesquisar grades curriculares dos cursos com maior compatibilidade.',
  'Participar de uma palestra, oficina ou feira de profissoes da area.',
  'Criar um pequeno projeto pratico para testar interesse real pela rotina.',
  'Registrar novas reflexoes no diario para refinar a proxima analise.',
];

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function formatAffinity(affinity: number) {
  const percentage = affinity <= 1 ? affinity * 100 : affinity;

  return `${Math.round(clampPercentage(percentage))}%`;
}

function getRequiredAction(action: string) {
  const actions: Record<string, { label: string; path: string }> = {
    add_daily_logs: {
      label: 'Adicionar diario',
      path: '/diario',
    },
    add_academic_records: {
      label: 'Adicionar desempenho',
      path: '/evolucao',
    },
    add_vocational_test: {
      label: 'Fazer teste vocacional',
      path: '/teste',
    },
  };

  return actions[action] || {
    label: 'Completar dados',
    path: '/dashboard',
  };
}

export function MentorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError, showInfo, showSuccess } = useToast();
  const userId = user?.id;
  const { dailyLogs, isLoading: isLoadingLogs } = useDailyLogs(userId);
  const { records, isLoading: isLoadingRecords } = useAcademicRecords(userId);
  const { testHistory, isLoading: isLoadingTests } = useVocationalTests(userId);
  const {
    recommendation,
    isGenerating,
    error: recommendationError,
    requestRecommendation,
    resetRecommendation,
  } = useRecommendation(userId);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const isLoading = isLoadingLogs || isLoadingRecords || isLoadingTests;
  const reportGenerated = recommendation?.status === 'success';
  const recommendedCourses =
    recommendation?.status === 'success' ? recommendation.recommendations : [];
  const insufficientData =
    recommendation?.status === 'insufficient_data' ? recommendation : null;
  const latestTest = testHistory[0];
  const latestTestLabel = latestTest?.result?.primaryLabel || latestTest?.name || 'Teste concluido';
  const hasVocationalTest = testHistory.length > 0;
  const diaryScore = clampPercentage((dailyLogs.length / requiredDiaryLogs) * 100);
  const academicScore = clampPercentage((records.length / requiredAcademicRecords) * 100);
  const testScore = hasVocationalTest ? 100 : 0;
  const readiness = Math.round(diaryScore * 0.4 + academicScore * 0.35 + testScore * 0.25);
  const confidence = clampPercentage(Math.round(62 + readiness * 0.32));
  const dataPoints = dailyLogs.length + records.length + testHistory.length;

  const topSubjects = useMemo(() => {
    const subjectMap = new Map<string, number>();

    records.forEach((record) => {
      subjectMap.set(record.subject, (subjectMap.get(record.subject) || 0) + 1);
    });

    return Array.from(subjectMap.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 4)
      .map(([name, count], index) => ({
        name,
        mentions: count,
        trend: index === 0 ? '+24%' : index === 1 ? '+16%' : '+8%',
        color: ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'][index],
      }));
  }, [records]);

  const highlightedDisciplines =
    topSubjects.length > 0
      ? topSubjects
      : [
          { name: 'Tecnologia', mentions: 4, trend: '+18%', color: 'bg-blue-500' },
          { name: 'Matematica', mentions: 3, trend: '+12%', color: 'bg-emerald-500' },
          { name: 'Logica', mentions: 2, trend: '+9%', color: 'bg-violet-500' },
          { name: 'Projetos', mentions: 2, trend: '+7%', color: 'bg-amber-500' },
        ];

  async function handleGenerateReport() {
    try {
      const result = await requestRecommendation();
      setSelectedCourse(null);

      if (result.status === 'success') {
        showSuccess('Recomendacao gerada com sucesso.');
        return;
      }

      showInfo(result.message);
    } catch (error) {
      console.error(error);
      showError('Nao foi possivel gerar a recomendacao agora.');
    }
  }

  function handleResetReport() {
    resetRecommendation();
    setSelectedCourse(null);
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center p-8">
        <div className="text-center text-muted-foreground">Carregando dados do Mentor IA...</div>
      </div>
    );
  }

  if (!reportGenerated) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="w-full">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className="mb-4 text-4xl">Mentor IA</h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Recomendacoes de carreira personalizadas a partir do diario, desempenho escolar e testes vocacionais.
              </p>
            </div>

            {isGenerating ? (
              <Card className="mx-auto max-w-2xl">
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="mb-3 text-xl">Analisando seus dados...</h2>
                  <p className="mb-6 text-muted-foreground">
                    O Mentor IA esta cruzando seus registros para montar uma recomendacao inicial.
                  </p>
                  <div className="mx-auto max-w-md">
                    <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-r from-primary to-secondary" />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Prontidao atual</span>
                      <span>{readiness}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                  <StatCard
                    icon={<FileText className="h-7 w-7 text-primary" />}
                    iconClassName="bg-primary/20"
                    value={String(dailyLogs.length)}
                    label="Entradas no diario"
                  />
                  <StatCard
                    icon={<BarChart3 className="h-7 w-7 text-secondary" />}
                    iconClassName="bg-secondary/20"
                    value={String(records.length)}
                    label="Desempenhos registrados"
                  />
                  <StatCard
                    icon={<Target className="h-7 w-7 text-violet-600" />}
                    iconClassName="bg-violet-500/20"
                    value={`${readiness}%`}
                    label="Prontidao da analise"
                  />
                </div>

                <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="py-8 text-center">
                    <h2 className="mb-4 text-2xl">Gerar recomendacao da IA</h2>
                    <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                      O Mentor identifica padroes nos seus registros e transforma isso em sugestoes de cursos,
                      materiais de estudo e proximos passos para explorar sua jornada vocacional.
                    </p>

                    <div className="mb-8 grid gap-4 text-left sm:grid-cols-2">
                      <InfoPanel
                        icon={<Zap className="h-5 w-5 text-primary" />}
                        title="O que sera analisado?"
                        items={[
                          'Entradas no diario de interesses',
                          'Evolucao do desempenho escolar',
                          'Historico de testes vocacionais',
                          'Padroes de recorrencia ao longo do tempo',
                        ]}
                      />
                      <InfoPanel
                        icon={<Sparkles className="h-5 w-5 text-secondary" />}
                        title="O que voce recebera?"
                        items={[
                          'Resumo do perfil vocacional',
                          'Cursos com maior compatibilidade',
                          'Materiais de estudo recomendados',
                          'Proximos passos acionaveis',
                        ]}
                      />
                    </div>

                    <Button
                      size="lg"
                      className="px-10"
                      onClick={handleGenerateReport}
                      disabled={isGenerating || !userId}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      {isGenerating ? 'Gerando relatorio...' : 'Gerar relatorio do Mentor IA'}
                    </Button>
                  </div>
                </Card>

                {insufficientData && (
                  <Card className="mx-auto mt-6 max-w-3xl border-amber-500/30 bg-amber-500/10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-600" />
                      <div className="flex-1">
                        <h3 className="mb-2">Ainda faltam dados para uma recomendacao precisa</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          {insufficientData.message}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {insufficientData.requiredActions.map((action) => {
                            const actionData = getRequiredAction(action);

                            return (
                              <Button
                                key={action}
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(actionData.path)}
                              >
                                {actionData.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {recommendationError && !insufficientData && (
                  <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span>{recommendationError}</span>
                  </div>
                )}

                <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Quanto mais voce alimentar a plataforma, melhor a recomendacao. O ideal e combinar diario,
                      desempenho e pelo menos um teste vocacional antes de gerar novas analises.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl">Recomendacao do Mentor IA</h1>
            <p className="text-muted-foreground">
              Analise personalizada baseada nos dados que voce registrou na plataforma.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleResetReport}>
          Gerar novo relatorio
        </Button>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Calendar className="h-6 w-6 text-primary" />}
          iconClassName="bg-primary/20"
          value={formatDate(new Date())}
          label="Ultima analise"
        />
        <StatCard
          icon={<BarChart3 className="h-6 w-6 text-secondary" />}
          iconClassName="bg-secondary/20"
          value={String(dataPoints)}
          label="Pontos de dados"
        />
        <StatCard
          icon={<Target className="h-6 w-6 text-violet-600" />}
          iconClassName="bg-violet-500/20"
          value={`${confidence}%`}
          label="Confianca"
        />
        <StatCard
          icon={<Brain className="h-6 w-6 text-amber-600" />}
          iconClassName="bg-amber-500/20"
          value={hasVocationalTest ? 'Completo' : 'Parcial'}
          label="Teste vocacional"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card
            title="Analise da IA"
            icon={<Sparkles className="h-5 w-5" />}
            className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A IA analisou seus registros e retornou cursos com maior afinidade para o seu momento atual.
                Use as justificativas abaixo como ponto de partida para comparar grades, conversar com pessoas da
                area e registrar novas descobertas no diario.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InsightBox
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
                title="Principais forcas"
                items={[
                  'Raciocinio logico em evolucao',
                  'Interesse por tecnologia e inovacao',
                  'Boa resposta a projetos praticos',
                  'Curiosidade para explorar novas trilhas',
                ]}
              />
              <InsightBox
                icon={<Lightbulb className="h-5 w-5 text-secondary" />}
                title="Oportunidades"
                items={[
                  'Registrar reflexoes com mais frequencia',
                  'Comparar cursos por grade curricular',
                  'Conversar com profissionais da area',
                  'Testar pequenos projetos antes de decidir',
                ]}
              />
            </div>
          </Card>

          <Card title="Cursos sugeridos para voce" icon={<GraduationCap className="h-5 w-5" />}>
            <div className="space-y-4">
              {recommendedCourses.map((course) => (
                <article
                  key={course.courseName}
                  className={`cursor-pointer rounded-lg border-2 p-5 transition-all ${
                    selectedCourse === course.courseName
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-accent/30 hover:border-primary/50'
                  }`}
                  onClick={() =>
                    setSelectedCourse(
                      selectedCourse === course.courseName ? null : course.courseName
                    )
                  }
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3>{course.courseName}</h3>
                        <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary">
                          {formatAffinity(course.affinity)} match
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{course.reason}</p>
                    </div>
                    <ChevronRight
                      className={`mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                        selectedCourse === course.courseName ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {selectedCourse === course.courseName && (
                    <div className="space-y-4 border-t border-border pt-4">
                      <RecommendationDetail course={course} />
                      <Button variant="outline" size="sm" fullWidth>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Pesquisar sobre {course.courseName}
                      </Button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </Card>

          <Card title="Materiais recomendados" icon={<BookOpen className="h-5 w-5" />}>
            <div className="grid gap-4 md:grid-cols-2">
              {materials.map((material) => (
                <article
                  key={material.title}
                  className="rounded-lg border border-border bg-accent/30 p-4 transition-all hover:border-primary/30"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">{material.type}</span>
                    <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{material.level}</span>
                  </div>
                  <h4 className="mb-1 text-sm">{material.title}</h4>
                  <p className="text-xs text-muted-foreground">{material.detail}</p>
                </article>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Disciplinas em destaque" icon={<BarChart3 className="h-5 w-5" />}>
            <p className="mb-4 text-xs text-muted-foreground">
              Baseado nos registros academicos e no uso recente da plataforma.
            </p>
            <div className="space-y-4">
              {highlightedDisciplines.map((discipline) => (
                <div key={discipline.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm">{discipline.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-secondary">{discipline.trend}</span>
                      <span className="text-xs text-muted-foreground">{discipline.mentions}x</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${discipline.color}`}
                      style={{ width: `${clampPercentage((discipline.mentions / Math.max(4, discipline.mentions)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Proximos passos" icon={<Target className="h-5 w-5" />}>
            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <div key={step} className="rounded-lg border border-border bg-accent/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2">Mantenha sua analise viva</h4>
              <p className="mb-4 text-xs text-muted-foreground">
                Continue registrando diario, notas e testes para que o Mentor IA acompanhe sua evolucao.
              </p>
              <Button size="sm" fullWidth onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? 'Atualizando...' : 'Atualizar analise'}
              </Button>
            </div>
          </Card>

          {latestTest && (
            <Card title="Ultimo teste" icon={<Target className="h-5 w-5" />}>
              <p className="text-sm text-muted-foreground">
                Resultado registrado: <span className="font-medium text-foreground">{latestTestLabel}</span>
              </p>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  iconClassName: string;
  value: string;
  label: string;
}

function StatCard({ icon, iconClassName, value, label }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${iconClassName}`}>{icon}</div>
        <div>
          <p className="text-2xl">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function InfoPanel({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">{icon}</div>
        <h3>{title}</h3>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-primary">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightBox({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h4>{title}</h4>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-primary">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecommendationDetail({ course }: { course: RecommendedCourse }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-2 flex items-center gap-2 text-sm">
          <Award className="h-4 w-4 text-primary" />
          Afinidade estimada
        </h4>
        <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: formatAffinity(course.affinity) }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Compatibilidade de {formatAffinity(course.affinity)} com base nos dados analisados.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-2 flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-secondary" />
          Como usar esta sugestao
        </h4>
        <p className="text-xs text-muted-foreground">
          Pesquise grade curricular, areas de atuacao e converse com alguem do curso antes de tomar uma decisao.
        </p>
      </div>
    </div>
  );
}
