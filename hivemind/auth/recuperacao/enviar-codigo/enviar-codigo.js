document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- ELEMENTOS DO DOM ---
    const codeInputs = document.querySelectorAll('.code-input');
    const verifyForm = document.getElementById('verify-form');
    const btnVerificar = document.getElementById('btn-verificar');
    const btnReenviar = document.getElementById('btn-reenviar');

    // --- 2. LÓGICA DE FOCO AUTOMÁTICO (Dígito por Dígito) ---
    codeInputs.forEach((input, index) => {
        // Ao digitar, pula para o próximo campo
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            validarFormulario();
        });

        // Ao apagar (Backspace), volta para o campo anterior
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });

    /**
     * Habilita o botão apenas quando os 6 dígitos estiverem preenchidos
     */
    function validarFormulario() {
        const todosPreenchidos = Array.from(codeInputs).every(input => input.value !== "");
        btnVerificar.disabled = !todosPreenchidos;
    }

    // --- 3. SUBMISSÃO E VERIFICAÇÃO COM API ---
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Une os dígitos em uma única string
            const codigoCompleto = Array.from(codeInputs).map(input => input.value).join('');
            
            // Feedback visual no botão
            btnVerificar.disabled = true;
            btnVerificar.innerHTML = `<span>Validando...</span>`;

            try {
                // CHAMADA REAL À API
                console.log("Validando código no servidor:", codigoCompleto);
                
                // Fazemos a requisição para a rota que o seu Python terá
                await HivemindAPI.request('/auth/verificar-codigo', 'POST', { codigo: codigoCompleto });

                // Sucesso: Código correto
                alert("Código confirmado com sucesso! Vamos definir sua nova senha.");
                
                // Caminho: sai de enviar-codigo e entra em nova-senha
                window.location.href = "../nova-senha/nova-senha.html";

            } catch (error) {
                // Erro: Código errado ou servidor offline
                console.error("Falha na verificação:", error);
                alert("Código inválido ou expirado. Por favor, tente novamente.");
                
                // Reseta os campos e o botão para nova tentativa
                btnVerificar.disabled = false;
                btnVerificar.innerHTML = `<span>Verificar Código</span>`;
                codeInputs.forEach(input => input.value = "");
                codeInputs[0].focus();
            }
        });
    }

    // --- 4. LÓGICA DE REENVIAR CÓDIGO ---
    if (btnReenviar) {
        btnReenviar.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                // Opcional: Você pode pegar o email do LocalStorage se salvou no passo anterior
                // const userEmail = localStorage.getItem('recovery_email');
                // await HivemindAPI.request('/auth/reenviar-codigo', 'POST', { email: userEmail });
                
                alert("Um novo código de 6 dígitos foi enviado para o seu e-mail.");
            } catch (err) {
                alert("Não foi possível reenviar o código agora.");
            }
        });
    }
});