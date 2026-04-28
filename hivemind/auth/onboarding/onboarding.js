document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- ELEMENTOS DO DOM ---
    const slides = document.querySelectorAll('.onboarding-slide');
    const btnNext = document.getElementById('next-slide');
    const btnPrev = document.getElementById('prev-slide');
    const btnFinish = document.getElementById('finish-onboarding');
    const dots = document.querySelectorAll('.dot');

    let currentSlide = 0;

    /**
     * Gerencia a troca visual dos slides e indicadores
     */
    function updateOnboarding() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
            slide.classList.toggle('hidden', index !== currentSlide);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Visibilidade dos botões de navegação
        if (btnPrev) btnPrev.style.visibility = currentSlide === 0 ? 'hidden' : 'visible';

        if (currentSlide === slides.length - 1) {
            btnNext?.classList.add('hidden');
            btnFinish?.classList.remove('hidden');
        } else {
            btnNext?.classList.remove('hidden');
            btnFinish?.classList.add('hidden');
        }
    }

    // --- EVENTOS DE NAVEGAÇÃO ---

    btnNext?.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateOnboarding();
        }
    });

    btnPrev?.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateOnboarding();
        }
    });

    // --- FINALIZAÇÃO INTEGRADA COM A API ---

    if (btnFinish) {
        btnFinish.addEventListener('click', async () => {
            // Feedback visual de carregamento
            btnFinish.disabled = true;
            btnFinish.innerHTML = `<span>Configurando...</span>`;

            try {
                // 1. Pegamos os dados do usuário que salvamos no Login/Cadastro
                const user = HivemindAPI.storage.getUser();

                if (user) {
                    // 2. Simulamos uma atualização no banco de dados via API
                    // Dizendo que o usuário já completou o onboarding
                    console.log("Atualizando status de onboarding para o usuário:", user.nome);
                    
                    // Exemplo: HivemindAPI.user.atualizarStatus(user.id, { onboarding: true });
                }

                // 3. Pequeno delay para dar sensação de processamento
                setTimeout(() => {
                    alert("Tudo pronto! Bem-vindo ao seu painel de controle.");
                    
                    // Redireciona para o Dashboard
                    // Caminho: sai de auth/onboarding para paginas/dashboard
                    window.location.href = "../../paginas/dashboard/dashboard.html";
                }, 1000);

            } catch (error) {
                console.error("Erro ao finalizar onboarding:", error);
                alert("Ocorreu um erro ao salvar suas configurações. Tente novamente.");
                
                btnFinish.disabled = false;
                btnFinish.innerHTML = `<span>Começar Agora</span>`;
            }
        });
    }

    // Inicializa a tela
    updateOnboarding();
});