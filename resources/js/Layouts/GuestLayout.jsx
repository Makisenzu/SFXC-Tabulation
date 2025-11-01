import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import bgImage from '@/images/bgimage.jpg';

export default function GuestLayout({ children }) {
    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bgImage.src || bgImage})`,
            }}
        >
            {/* Overlay with gradient for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
            
            {/* Main Container */}
            <div className="relative w-full max-w-5xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side - Branding */}
                    <div className="hidden lg:block space-y-8">
                        <div className="space-y-6">
                            <Link href="/" className="inline-block">
                                <ApplicationLogo className="h-24 w-24 fill-current text-white transition-transform duration-300 hover:scale-105" />
                            </Link>
                            
                            <div className="space-y-3">
                                <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
                                    SFXC<br />Tabulation
                                </h1>
                                <div className="h-1 w-20 bg-white/80"></div>
                            </div>
                            
                            <p className="text-white/80 text-lg leading-relaxed max-w-md">
                                Secure and efficient tabulation system for streamlined event management and results processing.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form Card */}
                    <div className="w-full">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-10">
                            <Link href="/" className="inline-block mb-6">
                                <ApplicationLogo className="h-20 w-20 fill-current text-white mx-auto" />
                            </Link>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                SFXC Tabulation
                            </h1>
                            <div className="h-1 w-16 bg-white/80 mx-auto mt-4"></div>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                            <div className="p-10 sm:p-12">
                                {children}
                            </div>
                            
                            {/* Footer */}
                            <div className="px-10 sm:px-12 pb-10">
                                <div className="pt-8 border-t border-gray-200">
                                    <p className="text-center text-sm text-gray-600">
                                        Secure authentication system
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}