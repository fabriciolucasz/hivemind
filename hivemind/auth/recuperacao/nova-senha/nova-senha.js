document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os ícones do Lucide (Cadeados e Olhos)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- ELEMENTOS DO DOM ---
    const resetForm = document.getElementById('reset-password-form');
    const passwordInput = document.getElementById('new-password');
    const confirmInput = document.getElementById('confirm-password');
    const toggleButtons = document.querySelectorAll('.toggle-password');
    const btnSalvar = document.getElementById('btn-salvar-senha');

    // --- 2. LÓGICA DE MOSTRAR/ESCONDER SENHA ---
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const isPassword = input.getAttribute('type') === 'password';
            
            input.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Atualiza o ícone visualmente
            const icon = btn.querySelector('i');
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            lucide.createIcons();
        });
    });

    // --- 3. VALIDAÇÃO E SUBMISSÃO COM API ---
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newPassword = passwordInput.value;
            const confirmPassword = confirmInput.value;

            // Validações de Front-end (Segurança Básica)
            if (!newPassword || !confirmPassword) {
                alert("Por favor, preencha os dois campos de senha.");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("As senhas não coincidem. Tente digitar novamente.");
                confirmInput.style.borderColor = "var(--error)";
                confirmInput.focus();
                return;
            }

            if (newPassword.length < 6) {
                alert("Para sua segurança, a senha deve ter pelo menos 6 caracteres.");
                passwordInput.style.borderColor = "var(--error)";
                return;
            }

            // Feedback visual no botão
            btnSalvar.disabled = true;
            btnSalvar.innerHTML = `<span>Atualizando...</span>`;

            try {
                // CHAMADA REAL À API
                console.log("Enviando nova senha para o servidor...");
                
                // Enviamos a nova senha para a rota de atualização
                await HivemindAPI.request('/auth/atualizar-senha', 'POST', { 
                    novaSenha: newPassword 
                });

                // Sucesso: Senha alterada
                alert("Senha alterada com sucesso! Você já pode entrar com suas novas credenciais.");
                
                // Redirecionamento final para o Login
                // Caminho: sai de nova-senha (3 níveis) e entra em login
                window.location.href = "../../login/login.html";

            } catch (error) {
                console.error("Erro ao atualizar senha:", error);
                alert("Ocorreu um erro ao salvar sua nova senha. Verifique sua conexão e tente novamente.");
                
                // Reseta o botão para nova tentativa
                btnSalvar.disabled = false;
                btnSalvar.innerHTML = `<span>Salvar Nova Senha</span>`;
                
                passwordInput.style.borderColor = "var(--border-color)";
                confirmInput.style.borderColor = "var(--border-color)";
            }
        });
    }
});