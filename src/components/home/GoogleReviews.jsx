import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const GoogleReviews = () => {
    useEffect(() => {
        // Load Elfsight platform script if not already loaded
        if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://elfsightcdn.com/platform.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 to-white pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6 border border-emerald-100"
                    >
                        <ShieldCheck className="text-emerald-600" size={16} />
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Verified Google Reviews</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4"
                    >
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Patients Say</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-lg text-gray-500 font-medium max-w-xl mx-auto"
                    >
                        Real reviews from real patients — straight from Google.
                    </motion.p>
                </div>

                {/* Elfsight Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <div
                        className="elfsight-app-700d011f-5287-4902-a880-7bd9fc45da87"
                        data-elfsight-app-lazy
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default GoogleReviews;
