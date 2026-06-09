import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useVocationalTests } from '../hooks/useVocationalTests';
import { useAcademicRecords } from '../hooks/useAcademicRecords';
import { useEvents } from '../hooks/useEvents';
import {
  BookOpen,
  Calendar,
  Bell,
  Brain,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import '../App.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Consumindo os dados reais do banco usando os hooks da equipe
  const { testHistory } = useVocationalTests(user?.id);
  const { records: performanceRecords } = useAcademicRecords(user?.id);
  const { events } = useEvents(user?.id);

  const [diaryEntry, setDiaryEntry] = useState('');
  const [diaryCount, setDiaryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [reminderActive, setReminderActive] = useState(() => {
    return localStorage.getItem('hivemind_reminder_active') === 'true';
  });
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('hivemind_reminder_time') || '18:00';
  });

  const dataDeHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const fetchDashboardStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/api/daily-logs/${user.id}`);
      setDiaryCount(response.data.length);
    } catch (error) {
      console.error('Erro ao coletar diários:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleSaveDiary = async () => {
    if (!diaryEntry.trim() || !user?.id) return;
    setSaving(true);
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR');
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      await api.post('/api/daily-logs', {
        text: diaryEntry,
        emoji: '⚡',
        tags: ['Anotação Rápida'],
        date: dateStr,
        time: timeStr,
        userId: user.id
      });

      setDiaryEntry('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000); 
      await fetchDashboardStats();
    } catch (error) {
      console.error('Erro ao submeter entrada do diário:', error);
      alert('Houve uma falha ao registrar sua entrada.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleReminder = () => {
    const nextState = !reminderActive;
    setReminderActive(nextState);
    localStorage.setItem('hivemind_reminder_active', String(nextState));
  };

  const handleTimeChange = (newTime: string) => {
    setReminderTime(newTime);
    localStorage.setItem('hivemind_reminder_time', newTime);
  };

  // --- LÓGICA DINÂMICA DE PROGRESSO ---
  const requiredDiary = 15;
  const requiredPerformance = 10;

  const performanceCount = performanceRecords?.length || 0;
  const vocationalCompleted = testHistory?.length > 0; 
  
  // mostrar apenas os futuros (max 3 eventos)
  const currentDateTime = new Date();
  const upcomingEvents = (events || [])
    .filter((event) => new Date(event.date) >= currentDateTime)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const overallProgress = Math.round(
    ((Math.min(diaryCount, requiredDiary) / requiredDiary) * 33.33 +
      (vocationalCompleted ? 33.33 : 0) +
      (Math.min(performanceCount, requiredPerformance) / requiredPerformance) * 33.33)
  );

  if (loading) {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <p className="text-muted">Carregando o seu painel...</p>
      </div>
    );
  }
  const firstName = user?.name ? user.name.split(' ')[0] : 'Estudante';

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-title-row">
          <h1 style={{ textTransform: 'capitalize' }}>Olá, {firstName}! 👋</h1>
        </div>
        <p className="page-subtitle">{dataDeHoje}</p>
      </header>

      {/* Card de Progresso da IA */}
      <section className="universal-card">
        <div className="card-header-with-icon">
          <div className="icon-placeholder">
            <Brain style={{ width: '24px', height: '24px', color: '#2563EB' }} />
          </div>
          <h2 style={{ flexGrow: 1 }}>Progresso de Alimentação da IA</h2>
          <div className="tag-badge">{overallProgress}% completo</div>
        </div>

        <p className="text-muted">
          Continue alimentando a IA com seus dados para gerar um relatório de recomendação ultra-individualizado.
        </p>

        <div>
          <div className="flex-row-center justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#1A202C' }}>Progresso Geral</span>
            <span style={{ fontSize: '14px', color: '#2563EB', fontWeight: 500 }}>{overallProgress}%</span>
          </div>
          <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#2563EB', width: `${overallProgress}%`, transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* Lista de sub-tarefas */}
        <div className="entradas-list" style={{ marginTop: '16px' }}>

          <div className="entrada-item-bordered" style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '2px' }}>
              {diaryCount >= requiredDiary ? <CheckCircle2 style={{ color: '#2563EB' }} /> : <Circle style={{ color: '#94A3B8' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1A202C' }}>Entradas no Diário</h4>
              <p className="text-muted" style={{ marginBottom: '12px' }}>Registre suas reflexões diárias para a IA entender sua evolução.</p>
              <div className="flex-row-center gap-2">
                <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#2563EB', width: `${Math.min((diaryCount / requiredDiary) * 100, 100)}%`, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{diaryCount}/{requiredDiary}</span>
              </div>
            </div>
          </div>

          <div className="entrada-item-bordered" style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '2px' }}>
              {vocationalCompleted ? <CheckCircle2 style={{ color: '#2563EB' }} /> : <Circle style={{ color: '#94A3B8' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1A202C' }}>Teste Vocacional</h4>
              <p className="text-muted" style={{ marginBottom: '12px' }}>Complete o teste vocacional para identificar suas aptidões.</p>
              <div className="flex-row-center justify-between">
                <span style={{ fontSize: '14px', color: vocationalCompleted ? '#2563EB' : '#64748B', fontWeight: vocationalCompleted ? 500 : 400 }}>
                  {vocationalCompleted ? '✓ Concluído' : 'Pendente'}
                </span>
                {!vocationalCompleted && <button className="btn-filter" onClick={() => navigate('/teste')}>Fazer Teste</button>}
              </div>
            </div>
          </div>

          <div className="entrada-item-bordered" style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '2px' }}>
              {performanceCount >= requiredPerformance ? <CheckCircle2 style={{ color: '#2563EB' }} /> : <Circle style={{ color: '#94A3B8' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1A202C' }}>Dados de Desempenho</h4>
              <p className="text-muted" style={{ marginBottom: '12px' }}>Registre suas notas e desempenho nas disciplinas.</p>
              <div className="flex-row-center gap-2">
                <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#2563EB', width: `${Math.min((performanceCount / requiredPerformance) * 100, 100)}%`, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{performanceCount}/{requiredPerformance}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Inferior */}
      <div className="diario-grid">
        <div className="diario-main-column">
          <section className="universal-card">
            <div className="card-header-with-icon justify-between" style={{ width: '100%' }}>
              <div className="flex-row-center gap-2">
                <div className="icon-placeholder">
                  <BookOpen style={{ width: '24px', height: '24px', color: '#1A202C' }} />
                </div>
                <h2>Diário de Interesses</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleToggleReminder}
                  className="info-message"
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    color: reminderActive ? '#16A34A' : '#EAB308',
                    background: reminderActive ? 'rgba(22, 163, 74, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '33px',
                    transition: 'all 0.2s ease',
                    fontWeight: 500,
                  }}
                >
                  <Bell size={16} />
                  {reminderActive ? 'Lembrete Ativo' : 'Ativar Lembrete'}
                </button>
                {reminderActive && (
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#475569',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                )}
              </div>
            </div>

            <p className="text-muted" style={{ marginTop: '-8px' }}>Registre seus interesses do dia. Essa anotação rápida irá direto para o seu histórico.</p>

            <div className="textarea-wrapper">
              <textarea
                className="form-textarea"
                placeholder="O que despertou seu interesse hoje?"
                value={diaryEntry}
                onChange={(e) => setDiaryEntry(e.target.value)}
                disabled={saving}
              />
              <div className="form-actions-bottom">
                <span className="char-counter">{diaryCount} {diaryCount === 1 ? 'entrada registrada' : 'entradas registradas'}</span>
                <div className="flex-row-center gap-2">
                  <button className="btn-filter" onClick={() => navigate('/diario')}>Acessar Diário</button>
                  <button className="btn-primary" onClick={handleSaveDiary} disabled={!diaryEntry.trim() || saving}>
                    {saving ? 'Salvando...' : 'Salvar Entrada'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Coluna Direita: Próximos Eventos */}
        <div className="diario-side-column">
          <section className="universal-card">
            <div className="card-header-with-icon">
              <div className="icon-placeholder">
                <Calendar style={{ width: '24px', height: '24px', color: '#1A202C' }} />
              </div>
              <h2>Próximos Eventos</h2>
            </div>
            <p className="text-muted" style={{ marginTop: '-12px', marginBottom: '8px' }}>Eventos e atividades na sua agenda</p>

            <div className="entradas-list">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  const dataFormatada = new Intl.DateTimeFormat('pt-BR').format(eventDate);
                  const horaFormatada = new Intl.DateTimeFormat('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(eventDate);

                  return (
                    <div key={event.id} className="entrada-item-bordered" style={{ padding: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#1A202C' }}>{event.title}</h4>
                      <div className="flex-row-center gap-4" style={{ color: '#64748B', fontSize: '13px' }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {dataFormatada}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {horaFormatada}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '24px 16px', textAlign: 'center', background: '#F8FAFB', borderRadius: '8px', border: '1px dashed #E2E8F0' }}>
                  <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Nenhum evento agendado por enquanto.</p>
                </div>
              )}
            </div>

            <button className="btn-filter mt-4" style={{ width: '100%' }} onClick={() => navigate('/eventos')}>
              Ver Calendário Completo
            </button>
          </section>
        </div>
      </div>
      
      {/* aviso entrada registrada com sucesso */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: '#10B981', 
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <CheckCircle2 size={24} />
          <span style={{ fontWeight: 500, fontSize: '15px' }}>
            Anotação salva no seu diário!
          </span>
        </div>
      )}
    </div>
  );
}