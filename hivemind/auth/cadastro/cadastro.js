document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- ELEMENTOS DO DOM ---
    const cadastroForm = document.getElementById('cadastro-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const toggleButtons = document.querySelectorAll('.toggle-password');
    const btnCadastrar = cadastroForm.querySelector('button[type="submit"]');

    // --- 2. LÓGICA DE MOSTRAR/ESCONDER SENHA ---
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const isPassword = input.getAttribute('type') === 'password';
            
            input.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Atualiza o ícone do botão clicado
            const icon = btn.querySelector('i');
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            lucide.createIcons();
        });
    });

    // --- 3. VALIDAÇÃO E SUBMISSÃO ---
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validações de Front-end
            if (!nome || !email || !password) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            if (password !== confirmPassword) {
                alert("As senhas não coincidem!");
                confirmPasswordInput.style.borderColor = "var(--error)";
                confirmPasswordInput.focus();
                return;
            }

            // Reseta estilo de erro se passar na validação
            confirmPasswordInput.style.borderColor = "var(--border-color)";

            // Feedback visual no botão
            btnCadastrar.disabled = true;
            btnCadastrar.innerHTML = `<span>Criando conta...</span>`;

            // Objeto com os dados para o Python
            const dadosNovoUsuario = {
                nome: nome,
                email: email,
                senha: password
            };

            try {
                // Chamada para a API Global (definida no api.js)
                const userData = await HivemindAPI.auth.cadastro(dadosNovoUsuario);
                
                console.log("Usuário cadastrado com sucesso:", userData);

                // Salvamos os dados básicos no navegador (LocalStorage)
                HivemindAPI.storage.saveUser(userData);

                alert(`Bem-vindo, ${nome}! Vamos configurar o seu perfil.`);

                // Redireciona para o Onboarding
                // Caminho: sai de auth/cadastro e entra em auth/onboarding
                window.location.href = "../onboarding/onboarding.html";

            } catch (error) {
                console.error("Erro ao realizar cadastro:", error);
                alert("Não foi possível criar a conta. Verifique se o e-mail já existe ou se o servidor está ativo.");
                
                // Devolve o controle do botão
                btnCadastrar.disabled = false;
                btnCadastrar.innerHTML = `<span>Criar Conta</span>`;
            }
        });
    }
});