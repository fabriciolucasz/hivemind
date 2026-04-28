document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa os ícones
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. SEGURANÇA E CONTEXTO ---
    const usuario = HivemindAPI.storage.getUser();
    if (!usuario) {
        window.location.href = "../../auth/login/login.html";
        return;
    }

    // --- 3. ELEMENTOS DO DOM ---
    const viewEmpty = document.getElementById('view-empty');
    const viewLoading = document.getElementById('view-loading');
    const viewReport = document.getElementById('view-report');
    const btnGerar = document.getElementById('btn-gerar-relatorio');
    const btnRefazer = document.getElementById('btn-refazer');

    // --- 4. LÓGICA DE GERAÇÃO DO RELATÓRIO ---
    async function gerarRelatorio() {
        // Troca visual para carregamento
        viewEmpty.classList.add('hidden');
        viewLoading.classList.remove('hidden');

        try {
            // CHAMADA À API (Aqui o Python processaria os dados com IA)
            console.log("Iniciando processamento IA para:", usuario.nome);
            
            // Simulamos o envio do ID para que o Python busque Notas e Diário
            const relatorio = await HivemindAPI.request('/mentor/gerar', 'POST', { 
                usuario_id: usuario.id 
            });

            // Preenche os dados na tela
            exibirRelatorio(relatorio);

        } catch (error) {
            console.error("Erro na análise da IA:", error);
            alert("Não foi possível gerar seu relatório agora. Verifique sua conexão com o servidor.");
            
            // Volta para o estado inicial em caso de erro
            viewLoading.classList.add('hidden');
            viewEmpty.classList.remove('hidden');
        }
    }

    // --- 5. EXIBIÇÃO DOS DADOS ---
    function exibirRelatorio(dados) {
        // Elementos de texto
        document.getElementById('report-title').textContent = `Perfil: ${dados.perfil_principal}`;
        document.getElementById('report-summary').textContent = dados.resumo;

        // Lista de Pontos Fortes
        const listaStrengths = document.getElementById('report-strengths');
        listaStrengths.innerHTML = '';
        dados.pontos_fortes.forEach(ponto => {
            const li = document.createElement('li');
            li.textContent = ponto;
            listaStrengths.appendChild(li);
        });

        // Tags de Carreira
        const containerCarreiras = document.getElementById('report-careers');
        containerCarreiras.innerHTML = '';
        dados.carreiras.forEach(carreira => {
            const span = document.createElement('span');
            span.className = 'career-tag';
            span.textContent = carreira;
            containerCarreiras.appendChild(span);
        });

        // Troca visual para o relatório
        viewLoading.classList.add('hidden');
        viewReport.classList.remove('hidden');
        
        lucide.createIcons();
    }

    // --- 6. EVENTOS ---
    if (btnGerar) {
        btnGerar.addEventListener('click', gerarRelatorio);
    }

    if (btnRefazer) {
        btnRefazer.addEventListener('click', () => {
            if (confirm("Deseja gerar uma nova análise? Isso pode levar alguns segundos.")) {
                viewReport.classList.add('hidden');
                viewEmpty.classList.remove('hidden');
            }
        });
    }
});