import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, FlaskConical, Droplets, Clock, Microscope, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PackageCard = ({ pkg }) => {
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();
    const isInCart = Array.isArray(cart) ? cart.find(i => i?.id === pkg?.id) : false;

    const discount = pkg?.originalPrice && pkg?.price
        ? Math.round(((Number(pkg.originalPrice) - Number(pkg.price)) / Number(pkg.originalPrice)) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!isInCart && pkg) {
            addToCart({
                ...pkg,
                name: pkg.name || 'Health Package',
                price: pkg.price
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-gray-200 flex flex-col cursor-pointer overflow-hidden h-full"
            onClick={() => navigate(`/item-details/${pkg?.id || pkg?.name}`)}
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
            {/* Top: Icon + Price */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <FlaskConical size={24} className="text-emerald-600" />
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600 leading-tight">
                        ₹{pkg?.price || 0}
                    </div>
                    {pkg?.originalPrice && (
                        <div className="text-sm text-gray-400 line-through font-semibold">
                            ₹{pkg.originalPrice}
                        </div>
                    )}
                </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                {pkg?.category && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
                        {pkg.category}
                    </span>
                )}
                {pkg?.fasting && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
                        Fasting Required
                    </span>
                )}
                {pkg?.tag && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        {pkg.tag}
                    </span>
                )}
                {pkg?.isLocal && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        Near You
                    </span>
                )}
            </div>

            {/* Name + Lab */}
            <div className="px-5 pb-3">
                <h3 className="text-lg font-black text-emerald-700 leading-tight mb-0.5 line-clamp-2">
                    {pkg?.name || 'Health Package'}
                </h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {pkg?.labName || 'OxyCare Labs'}
                </p>
            </div>

            {/* Sample Type */}
            <div className="px-5 pb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                    <Droplets size={12} className="text-emerald-600" />
                    Sample: {pkg?.sampleType || 'Blood'}
                </span>
            </div>

            {/* Parameters Count */}
            <div className="px-5 pb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                    <Microscope size={12} className="text-emerald-600" />
                    {pkg?.testsCount || pkg?.parameters?.length || 1} Parameters
                </span>
            </div>

            {/* Reports In + Method Row */}
            <div className="flex gap-6 px-5 pb-4 border-t border-gray-100 pt-3">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Reports In</p>
                    <p className="text-[11px] font-black text-gray-700 uppercase">{pkg?.tat || '24 Hrs'}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Method</p>
                    <p className="text-[11px] font-black text-gray-700 uppercase">{pkg?.method || 'Standard'}</p>
                </div>
            </div>

            {/* Footer: Rating + CTA */}
            <div className="flex items-center justify-between px-5 pb-5 mt-auto">
                <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[13px] font-black text-gray-700">{pkg?.rating || '4.5'}</span>
                </div>

                <button
                    onClick={handleAddToCart}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-200 ${
                        isInCart
                            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 active:scale-95'
                    }`}
                >
                    {isInCart ? (
                        <><Check size={14} /> In Cart</>
                    ) : (
                        <><ShoppingCart size={14} /> Add to Cart</>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default PackageCard;
