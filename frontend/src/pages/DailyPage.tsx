import { useState, useMemo } from 'react';
import '../App.css';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDailyLogs } from '../hooks/useDailyLogs';
import type { DailyLog } from '../types/dailyLog';

const TAGS_DISPONIVEIS = [
  'Matemática', 'Física', 'Tecnologia', 'Programação', 'Biologia',
  'História', 'Literatura', 'Arte', 'Música', 'Esportes',
];

const EMOJIS_DISPONIVEIS = [
  '📝', '🤩', '🤓', '💡', '🎯', '🚀', '🤔', '🔥', '💻', '📚', '😞', '🙄',
];

export default function Diario() {
  const { user } = useAuth();
  
  const { showError, showSuccess } = useToast();
  const {
    dailyLogs,
    isLoading,
    error,
    createLog,
    deleteLog,
    updateEmojiLocally,
  } = useDailyLogs(user?.id);

  const [newText, setNewText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openEmojiId, setOpenEmojiId] = useState<string | null>(null);
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeEmojiFilter, setActiveEmojiFilter] = useState<string | null>(null);
  
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const saveDailyLog = async () => {
    if (newText.trim() === '') return;

    if (!user?.id) {
      showError('Usuário não autenticado');
      return;
    }

    const [year, month, day] = selectedDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const dataToSend = {
      date: formattedDate,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: newText,
      tags: selectedTags.length > 0 ? selectedTags : ['Geral'],
      emoji: '📝',
      userId: user.id,
    };

    try {
      await createLog(dataToSend);
      setNewText('');
      setSelectedTags([]);
      showSuccess('Entrada salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showError('Erro ao conectar ao backend.');
    }
  };

  const confirmDelete = async () => {
    if (!logToDelete) return;

    try {
      setIsDeleting(true);
      await deleteLog(logToDelete);
      setLogToDelete(null);
      showSuccess('Anotação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      showError('Erro ao excluir a anotação.');
    } finally {
      setIsDeleting(false);
    }
  };

  const changeEmoji = (idDailyLog: string, newEmoji: string) => {
    updateEmojiLocally(idDailyLog, newEmoji);
    setOpenEmojiId(null);
  };

  const clearFilters = () => {
    setActiveTagFilter(null);
    setActiveEmojiFilter(null);
    setSearchTerm('');
    setFilterOpen(false);
  };

  const filteredDailyLogs = useMemo(() => {
    return dailyLogs.filter((log) => {
      const matchSearch =
        searchTerm === '' ||
        log.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTag = activeTagFilter ? log.tags.includes(activeTagFilter) : true;
      const matchEmoji = activeEmojiFilter ? log.emoji === activeEmojiFilter : true;

      return matchSearch && matchTag && matchEmoji;
    });
  }, [dailyLogs, searchTerm, activeTagFilter, activeEmojiFilter]);

  const totalEntries = dailyLogs.length;

  const currentMonthFormatted = `/${new Date().getMonth() + 1 < 10 ? '0' : ''}${new Date().getMonth() + 1}/`;

  const entriesThisMonth = dailyLogs.filter((log) =>
    log.date.includes(currentMonthFormatted)
  ).length;

  const calculateConsecutiveDays = (list: DailyLog[]) => {
    if (list.length === 0) return 0;

    const datesInMs = [
      ...new Set(
        list.map((log) => {
          const [day, month, year] = log.date.split('/');
          return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
        })
      ),
    ].sort((a, b) => b - a);

    let streak = 1;
    const oneDay = 86400000;

    for (let i = 0; i < datesInMs.length - 1; i++) {
      const diff = Math.round((datesInMs[i] - datesInMs[i + 1]) / oneDay);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const consecutiveDays = calculateConsecutiveDays(dailyLogs);

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-title-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 9.3335V28.0002" stroke="#2563EB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.00002 24C3.6464 24 3.30726 23.8595 3.05721 23.6095C2.80716 23.3594 2.66669 23.0203 2.66669 22.6667V5.33333C2.66669 4.97971 2.80716 4.64057 3.05721 4.39052C3.30726 4.14048 3.6464 4 4.00002 4H10.6667C12.0812 4 13.4377 4.5619 14.4379 5.5621C15.4381 6.56229 16 7.91885 16 9.33333C16 7.91885 16.5619 6.56229 17.5621 5.5621C18.5623 4.5619 19.9189 4 21.3334 4H28C28.3536 4 28.6928 4.14048 28.9428 4.39052C29.1929 4.64057 29.3334 4.97971 29.3334 5.33333V22.6667C29.3334 23.0203 29.1929 23.3594 28.9428 23.6095C28.6928 23.8595 28.3536 24 28 24H20C18.9392 24 17.9217 24.4214 17.1716 25.1716C16.4214 25.9217 16 26.9391 16 28C16 26.9391 15.5786 25.9217 14.8284 25.1716C14.0783 24.4214 13.0609 24 12 24H4.00002Z" stroke="#2563EB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1>Meu Diário de Interesses</h1>
        </div>
        <p className="page-subtitle">
          Registre suas descobertas, reflexões e interesses. A IA analisa suas entradas para fornecer recomendações personalizadas.
        </p>
      </header>

      <div className="diario-grid">
        <div className="diario-main-column">
          <section className="universal-card">
            <div className="card-header-with-icon justify-between">
              <div className="flex-row-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6.66669 1.6665V4.99984" stroke="#2563EB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.3333 1.6665V4.99984" stroke="#2563EB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.8333 3.3335H4.16667C3.24619 3.3335 2.5 4.07969 2.5 5.00016V16.6668C2.5 17.5873 3.24619 18.3335 4.16667 18.3335H15.8333C16.7538 18.3335 17.5 17.5873 17.5 16.6668V5.00016C17.5 4.07969 16.7538 3.3335 15.8333 3.3335Z" stroke="#2563EB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.5 8.3335H17.5" stroke="#2563EB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2>Nova Entrada</h2>
              </div>
              <input
                type="date"
                className="date-picker-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <textarea
              className="form-textarea"
              placeholder="O que você aprendeu hoje? Que temas despertaram seu interesse? Teve alguma reflexão..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />

            <div className="tags-selection-section">
              <div className="tags-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clipPath="url(#clip0_80_358)">
                    <path d="M8.39065 1.72416C8.14066 1.4741 7.80157 1.33357 7.44798 1.3335H2.66665C2.31302 1.3335 1.97389 1.47397 1.72384 1.72402C1.47379 1.97407 1.33331 2.31321 1.33331 2.66683V7.44816C1.33339 7.80176 1.47391 8.14084 1.72398 8.39083L7.52665 14.1935C7.82966 14.4946 8.23948 14.6636 8.66665 14.6636C9.09382 14.6636 9.50364 14.4946 9.80665 14.1935L14.1933 9.80683C14.4944 9.50382 14.6634 9.094 14.6634 8.66683C14.6634 8.23966 14.4944 7.82984 14.1933 7.52683L8.39065 1.72416Z" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.00002 5.33317C5.18412 5.33317 5.33335 5.18393 5.33335 4.99984C5.33335 4.81574 5.18412 4.6665 5.00002 4.6665C4.81593 4.6665 4.66669 4.81574 4.66669 4.99984C4.66669 5.18393 4.81593 5.33317 5.00002 5.33317Z" fill="#2563EB" stroke="#2563EB" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_80_358">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>Adicionar tags (opcional)</span>
              </div>
              <div className="tags-grid">
                {TAGS_DISPONIVEIS.map(tag => (
                  <button
                    key={tag}
                    className={`tag-toggle-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions-bottom">
              <span className="char-counter">{newText.length} caracteres</span>
              <button className="btn-primary" onClick={saveDailyLog}>
                Salvar Entrada
              </button>
            </div>
          </section>

          <section className="universal-card mt-4">
            <div className="card-header-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_80_392)">
                  <path d="M10 18.3332C14.6024 18.3332 18.3334 14.6022 18.3334 9.99984C18.3334 5.39746 14.6024 1.6665 10 1.6665C5.39765 1.6665 1.66669 5.39746 1.66669 9.99984C1.66669 14.6022 5.39765 18.3332 10 18.3332Z" stroke="#2563EB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 5V10L13.3333 11.6667" stroke="#2563EB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_80_392">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h2>Entradas Anteriores</h2>
            </div>

            <div className="search-filter-row">
              <div className="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                  type="text"
                  placeholder="Buscar nas suas entradas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-count-row">
              
              <div className="filter-wrapper">
                <button
                  className={`btn-filter ${filterOpen || activeTagFilter || activeEmojiFilter ? 'ativo' : ''}`}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  {(activeTagFilter || activeEmojiFilter) && <span className="filter-badge"></span>}
                </button>

                {filterOpen && (
                  <div className="filter-dropdown-menu">
                    <div className="filter-section">
                      <span className="filter-label">Por Tag:</span>
                      <div className="tags-grid">
                        <button
                          className={`tag-toggle-btn ${!activeTagFilter ? 'active' : ''}`}
                          onClick={() => setActiveTagFilter(null)}
                        >Todas</button>
                        {TAGS_DISPONIVEIS.map(tag => (
                          <button
                            key={tag}
                            className={`tag-toggle-btn ${activeTagFilter === tag ? 'active' : ''}`}
                            onClick={() => setActiveTagFilter(tag)}
                          >{tag}</button>
                        ))}
                      </div>
                    </div>

                    <div className="filter-section">
                      <span className="filter-label">Por Emoji:</span>
                      <div className="tags-grid" style={{ gap: '4px' }}>
                        <button
                          className={`tag-toggle-btn ${!activeEmojiFilter ? 'active' : ''}`}
                          onClick={() => setActiveEmojiFilter(null)}
                        >Todos</button>
                        {EMOJIS_DISPONIVEIS.map(emj => (
                          <button
                            key={emj}
                            className={`emoji-filter-btn ${activeEmojiFilter === emj ? 'active' : ''}`}
                            onClick={() => setActiveEmojiFilter(emj)}
                          >{emj}</button>
                        ))}
                      </div>
                    </div>

                    {(activeTagFilter || activeEmojiFilter || searchTerm) && (
                      <button className="btn-clear-filters" onClick={clearFilters}>
                        Limpar todos os filtros
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <span className="entries-count">{filteredDailyLogs.length} entradas</span>
            </div>

            <div className="entradas-list">
              {error && (
                <p className="text-muted text-center py-4">{error}</p>
              )}
              {isLoading && (
                <p className="text-muted text-center py-4">Carregando entradas...</p>
              )}
              {!isLoading && filteredDailyLogs.map((log) => (
                <div key={log.id} className="entrada-item-bordered">
                  <div className="entrada-item-header">
                    <div className="entrada-meta-left">
                      <div className="emoji-picker-container">
                        <span
                          className="entrada-emoji clicavel"
                          onClick={() => setOpenEmojiId(openEmojiId === log.id ? null : log.id)}
                          title="Clique para trocar o emoji"
                        >
                          {log.emoji}
                        </span>

                        {openEmojiId === log.id && (
                          <div className="emoji-popup">
                            {EMOJIS_DISPONIVEIS.map(emj => (
                              <span
                                key={emj}
                                className="emoji-option"
                                onClick={() => changeEmoji(log.id, emj)}
                              >
                                {emj}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="entrada-date-time">
                        <span className="entrada-date">{log.date}</span>
                        <span className="entrada-time">{log.time}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="tags-row">
                        {log.tags.map((tag, index) => (
                          <span key={index} className="tag-badge">{tag}</span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setLogToDelete(log.id)}
                        title="Excluir anotação"
                        aria-label="Excluir anotação"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="entrada-texto">{log.text}</p>
                </div>
              ))}
              {!isLoading && filteredDailyLogs.length === 0 && (
                <p className="text-muted text-center py-4">Nenhuma entrada encontrada para os filtros aplicados.</p>
              )}
            </div>
          </section>

        </div>

        <div className="diario-side-column">
          <section className="universal-card">
            <div className="card-header-with-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <h2>Estatísticas</h2>
            </div>

            <div className="stats-container">
              <div className="stat-box">
                <span className="stat-number stat-blue">{entriesThisMonth}</span>
                <span className="stat-label">Entradas este mês</span>
              </div>
              <div className="stat-box">
                <span className="stat-number stat-green">{consecutiveDays}</span>
                <span className="stat-label">Dias consecutivos</span>
              </div>
              <div className="stat-box">
                <span className="stat-number stat-dark">{totalEntries}</span>
                <span className="stat-label">Total de entradas</span>
              </div>
            </div>
          </section>

          <section className="dicas-card mt-4">
            <div className="card-header-with-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.8 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>
              <h2>Dicas</h2>
            </div>
            <ul className="dicas-list">
              <li>Seja consistente! Registros diários ajudam a IA a entender melhor sua evolução.</li>
              <li>Use tags para facilitar a busca e análise de padrões.</li>
              <li>Seja específico sobre o que despertou seu interesse.</li>
            </ul>
          </section>

        </div>
      </div>

      {logToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: '18px', color: '#0F172A' }}>
              Excluir anotação?
            </h3>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginTop: '12px' }}>
              Tem certeza que deseja excluir esta entrada? Esta ação não poderá ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                className="btn-filter"
                onClick={() => setLogToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                style={{
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  opacity: isDeleting ? 0.7 : 1,
                }}
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}