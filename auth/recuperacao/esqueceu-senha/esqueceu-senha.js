document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- ELEMENTOS DO DOM ---
    const forgotForm = document.getElementById('forgot-form');
    const emailInput = document.getElementById('email');
    const btnEnviar = document.getElementById('btn-enviar-link');

    // --- 2. LOGICA DE SUBMISSÃO ---
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();

            // Validação simples de front-end
            if (!email || !email.includes('@')) {
                alert("Por favor, insira um e-mail válido para continuar.");
                emailInput.style.borderColor = "var(--error)";
                return;
            }

            // Feedback visual no botão para evitar cliques múltiplos
            btnEnviar.disabled = true;
            btnEnviar.innerHTML = `<span>Enviando...</span>`;

            try {
                // 3. CHAMADA À API
                // Aqui usamos o método genérico da nossa API central
                console.log("Solicitando recuperação para:", email);
                
                await HivemindAPI.request('/auth/recuperar-senha', 'POST', { email });

                // Sucesso: Avisa o usuário e redireciona
                alert(`Sucesso! Um código de verificação foi enviado para ${email}. Verifique sua caixa de entrada.`);
                
                // Caminho: sai de esqueceu-senha e entra em enviar-codigo
                window.location.href = "../enviar-codigo/enviar-codigo.html";

            } catch (error) {
                // Erro: Caso o e-mail não exista ou o servidor esteja offline
                console.error("Erro na recuperação:", error);
                
                alert("Não foi possível processar a solicitação. Verifique se o e-mail está correto ou tente novamente mais tarde.");
                
                // Reseta o estado do botão
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = `<span>Enviar Código</span>`;
                emailInput.style.borderColor = "var(--border-color)";
            }
        });
    }
});