import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
};

const csrfToken = getCsrfToken();

// Determine which broadcaster to use based on environment
const broadcaster = import.meta.env.VITE_REVERB_APP_KEY ? 'reverb' : 'pusher';

let echoConfig;

if (broadcaster === 'reverb') {
    // LOCAL DEVELOPMENT - Use Reverb (works without internet)
    echoConfig = {
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    };
} else {
    // PRODUCTION - Use Pusher (requires internet)
    echoConfig = {
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true,
        encrypted: true,
    };
}

// Add CSRF token for authentication
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
    csrfToken: csrfToken ? 'Present' : 'Missing'
});

window.Echo = new Echo(echoConfig);

// Debug: Confirm Echo is initialized
console.log('✅ Echo initialized with broadcaster:', broadcaster);

// Enable Pusher logging (for development)
if (import.meta.env.DEV) {
    Pusher.logToConsole = true;
}