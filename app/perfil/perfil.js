document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa ícones
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. SEGURANÇA: VERIFICAÇÃO DE SESSÃO ---
    const usuarioLogado = HivemindAPI.storage.getUser();
    if (!usuarioLogado) {
        window.location.href = "../../auth/login/login.html";
        return;
    }

    // --- 3. CARREGAMENTO INICIAL DOS DADOS ---
    const inputNome = document.getElementById('perfil-nome');
    const inputEmail = document.getElementById('perfil-email');

    async function carregarDadosPerfil() {
        try {
            // Busca dados atualizados do servidor
            const dados = await HivemindAPI.request(`/user/perfil/${usuarioLogado.id}`);
            
            inputNome.value = dados.nome || usuarioLogado.nome;
            inputEmail.value = dados.email || usuarioLogado.email;
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            // Fallback para os dados do storage se a API falhar
            inputNome.value = usuarioLogado.nome;
            inputEmail.value = usuarioLogado.email;
        }
    }

    // --- 4. ATUALIZAÇÃO DE PERFIL ---
    const formPerfil = document.getElementById('form-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = document.getElementById('btn-atualizar');
            btn.disabled = true;
            btn.textContent = "Salvando...";

            try {
                const novoNome = inputNome.value.trim();
                
                await HivemindAPI.request('/user/update', 'POST', {
                    id: usuarioLogado.id,
                    nome: novoNome
                });

                // Atualiza o storage local para refletir o novo nome no Dashboard
                usuarioLogado.nome = novoNome;
                HivemindAPI.storage.saveUser(usuarioLogado);

                alert("Perfil atualizado com sucesso!");
            } catch (error) {
                alert("Erro ao atualizar perfil.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Salvar Alterações";
            }
        });
    }

    // --- 5. EXPORTAÇÃO DE DADOS (LGPD) ---
    const btnExportar = document.getElementById('btn-exportar');
    if (btnExportar) {
        btnExportar.addEventListener('click', async () => {
            try {
                const dadosCompletos = await HivemindAPI.request(`/user/export/${usuarioLogado.id}`);
                
                // Transforma o JSON em arquivo para download
                const blob = new Blob([JSON.stringify(dadosCompletos, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dados-hivemind-${usuarioLogado.nome}.json`;
                a.click();
            } catch (err) {
                alert("Erro ao exportar dados.");
            }
        });
    }

    // --- 6. EXCLUSÃO DE CONTA ---
    const btnDeletar = document.getElementById('btn-deletar-conta');
    if (btnDeletar) {
        btnDeletar.addEventListener('click', async () => {
            const confirmar = confirm("TEM CERTEZA? Esta ação não pode ser desfeita e todos os seus dados serão apagados.");
            
            if (confirmar) {
                try {
                    await HivemindAPI.request(`/user/delete/${usuarioLogado.id}`, 'DELETE');
                    alert("Sua conta foi excluída. Sentiremos sua falta!");
                    HivemindAPI.storage.clear();
                    window.location.href = "../../auth/login/login.html";
                } catch (err) {
                    alert("Erro ao excluir conta. Tente novamente.");
                }
            }
        });
    }

    // Inicia a página
    carregarDadosPerfil();
});