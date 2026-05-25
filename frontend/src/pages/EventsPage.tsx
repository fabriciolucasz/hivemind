import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from '../services/eventService';
import type { EventCategory, EventType } from '../types/event';

const userId = '123';
const eventsPageSize = 6;

const initialForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  type: 'other' as EventCategory,
  description: '',
  isAttending: false,
  notes: '',
  rating: 0,
};

const typeLabels: Record<EventCategory, string> = {
  fair: '🎪 Feira',
  workshop: '🛠️ Workshop',
  lecture: '🎤 Palestra',
  visit: '🏛️ Visita',
  other: '📅 Outro',
};

const typeColors: Record<EventCategory, string> = {
  fair: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
  workshop: 'bg-orange-500/15 text-orange-700 border-orange-500/30',
  lecture: 'bg-primary/15 text-primary border-primary/30',
  visit: 'bg-secondary/15 text-secondary border-secondary/30',
  other: 'bg-muted text-muted-foreground border-border',
};

const typeDots: Record<EventCategory, string> = {
  fair: 'bg-purple-500',
  workshop: 'bg-orange-500',
  lecture: 'bg-primary',
  visit: 'bg-secondary',
  other: 'bg-muted-foreground',
};

function getEventType(event: EventType): EventCategory {
  return event.type || 'other';
}

function getEventDate(event: EventType) {
  return new Date(event.date);
}

function hasEventPassed(event: EventType, referenceDate: Date) {
  return getEventDate(event) < referenceDate;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function toDateInputValue(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

function toTimeInputValue(date: string) {
  return new Date(date).toTimeString().slice(0, 5);
}

function toIsoDate(date: string, time: string) {
  return new Date(`${date}T${time || '00:00'}`).toISOString();
}

function truncateText(text = '', maxLength = 150) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

function isSameWeek(date: Date, reference: Date) {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return date >= start && date < end;
}

function getCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

export function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [pastPage, setPastPage] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');

  async function loadEvents() {
    try {
      setPageError('');
      const data = await getEvents(userId);
      setEvents(data);
    } catch (error) {
      console.error(error);
      setPageError('Nao foi possivel carregar os eventos.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  const today = useMemo(() => {
    const start = new Date(currentDateTime);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [currentDateTime]);

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => !hasEventPassed(event, currentDateTime))
        .sort((a, b) => getEventDate(a).getTime() - getEventDate(b).getTime()),
    [currentDateTime, events],
  );

  const pastEvents = useMemo(
    () =>
      events
        .filter((event) => hasEventPassed(event, currentDateTime))
        .sort((a, b) => getEventDate(b).getTime() - getEventDate(a).getTime()),
    [currentDateTime, events],
  );

  const maxUpcomingPage = Math.max(Math.ceil(upcomingEvents.length / eventsPageSize) - 1, 0);
  const visibleUpcomingEvents = upcomingEvents.slice(
    upcomingPage * eventsPageSize,
    upcomingPage * eventsPageSize + eventsPageSize,
  );
  const maxPastPage = Math.max(Math.ceil(pastEvents.length / eventsPageSize) - 1, 0);
  const visiblePastEvents = pastEvents.slice(
    pastPage * eventsPageSize,
    pastPage * eventsPageSize + eventsPageSize,
  );
  const attendedCount = events.filter(
    (event) => event.isAttending || hasEventPassed(event, currentDateTime),
  ).length;
  const weekCount = upcomingEvents.filter((event) =>
    isSameWeek(getEventDate(event), new Date()),
  ).length;
  const calendarDays = getCalendarDays(currentMonth);
  const isEditingPastEvent =
    editingEvent !== null && hasEventPassed(editingEvent, currentDateTime);

  useEffect(() => {
    if (upcomingPage > maxUpcomingPage) {
      setUpcomingPage(maxUpcomingPage);
    }

    if (pastPage > maxPastPage) {
      setPastPage(maxPastPage);
    }
  }, [maxPastPage, maxUpcomingPage, pastPage, upcomingPage]);

  function openCreateModal() {
    setEditingEvent(null);
    setFormData(initialForm);
    setFormError('');
    setShowEventModal(true);
  }

  function openEditModal(event: EventType) {
    setEditingEvent(event);
    setSelectedEvent(null);
    setFormData({
      title: event.title,
      date: toDateInputValue(event.date),
      time: toTimeInputValue(event.date),
      location: event.location || '',
      type: getEventType(event),
      description: event.description || '',
      isAttending: event.isAttending ?? false,
      notes: event.notes || '',
      rating: event.rating || 0,
    });
    setFormError('');
    setShowEventModal(true);
  }

  function closeEventModal() {
    setShowEventModal(false);
    setEditingEvent(null);
    setFormError('');
  }

  async function handleSubmitEvent() {
    if (!formData.title.trim() || !formData.date) {
      setFormError('Informe pelo menos o titulo e a data do evento.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        date: toIsoDate(formData.date, formData.time),
        location: formData.location.trim() || undefined,
        type: formData.type,
        isAttending: formData.isAttending,
        notes: formData.notes.trim() || undefined,
        rating: formData.rating || null,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, userId, payload);
      } else {
        await createEvent({ ...payload, userId });
      }

      await loadEvents();
      closeEventModal();
      setFormData(initialForm);
    } catch (error) {
      console.error(error);
      setFormError('Nao foi possivel salvar o evento. Confira os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      await deleteEvent(eventId, userId);
      setSelectedEvent((event) => (event?.id === eventId ? null : event));
      await loadEvents();
    } catch (error) {
      console.error(error);
      setPageError('Nao foi possivel excluir o evento.');
    }
  }

  async function handleToggleAttending(event: EventType) {
    try {
      await updateEvent(event.id, userId, {
        isAttending: !(event.isAttending ?? false),
      });
      await loadEvents();
    } catch (error) {
      console.error(error);
      setPageError('Nao foi possivel atualizar a presenca.');
    }
  }

  function changeMonth(offset: number) {
    setCurrentMonth((month) => {
      const next = new Date(month);
      next.setMonth(month.getMonth() + offset);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-3xl">
              <Calendar className="h-8 w-8 text-primary" />
              Agenda de Eventos
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Gerencie eventos vocacionais, palestras e atividades relacionadas a sua carreira.
            </p>
          </div>

          <Button size="sm" onClick={openCreateModal} className="self-start sm:self-center">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Evento
          </Button>
        </div>

        {pageError && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{pageError}</span>
          </div>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Calendar className="h-6 w-6 text-primary" />}
            iconClassName="bg-primary/20"
            value={upcomingEvents.length}
            label="Proximos Eventos"
          />
          <StatCard
            icon={<Star className="h-6 w-6 text-purple-600" />}
            iconClassName="bg-purple-500/20"
            value={attendedCount}
            label="Eventos Participados"
          />
          <StatCard
            icon={<Bell className="h-6 w-6 text-orange-600" />}
            iconClassName="bg-orange-500/20"
            value={weekCount}
            label="Eventos da Semana"
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title="Proximos Eventos" icon={<Calendar className="h-5 w-5" />}>
              <EventList
                events={visibleUpcomingEvents}
                emptyText={isLoading ? 'Carregando eventos...' : 'Nenhum evento futuro cadastrado.'}
                onSelect={setSelectedEvent}
                onEdit={openEditModal}
                onDelete={handleDeleteEvent}
                onToggleAttending={handleToggleAttending}
              />

              {upcomingEvents.length > eventsPageSize && (
                <PaginationControls
                  page={upcomingPage}
                  maxPage={maxUpcomingPage}
                  onPrevious={() => setUpcomingPage((page) => Math.max(page - 1, 0))}
                  onNext={() => setUpcomingPage((page) => Math.min(page + 1, maxUpcomingPage))}
                />
              )}
            </Card>

            <Card title="Eventos Anteriores" icon={<Star className="h-5 w-5" />}>
              <EventList
                events={visiblePastEvents}
                emptyText={isLoading ? 'Carregando eventos...' : 'Nenhum evento anterior encontrado.'}
                past
                onSelect={setSelectedEvent}
                onEdit={openEditModal}
                onDelete={handleDeleteEvent}
                onToggleAttending={handleToggleAttending}
              />

              {pastEvents.length > eventsPageSize && (
                <PaginationControls
                  page={pastPage}
                  maxPage={maxPastPage}
                  onPrevious={() => setPastPage((page) => Math.max(page - 1, 0))}
                  onNext={() => setPastPage((page) => Math.min(page + 1, maxPastPage))}
                />
              )}
            </Card>
          </div>

          <aside className="space-y-6">
            <Card
              title={new Intl.DateTimeFormat('pt-BR', {
                month: 'long',
                year: 'numeric',
              }).format(currentMonth)}
              icon={<Calendar className="h-5 w-5" />}
              badge={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 hover:bg-accent"
                    onClick={() => changeMonth(-1)}
                  >
                    {'<'}
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 hover:bg-accent"
                    onClick={() => changeMonth(1)}
                  >
                    {'>'}
                  </button>
                </div>
              }
            >
              <div className="grid grid-cols-7 gap-1 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                  <div key={`${day}-${index}`} className="p-1 text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, index) => {
                  const hasEvent =
                    day !== null &&
                    events.some((event) => {
                      const eventDate = getEventDate(event);
                      return (
                        eventDate.getFullYear() === currentMonth.getFullYear() &&
                        eventDate.getMonth() === currentMonth.getMonth() &&
                        eventDate.getDate() === day
                      );
                    });
                  const isToday =
                    day !== null &&
                    currentMonth.getFullYear() === today.getFullYear() &&
                    currentMonth.getMonth() === today.getMonth() &&
                    day === today.getDate();

                  return (
                    <div
                      key={`${day}-${index}`}
                      className={`flex aspect-square items-center justify-center rounded text-sm ${
                        day === null
                          ? ''
                          : isToday
                            ? 'bg-primary text-primary-foreground'
                            : hasEvent
                              ? 'bg-secondary/20 font-medium text-secondary'
                              : 'hover:bg-accent'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Tipos de Evento" icon={<Users className="h-5 w-5" />}>
              <div className="space-y-2">
                {(Object.keys(typeLabels) as EventCategory[]).map((type) => (
                  <div
                    key={type}
                    className={`flex items-center justify-between rounded-lg border-2 p-3 ${typeColors[type]}`}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <span className={`h-2.5 w-2.5 rounded-full ${typeDots[type]}`} />
                      {typeLabels[type]}
                    </span>
                    <span className="text-sm font-medium">
                      {events.filter((event) => getEventType(event) === type).length}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="💡 Lembretes" className="border-primary/20 bg-primary/5">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>📝 Registre observacoes apos cada evento.</li>
                <li>⭐ Avalie eventos passados com estrelas.</li>
                <li>✅ Confirme presenca em eventos de interesse.</li>
              </ul>
            </Card>
          </aside>
        </div>
      </main>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={openEditModal}
          onDelete={handleDeleteEvent}
          onToggleAttending={handleToggleAttending}
        />
      )}

      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl">
                {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </h2>
              <button
                type="button"
                onClick={closeEventModal}
                className="rounded-lg p-2 transition-colors hover:bg-accent"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {formError && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <Input
                label="Titulo do Evento"
                placeholder="Ex: Feira de Profissoes"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Data"
                  type="date"
                  value={formData.date}
                  onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                />
                <Input
                  label="Horario"
                  type="time"
                  value={formData.time}
                  onChange={(event) => setFormData({ ...formData, time: event.target.value })}
                />
              </div>

              <Input
                label="Local"
                placeholder="Ex: Campus UFRJ"
                value={formData.location}
                onChange={(event) => setFormData({ ...formData, location: event.target.value })}
              />

              <div>
                <label className="mb-2 block text-sm text-foreground">
                  Tipo de Evento
                </label>
                <select
                  className="w-full rounded-lg border border-input bg-input-background px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.type}
                  onChange={(event) =>
                    setFormData({ ...formData, type: event.target.value as EventCategory })
                  }
                >
                  <option value="fair">Feira</option>
                  <option value="workshop">Workshop</option>
                  <option value="lecture">Palestra</option>
                  <option value="visit">Visita</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              {!isEditingPastEvent && (
                <label className="flex items-center gap-3 rounded-lg border border-border bg-accent/40 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isAttending}
                    onChange={(event) =>
                      setFormData({ ...formData, isAttending: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  Confirmar participacao neste evento
                </label>
              )}

              <div>
                <label className="mb-2 block text-sm text-foreground">
                  Descricao
                </label>
                <textarea
                  className="w-full resize-none rounded-lg border border-input bg-input-background px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  placeholder="Descreva o evento..."
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({ ...formData, description: event.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    Observacoes
                  </label>
                  <textarea
                    className="w-full resize-none rounded-lg border border-input bg-input-background px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={3}
                    placeholder="Registre aprendizados e impressoes..."
                    value={formData.notes}
                    onChange={(event) =>
                      setFormData({ ...formData, notes: event.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-foreground">
                    Avaliacao
                  </label>
                  <div className="flex h-[76px] items-center gap-1 rounded-lg border border-input bg-input-background px-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className="rounded p-1 hover:bg-accent"
                        aria-label={`Avaliar com ${rating} estrelas`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            rating <= formData.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={closeEventModal} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitEvent} disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Salvando...'
                    : editingEvent
                      ? 'Salvar Alteracoes'
                      : 'Adicionar Evento'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  iconClassName: string;
  value: number;
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

interface PaginationControlsProps {
  page: number;
  maxPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

function PaginationControls({
  page,
  maxPage,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">
        Pagina {page + 1} de {maxPage + 1}
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 0}
          onClick={onPrevious}
        >
          Voltar Pagina
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= maxPage}
          onClick={onNext}
        >
          Proxima Pagina
        </Button>
      </div>
    </div>
  );
}

interface EventListProps {
  events: EventType[];
  emptyText: string;
  past?: boolean;
  onSelect: (event: EventType) => void;
  onEdit: (event: EventType) => void;
  onDelete: (eventId: string) => void;
  onToggleAttending: (event: EventType) => void;
}

function EventList({
  events,
  emptyText,
  past = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleAttending,
}: EventListProps) {
  if (!events.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const eventType = getEventType(event);

        return (
          <article
            key={event.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(event)}
            onKeyDown={(keyboardEvent) => {
              if (keyboardEvent.key === 'Enter') {
                onSelect(event);
              }
            }}
            className={`rounded-lg border-2 p-5 text-left transition-all hover:shadow-md ${
              past ? 'border-border bg-accent/30' : typeColors[eventType]
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg">{event.title}</h3>
                  <span className="rounded bg-white/60 px-2 py-1 text-xs text-foreground">
                    {typeLabels[eventType]}
                  </span>
                  {!past && event.isAttending && (
                    <span className="inline-flex items-center gap-1 rounded bg-secondary/15 px-2 py-1 text-xs text-secondary">
                      <Check className="h-3 w-3" />
                      Confirmado
                    </span>
                  )}
                </div>

                <p className="mb-3 text-sm opacity-80">
                  {event.description
                    ? truncateText(event.description)
                    : 'Sem descricao cadastrada.'}
                </p>

                <div className="mb-3 flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(event.date)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  )}
                </div>

                {past && (
                  <div className="space-y-2">
                    {!!event.rating && <RatingStars rating={event.rating} />}
                    {event.notes && (
                      <p className="text-sm italic text-muted-foreground">
                        "{truncateText(event.notes, 110)}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    onEdit(event);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                {!past && (
                  <Button
                    size="sm"
                    variant={event.isAttending ? 'secondary' : 'outline'}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      onToggleAttending(event);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {event.isAttending ? 'Confirmado' : 'Participar'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(clickEvent) => {
                    clickEvent.stopPropagation();
                    onDelete(event.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

interface EventDetailModalProps {
  event: EventType;
  onClose: () => void;
  onEdit: (event: EventType) => void;
  onDelete: (eventId: string) => void;
  onToggleAttending: (event: EventType) => void;
}

function EventDetailModal({
  event,
  onClose,
  onEdit,
  onDelete,
  onToggleAttending,
}: EventDetailModalProps) {
  const isPast = hasEventPassed(event, new Date());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className={`mb-3 inline-flex rounded-full border px-3 py-1 text-sm ${typeColors[getEventType(event)]}`}>
              {typeLabels[getEventType(event)]}
            </span>
            <h2 className="text-2xl">{event.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-accent"
            aria-label="Fechar detalhes"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <DetailItem icon={<Calendar className="h-4 w-4" />} label="Data" value={formatDate(event.date)} />
            <DetailItem icon={<Clock className="h-4 w-4" />} label="Horario" value={formatTime(event.date)} />
            <DetailItem icon={<MapPin className="h-4 w-4" />} label="Local" value={event.location || 'Nao informado'} />
          </div>

          <div>
            <h3 className="mb-2 text-base">Descricao</h3>
            <p className="rounded-lg border border-border bg-accent/30 p-4 text-sm text-muted-foreground">
              {event.description || 'Sem descricao cadastrada.'}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-base">Observacoes</h3>
            <p className="rounded-lg border border-border bg-accent/30 p-4 text-sm text-muted-foreground">
              {event.notes || 'Sem observacoes cadastradas.'}
            </p>
          </div>

          {!!event.rating && (
            <div>
              <h3 className="mb-2 text-base">Avaliacao</h3>
              <RatingStars rating={event.rating} />
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => onEdit(event)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            {!isPast && (
              <Button
                variant={event.isAttending ? 'secondary' : 'outline'}
                onClick={() => onToggleAttending(event)}
              >
                <Check className="mr-2 h-4 w-4" />
                {event.isAttending ? 'Confirmado' : 'Participar'}
              </Button>
            )}
            <Button variant="destructive" onClick={() => onDelete(event.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DetailItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg border border-border bg-accent/30 p-3">
      <div className="mb-1 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p>{value}</p>
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );
}
