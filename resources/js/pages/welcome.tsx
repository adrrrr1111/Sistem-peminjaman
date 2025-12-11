import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, ArrowRight, Box, Layers, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome({ itemsCount }: { itemsCount: number }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-hidden relative">
                {/* Grid Background Pattern */}
                <div 
                    className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                    }}
                />

                <div className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-6 md:px-12">
                    {/* Header */}
                    <header className="flex justify-between items-center py-8">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-bold">
                                <Package className="w-5 h-5" />
                             </div>
                             <span className="font-bold text-xl tracking-tight">Peminjaman</span>
                        </div>
                        
                        <nav className="flex items-center gap-6 text-sm font-medium">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className="text-gray-400 hover:text-white transition-colors">Log In</Link>
                                    <Link
                                        href={register()}
                                        className="px-4 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    {/* Main Content Grid */}
                    <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
                        {/* Left Column: Text */}
                        <div className="flex flex-col justify-center space-y-8">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                                Manage <br />
                                Your Assets. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                                    Instantly.
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                                The next-generation inventory system. Real-time tracking, QR code integration, and seamless borrowing workflows. 
                                Built for speed and reliability.
                            </p>

                            <div className="flex flex-row gap-4">
                                <Link
                                    href={register()}
                                    className="h-12 px-8 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    Start Borrowing
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href={login()}
                                    className="h-12 px-8 border border-white/20 rounded-full font-medium flex items-center hover:bg-white/10 transition-colors"
                                >
                                    Documentation
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Visualization */}
                        <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center">
                            <StorageGrid itemsCount={itemsCount} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

// Visualization Component
function StorageGrid({ itemsCount }: { itemsCount: number }) {
    // Generate a grid of items
    const rows = 8;
    const cols = 6;
    const [activeCell, setActiveCell] = useState<{r: number, c: number} | null>(null);

    useEffect(() => {
        // Randomly "scan" cells
        const interval = setInterval(() => {
            setActiveCell({
                r: Math.floor(Math.random() * rows),
                c: Math.floor(Math.random() * cols)
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-md aspect-[3/4] perspective-1000">
             {/* The Rack/Grid Container */}
             <div 
                className="absolute inset-0 grid gap-2 p-4 bg-zinc-900/50 border border-white/10 rounded-xl backdrop-blur-sm transform rotate-y-12 rotate-x-6 hover:rotate-y-0 transition-transform duration-700 ease-out"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`
                }}
            >
                {Array.from({ length: rows * cols }).map((_, i) => {
                    const r = Math.floor(i / cols);
                    const c = i % cols;
                    const isActive = activeCell?.r === r && activeCell?.c === c;
                    // Random populated cells
                    const isOccupied = (i * 123 + 45) % 3 !== 0; 
                    
                    return (
                        <div 
                            key={i} 
                            className={`
                                relative rounded-sm transition-all duration-300 border
                                ${isActive ? 'bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 scale-110' : ''}
                                ${isOccupied && !isActive ? 'bg-zinc-800 border-white/5' : 'bg-transparent border-white/5'}
                            `}
                        >
                            {isOccupied && (
                                <div className={`w-full h-full flex items-center justify-center opacity-40 ${isActive ? 'opacity-100' : ''}`}>
                                    <Box className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {/* Scan Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 blur-sm animate-scan" style={{ animationDuration: '3s' }} />
            </div>

            {/* Float Stats Card */}
            <div className="absolute -bottom-10 -left-10 bg-black border border-white/10 p-4 rounded-lg shadow-2xl flex gap-4 items-center animate-bounce-slow">
                <div className="w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">System Status</div>
                    <div className="text-white font-mono">Operational</div>
                </div>
            </div>
             <div className="absolute -top-5 -right-5 bg-black border border-white/10 p-4 rounded-lg shadow-2xl flex gap-4 items-center animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Items</div>
                    <div className="text-white font-mono">{itemsCount}</div>
                </div>
            </div>
        </div>
    );
}
