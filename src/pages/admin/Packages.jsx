import React, { useState } from 'react';
import { Package, Plus, Search, Filter, ArrowRight, Tag, ShieldPlus, ChevronRight, Trash2, Upload, FileText, Clock, X, Building2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import BulkUpload from '../../components/admin/BulkUpload';

const PackagesManager = () => {
    const { packages, labs, serviceableCities, deletePackage, addPackage, addPackages, updatePackage, togglePackageStatus, testCategories } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [paramInput, setParamInput] = useState({ name: '', unit: '', range: '', groupName: '' });
    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        category: 'Full Body',
        categoryType: 'Pathology',
        testsCount: 0,
        isAddon: false,
        desc: '',
        tat: '',
        fasting: true,
        sampleType: '',
        ageGroup: '',
        gender: 'Unisex',
        labName: '',
        cities: '',
        parameters: [],
        image: '',
        status: 'Active',
        testMethod: 'EIA/CLIA',
        showUrlInput: false
    });

    const headerMap = {
        name: ['name', 'package name', 'title', 'package_name', 'item name', 'test name', 'test'],
        price: ['price', 'base price', 'mrp', 'cost', 'base_price', 'amount', 'selling price', 'rate'],
        originalPrice: ['originalprice', 'original price', 'actual price', 'old price', 'actual_price', 'mrp_old', 'strike price'],
        testsCount: ['testscount', 'tests count', 'no of tests', 'total tests', 'tests_count', 'parameters count'],
        category: ['category', 'type', 'group', 'dept', 'department'],
        tat: ['tat', 'turnaround time', 'reporting time', 'turnaround_time', 'report time'],
        fasting: ['fasting', 'fasting required', 'is_fasting', 'pre test info'],
        desc: ['desc', 'description', 'summary', 'about', 'info'],
        sampleType: ['sampletype', 'sample type', 'sample', 'sample_type', 'specimen'],
        gender: ['gender', 'sex', 'applicable for'],
        isAddon: ['isaddon', 'is addon', 'addon', 'is_addon', 'premium'],
        parameters: ['parameters', 'params', 'test details', 'breakup', 'param_list'],
        labName: ['labname', 'lab name', 'partner', 'lab', 'partner_lab', 'vendor'],
        image: ['image', 'img', 'url', 'photo', 'picture', 'image url', 'image_url'],
        testMethod: ['testmethod', 'method', 'technology', 'test_method', 'protocol']
    };

    const handleBulkUploadData = async (mappedData) => {
        console.log("PackagesManager: handleBulkUploadData called with", mappedData.length, "items");
        try {
            const packagesToCreate = mappedData.map(pkgData => {
                // Parse parameters if provided in format "Name:Unit:Range, Name2:Unit2:Range2"
                let parsedParams = [];
                if (pkgData.parameters && typeof pkgData.parameters === 'string') {
                    const paramGroups = pkgData.parameters.split(',').map(p => p.trim());
                    parsedParams = paramGroups.map((group, index) => {
                        const [name, unit, range] = group.split(':').map(val => val?.trim() || '');
                        return { id: Date.now() + index, name: name || 'Parameter', unit: unit || '', range: range || '' };
                    }).filter(p => p.name);
                }

                const testsCount = parseInt(pkgData.testsCount) || parsedParams.length || 0;
                
                const fallbackNames = ['Lab Test', 'New Test', 'Diagnostic Test', 'Diagnostic Service', 'General Test', 'Default Test', 'New Package'];
                let displayName = pkgData.name || '';

                // Rescue generic or missing names
                if (!displayName || fallbackNames.includes(displayName) || displayName === (pkgData.labName || pkgData.vendor)) {
                    // Look for ANY other string field that isn't a known numeric/metadata field
                    const entries = Object.entries(pkgData);
                    const betterName = entries.find(([key, val]) => {
                        const cleanKey = key.toLowerCase();
                        const isMetadata = ['id', 'price', 'originalprice', 'lab', 'labname', 'status', 'category', 'categorytype', 'discount', 'rating', 'bookedcount', 'itemname', 'name'].includes(cleanKey);
                        return !isMetadata && typeof val === 'string' && val.length >= 3 && !fallbackNames.includes(val);
                    });
                    
                    if (betterName) {
                        displayName = betterName[1];
                    } else if (!displayName) {
                        displayName = 'Health Package';
                    }
                }

                return {
                    name: displayName,
                    testsCount: testsCount,
                    tests: `${testsCount} Tests Included`,
                    price: pkgData.price || 0,
                    originalPrice: pkgData.originalPrice || pkgData.price || 0,
                    category: pkgData.category || 'Full Body',
                    status: pkgData.status || 'Active',
                    isAddon: Boolean(pkgData.isAddon),
                    desc: pkgData.desc || '',
                    tat: pkgData.tat || '',
                    fasting: pkgData.fasting !== undefined ? Boolean(pkgData.fasting) : true,
                    sampleType: pkgData.sampleType || 'Blood',
                    ageGroup: pkgData.ageGroup || 'All Ages',
                    gender: pkgData.gender || 'Unisex',
                    labName: pkgData.labName || '',
                    image: pkgData.image || '',
                    testMethod: pkgData.testMethod || 'EIA/CLIA',
                    parameters: parsedParams
                };
            });

            if (packagesToCreate.length > 0) {
                await addPackages(packagesToCreate);
                setUploadStatus({ type: 'success', message: `Successfully added ${packagesToCreate.length} packages!` });
                setTimeout(() => {
                    setIsBulkUploadModalOpen(false);
                    setUploadStatus({ type: '', message: '' });
                }, 2000);
            } else {
                setUploadStatus({ type: 'error', message: 'No valid packages found.' });
            }
        } catch (err) {
            console.error("BulkUpload process error:", err);
            setUploadStatus({ type: 'error', message: 'Failed to process packages.' });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            if (editingPackage) {
                await updatePackage(editingPackage.id, formData);
            } else {
                await addPackage(formData);
            }
            setIsModalOpen(false);
            setEditingPackage(null);
            setFormData({ name: '', price: '', originalPrice: '', category: 'Full Body', categoryType: 'Pathology', testsCount: 0, isAddon: false, desc: '', tat: '', fasting: true, sampleType: '', ageGroup: '', gender: 'Unisex', labName: '', cities: '', parameters: [], image: '', status: 'Active', testMethod: 'EIA/CLIA' });
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (pkg) => {
        // Sanitize parameters: convert strings to objects if necessary
        const sanitizedParams = (pkg.parameters || []).map((p, idx) => {
            if (typeof p === 'string') {
                return { id: `legacy-${idx}-${Date.now()}`, name: p, unit: '', range: '' };
            }
            return { ...p, id: p.id || `p-${idx}-${Date.now()}` };
        });

        const sanitizedPkg = {
            ...pkg,
            parameters: sanitizedParams
        };

        setEditingPackage(sanitizedPkg);
        setFormData(sanitizedPkg);
        setIsModalOpen(true);
    };

    const handleAddParam = (e) => {
        if (e) e.preventDefault();
        const trimmedName = paramInput.name.trim();
        const trimmedGroup = paramInput.groupName.trim();
        
        // Allow adding if at least name OR group name is provided
        if (trimmedName || trimmedGroup) {
            const newParam = {
                id: `param-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                name: trimmedName || trimmedGroup,
                unit: paramInput.unit.trim(),
                range: paramInput.range.trim(),
                groupName: trimmedName ? trimmedGroup : ''
            };
            setFormData({
                ...formData,
                parameters: [...(formData.parameters || []), newParam]
            });
            setParamInput({ name: '', unit: '', range: '', groupName: trimmedGroup }); // Keep group name for faster entry
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-dark-text mb-2">Packages & Add-ons</h1>
                    <p className="text-grey-text">Manage health bundles and promotional product add-ons.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-medical-green transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search names or labs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-12 bg-white border border-gray-200 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-medical-green transition-all w-full sm:w-64"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-12 border-gray-200 gap-2 px-4 whitespace-nowrap"
                            onClick={() => setIsBulkUploadModalOpen(true)}
                        >
                            <Upload size={18} /> Bulk Import
                        </Button>
                        <Button
                            onClick={() => {
                                setEditingPackage(null);
                                setFormData({ name: '', price: '', originalPrice: '', category: 'Full Body', categoryType: 'Pathology', testsCount: 0, isAddon: false, desc: '', tat: '', fasting: true, sampleType: '', ageGroup: '', gender: 'Unisex', labName: '', cities: '', parameters: [], image: '', status: 'Active', testMethod: 'EIA/CLIA' });
                                setIsModalOpen(true);
                            }}
                            className="h-12 bg-dark-text hover:bg-black gap-2 px-6 whitespace-nowrap"
                            disabled={isUploading}
                        >
                            <Plus size={18} /> Create New
                        </Button>
                    </div>
                </div>
            </div>

            {uploadStatus.message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border ${uploadStatus.type === 'success' ? 'bg-soft-green border-medical-green/20 text-medical-green' : 'bg-red-50 border-red-100 text-red-600'
                        } flex items-center gap-3 text-sm font-bold`}
                >
                    <FileText size={20} />
                    {uploadStatus.message}
                </motion.div>
            )}

            {/* Modal for Bulk Upload */}
            <AnimatePresence>
                {isBulkUploadModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden p-8 relative"
                        >
                            <button onClick={() => setIsBulkUploadModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-dark-text transition-colors">
                                <X size={20} />
                            </button>
                            <BulkUpload
                                headerMap={headerMap}
                                onUpload={handleBulkUploadData}
                                title="Import Packages"
                                description="Upload a CSV or Excel file to add multiple packages at once."
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        <div className="p-8 md:p-12 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-dark-text">{editingPackage ? 'Edit Package' : 'Create New Package'}</h2>
                                <p className="text-sm text-grey-text font-medium mt-1">Configure diagnostic products and add-ons.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-dark-text transition-colors shadow-sm">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSave} className="p-8 md:p-12 space-y-8">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-black text-dark-text border-b border-gray-100 pb-2">Package Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Package Name</label>
                                            <input
                                                type="text" required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all"
                                                placeholder="e.g. Full Body Audit"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                                            <textarea
                                                value={formData.desc}
                                                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                                className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium text-dark-text focus:outline-none focus:border-medical-green transition-all resize-none"
                                                placeholder="Detailed description of the package..."
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <div className="flex items-center justify-between ml-4">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Package Image</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, showUrlInput: !formData.showUrlInput })}
                                                    className="text-[10px] font-black text-medical-green uppercase tracking-widest hover:underline"
                                                >
                                                    {formData.showUrlInput ? 'Hide URL Input' : 'Edit URL manually'}
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setFormData({ ...formData, image: reader.result });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="hidden" 
                                                    accept="image/*"
                                                />
                                                
                                                {/* Premium Click-to-Upload Zone */}
                                                <div 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className={`
                                                        relative w-full h-48 rounded-[32px] border-2 border-dashed transition-all cursor-pointer overflow-hidden group
                                                        ${formData.image 
                                                            ? 'border-medical-green/20' 
                                                            : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-medical-green/40'
                                                        }
                                                    `}
                                                >
                                                    {formData.image ? (
                                                        <>
                                                            <img 
                                                                src={formData.image} 
                                                                alt="Preview" 
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-dark-text/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                                                    <Upload size={20} />
                                                                </div>
                                                                <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Package Image</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                            <div className="w-16 h-16 bg-medical-green/10 rounded-3xl flex items-center justify-center text-medical-green group-hover:scale-110 transition-transform">
                                                                <ImageIcon size={32} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-black text-dark-text uppercase tracking-tight">Click to Upload Package Image</p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG or WebP supported</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {formData.showUrlInput && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="relative"
                                                    >
                                                        <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.image}
                                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                            className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all text-sm"
                                                            placeholder="Paste image URL here..."
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all appearance-none"
                                            >
                                                {testCategories.map(cat => (
                                                    <option key={cat.id} value={cat.filter}>{cat.name} ({cat.type})</option>
                                                ))}
                                                <option value="Full Body">Full Body</option>
                                                <option value="Senior Citizen">Senior Citizen</option>
                                                <option value="Women Health">Women Health</option>
                                                <option value="Add-on">Add-on</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Price (₹)</label>
                                            <input
                                                type="text" required
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all"
                                                placeholder="1999"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Sample Type</label>
                                            <input
                                                type="text"
                                                value={formData.sampleType}
                                                onChange={e => setFormData({ ...formData, sampleType: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all"
                                                placeholder="e.g. Blood, Urine"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Turnaround Time</label>
                                            <input
                                                type="text"
                                                value={formData.tat}
                                                onChange={e => setFormData({ ...formData, tat: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all"
                                                placeholder="e.g. 24 Hours"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Test Method</label>
                                            <input
                                                type="text"
                                                value={formData.testMethod}
                                                onChange={e => setFormData({ ...formData, testMethod: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all"
                                                placeholder="e.g. EIA/CLIA, HPLC"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Age Group</label>
                                            <input
                                                type="text"
                                                value={formData.ageGroup}
                                                onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all"
                                                placeholder="e.g. All Ages, 18+"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Gender</label>
                                            <select
                                                value={formData.gender}
                                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all appearance-none"
                                            >
                                                <option value="Unisex">Unisex</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Associated Lab</label>
                                            <select
                                                value={formData.labName}
                                                onChange={e => setFormData({ ...formData, labName: e.target.value })}
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all appearance-none"
                                            >
                                                <option value="">General (All Labs)</option>
                                                {labs.map(lab => (
                                                    <option key={lab.id} value={lab.name}>{lab.name} — {lab.location || lab.city || 'N/A'}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                                Available In Cities
                                                <span className="ml-2 text-gray-300 normal-case font-medium">comma-separated · leave blank = use lab location</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.cities}
                                                onChange={e => setFormData({ ...formData, cities: e.target.value })}
                                                placeholder="e.g. Ghaziabad, Noida, Delhi  —  or type: Pan India"
                                                className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-dark-text focus:outline-none focus:border-medical-green transition-all placeholder:font-medium placeholder:text-gray-300"
                                            />
                                            <div className="flex flex-wrap gap-2 px-2 pt-1">
                                                {(serviceableCities || []).map(city => (
                                                    <button
                                                        key={city.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const current = formData.cities ? formData.cities.split(',').map(s => s.trim()).filter(Boolean) : [];
                                                            if (!current.map(c => c.toLowerCase()).includes(city.name.toLowerCase())) {
                                                                setFormData({ ...formData, cities: [...current, city.name].join(', ') });
                                                            }
                                                        }}
                                                        className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-100 transition-all"
                                                    >
                                                        + {city.name}
                                                    </button>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, cities: 'Pan India' })}
                                                    className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full hover:bg-blue-100 transition-all"
                                                >
                                                    🌐 Pan India
                                                </button>
                                                {formData.cities && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, cities: '' })}
                                                        className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-red-50 border border-red-100 text-red-500 rounded-full hover:bg-red-100 transition-all"
                                                    >
                                                        ✕ Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-4 p-4 bg-medical-green/5 border border-medical-green/10 rounded-2xl">
                                            <input
                                                type="checkbox"
                                                id="fasting"
                                                checked={formData.fasting}
                                                onChange={e => setFormData({ ...formData, fasting: e.target.checked })}
                                                className="w-5 h-5 accent-medical-green"
                                            />
                                            <label htmlFor="fasting" className="text-sm font-bold text-dark-text">Fasting Required</label>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                            <input
                                                type="checkbox"
                                                id="isAddon"
                                                checked={formData.isAddon}
                                                onChange={e => setFormData({ ...formData, isAddon: e.target.checked })}
                                                className="w-5 h-5 accent-indigo-600"
                                            />
                                            <label htmlFor="isAddon" className="text-sm font-bold text-indigo-900">Mark as Premium Add-on</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Parameters Section */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-black text-dark-text border-b border-gray-100 pb-2">Test Parameters</h3>
                                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Param Name</label>
                                                <input
                                                    type="text"
                                                    value={paramInput.name}
                                                    onChange={e => setParamInput({ ...paramInput, name: e.target.value })}
                                                    onKeyDown={e => e.key === 'Enter' && handleAddParam(e)}
                                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-bold text-sm text-dark-text focus:outline-none focus:border-medical-green"
                                                    placeholder="e.g. Haemoglobin"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Test / Group Name</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={paramInput.groupName}
                                                        onChange={e => setParamInput({ ...paramInput, groupName: e.target.value })}
                                                        onKeyDown={e => e.key === 'Enter' && handleAddParam(e)}
                                                        className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-bold text-sm text-dark-text focus:outline-none focus:border-medical-green"
                                                        placeholder="e.g. Vitamin D"
                                                    />
                                                    {/* Quick Selection for current groups */}
                                                    {formData.parameters?.length > 0 && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                                            {[...new Set(formData.parameters.map(p => p.groupName).filter(Boolean))].slice(0, 2).map(g => (
                                                                <button 
                                                                    key={g} 
                                                                    type="button"
                                                                    onClick={() => setParamInput({ ...paramInput, groupName: g })}
                                                                    className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-black uppercase text-gray-500 hover:bg-medical-green/10 hover:text-medical-green"
                                                                >
                                                                    {g}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Unit</label>
                                                <input
                                                    type="text"
                                                    value={paramInput.unit}
                                                    onChange={e => setParamInput({ ...paramInput, unit: e.target.value })}
                                                    onKeyDown={e => e.key === 'Enter' && handleAddParam(e)}
                                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-bold text-sm text-dark-text focus:outline-none focus:border-medical-green"
                                                    placeholder="e.g. g/dL"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Ref Range</label>
                                                <input
                                                    type="text"
                                                    value={paramInput.range}
                                                    onChange={e => setParamInput({ ...paramInput, range: e.target.value })}
                                                    onKeyDown={e => e.key === 'Enter' && handleAddParam(e)}
                                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 font-bold text-sm text-dark-text focus:outline-none focus:border-medical-green"
                                                    placeholder="e.g. 13-17"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleAddParam}
                                            className="w-full h-12 bg-medical-green hover:bg-emerald-600 text-white gap-2 rounded-xl shadow-lg shadow-medical-green/20 transition-all active:scale-95"
                                        >
                                            <Plus size={18} strokeWidth={3} />
                                            <span className="text-xs font-black uppercase tracking-widest">Add Parameter to List</span>
                                        </Button>

                                        {/* Parameters List */}
                                        <div className="space-y-2">
                                            {formData.parameters?.map((param, index) => (
                                                <div key={param.id || index} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-6 h-6 rounded-full bg-medical-green/10 text-medical-green text-xs flex items-center justify-center font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-bold text-dark-text">{param.name}</p>
                                                                {param.groupName && (
                                                                    <span className="text-[8px] font-black uppercase bg-medical-green/10 text-medical-green px-1.5 py-0.5 rounded tracking-widest">
                                                                        {param.groupName}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-400">{param.range} {param.unit}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            parameters: formData.parameters.filter(p => p.id !== param.id)
                                                        })}
                                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!formData.parameters || formData.parameters.length === 0) && (
                                                <p className="text-center text-xs text-gray-400 py-2">No parameters added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-14 bg-medical-green hover:bg-emerald-600 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-medical-green/20">
                                    {editingPackage ? 'Update Package' : 'Publish Package'}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                    const filteredPackages = (packages || [])
                        .filter(p => {
                            const query = searchTerm.toLowerCase();
                            return (
                                (p.name || '').toLowerCase().includes(query) ||
                                (p.labName || '').toLowerCase().includes(query) ||
                                (p.category || '').toLowerCase().includes(query)
                            );
                        })
                        .sort((a, b) => {
                            const idA = String(a.id || '');
                            const idB = String(b.id || '');
                            return idB.localeCompare(idA);
                        });

                    if (filteredPackages.length > 0) {
                        return filteredPackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex h-full">
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div 
                                                onClick={() => handleEdit(pkg)}
                                                className={`
                                                    w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden cursor-pointer shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center shrink-0
                                                    ${pkg.image ? 'bg-gray-50' : (pkg.isAddon ? 'bg-indigo-50 text-indigo-600' : 'bg-soft-green text-medical-green')}
                                                `}
                                            >
                                                {pkg.image ? (
                                                    <img 
                                                        src={pkg.image} 
                                                        alt={pkg.name} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`${pkg.image ? 'hidden' : 'flex'} items-center justify-center`}>
                                                    <Package size={24} />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => togglePackageStatus(pkg.id)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${pkg.status === 'Active' ? 'bg-medical-green/10 text-medical-green hover:bg-red-50 hover:text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-medical-green/10 hover:text-medical-green'
                                                    }`}>
                                                {pkg.status}
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-black text-dark-text mb-2 tracking-tight line-clamp-1">{pkg.name}</h3>
                                        <p className="text-xs text-grey-text font-bold uppercase tracking-widest mb-4">{pkg.tests}</p>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
                                                <Tag size={12} /> {pkg.category}
                                            </span>
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${pkg.categoryType === 'Radiology' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                {pkg.categoryType || 'Pathology'}
                                            </span>
                                            {pkg.labName && (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-xl text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">
                                                    <Building2 size={12} /> {pkg.labName}
                                                </span>
                                            )}
                                            {pkg.isAddon && (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl text-[10px] font-black text-amber-600 uppercase tracking-widest border border-amber-100">
                                                    <ShieldPlus size={12} /> Premium Add-on
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Price</p>
                                            <p className="text-2xl font-black text-dark-text tracking-tight">₹{pkg.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(pkg)}
                                                className="flex items-center gap-2 bg-medical-green/10 text-medical-green px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-medical-green hover:text-white transition-all shadow-sm"
                                            >
                                                <Upload size={14} /> Image
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm(`Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`)) {
                                                        try {
                                                            await deletePackage(pkg.id);
                                                            // Optional: Show success toast if you have one
                                                        } catch (error) {
                                                            console.error("Deletion failed:", error);
                                                            alert("Failed to delete package. Please try again.");
                                                        }
                                                    }
                                                }}
                                                className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                title="Delete Package"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(pkg)}
                                                className="flex items-center gap-2 bg-dark-text text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md group/btn"
                                            >
                                                Edit <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ));
                    } else {
                        return (
                            <div className="col-span-1 md:col-span-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center">
                                <Package size={48} className="text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-dark-text">No Packages Found</h3>
                                <p className="text-grey-text mt-2 font-medium">Try a different search or create a new package.</p>
                            </div>
                        );
                    }
                })()}
            </div>
        </div >
    );
};

export default PackagesManager;
