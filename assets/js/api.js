/**
 * Hivemind API - Central de Comunicação
 * Este arquivo gerencia todas as chamadas para o backend e armazenamento local.
 */

const HivemindAPI = {
    // 1. Configuração do Endereço do Servidor
    // Quando você rodar o Python (Flask/FastAPI), o endereço geralmente será este:
    BASE_URL: 'http://127.0.0.1:5000/api',

    // 2. Funções de Armazenamento Local (LocalStorage)
    // Útil para manter o nome do usuário e o token entre as páginas
    storage: {
        saveUser: (userData) => {
            localStorage.setItem('hivemind_user', JSON.stringify(userData));
        },
        getUser: () => {
            const user = localStorage.getItem('hivemind_user');
            return user ? JSON.parse(user) : null;
        },
        clear: () => {
            localStorage.removeItem('hivemind_user');
        }
    },

    // 3. Função Genérica para Requisições (O coração do fetch)
    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.BASE_URL}${endpoint}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                // Aqui você enviaria o token de segurança no futuro
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Falha na comunicação com a API:", error);
            throw error;
        }
    },

    // 4. Métodos Específicos para as suas Telas
    auth: {
        login: (email, senha) => HivemindAPI.request('/login', 'POST', { email, senha }),
        cadastro: (dados) => HivemindAPI.request('/cadastro', 'POST', dados)
    },

    user: {
        getPerfil: (id) => HivemindAPI.request(`/perfil/${id}`),
        salvarRelato: (relato) => HivemindAPI.request('/diario', 'POST', relato),
        getDesempenho: () => HivemindAPI.request('/desempenho')
    }
};