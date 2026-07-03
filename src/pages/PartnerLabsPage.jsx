import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLocation } from '../context/LocationContext';
import { MapPin, Star, ShieldCheck, Clock, Building2, Search, ArrowRight, FlaskConical, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const PartnerLabsPage = () => {
    const navigate = useNavigate();
    const { labs, isDataLoaded } = useData();
    const { location } = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (isDataLoaded) {
            setIsLoaded(true);
        }
    }, [isDataLoaded]);

    const activeLabs = (labs || []).filter(lab => lab && String(lab.status || '').toLowerCase() === 'active');

    // ── Parse user city from full or short location string ─────────────────
    const rawUserLoc = (location || '').toLowerCase().trim();
    const locParts = rawUserLoc.split(',').map(s => s.trim()).filter(Boolean);
    const userCity = (locParts.length >= 2 ? locParts[1] : locParts[0]) || rawUserLoc;
    const locationKnown = userCity && userCity !== 'india';

    // NCR group — Ghaziabad/Noida/Delhi/Gurugram users all see each other's labs
    const ncrCities = ['delhi', 'noida', 'gurugram', 'gurgaon', 'ghaziabad', 'faridabad', 'ncr', 'greater noida'];
    const isUserInNCR = ncrCities.some(c => rawUserLoc.includes(c));

    // National = genuinely pan-India (NOT city-specific NCR)
    const isLabNational = (lab) => {
        const loc = (lab?.location || lab?.city || '').toLowerCase();
        return loc === 'india' ||
               loc === 'all india' ||
               loc.includes('multiple cities') ||
               loc.includes('multiple') ||
               loc.includes('pan india') ||
               loc.includes('nationwide') ||
               loc.includes('across india');
    };

    const isLabLocal = (lab) => {
        const labLoc = (lab?.location || lab?.city || '').toLowerCase();
        if (!labLoc || !locationKnown) return false;
        const isLabInNCR = ncrCities.some(c => labLoc.includes(c));
        return labLoc.includes(userCity) ||
               userCity.includes(labLoc) ||
               (isUserInNCR && isLabInNCR);
    };

    const filteredLabs = activeLabs
        .filter(lab => {
            if (!lab || !lab.name) return false;

            // Search filter (manual)
            if (searchQuery) {
                const search = searchQuery.toLowerCase();
                return lab.name.toLowerCase().includes(search) ||
                    (lab.location || '').toLowerCase().includes(search) ||
                    (lab.address || '').toLowerCase().includes(search);
            }

            // Location filter: when location is known, only show local + national labs
            if (locationKnown) {
                return isLabLocal(lab) || isLabNational(lab);
            }

            return true; // location not known → show all
        })
        .sort((a, b) => {
            // Local labs always first, then national, then others
            const aLocal = isLabLocal(a);
            const bLocal = isLabLocal(b);
            if (aLocal && !bLocal) return -1;
            if (!aLocal && bLocal) return 1;

            const aNational = isLabNational(a);
            const bNational = isLabNational(b);
            if (aNational && !bNational) return -1;
            if (!aNational && bNational) return 1;

            return (a.name || '').localeCompare(b.name || '');
        });


    return (
        <div className="bg-[#f8fafc] min-h-screen pt-28 pb-24 font-sans selection:bg-brand-teal selection:text-white relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-br from-brand-teal/5 via-[#108A9E]/5 to-transparent -z-10 pointer-events-none" />
            <div className="fixed -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-teal/5 blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#108A9E]/5 blur-[100px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header Section */}
                <div className={`text-center max-w-4xl mx-auto mb-16 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white text-brand-teal px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,138,158,0.1)] transition-all cursor-default">
                        <Building2 size={16} className="text-[#108A9E]" /> Certified Excellence
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-dark-text mb-6 leading-[1.1] tracking-tight">
                        Our Trusted <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-[#108A9E] inline-block mt-2">Partner Labs</span>
                    </h1>
                    <p className="text-gray-500/80 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        We partner exclusively with India's top NABL &amp; CAP accredited laboratories. 
                        Experience 100% accuracy, rapid reports, and unparalleled diagnostic safety.
                    </p>
                    {locationKnown && (
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-sm font-bold text-emerald-700">
                            <MapPin size={14} />
                            Showing labs available in <span className="font-black capitalize">{userCity}</span>
                        </div>
                    )}
                </div>

                {/* Search Bar - Glassmorphism */}
                <div className={`max-w-3xl mx-auto mb-20 transition-all duration-1000 delay-150 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50 p-2 flex items-center relative group hover:shadow-[0_8px_30px_rgb(16,138,158,0.12)] hover:border-brand-teal/20 transition-all duration-500">
                        <div className="pl-6 pr-4 text-brand-teal/60 group-hover:text-brand-teal transition-colors">
                            <Search size={24} className="group-focus-within:animate-pulse" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find a lab by name or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-base md:text-lg font-medium py-4 placeholder:text-gray-400 outline-none text-dark-text"
                        />
                        <div className="pr-2 hidden sm:block">
                            <Button className="rounded-full px-8 py-3.5 bg-dark-text hover:bg-black text-white shadow-lg shadow-black/10 transition-transform hover:scale-105 active:scale-95">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Labs Grid */}
                {filteredLabs.length === 0 ? (
                    <div className={`bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-16 md:p-24 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white max-w-3xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FlaskConical size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-dark-text mb-4">No Labs Found</h3>
                        <p className="text-gray-500 text-lg font-medium max-w-md mx-auto">We couldn't find any partner labs matching <span className="text-dark-text font-bold">"{searchQuery}"</span>. Try a different city or lab name.</p>
                        <Button 
                            variant="outline" 
                            className="mt-8 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-dark-text px-8"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear Search
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {(filteredLabs || []).length > 0 ? (
                            (filteredLabs || []).map((lab, index) => (
                                <div 
                                    key={lab?.id || index} 
                                    className={`bg-white rounded-[2rem] border border-gray-100/50 p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(16,138,158,0.1)] transition-all duration-500 group flex flex-col h-full hover:-translate-y-2 relative overflow-hidden transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >   
                                    {/* Lab Gradient Cover */}
                                    <div className="h-48 md:h-56 bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] rounded-[1.5rem] flex items-center justify-center mb-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-teal/10 rounded-full blur-xl -ml-5 -mb-5 group-hover:scale-150 transition-transform duration-700" />
                                        
                                        <h2 className="text-[#0369a1] text-3xl md:text-4xl font-black text-center px-6 leading-[1.1] z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-500">
                                            {lab?.name || 'Partner Lab'}
                                        </h2>

                                        {/* Premium Rating Badge */}
                                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white">
                                            <Star size={14} className="text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-black text-dark-text">{lab?.rating || '4.5'}</span>
                                        </div>

                                        {/* Near You badge */}
                                        {isLabLocal(lab) && (
                                            <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                                                <MapPin size={9} /> Near You
                                            </div>
                                        )}
                                        {!isLabLocal(lab) && isLabNational(lab) && (
                                            <div className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                                                Pan India
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col px-4 md:px-5 pb-5">
                                        <div className="mb-6">
                                            <div className="flex items-start gap-2 text-gray-500 text-sm">
                                                <MapPin size={16} className="text-brand-teal mt-0.5 shrink-0" />
                                                <span className="font-medium leading-relaxed">{lab?.address || lab?.location || 'Address N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-8 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                                            {lab?.accreditation && (
                                                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                        <ShieldCheck size={16} className="text-emerald-500" />
                                                    </div>
                                                    <span className="leading-tight">{lab.accreditation}</span>
                                                </div>
                                            )}
                                            {lab?.timing && (
                                                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                        <Clock size={16} className="text-blue-500" />
                                                    </div>
                                                    <span className="leading-tight">{lab.timing}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-2">
                                            <Button 
                                                onClick={() => navigate(`/lab/${lab?.id}`)}
                                                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 bg-[#108A9E] hover:bg-brand-teal shadow-[0_8px_20px_rgb(16,138,158,0.2)] hover:shadow-[0_12px_25px_rgb(16,138,158,0.3)] transition-all duration-300 group/btn overflow-hidden relative"
                                            >
                                                <span className="relative z-10 font-bold text-base">View Full Profile</span>
                                                <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 font-bold uppercase tracking-widest">No labs found in this location.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default PartnerLabsPage;
