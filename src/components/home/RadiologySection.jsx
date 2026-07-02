import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Scan, Brain, Bone, Wind, Activity, Radiation, CircleDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CALL_NUMBER = '+918376852126';

const radiologyTests = [
    {
        id: 'rad-1',
        icon: <Scan size={28} />,
        name: 'X-Ray',
        desc: 'Chest, Spine, Limbs & more. Digital X-Ray with instant reports.',
        startingPrice: 249,
        tat: '2 Hrs',
        color: 'from-blue-500 to-blue-600',
        lightColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-100',
        tag: 'Most Popular',
    },
    {
        id: 'rad-2',
        icon: <Activity size={28} />,
        name: 'Ultrasound',
        desc: 'Abdomen, Pelvis, Thyroid, Obstetric & more. By expert sonographers.',
        startingPrice: 699,
        tat: '2 Hrs',
        color: 'from-violet-500 to-violet-600',
        lightColor: 'bg-violet-50',
        textColor: 'text-violet-600',
        borderColor: 'border-violet-100',
        tag: 'High Demand',
    },
    {
        id: 'rad-3',
        icon: <Brain size={28} />,
        name: 'MRI Scan',
        desc: 'Brain, Spine, Knee, Shoulder & whole body MRI with contrast.',
        startingPrice: 3999,
        tat: '4 Hrs',
        color: 'from-indigo-500 to-indigo-600',
        lightColor: 'bg-indigo-50',
        textColor: 'text-indigo-600',
        borderColor: 'border-indigo-100',
        tag: 'Advanced',
    },
    {
        id: 'rad-4',
        icon: <CircleDot size={28} />,
        name: 'CT Scan',
        desc: 'Chest, Abdomen, Brain, Whole Body & PET CT in NABL centres.',
        startingPrice: 2999,
        tat: '4 Hrs',
        color: 'from-cyan-500 to-cyan-600',
        lightColor: 'bg-cyan-50',
        textColor: 'text-cyan-600',
        borderColor: 'border-cyan-100',
        tag: 'Diagnostic',
    },
    {
        id: 'rad-5',
        icon: <Bone size={28} />,
        name: 'DEXA Scan',
        desc: 'Bone density & mineral test. Recommended for osteoporosis screening.',
        startingPrice: 1499,
        tat: '24 Hrs',
        color: 'from-amber-500 to-orange-500',
        lightColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-100',
        tag: 'Bone Health',
    },
    {
        id: 'rad-6',
        icon: <Wind size={28} />,
        name: 'Mammography',
        desc: 'Digital breast screening & diagnostic mammogram for women\'s health.',
        startingPrice: 1299,
        tat: '24 Hrs',
        color: 'from-rose-500 to-pink-500',
        lightColor: 'bg-rose-50',
        textColor: 'text-rose-600',
        borderColor: 'border-rose-100',
        tag: 'Women Health',
    },
];

const RadiologySection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-3xl rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-600/10 blur-3xl rounded-full" />
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5"
                        >
                            <Scan size={13} className="text-blue-400" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">Radiology & Imaging</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="text-4xl md:text-5xl font-black text-white leading-tight mb-3"
                        >
                            Advanced{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                                Imaging Tests
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.12 }}
                            className="text-slate-400 font-medium text-base max-w-xl"
                        >
                            MRI, CT Scan, X-Ray, Ultrasound & more — at NABL-accredited imaging centres near you.
                        </motion.p>
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        onClick={() => navigate('/book-test?type=Radiology')}
                        className="group flex items-center gap-2 text-sm font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 px-5 py-3 rounded-xl transition-all shrink-0 whitespace-nowrap"
                    >
                        View All Radiology
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {radiologyTests.map((test, i) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            whileHover={{ y: -4 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group cursor-pointer relative overflow-hidden"
                            onClick={() => navigate(`/book-test?type=Radiology&category=${test.name}`)}
                        >
                            {/* Subtle gradient glow on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${test.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />

                            {/* Top row */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl ${test.lightColor} ${test.textColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    {test.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${test.lightColor} ${test.textColor} border ${test.borderColor}`}>
                                    {test.tag}
                                </span>
                            </div>

                            {/* Name + desc */}
                            <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-300 transition-colors">
                                {test.name}
                            </h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-5">
                                {test.desc}
                            </p>

                            {/* Price + TAT */}
                            <div className="flex items-center gap-4 mb-5">
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Starting From</p>
                                    <p className={`text-2xl font-black ${test.textColor}`}>₹{test.startingPrice}</p>
                                </div>
                                <div className="w-px h-8 bg-slate-800" />
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reports In</p>
                                    <p className="text-sm font-black text-white">{test.tat}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/book-test?type=Radiology&category=${test.name}`);
                                    }}
                                    className={`flex-1 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider bg-gradient-to-r ${test.color} text-white hover:opacity-90 transition-all active:scale-95 shadow-lg`}
                                >
                                    Book Now
                                </button>
                                <a
                                    href={`tel:${CALL_NUMBER}`}
                                    onClick={e => e.stopPropagation()}
                                    className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                                    title="Call to Book"
                                >
                                    <Phone size={16} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-slate-500 text-sm font-medium mb-4">
                        Not sure which scan you need? Our experts will guide you.
                    </p>
                    <a
                        href={`tel:${CALL_NUMBER}`}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-sm rounded-xl transition-all"
                    >
                        <Phone size={16} /> Call Our Radiology Expert: +91 8376852126
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default RadiologySection;
