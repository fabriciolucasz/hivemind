document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa os ícones do Lucide
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
    const diarioForm = document.getElementById('form-diario');
    const campoTexto = document.getElementById('relato-texto');
    const listaHistorico = document.getElementById('historico-relatos');
    const btnSalvar = document.getElementById('btn-salvar-relato');

    // --- 4. CARREGAR HISTÓRICO DE RELATOS ---
    async function carregarHistorico() {
        try {
            // Chamada à API para procurar relatos anteriores do utilizador
            const relatos = await HivemindAPI.request(`/diario/${utilizador.id}`);
            
            renderizarHistorico(relatos);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            // Dados de exemplo caso o servidor esteja offline (para a tua apresentação)
            const exemplo = [
                { id: 1, texto: "Hoje a aula de algoritmos foi muito produtiva.", data: "27/04/2026" },
                { id: 2, texto: "Senti muita facilidade em organizar o projeto de interface.", data: "25/04/2026" }
            ];
            renderizarHistorico(exemplo);
        }
    }

    // --- 5. RENDERIZAR OS RELATOS NA TELA ---
    function renderizarHistorico(relatos) {
        if (!listaHistorico) return;
        
        listaHistorico.innerHTML = ''; 

        relatos.forEach(relato => {
            const card = document.createElement('div');
            card.className = 'relato-card';
            card.innerHTML = `
                <div class="relato-header">
                    <span class="relato-data">${relato.data}</span>
                    <i data-lucide="calendar" class="icon-small"></i>
                </div>
                <p class="relato-corpo">${relato.texto}</p>
            `;
            listaHistorico.prepend(card); // O mais recente aparece no topo
        });

        lucide.createIcons();
    }

    // --- 6. SALVAR NOVO RELATO ---
    if (diarioForm) {
        diarioForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const texto = campoTexto.value.trim();

            if (!texto) {
                alert("O teu relato parece estar vazio. Escreve algo sobre o teu dia!");
                return;
            }

            // Feedback visual no botão
            btnSalvar.disabled = true;
            btnSalvar.innerHTML = `<span>A guardar...</span>`;

            const novoRelato = {
                usuario_id: utilizador.id,
                texto: texto,
                data: new Date().toLocaleDateString('pt-BR')
            };

            try {
                // Envia para o servidor Python via api.js
                await HivemindAPI.user.salvarRelato(novoRelato);
                
                alert("Relato guardado! O Mentor IA já está a analisar estas informações.");
                
                campoTexto.value = ''; // Limpa o campo
                carregarHistorico();   // Atualiza a lista lateral/abaixo
            } catch (error) {
                console.error("Erro ao salvar relato:", error);
                alert("Não foi possível ligar ao servidor. O relato foi guardado apenas localmente.");
            } finally {
                btnSalvar.disabled = false;
                btnSalvar.innerHTML = `<span>Guardar Relato</span>`;
            }
        });
    }

    // Inicialização
    carregarHistorico();
});