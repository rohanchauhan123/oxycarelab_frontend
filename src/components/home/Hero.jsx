import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Clock, Home, ArrowRight, FlaskConical, Heart, Activity, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const stats = [
    { value: '50,000+', label: 'Tests Delivered' },
    { value: '4.9★', label: 'Google Rating' },
    { value: '24 Hrs', label: 'Report Delivery' },
    { value: '100%', label: 'NABL Certified' },
];

const floatingBadges = [
    { icon: '🩸', label: 'Blood Tests', color: 'bg-red-50 border-red-100 text-red-600', top: '15%', left: '2%' },
    { icon: '🫀', label: 'Cardiac Profile', color: 'bg-pink-50 border-pink-100 text-pink-600', top: '55%', left: '0%' },
    { icon: '🧪', label: 'Full Body', color: 'bg-emerald-50 border-emerald-100 text-emerald-600', top: '20%', right: '2%' },
    { icon: '🩺', label: 'Home Visit', color: 'bg-blue-50 border-blue-100 text-blue-600', top: '60%', right: '0%' },
];

const symptoms = [
    { icon: '🥱', label: 'Tired' },
    { icon: '⚖️', label: 'Weight Gain' },
    { icon: '💇', label: 'Hair Fall' },
    { icon: '🩸', label: 'Diabetes' },
    { icon: '🫀', label: 'Heart Health' },
    { icon: '🦴', label: 'Joint Pain' },
];

const Hero = () => {
    const navigate = useNavigate();
    const [activeSymptom, setActiveSymptom] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/book-test?search=${encodeURIComponent(searchQuery)}`);
        else navigate('/book-test');
    };

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white pt-24 pb-16">

            {/* Background Gradient Blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 blur-3xl opacity-60" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-50 to-cyan-50 blur-3xl opacity-50" />
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* Trust pill */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-full px-5 py-2.5 shadow-sm">
                        <div className="flex -space-x-1">
                            {['🧑‍⚕️', '👩‍⚕️', '🧑‍🔬'].map((e, i) => (
                                <span key={i} className="w-6 h-6 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-xs">{e}</span>
                            ))}
                        </div>
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
                            50,000+ Patients Trust OxyCare Labs
                        </span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Main Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-center max-w-5xl mx-auto mb-8"
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.0] tracking-tight mb-6">
                        Your Health,{' '}
                        <span className="relative">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600">
                                Decoded.
                            </span>
                            {/* Underline accent */}
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                <path d="M2 10 Q75 2 150 8 Q225 14 298 6" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
                            </svg>
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Book 1500+ lab tests & health packages at home. Get results in 24 hours. Trusted by doctors across India.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="max-w-2xl mx-auto mb-10"
                >
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center bg-white rounded-2xl border-2 border-gray-200 shadow-xl shadow-gray-100/80 hover:border-emerald-300 transition-colors overflow-hidden">
                            <FlaskConical size={20} className="ml-5 text-emerald-500 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for tests, packages... (e.g. CBC, Thyroid)"
                                className="flex-1 px-4 py-5 text-gray-700 font-medium bg-transparent outline-none placeholder:text-gray-400 text-base"
                            />
                            <button
                                type="submit"
                                className="m-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-200"
                            >
                                Search <ArrowRight size={16} />
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-400 font-medium mt-2.5">
                            Popular: CBC, Thyroid, Lipid Profile, Vitamin D, HbA1c, Full Body Checkup
                        </p>
                    </form>
                </motion.div>

                {/* Quick Symptom Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="flex flex-wrap justify-center gap-2.5 mb-12"
                >
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest self-center mr-1">I'm facing:</span>
                    {symptoms.map((s, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/health-check?problem=${encodeURIComponent(s.label)}`)}
                            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 text-sm font-bold px-4 py-2 rounded-full transition-all shadow-sm"
                        >
                            <span>{s.icon}</span> {s.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
                >
                    <button
                        onClick={() => navigate('/health-packages')}
                        className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-200 transition-all hover:-translate-y-0.5"
                    >
                        <Activity size={20} /> View Health Packages
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/book-test')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white border-2 border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 font-black text-base rounded-2xl transition-all hover:-translate-y-0.5 shadow-sm"
                    >
                        <Home size={20} /> Book Home Collection
                    </button>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="text-2xl font-black text-emerald-600 mb-1">{stat.value}</div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Trust Badges Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-wrap justify-center items-center gap-6 mt-10"
                >
                    {[
                        { icon: <ShieldCheck size={16} className="text-emerald-600" />, text: 'NABL & ISO Certified Labs' },
                        { icon: <Clock size={16} className="text-emerald-600" />, text: 'Reports in 24 Hours' },
                        { icon: <Home size={16} className="text-emerald-600" />, text: 'Free Home Sample Collection' },
                        { icon: <Zap size={16} className="text-emerald-600" />, text: 'Instant WhatsApp Reports' },
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                            {badge.icon} {badge.text}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
