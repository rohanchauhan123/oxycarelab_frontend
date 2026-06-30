import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Home, Microscope, Zap, PhoneCall, FileCheck } from 'lucide-react';

const reasons = [
    {
        icon: <Home size={28} className="text-emerald-600" />,
        title: 'Free Home Collection',
        desc: 'Our trained phlebotomists visit your home at your preferred time slot.',
        badge: 'Zero Extra Cost',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
        icon: <ShieldCheck size={28} className="text-blue-600" />,
        title: 'NABL Certified Labs',
        desc: 'All our partner labs are NABL & ISO accredited, ensuring highest accuracy.',
        badge: 'Government Verified',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
        icon: <Clock size={28} className="text-orange-600" />,
        title: 'Reports in 24 Hours',
        desc: 'Receive easy-to-read digital reports on WhatsApp & Email within 24 hours.',
        badge: 'Fast TAT',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-100',
    },
    {
        icon: <Microscope size={28} className="text-purple-600" />,
        title: '1500+ Tests Available',
        desc: 'From basic blood tests to advanced genetic panels — we have everything.',
        badge: 'Widest Coverage',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    {
        icon: <FileCheck size={28} className="text-teal-600" />,
        title: 'Doctor-Reviewed Reports',
        desc: 'Every report comes with color-coded normal ranges and easy interpretation.',
        badge: 'Expert Reviewed',
        badgeColor: 'bg-teal-50 text-teal-700 border-teal-100',
    },
    {
        icon: <PhoneCall size={28} className="text-rose-600" />,
        title: '24/7 Support',
        desc: 'Dedicated healthcare support team available round the clock for your queries.',
        badge: 'Always Here',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-100',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-6"
                    >
                        <Zap size={14} className="text-emerald-600" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Why OxyCare Labs</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4"
                    >
                        The Smarter Way to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Get Tested</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-lg text-gray-500 max-w-xl mx-auto font-medium"
                    >
                        We've reimagined every step of your diagnostic experience — from booking to report delivery.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {reasons.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                {r.icon}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${r.badgeColor} mb-4 inline-block`}>
                                {r.badge}
                            </span>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{r.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed text-sm">{r.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
