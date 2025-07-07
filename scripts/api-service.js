const API_BASE_URL = 'https://evolution.alicefinancas.com.br'; // URL atualizada

class ApiService {
    // Método genérico melhorado
    async request(endpoint, method = 'GET', data = null, requiresAuth = true) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
        };

        if (requiresAuth) {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Não autenticado');
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
            credentials: 'include' // Para cookies de sessão, se necessário
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Falha na requisição para ${endpoint}:`, error);
            throw error;
        }
    }

    // Autenticação
    async login(email, senha) {
        return this.request('/auth/login', 'POST', { email, senha }, false);
    }

    async verifyToken() {
        return this.request('/auth/verify');
    }

    // Posts
    async getPost(id) {
        const hasToken = localStorage.getItem('authToken');
        return this.request(`/posts/${id}`, 'GET', null, !!hasToken);
    }

    async getPosts() {
        const hasToken = localStorage.getItem('authToken');
        return this.request('/posts', 'GET', null, !!hasToken);
    }

    async createPost(postData) {
        return this.request('/posts', 'POST', postData);
    }

    async updatePost(id, postData) {
        return this.request(`/posts/${id}`, 'PUT', postData);
    }

    async deletePost(id) {
        return this.request(`/posts/${id}`, 'DELETE');
    }

    // Eventos
    async getEvents() {
        const hasToken = localStorage.getItem('authToken');
        return this.request('/eventos', 'GET', null, !!hasToken);
    }

    async createEvent(eventData) {
        return this.request('/eventos', 'POST', eventData);
    }

    async updateEvent(id, eventData) {
        return this.request(`/eventos/${id}`, 'PUT', eventData);
    }

    async deleteEvent(id) {
        return this.request(`/eventos/${id}`, 'DELETE');
    }

    // Depoimentos
    async getTestimonials() {
        return this.request('/testimonials');
    }

    async createTestimonial(testimonialData) {
        return this.request('/testimonials', 'POST', testimonialData);
    }

    async updateTestimonial(id, testimonialData) {
        return this.request(`/testimonials/${id}`, 'PUT', testimonialData);
    }

    async deleteTestimonial(id) {
        return this.request(`/testimonials/${id}`, 'DELETE');
    }


}

export const apiService = new ApiService();