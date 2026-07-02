import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TestCard from '../components/ui/TestCard';
import FilterSidebar from '../components/ui/FilterSidebar';
import { Filter, Search, ChevronDown, FlaskConical, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useData } from '../context/DataContext';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';

const BookTest = () => {
    const navigate = useNavigate();
    const { tests, packages, labs, testCategories, isDataLoaded } = useData();
    const { location, isLoading: isLocLoading } = useLocation();
    const { addToCart } = useCart();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || null);

    // Sync search term and type from URL
    React.useEffect(() => {
        const query = searchParams.get('q');
        if (query !== null) setSearchTerm(query);
        
        const type = searchParams.get('type');
        setSelectedType(type);
    }, [searchParams]);

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState(() => {
        const cat = searchParams.get('category');
        return cat ? [cat] : [];
    });
    const [selectedLabs, setSelectedLabs] = useState([]);
    const [sortBy, setSortBy] = useState('Popularity');
    const [visibleCount, setVisibleCount] = useState(200);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 100);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedLabs([]);
        setSearchTerm('');
        setSelectedType(null);
        setSortBy('Popularity');
    };

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleLab = (lab) => {
        setSelectedLabs(prev => 
            prev.includes(lab) ? prev.filter(l => l !== lab) : [...prev, lab]
        );
    };

    // Derived state for tests — ONLY tests, never packages
    const activeTests = [
        ...(Array.isArray(tests) ? tests.map(t => ({ ...t, isPackage: false })) : [])
    ]
        .filter(t => {
            if (!t) return false;
            // Explicitly exclude packages (safety guard)
            if (t.isPackage === true) return false;
            if ((t.type || '').toLowerCase() === 'package') return false;
            // Items with testsCount or parameters array are packages
            if (t.testsCount !== undefined || Array.isArray(t.parameters)) return false;

            const status = (t.status || '').toLowerCase();
            if (status !== 'active' && status !== 'Active' && status !== '') {
                if (status === 'inactive' || status === 'disabled') return false;
            }
            
            const testSubject = (t.name || t.test || t.testName || t.packageName || '').toLowerCase();
            const matchesSearch = testSubject.includes(searchTerm.toLowerCase()) ||
                (t.description || t.desc || '').toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            const testCatName = (t.category || t.department || '').toLowerCase();
            
            if (selectedCategories.length > 0) {
                const matches = selectedCategories.some(sc => sc.toLowerCase() === testCatName);
                if (!matches) return false;
            }

            if (selectedType) {
                const catDef = (testCategories || []).find(c => 
                    c.filter.toLowerCase() === testCatName || 
                    c.name.toLowerCase() === testCatName
                );
                const catType = (catDef?.type || t.categoryType || '').toLowerCase();
                if (catType !== selectedType.toLowerCase()) return false;
            }

            if (selectedLabs.length > 0) {
                const labPartner = t?.labName || t?.lab;
                if (!labPartner || !selectedLabs.includes(labPartner)) return false;
            }

            // Location filtering now only marks items as local/national for sorting
            // We no longer return false here to ensure "saare aane chahiye" requirement
            return true;
        })
        .map(t => {
            if (!t) return null;
            const labPartner = String(t?.labName || t?.lab || '').trim().toLowerCase();
            const lab = Array.isArray(labs) ? labs.find(l => {
                const lName = String(l?.name || '').trim().toLowerCase();
                return lName === labPartner;
            }) : null;

            const labLoc = (lab?.location || '').toLowerCase();

            // Extract just the city part from the full location string (e.g. "Sanjay Nagar, Ghaziabad, Uttar Pradesh" → "ghaziabad")
            const rawUserLoc = (location || '').toLowerCase();
            const locationParts = rawUserLoc.split(',').map(s => s.trim());
            // City is usually the 2nd part in "area, city, state" or first part if single word
            const userCity = locationParts.length >= 2 ? locationParts[1] : locationParts[0];
            const userLoc = userCity || rawUserLoc;

            // If no lab found for this test, treat as available everywhere (national)
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
                ...t,
                isLocal: isDirectMatch,
                isNational: isNational
            };
        })
        .filter(Boolean)
        .sort((a, b) => {
            if (a?.isLocal && !b?.isLocal) return -1;
            if (!a?.isLocal && b?.isLocal) return 1;
            if (a?.isNational && !b?.isNational) return -1;
            if (!a?.isNational && b?.isNational) return 1;
            
            if (sortBy === 'Price: Low to High') return (a?.price || 0) - (b?.price || 0);
            if (sortBy === 'Price: High to Low') return (b?.price || 0) - (a?.price || 0);
            return 0;
        });

    // Deduplicate by test name — same test from 10 labs = show once
    // Lab will be selected at checkout. Keep lowest-price variant as representative.
    const deduplicatedTests = (() => {
        const seen = new Map(); // key: normalised test name → best variant index
        const result = [];

        for (const t of activeTests) {
            const key = (t.name || t.testName || t.test || '').toLowerCase().trim();
            if (!key) continue;

            if (!seen.has(key)) {
                seen.set(key, result.length);
                result.push({ ...t, availableLabsCount: 1, allVariants: [t] });
            } else {
                const idx = seen.get(key);
                const existing = result[idx];
                // Accumulate variants
                existing.allVariants.push(t);
                existing.availableLabsCount = existing.allVariants.length;
                // Keep cheapest as price shown
                if ((t.price || 0) < (existing.price || 0)) {
                    result[idx] = {
                        ...t,
                        availableLabsCount: existing.availableLabsCount,
                        allVariants: existing.allVariants,
                    };
                    seen.set(key, idx);
                }
            }
        }
        return result;
    })();

    return (
        <div className="pt-32 pb-28 bg-[#f8fafc] min-h-screen relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-br from-medical-green/5 via-brand-teal/5 to-transparent -z-10 pointer-events-none" />
            <div className="fixed -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-medical-green/5 blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header Section */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100/50 pb-12">
                    <div className="max-w-2xl">
                         <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white text-medical-green px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[2px] mb-6 shadow-sm"
                        >
                            <FlaskConical size={14} /> Diagnostic Excellence
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black text-dark-text mb-4 tracking-tight leading-tight uppercase">
                            {selectedType ? `${selectedType}` : <><span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-green to-brand-teal inline-block">Book</span></>} <br className="md:hidden" />
                            <span className="text-medical-green">Diagnostic Tests</span>
                        </h1>
                        <p className="text-gray-500 font-bold text-base md:text-lg leading-relaxed max-w-lg">
                            Access over 2000+ tests from India's most trusted partner laboratories with verified accuracy.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex lg:hidden items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-[2px] shadow-sm active:scale-95 transition-all text-dark-text"
                        >
                            <Filter size={18} className="text-medical-green" /> Filters
                        </button>

                        <div className="relative group min-w-[320px] md:min-w-[400px]">
                            <div className="absolute inset-0 bg-medical-green/5 blur-xl group-focus-within:opacity-100 opacity-0 transition-opacity rounded-[2rem]" />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="Search by test name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green shadow-sm text-base font-bold transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Filter Sidebar (Handles both Mobile Modal and Desktop Inline) */}
                    <FilterSidebar 
                        isOpen={isFilterOpen} 
                        onClose={() => setIsFilterOpen(false)} 
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                        selectedLabs={selectedLabs}
                        toggleLab={toggleLab}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        clearFilters={clearFilters}
                    />
                    
                    {/* Main Content Area */}
                    <div className="flex-1 w-full">
                        {!isDataLoaded ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="bg-white rounded-[3rem] p-8 border border-gray-100 animate-pulse h-[350px]">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl mb-6" />
                                        <div className="h-8 bg-gray-50 rounded-lg w-3/4 mb-4" />
                                        <div className="h-4 bg-gray-50 rounded-lg w-1/2 mb-10" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 auto-rows-fr">
                                    {deduplicatedTests.length > 0 ? (
                                        deduplicatedTests.slice(0, visibleCount).map((item) => (
                                            <TestCard key={item.id} test={item} />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                                            <FlaskConical size={64} className="text-gray-100 mx-auto mb-6" />
                                            <h3 className="text-2xl font-black text-dark-text uppercase tracking-tight mb-2">No results found</h3>
                                            <p className="text-gray-400 font-bold max-w-xs mx-auto">We couldn't find any tests matching your filters.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination / Load More */}
                                {deduplicatedTests.length > visibleCount && (
                                    <div className="mt-16 text-center">
                                        <button 
                                            onClick={handleLoadMore}
                                            className="px-12 py-5 bg-white border border-gray-200 rounded-[2rem] font-black text-[10px] uppercase tracking-[2px] text-dark-text hover:bg-dark-text hover:text-white transition-all shadow-sm hover:shadow-xl active:scale-95"
                                        >
                                            Load More Results
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookTest;
