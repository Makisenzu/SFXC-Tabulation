import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Function to get the current CSRF token
function getCsrfToken() {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    return token ? token.content : null;
}

// Set CSRF token for all axios requests
const token = getCsrfToken();
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
} else {
    console.error('CSRF token not found');
}

// Add request interceptor to always use the latest CSRF token
window.axios.interceptors.request.use(
    (config) => {
        const currentToken = getCsrfToken();
        if (currentToken) {
            config.headers['X-CSRF-TOKEN'] = currentToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle CSRF token mismatch
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 419) {
            // CSRF token mismatch - reload the page to get a fresh token
            console.warn('CSRF token mismatch detected, reloading page...');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

import './echo';