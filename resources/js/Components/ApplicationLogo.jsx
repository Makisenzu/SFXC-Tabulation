import { usePage } from '@inertiajs/react';
import appLogo from '@/images/logo.png';

export default function ApplicationLogo(props) {
    const { appLogo: customLogoPath } = usePage().props;
    const customLogo = customLogoPath ? `/storage/${customLogoPath}` : null;

    return (
        <img
            src={customLogo || appLogo}
            alt="App Logo"
            className={props.className || "h-20 w-auto"}
        />
    );
}
