import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  Filter,
  Plus,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  X,
} from 'lucide-react';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAcademicRecords } from '../hooks/useAcademicRecords';
import type {
  AcademicRecord,
  AcademicRecordType,
  CreateAcademicRecordData,
} from '../types/academicRecord';

const initialForm = {
  activity: '',
  subject: '',
  result: '',
  maxScore: '10',
  date: new Date().toISOString().split('T')[0],
  type: 'test' as AcademicRecordType,
  notes: '',
};

const typeLabels: Record<AcademicRecordType, string> = {
  test: 'Prova',
  assignment: 'Trabalho',
  presentation: 'Apresentação',
  project: 'Projeto',
};

const typeColors: Record<AcademicRecordType, string> = {
  test: 'bg-primary/20 text-primary',
  assignment: 'bg-secondary/20 text-secondary',
  presentation: 'bg-purple-500/20 text-purple-700',
  project: 'bg-orange-500/20 text-orange-700',
};

function normalizeScore(record: AcademicRecord) {
  if (!record.maxScore) {
    return 0;
  }

  return (record.result / record.maxScore) * 10;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

export function PerformancePage() {
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const userId = user?.id;
  const {
    records,
    isLoading,
    error: pageError,
    setError: setPageError,
    addRecord,
    removeRecord,
  } = useAcademicRecords(userId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSubject, setFilterSubject] = useState('all');
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const subjects = useMemo(
    () => Array.from(new Set(records.map((record) => record.subject))).sort(),
    [records]
  );

  const filteredRecords = useMemo(
    () =>
      filterSubject === 'all'
        ? records
        : records.filter((record) => record.subject === filterSubject),
    [filterSubject, records]
  );

  const chartRecords = useMemo(
    () =>
      [...records].reverse().map((record) => ({
        id: record.id,
        label: record.subject,
        value: normalizeScore(record),
        title: `${record.subject}: ${normalizeScore(record).toFixed(1)}`,
      })),
    [records]
  );

  const averageScore = useMemo(() => {
    if (!records.length) {
      return 0;
    }

    return (
      records.reduce((acc, record) => acc + normalizeScore(record), 0) /
      records.length
    );
  }, [records]);

  const bestScore = useMemo(() => {
    if (!records.length) {
      return 0;
    }

    return Math.max(...records.map(normalizeScore));
  }, [records]);

  const monthEvolution = useMemo(() => {
    if (records.length < 2) {
      return 0;
    }

    const sorted = [...records].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return normalizeScore(sorted[sorted.length - 1]) - normalizeScore(sorted[0]);
  }, [records]);

  async function handleAddPerformance() {
    if (!userId) {
      setFormError('Faça login para registrar um desempenho.');
      return;
    }

    const result = Number(formData.result);
    const maxScore = Number(formData.maxScore);

    if (!formData.activity.trim() || !formData.subject.trim() || Number.isNaN(result)) {
      setFormError('Informe atividade, disciplina e nota obtida.');
      return;
    }

    if (Number.isNaN(maxScore) || maxScore <= 0) {
      setFormError('Informe uma nota máxima válida.');
      return;
    }

    const payload: CreateAcademicRecordData = {
      userId,
      activity: formData.activity.trim(),
      subject: formData.subject.trim(),
      result,
      maxScore,
      date: formData.date,
      type: formData.type,
      notes: formData.notes.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      setFormError('');

      await addRecord(payload);
      setShowAddForm(false);
      setFormData(initialForm);
      showSuccess('Desempenho salvo com sucesso.');
    } catch (error) {
      console.error(error);
      setFormError('Não foi possível salvar o desempenho.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteRecord(recordId: string) {
    if (!userId) {
      setPageError('Faça login para excluir um registro.');
      return;
    }

    try {
      await removeRecord(recordId);
      showSuccess('Registro excluído com sucesso.');
    } catch (error) {
      console.error(error);
      setPageError('Não foi possível excluir o registro.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 flex items-center gap-3 text-3xl">
            <TrendingUp className="h-8 w-8 text-primary" />
            Evolução de Desempenho
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso acadêmico e identifique padrões de evolução.
          </p>
        </div>
        <Button onClick={() => setShowAddForm((isOpen) => !isOpen)}>
          {showAddForm ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {showAddForm ? 'Fechar' : 'Adicionar Desempenho'}
        </Button>
      </div>

      {pageError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <span>{pageError}</span>
        </div>
      )}

      {showAddForm && (
        <Card className="mb-6" title="Novo Desempenho" icon={<Plus className="h-5 w-5" />}>
          {formError && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome da Atividade"
              placeholder="Ex: Prova de Matemática"
              value={formData.activity}
              onChange={(event) =>
                setFormData({ ...formData, activity: event.target.value })
              }
            />
            <Input
              label="Disciplina"
              placeholder="Ex: Matemática"
              value={formData.subject}
              onChange={(event) =>
                setFormData({ ...formData, subject: event.target.value })
              }
            />
            <Input
              label="Nota Obtida"
              type="number"
              placeholder="9.5"
              step="0.1"
              value={formData.result}
              onChange={(event) =>
                setFormData({ ...formData, result: event.target.value })
              }
            />
            <Input
              label="Nota Máxima"
              type="number"
              placeholder="10"
              step="0.1"
              value={formData.maxScore}
              onChange={(event) =>
                setFormData({ ...formData, maxScore: event.target.value })
              }
            />
            <Input
              label="Data"
              type="date"
              value={formData.date}
              onChange={(event) =>
                setFormData({ ...formData, date: event.target.value })
              }
            />
            <div>
              <label className="mb-2 block text-sm text-foreground">
                Tipo
              </label>
              <select
                className="w-full rounded-lg border border-input bg-input-background px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.type}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    type: event.target.value as AcademicRecordType,
                  })
                }
              >
                <option value="test">Prova</option>
                <option value="assignment">Trabalho</option>
                <option value="presentation">Apresentação</option>
                <option value="project">Projeto</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-foreground">
              Observações (opcional)
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-input bg-input-background px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="Adicione observações sobre esta atividade..."
              value={formData.notes}
              onChange={(event) =>
                setFormData({ ...formData, notes: event.target.value })
              }
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPerformance} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </Card>
      )}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Target className="h-6 w-6 text-primary" />}
          iconClassName="bg-primary/20"
          value={averageScore.toFixed(1)}
          label="Média Geral"
        />
        <StatCard
          icon={<Trophy className="h-6 w-6 text-secondary" />}
          iconClassName="bg-secondary/20"
          value={bestScore.toFixed(1)}
          label="Melhor Nota"
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-orange-600" />}
          iconClassName="bg-orange-500/20"
          value={String(records.length)}
          label="Atividades"
        />
        <StatCard
          icon={<Star className="h-6 w-6 text-purple-600" />}
          iconClassName="bg-purple-500/20"
          value={`${monthEvolution >= 0 ? '+' : ''}${monthEvolution.toFixed(1)}`}
          label="Evolução"
        />
      </section>

      <div className="mb-6">
        <Card
          title="Desempenho por Disciplina"
          icon={<BarChart3 className="h-5 w-5" />}
        >
          {chartRecords.length === 0 ? (
            <EmptyState text="Nenhum desempenho registrado ainda." />
          ) : (
            <div className="px-2 pb-2 pt-3">
              <div className="grid grid-cols-[44px_1fr] gap-3">
                <div className="relative h-[300px] text-sm text-muted-foreground">
                  <span className="absolute right-1 top-0 -translate-y-1/2">10</span>
                  <span className="absolute right-1 top-[35%] -translate-y-1/2">6</span>
                  <span className="absolute right-1 top-[70%] -translate-y-1/2">3</span>
                  <span className="absolute bottom-0 right-1 translate-y-1/2">0</span>
                </div>

                <div className="overflow-x-auto pb-8">
                  <div
                    className="min-w-full"
                    style={{
                      width: `${Math.max(chartRecords.length * 68 + 32, 520)}px`,
                    }}
                  >
                    <div className="relative h-[300px] border-b border-l border-muted-foreground/50">
                      <div className="absolute inset-0 grid grid-rows-[0.35fr_0.35fr_0.3fr]">
                        <div className="border-t border-dashed border-border" />
                        <div className="border-t border-dashed border-border" />
                        <div className="border-t border-dashed border-border" />
                      </div>

                      <div className="absolute inset-x-4 bottom-0 top-0 flex items-end justify-start gap-3">
                        {chartRecords.map((item) => (
                          <div
                            key={item.id}
                            className="flex h-full w-14 flex-shrink-0 flex-col items-center justify-end"
                          >
                            <div
                              className="w-full rounded-t-lg bg-emerald-500"
                              style={{ height: `${Math.min(item.value * 10, 100)}%` }}
                              title={item.title}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7 flex justify-start gap-3 px-4">
                      {chartRecords.map((item) => (
                        <span
                          key={item.id}
                          className="w-14 flex-shrink-0 -rotate-45 text-right text-sm text-muted-foreground"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-2 text-sm text-emerald-600">
                <span className="h-3 w-3 bg-emerald-500" />
                Média
              </div>
            </div>
          )}
        </Card>

      </div>

      <Card title="Histórico de Atividades" icon={<Calendar className="h-5 w-5" />}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="rounded-lg border border-input bg-input-background px-4 py-2 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterSubject}
              onChange={(event) => setFilterSubject(event.target.value)}
            >
              <option value="all">Todas as disciplinas</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-muted-foreground sm:ml-auto">
            {filteredRecords.length}{' '}
            {filteredRecords.length === 1 ? 'atividade' : 'atividades'}
          </span>
        </div>

        {isLoading ? (
          <EmptyState text="Carregando desempenhos..." />
        ) : filteredRecords.length === 0 ? (
          <EmptyState text="Nenhuma atividade encontrada para o filtro atual." />
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => {
              const percentage = (record.result / record.maxScore) * 100;
              const isExcellent = percentage >= 90;
              const isGood = percentage >= 70 && percentage < 90;

              return (
                <article
                  key={record.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-accent/30 p-4 transition-all hover:border-primary/30 sm:flex-row sm:items-center"
                >
                  <div
                    className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg ${
                      isExcellent
                        ? 'bg-secondary/20 text-secondary'
                        : isGood
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Award className="h-7 w-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h4>{record.activity}</h4>
                      <span className={`rounded-full px-2 py-1 text-xs ${typeColors[record.type]}`}>
                        {typeLabels[record.type]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{record.subject}</span>
                      <span>•</span>
                      <span>{formatDate(record.date)}</span>
                    </div>
                    {record.notes && (
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        "{record.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p
                        className={`text-3xl ${
                          isExcellent
                            ? 'text-secondary'
                            : isGood
                              ? 'text-primary'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {record.result.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        de {record.maxScore}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>
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
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconClassName}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
