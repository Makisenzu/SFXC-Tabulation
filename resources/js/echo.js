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
    // console.warn('CSRF token not found. Private channels may not work.');
}


let echoInstance = null;

export const initEcho = () => {
    if (typeof window !== 'undefined' && !echoInstance) {
        echoInstance = new Echo(echoConfig);
    }
    return echoInstance;
};

export const getEcho = () => {
    return echoInstance;
};

window.Echo = new Echo(echoConfig);