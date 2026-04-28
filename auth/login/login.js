document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os ícones do Lucide (Cadeado, Envelope, Olho)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- ELEMENTOS DO DOM ---
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loginBtn = document.getElementById('btn-entrar');

    // --- 2. LÓGICA DE MOSTRAR/ESCONDER SENHA ---
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            // Alterna entre 'password' e 'text'
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

            // Atualiza o ícone visualmente
            const icon = togglePasswordBtn.querySelector('i');
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            
            // Recarrega o Lucide para aplicar a mudança do ícone
            lucide.createIcons();
        });
    }

    // --- 3. LÓGICA DE SUBMISSÃO COM A API ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Validação simples de preenchimento
            if (!email || !password) {
                alert("Por favor, preencha todos os campos para continuar.");
                return;
            }

            // Feedback visual: desativa o botão enquanto "fala" com o servidor
            loginBtn.disabled = true;
            loginBtn.innerHTML = `<span>Autenticando...</span>`;

            try {
                // Chamada para a nossa API global (assets/js/api.js)
                const userData = await HivemindAPI.auth.login(email, password);
                
                console.log("Login bem-sucedido!", userData);

                // Guarda os dados do usuário no navegador (nome, id, etc)
                HivemindAPI.storage.saveUser(userData);

                // Redireciona para o Dashboard
                // Caminho: sai de auth/login para paginas/dashboard
                window.location.href = "../../paginas/dashboard/dashboard.html";

            } catch (error) {
                // Se o servidor der erro ou a senha estiver errada
                console.error("Falha na autenticação:", error);
                
                alert("E-mail ou senha incorretos. Verifique os dados ou se o servidor está ativo.");

                // Devolve o controle do botão ao usuário
                loginBtn.disabled = false;
                loginBtn.innerHTML = `<span>Entrar</span>`;
            }
        });
    }
});