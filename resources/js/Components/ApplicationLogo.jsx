import { usePage } from '@inertiajs/react';
import appLogo from '@/images/logo.png';

export default function ApplicationLogo(props) {
    const { appLogo: customLogoPath } = usePage().props;
    
    // Use custom logo from storage if available, otherwise use default logo
    const logoSrc = customLogoPath ? `/storage/${customLogoPath}` : appLogo;

    return (
        <img
            src={logoSrc}
            alt="App Logo"
            className={props.className || "h-20 w-auto"}
        />
    );
}
