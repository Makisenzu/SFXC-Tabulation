import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import bgImage from '@/images/bgimage.jpg';

export default function GuestLayout({ children }) {
    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `url(${bgImage.src || bgImage})`,
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            
            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                    <ApplicationLogo className="h-36 w-36 fill-current text-white drop-shadow-lg" />
                    </Link>
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                            SFXC Tabulation
                        </h1>
                    </div>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                    <div className="p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}