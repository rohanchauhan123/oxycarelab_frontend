import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, FlaskConical, Droplets, Microscope, Star, ShoppingCart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';

const fallbackPackages = [
    { id: 'f1', name: 'Complete Blood Count', category: 'Pathology', price: 299, originalPrice: 499, sampleType: 'Blood', tat: '24 Hrs', method: 'Automated', rating: 4.8, parameters: [1] },
    { id: 'f2', name: 'Thyroid Profile (T3, T4, TSH)', category: 'Pathology', price: 499, originalPrice: 799, sampleType: 'Blood', tat: '24 Hrs', method: 'CLIA', rating: 4.9, parameters: [1, 2, 3] },
    { id: 'f3', name: 'Lipid Profile', category: 'Pathology', price: 425, originalPrice: 750, sampleType: 'Blood', tat: '24 Hrs', method: 'EIA/CLIA', rating: 4.7, parameters: [1, 2, 3, 4, 5] },
    { id: 'f4', name: 'Liver Function Test', category: 'Pathology', price: 549, originalPrice: 899, sampleType: 'Blood', tat: '24 Hrs', method: 'Spectro', rating: 4.8, parameters: [1, 2, 3, 4, 5, 6, 7] },
    { id: 'f5', name: 'Vitamin D Total', category: 'Pathology', price: 699, originalPrice: 1100, sampleType: 'Blood', tat: '48 Hrs', method: 'CLIA', rating: 4.9, parameters: [1] },
    { id: 'f6', name: 'HbA1c (Glycated Hemoglobin)', category: 'Pathology', price: 349, originalPrice: 599, sampleType: 'Blood', tat: '24 Hrs', method: 'HPLC', rating: 4.8, parameters: [1] },
    { id: 'f7', name: 'Kidney Function Test', category: 'Pathology', price: 499, originalPrice: 799, sampleType: 'Blood/Urine', tat: '24 Hrs', method: 'Automated', rating: 4.7, parameters: [1, 2, 3, 4, 5, 6] },
    { id: 'f8', name: 'Full Body Checkup', category: 'Wellness', price: 999, originalPrice: 2499, sampleType: 'Blood', tat: '48 Hrs', method: 'Multiple', rating: 5.0, parameters: Array(72).fill(1) },
];

const SliderCard = ({ pkg }) => {
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();
    const isInCart = Array.isArray(cart) ? cart.find(i => i?.id === pkg?.id) : false;

    const discount = pkg?.originalPrice && pkg?.price
        ? Math.round(((Number(pkg.originalPrice) - Number(pkg.price)) / Number(pkg.originalPrice)) * 100)
        : 0;

    return (
        <div
            onClick={() => navigate(`/item-details/${pkg?.id || pkg?.name}`)}
            className="w-[240px] shrink-0 bg-white rounded-2xl border border-gray-200 flex flex-col cursor-pointer overflow-hidden group"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
        >
            {/* Top: Icon + Price */}
            <div className="flex items-start justify-between px-4 pt-4 pb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <FlaskConical size={20} className="text-emerald-600" />
                </div>
                <div className="text-right">
                    <div className="text-xl font-black text-emerald-600 leading-tight">₹{pkg?.price || 0}</div>
                    {pkg?.originalPrice && (
                        <div className="text-xs text-gray-400 line-through font-semibold">₹{pkg.originalPrice}</div>
                    )}
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 px-4 pb-2">
                {pkg?.category && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                        {pkg.category}
                    </span>
                )}
                {discount >= 20 && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {discount}% Off
                    </span>
                )}
            </div>

            {/* Name */}
            <div className="px-4 pb-2">
                <h3 className="text-sm font-black text-emerald-700 leading-snug line-clamp-2 mb-0.5">
                    {pkg?.name || 'Health Test'}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {pkg?.labName || 'OxyCare Labs'}
                </p>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-1 px-4 pb-3">
                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
                    <Droplets size={8} /> {pkg?.sampleType || 'Blood'}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
                    <Microscope size={8} /> {pkg?.parameters?.length || 1} Params
                </span>
            </div>

            {/* Reports row */}
            <div className="flex gap-4 px-4 pb-3 border-t border-gray-100 pt-2">
                <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reports In</p>
                    <p className="text-[10px] font-black text-gray-700">{pkg?.tat || '24 Hrs'}</p>
                </div>
                <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Method</p>
                    <p className="text-[10px] font-black text-gray-700">{pkg?.method || 'Standard'}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 pb-4 mt-auto">
                <div className="flex items-center gap-1">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[11px] font-black text-gray-700">{pkg?.rating || '4.5'}</span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isInCart && pkg) addToCart({ ...pkg, name: pkg.name || 'Health Test', price: pkg.price });
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wide transition-all ${
                        isInCart
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                    }`}
                >
                    {isInCart ? <><Check size={10} /> Added</> : <><ShoppingCart size={10} /> Add</>}
                </button>
            </div>
        </div>
    );
};

const PopularPackages = () => {
    const navigate = useNavigate();
    const { packages } = useData();

    const displayPackages = (packages && packages.length > 0)
        ? packages.filter(p => p?.status !== 'Deleted' && p?.status !== 'Inactive').slice(0, 12)
        : fallbackPackages;

    // Triple for seamless loop
    const items = [...displayPackages, ...displayPackages, ...displayPackages];

    useEffect(() => {
        const id = 'marquee-style';
        if (!document.getElementById(id)) {
            const s = document.createElement('style');
            s.id = id;
            s.textContent = `
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(calc(-100% / 3)); }
                }
                .marquee-track {
                    animation: marquee 30s linear infinite;
                    will-change: transform;
                }
                .marquee-wrap:hover .marquee-track {
                    animation-play-state: paused;
                }
            `;
            document.head.appendChild(s);
        }
    }, []);

    return (
        <section className="py-20 bg-gray-50/60 relative overflow-hidden">
            {/* Soft glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-emerald-100/50 blur-3xl rounded-full" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="container mx-auto px-4 mb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-4"
                            >
                                <Sparkles size={13} className="text-emerald-600" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Popular This Week</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.08 }}
                                className="text-4xl md:text-5xl font-black text-gray-900 leading-tight"
                            >
                                Most Booked{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                                    Packages
                                </span>
                            </motion.h2>
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            onClick={() => navigate('/health-packages')}
                            className="group flex items-center gap-2 text-sm font-black text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 px-5 py-3 rounded-xl transition-all shrink-0"
                        >
                            View All
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>

                {/* Marquee strip with edge fades */}
                <div className="relative marquee-wrap">
                    {/* Left fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to right, rgba(248,250,248,1) 0%, transparent 100%)' }} />
                    {/* Right fade */}
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, rgba(248,250,248,1) 0%, transparent 100%)' }} />

                    <div className="overflow-hidden px-4">
                        <div className="marquee-track flex gap-5" style={{ width: 'max-content' }}>
                            {items.map((pkg, i) => (
                                <SliderCard key={`${pkg.id}-${i}`} pkg={pkg} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularPackages;
