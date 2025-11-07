import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
};

const csrfToken = getCsrfToken();

const echoConfig = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true,
};

if (csrfToken) {
    echoConfig.auth = {
        headers: {
            'X-CSRF-TOKEN': csrfToken,
        },
    };
} else {
    console.warn('CSRF token not found. Private channels may not work.');
}

// Debug: Log Echo configuration
console.log('🔧 Echo Config:', {
    broadcaster: echoConfig.broadcaster,
    key: echoConfig.key ? 'Set' : 'Missing',
    cluster: echoConfig.cluster,
    csrfToken: csrfToken ? 'Present' : 'Missing'
});

window.Echo = new Echo(echoConfig);

// Debug: Confirm Echo is initialized
console.log('✅ Echo initialized:', window.Echo);

// Enable Pusher logging (for development)
if (import.meta.env.DEV) {
    Pusher.logToConsole = true;
}