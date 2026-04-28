document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa os ícones do Lucide (Calendário, Relógio, Alfinete)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. SEGURANÇA: VERIFICAÇÃO DE SESSÃO ---
    const utilizador = HivemindAPI.storage.getUser();
    if (!utilizador) {
        window.location.href = "../../auth/login/login.html";
        return;
    }

    // --- 3. ELEMENTOS DO DOM ---
    const formEvento = document.getElementById('form-evento');
    const listaEventos = document.getElementById('lista-eventos');
    const btnSalvar = document.getElementById('btn-salvar-evento');

    // --- 4. CARREGAR EVENTOS DA API ---
    async function carregarEventos() {
        try {
            console.log("A procurar agenda de:", utilizador.nome);
            
            // Procura os eventos do utilizador no backend
            const eventos = await HivemindAPI.request(`/eventos/${utilizador.id}`);
            
            renderizarEventos(eventos);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
            // Dados de demonstração caso o servidor esteja offline
            const exemplo = [
                { id: 1, titulo: "Entrega do Projeto Final", data: "2026-05-15", tipo: "Trabalho" },
                { id: 2, titulo: "Simulado de Concurso", data: "2026-05-20", tipo: "Estudo" }
            ];
            renderizarEventos(exemplo);
        }
    }

    // --- 5. RENDERIZAR EVENTOS NA INTERFACE ---
    function renderizarEventos(eventos) {
        if (!listaEventos) return;
        
        listaEventos.innerHTML = ''; // Limpa a lista atual

        if (eventos.length === 0) {
            listaEventos.innerHTML = '<p class="text-muted">Não tens eventos marcados para breve.</p>';
            return;
        }

        eventos.forEach(ev => {
            const item = document.createElement('div');
            item.className = 'evento-card';
            item.innerHTML = `
                <div class="evento-info">
                    <span class="evento-tag">${ev.tipo}</span>
                    <h4 class="evento-titulo">${ev.titulo}</h4>
                    <div class="evento-meta">
                        <i data-lucide="calendar"></i>
                        <span>${new Date(ev.data).toLocaleDateString('pt-PT')}</span>
                    </div>
                </div>
                <button class="btn-delete" onclick="excluirEvento(${ev.id})">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            listaEventos.appendChild(item);
        });

        lucide.createIcons();
    }

    // --- 6. ADICIONAR NOVO EVENTO ---
    if (formEvento) {
        formEvento.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titulo = document.getElementById('evento-titulo').value.trim();
            const data = document.getElementById('evento-data').value;
            const tipo = document.getElementById('evento-tipo').value;

            if (!titulo || !data) {
                alert("Por favor, preenche o título e a data do evento.");
                return;
            }

            btnSalvar.disabled = true;
            btnSalvar.innerHTML = `<span>A agendar...</span>`;

            const novoEvento = {
                usuario_id: utilizador.id,
                titulo: titulo,
                data: data,
                tipo: tipo
            };

            try {
                // Envia para o servidor via api.js
                await HivemindAPI.request('/eventos/add', 'POST', novoEvento);
                
                alert("Evento adicionado com sucesso!");
                formEvento.reset();
                carregarEventos(); // Atualiza a lista
            } catch (error) {
                console.error("Erro ao salvar evento:", error);
                alert("Erro ao ligar ao servidor. Tenta novamente mais tarde.");
            } finally {
                btnSalvar.disabled = false;
                btnSalvar.innerHTML = `<span>Agendar Evento</span>`;
            }
        });
    }

    // Inicialização da página
    carregarEventos();
});

/**
 * Função Global para eliminar eventos (chamada pelo botão renderizado)
 */
async function excluirEvento(id) {
    if (confirm("Tens a certeza que desejas remover este evento?")) {
        try {
            await HivemindAPI.request(`/eventos/delete/${id}`, 'DELETE');
            location.reload(); // Recarrega para atualizar a lista
        } catch (error) {
            alert("Não foi possível eliminar o evento.");
        }
    }
}