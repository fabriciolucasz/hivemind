document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. PROTEÇÃO DE ROTA (O SEU "SEGURANÇA") ---
    // Verificamos se existe um utilizador no LocalStorage
    const utilizador = HivemindAPI.storage.getUser();

    if (!utilizador) {
        // Se não houver utilizador, redireciona para o login
        console.warn("Acesso não autorizado. A redirecionar...");
        window.location.href = "../../auth/login/login.html";
        return; // Interrompe a execução do resto do script
    }

    // --- 3. PERSONALIZAÇÃO DA INTERFACE ---
    // Atualiza o nome do utilizador no Dashboard
    const nomeElemento = document.getElementById('user-name');
    const boasVindasElemento = document.getElementById('welcome-text');

    if (nomeElemento) nomeElemento.textContent = utilizador.nome;
    if (boasVindasElemento) {
        boasVindasElemento.textContent = `Olá, ${utilizador.nome}! Bom vê-lo de volta.`;
    }

    // --- 4. CARREGAMENTO DE DADOS DINÂMICOS ---
    async function carregarDadosDashboard() {
        try {
            console.log("A procurar dados do utilizador:", utilizador.id);
            
            // Exemplo de chamada para estatísticas (notas, progresso do teste, etc.)
            // const stats = await HivemindAPI.user.getStats(utilizador.id);
            // atualizarWidgets(stats);

        } catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error);
        }
    }

    carregarDadosDashboard();

    // --- 5. LÓGICA DE LOGOUT (SAIR) ---
    const btnLogout = document.getElementById('btn-logout');

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (confirm("Deseja realmente sair do Hivemind?")) {
                // Limpa os dados do utilizador no navegador
                HivemindAPI.storage.clear();
                
                // Redireciona para o login
                window.location.href = "../../auth/login/login.html";
            }
        });
    }

    // --- 6. INTERAÇÕES DA SIDEBAR (MENU) ---
    const btnMenu = document.getElementById('btn-menu');
    const sidebar = document.querySelector('.sidebar');

    if (btnMenu && sidebar) {
        btnMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});

/**
 * Função utilitária para atualizar widgets visualmente
 */
function atualizarWidgets(dados) {
    // Aqui incluiria a lógica para preencher os gráficos ou tabelas
    // com os dados vindos do seu backend em Python
}