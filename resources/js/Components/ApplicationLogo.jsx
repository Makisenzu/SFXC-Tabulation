import { useState, useEffect } from 'react';
import appLogo from '@/images/logo.png';

export default function ApplicationLogo(props) {
    const [customLogo, setCustomLogo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch custom logo if available
        fetch('/api/settings/logo')
            .then(res => res.json())
            .then(data => {
                if (data.logo) {
                    setCustomLogo(`/storage/${data.logo}`);
                }
            })
            .catch(err => console.error('Error loading custom logo:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={props.className || "h-20 w-auto"}>
                <div className="animate-pulse bg-gray-200 rounded h-full w-full"></div>
            </div>
        );
    }

    return (
        <img
            src={customLogo || appLogo}
            alt="App Logo"
            className={props.className || "h-20 w-auto"}
        />
    );
}
