import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Baby, UserCheck, Activity, CheckCircle2, FlaskConical, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import PackageCard from '../components/ui/PackageCard';
import PackageDetailsModal from '../components/ui/PackageDetailsModal';

const HealthPackages = () => {
    const navigate = useNavigate();
    const { packages, labs } = useData();
    const { location } = useLocation();
    const { addToCart, cart } = useCart();
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedPackage, setSelectedPackage] = useState(null);

    const categories = [
        { name: 'All', icon: Activity },
        { name: 'Full Body', icon: Activity },
        { name: 'Senior Citizen', icon: UserCheck },
        { name: 'Women Health', icon: HeartPulse },
        { name: 'Child Care', icon: Baby },
    ];

    const activePackages = packages
        .filter(p => {
            if (!p) return false;
            const status = String(p.status || '').toLowerCase();
            if (status !== 'active') return false;
            
            if (activeCategory !== 'All' && p.category !== activeCategory) return false;
            
            return true;
        })
        .map(p => {
            const lab = Array.isArray(labs) ? labs.find(l => l?.name === p?.labName || l?.name === p?.lab) : null;
            const labLoc = (lab?.location || '').toLowerCase();

            const rawUserLoc = (location || '').toLowerCase();
            const locationParts = rawUserLoc.split(',').map(s => s.trim());
            const userCity = locationParts.length >= 2 ? locationParts[1] : locationParts[0];
            const userLoc = userCity || rawUserLoc;

            const hasNoLab = !lab || !labLoc;

            const isNational = hasNoLab ||
                               labLoc.includes('multiple') ||
                               labLoc.includes('ncr') ||
                               labLoc.includes('india') ||
                               labLoc.includes('national') ||
                               labLoc.includes('pan india') ||
                               labLoc.includes('nationwide') ||
                               labLoc.includes('across india');

            const ncrCities = ['delhi', 'noida', 'gurugram', 'gurgaon', 'ghaziabad', 'faridabad', 'ncr', 'greater noida'];
            const isUserInNCR = ncrCities.some(c => rawUserLoc.includes(c));
            const isLabInNCR = ncrCities.some(c => labLoc.includes(c));

            const isDirectMatch = !hasNoLab && userLoc && userLoc !== 'india' && (
                labLoc.includes(userLoc) ||
                userLoc.includes(labLoc) ||
                (isUserInNCR && isLabInNCR)
            );

            return {
                ...p,
                isLocal: isDirectMatch,
                isNational: isNational
            };
        })
        .sort((a, b) => {
            if (a?.isLocal && !b?.isLocal) return -1;
            if (!a?.isLocal && b?.isLocal) return 1;
            if (a?.isNational && !b?.isNational) return -1;
            if (!a?.isNational && b?.isNational) return 1;
            
            // Tie-breaker: Newest first
            const idA = String(a?.id || '');
            const idB = String(b?.id || '');
            return idB.localeCompare(idA);
        });

    const isPkgInCart = (pkgId) => cart.find(i => i?.id === pkgId);

    return (
        <div className="pt-32 pb-28 bg-[#f8fafc] min-h-screen relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-br from-medical-green/5 via-brand-teal/5 to-transparent -z-10 pointer-events-none" />
            <div className="fixed -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-medical-green/5 blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white text-medical-green px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[2px] mb-8 shadow-sm"
                    >
                        <ShieldCheck size={16} /> Certified Health Partners
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-dark-text mb-6 tracking-tight leading-[1.1]">
                        Preventive <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-green to-brand-teal inline-block mt-2">Health Packages</span>
                    </h1>
                    <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                        Custom-tailored health checkups for every member of your family. 
                        Choose from a wide range of premium diagnostic solutions.
                    </p>
                    
                    <div className="flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <MapPin size={12} className="text-medical-green" /> Available for {location}
                        </span>
                    </div>
                </div>

                {/* Tabs - Mobile Scrollable */}
                <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-4 mb-16 no-scrollbar px-2 max-w-5xl mx-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[2px] transition-all flex-shrink-0 relative overflow-hidden group ${activeCategory === cat.name
                                ? 'bg-dark-text text-white shadow-xl shadow-dark-text/20 scale-105'
                                : 'bg-white text-gray-400 border border-gray-100 hover:border-medical-green/30 hover:text-medical-green'
                                }`}
                        >
                            <cat.icon size={18} className={activeCategory === cat.name ? 'text-medical-green' : 'group-hover:scale-110 transition-transform'} />
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {(activePackages || []).length > 0 ? (
                        (activePackages || []).map((pkg) => (
                            <PackageCard 
                                key={pkg?.id || Math.random()} 
                                pkg={{
                                    ...pkg,
                                    isLocal: pkg.isLocal,
                                    isNational: pkg.isNational
                                }} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                            <FlaskConical size={48} className="text-gray-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-dark-text uppercase tracking-tight mb-2">No packages available</h3>
                            <p className="text-grey-text font-bold">Try adjusting your filters or location settings.</p>
                        </div>
                    )}
                </div>


                {/* Trust Banner */}
                <div className="mt-20 p-8 rounded-3xl bg-dark-text text-white flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Not sure which package to choose?</h2>
                        <p className="opacity-70">Consult with our health experts for a personalized recommendation.</p>
                    </div>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-dark-text px-8 h-12">Talk to Expert</Button>
                </div>
            </div>

            <PackageDetailsModal
                isOpen={!!selectedPackage}
                onClose={() => setSelectedPackage(null)}
                pkg={selectedPackage}
            />
        </div>
    );
};

export default HealthPackages;
