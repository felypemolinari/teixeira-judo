const API_BASE_URL = 'http://localhost:8080'; // Mantenha isso configurável

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
    async login(email, password) {
        return this.request('/api/auth/login', 'POST', { email, password }, false);
    }

    async verifyToken() {
        return this.request('/api/auth/verify');
    }

    // Posts
    async getPost(id) {
        return this.request(`/api/posts/${id}`);
    }

    async getPosts() {
        return this.request('/api/posts');
    }

    async createPost(postData) {
        return this.request('/api/posts', 'POST', postData);
    }

    async updatePost(id, postData) {
        return this.request(`/api/posts/${id}`, 'PUT', postData);
    }

    async deletePost(id) {
        return this.request(`/api/posts/${id}`, 'DELETE');
    }

    // Eventos
    async getEvents() {
        return this.request('/api/events');
    }

    async createEvent(eventData) {
        return this.request('/api/events', 'POST', eventData);
    }

    async updateEvent(id, eventData) {
        return this.request(`/api/events/${id}`, 'PUT', eventData);
    }

    async deleteEvent(id) {
        return this.request(`/api/events/${id}`, 'DELETE');
    }

    // Depoimentos
    async getTestimonials() {
        return this.request('/api/testimonials');
    }

    async createTestimonial(testimonialData) {
        return this.request('/api/testimonials', 'POST', testimonialData);
    }

    async updateTestimonial(id, testimonialData) {
        return this.request(`/api/testimonials/${id}`, 'PUT', testimonialData);
    }

    async deleteTestimonial(id) {
        return this.request(`/api/testimonials/${id}`, 'DELETE');
    }

    // Contatos
    async getContacts() {
        return this.request('/api/contacts');
    }

    async deleteContact(id) {
        return this.request(`/api/contacts/${id}`, 'DELETE');
    }

    async sendContactForm(data) {
        return this.request('/api/contact', 'POST', data, false);
    }
}

export const apiService = new ApiService();