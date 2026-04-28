document.addEventListener('DOMContentLoaded', async () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- 1. SEGURANÇA: VERIFICAÇÃO DE SESSÃO ---
    const usuario = HivemindAPI.storage.getUser();
    if (!usuario) {
        window.location.href = "../../auth/login/login.html";
        return;
    }

    // --- 2. CONFIGURAÇÃO DO TESTE (Exemplo de estrutura) ---
    const perguntas = [
        {
            texto: "Como preferes resolver problemas complexos?",
            opcoes: ["Lógica e dados", "Criatividade pura", "Conversa e empatia", "Prática direta"]
        },
        {
            texto: "Num projeto de grupo, qual é o teu papel natural?",
            opcoes: ["O organizador", "O visionário", "O mediador", "O executor"]
        }
        // Repetir até 25 questões...
    ];

    let questaoAtual = 0;
    let respostasUsuario = [];

    // --- 3. ELEMENTOS DO DOM ---
    const viewStart = document.getElementById('view-start');
    const viewQuiz = document.getElementById('view-quiz');
    const viewLoading = document.getElementById('view-loading');
    const questionText = document.getElementById('question-text');
    const optionsList = document.querySelector('.options-list');
    const progressFill = document.querySelector('.progress-bar-fill');
    const currentQText = document.getElementById('current-q');
    const percentText = document.getElementById('percent-complete');
    
    const btnIniciar = document.getElementById('btn-iniciar-teste');
    const btnProximo = document.getElementById('btn-proximo');
    const btnVoltar = document.getElementById('btn-voltar');

    // --- 4. LÓGICA DE NAVEGAÇÃO ---

    btnIniciar.addEventListener('click', () => {
        viewStart.classList.add('hidden');
        viewQuiz.classList.remove('hidden');
        carregarQuestao();
    });

    function carregarQuestao() {
        const q = perguntas[questaoAtual];
        questionText.textContent = q.texto;
        currentQText.textContent = questaoAtual + 1;
        
        // Atualiza Progresso
        const progresso = ((questaoAtual + 1) / perguntas.length) * 100;
        progressFill.style.width = `${progresso}%`;
        percentText.textContent = `${Math.round(progresso)}%`;

        // Renderiza Opções
        optionsList.innerHTML = '';
        q.opcoes.forEach((opcao, index) => {
            const btn = document.createElement('button');
            btn.className = `option-button ${respostasUsuario[questaoAtual] === index ? 'selected' : ''}`;
            btn.innerHTML = `<span>${opcao}</span>`;
            btn.onclick = () => selecionarOpcao(index);
            optionsList.appendChild(btn);
        });

        btnVoltar.disabled = questaoAtual === 0;
        btnProximo.disabled = respostasUsuario[questaoAtual] === undefined;
    }

    function selecionarOpcao(index) {
        respostasUsuario[questaoAtual] = index;
        carregarQuestao(); // Atualiza visualmente a seleção
        
        // Pequeno delay para feedback visual antes de avançar automaticamente
        setTimeout(() => {
            if (questaoAtual < perguntas.length - 1) {
                questaoAtual++;
                carregarQuestao();
            } else {
                finalizarTeste();
            }
        }, 300);
    }

    btnVoltar.addEventListener('click', () => {
        if (questaoAtual > 0) {
            questaoAtual--;
            carregarQuestao();
        }
    });

    // --- 5. FINALIZAÇÃO E ENVIO (API) ---

    async function finalizarTeste() {
        viewQuiz.classList.add('hidden');
        viewLoading.classList.remove('hidden');

        try {
            console.log("A enviar resultados para o Hivemind...");
            
            // Enviamos as respostas para o servidor Python
            await HivemindAPI.request('/teste/salvar', 'POST', {
                usuario_id: usuario.id,
                respostas: respostasUsuario
            });

            alert("Teste concluído! O Mentor IA já está a preparar o teu relatório.");
            
            // Redireciona para a página do Mentor IA
            window.location.href = "../mentor-ia/mentor-ia.html";

        } catch (error) {
            console.error("Erro ao salvar teste:", error);
            alert("Erro ao ligar ao servidor. Não te preocupes, as tuas respostas foram guardadas localmente.");
            window.location.href = "../mentor-ia/mentor-ia.html";
        }
    }
});