document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. SEGURANÇA: VERIFICAÇÃO DE UTILIZADOR ---
    const utilizador = HivemindAPI.storage.getUser();
    if (!utilizador) {
        window.location.href = "../../auth/login/login.html";
        return;
    }

    // --- 3. ELEMENTOS DO DOM ---
    const tabelaNotas = document.getElementById('tabela-notas-corpo');
    const formNota = document.getElementById('form-add-nota');
    const mediaGeralTexto = document.getElementById('media-geral-valor');

    // --- 4. CARREGAR NOTAS DA API ---
    async function inicializarDesempenho() {
        try {
            // Chamada real para o seu backend Python
            const dados = await HivemindAPI.request(`/desempenho/${utilizador.id}`);
            
            renderizarTabela(dados.notas);
            atualizarResumo(dados.notas);
            
        } catch (error) {
            console.error("Erro ao carregar desempenho:", error);
            // Se a API ainda não estiver pronta, podemos mostrar dados de exemplo
            alert("A carregar modo de demonstração (servidor offline).");
        }
    }

    // --- 5. RENDERIZAR TABELA DE NOTAS ---
    function renderizarTabela(notas) {
        if (!tabelaNotas) return;
        
        tabelaNotas.innerHTML = ''; // Limpa a tabela

        notas.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.materia}</td>
                <td><span class="badge-nota">${item.nota}</span></td>
                <td>${item.data || '---'}</td>
                <td>
                    <button class="btn-icon" onclick="editarNota(${item.id})">
                        <i data-lucide="edit-3"></i>
                    </button>
                </td>
            `;
            tabelaNotas.appendChild(tr);
        });

        lucide.createIcons(); // Atualiza os ícones gerados dinamicamente
    }

    // --- 6. ADICIONAR NOVA NOTA ---
    if (formNota) {
        formNota.addEventListener('submit', async (e) => {
            e.preventDefault();

            const novaNota = {
                usuario_id: utilizador.id,
                materia: document.getElementById('materia').value,
                nota: parseFloat(document.getElementById('nota').value),
                data: new Date().toLocaleDateString('pt-BR')
            };

            try {
                await HivemindAPI.request('/desempenho/add', 'POST', novaNota);
                alert("Nota adicionada com sucesso!");
                formNota.reset();
                inicializarDesempenho(); // Recarrega a lista
            } catch (err) {
                alert("Erro ao salvar nota.");
            }
        });
    }

    // Executa a carga inicial
    inicializarDesempenho();
});

/**
 * Lógica simples para atualizar a média visual no topo da página
 */
function atualizarResumo(notas) {
    const total = notas.reduce((acc, curr) => acc + curr.nota, 0);
    const media = notas.length > 0 ? (total / notas.length).toFixed(1) : 0;
    
    const displayMedia = document.getElementById('media-geral-valor');
    if (displayMedia) displayMedia.textContent = media;
}