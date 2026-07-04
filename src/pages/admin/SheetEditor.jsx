import React, { useState } from 'react';
import {
    Download,
    Upload,
    Plus,
    Trash2,
    Save,
    Search,
    Grid3X3,
    FileSpreadsheet,
    Undo2,
    Redo2,
    Filter,
    CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import SheetEditorUploadModal from '../../components/admin/SheetEditorUploadModal';

const SheetEditor = () => {
    const { tests, saveAllTests, packages, saveAllPackages, testCategories, repairAllTests } = useData();
    const [viewMode, setViewMode] = useState('tests'); // 'tests' or 'packages'
    const [data, setData] = useState([]);
    
    // Sync data with source whenever source changes
    React.useEffect(() => {
        const sourceData = viewMode === 'tests' ? tests : packages;
        
        // Immediate repair for generic names when loading state
        const fallbackNames = ['Lab Test', 'New Test', 'Diagnostic Test', 'Diagnostic Service', 'General Test', 'Default Test'];
        const sanitized = sourceData.map(t => {
            const currentName = String(t.testName || t.name || '').trim();
            if (!currentName || fallbackNames.includes(currentName)) {
                const betterName = t.test || t.category || 'Unidentified Item';
                return { ...t, name: betterName, testName: betterName };
            }
            return t;
        });
        setData(sanitized);
    }, [viewMode, tests, packages]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleBulkUpload = async (mappedData, selectedLab) => {
        console.log(`SheetEditor: handleBulkUpload started for ${viewMode} with`, mappedData.length, "items");
        
        // Filter out rows that don't have a name in any recognized field
        const validMappedData = mappedData.filter(item => {
            const potentialName = item.testName || item.name || item.test || item['Test Name'] || item['Name'] || item['Package Name'];
            const hasName = potentialName && potentialName.toString().trim() !== '';
            return hasName;
        });
        
        if (validMappedData.length === 0) {
            alert("No valid items found. Please ensure your CSV has a Name or Title column.");
            return;
        }

        const lastId = data.reduce((max, d) => {
            const numId = parseInt(String(d.id).replace(/\D/g, ''), 10);
            return !isNaN(numId) ? Math.max(max, numId) : max;
        }, 0);
        
        const newRows = validMappedData.map((item, index) => {
            const displayName = item.testName || item.name || item.test || item['Test Name'] || item['Package Name'] || item['Name'] || 'New Item';
            
            const baseRow = {
                id: viewMode === 'tests' ? (lastId + index + 1) : `PKG-UP-${Date.now()}-${index}`,
                name: displayName,
                testName: displayName,
                lab: selectedLab || item.lab || item.labName || 'OxyCare Lab',
                labName: selectedLab || item.labName || item.lab || 'OxyCare Lab',
                category: item.category || (viewMode === 'tests' ? 'Full Body' : 'Pathology'),
                price: Number(item.price) || Number(item['Rate']) || 0,
                originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
                desc: item.desc || item.description || '',
                tat: item.tat || item.reportTime || '',
                fasting: item.fasting !== undefined ? Boolean(item.fasting) : true,
                sampleType: item.sampleType || 'Blood',
                status: item.status || 'Active',
                testMethod: item.testMethod || 'EIA/CLIA'
            };

            if (viewMode === 'packages') {
                return {
                    ...baseRow,
                    testsCount: Number(item.testsCount) || 0,
                    image: item.image || '',
                    parameters: [] // Complex params usually handled manually or via specific format
                };
            }
            return baseRow;
        });

        const updatedData = [...data, ...newRows];
        setData(updatedData);
        
        if (viewMode === 'tests') {
            await saveAllTests(updatedData);
        } else {
            await saveAllPackages(updatedData);
        }
        
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleSave = () => {
        if (viewMode === 'tests') {
            saveAllTests(data);
        } else {
            saveAllPackages(data);
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleCellChange = (id, field, value) => {
        const newData = data.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setData(newData);
    };

    const addRow = () => {
        const newId = viewMode === 'tests' 
            ? (data.reduce((max, d) => Math.max(max, Number(d.id) || 0), 0) + 1)
            : `PKG-NEW-${Date.now()}`;
            
        const newRow = { 
            id: newId, 
            name: '',
            testName: '', 
            lab: '', 
            labName: '',
            cities: '',
            category: viewMode === 'tests' ? 'Full Body' : 'Pathology', 
            price: 0, 
            originalPrice: 0,
            desc: '',
            tat: '',
            fasting: true,
            sampleType: 'Blood',
            parameters: [],
            status: 'Draft' 
        };
        if (viewMode === 'packages') {
            newRow.testsCount = 0;
            newRow.image = '';
        }
        setData([...data, newRow]);
    };

    const filteredData = React.useMemo(() => {
        return data.filter(row => {
            const nameMatch = (row.testName || row.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const labMatch = (row.lab || row.labName || '').toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = (row.category || '').toLowerCase().includes(searchTerm.toLowerCase());
            return nameMatch || labMatch || categoryMatch;
        });
    }, [data, searchTerm]);

    const displayData = filteredData.slice(0, 100);
    const hiddenCount = filteredData.length - displayData.length;

    const deleteRow = (id) => {
        setData(data.filter(item => item.id !== id));
    };

    return (
        <div className="max-w-full space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-medical-green/10 rounded-2xl flex items-center justify-center text-medical-green">
                        <Grid3X3 size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-dark-text">Inventory Editor</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-grey-text font-black uppercase tracking-widest">Managing:</span>
                            <div className="flex p-0.5 bg-gray-100 rounded-lg">
                                <button 
                                    onClick={() => setViewMode('tests')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tight transition-all ${viewMode === 'tests' ? 'bg-white text-medical-green shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Diagnostic Tests
                                </button>
                                <button 
                                    onClick={() => setViewMode('packages')}
                                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tight transition-all ${viewMode === 'packages' ? 'bg-white text-medical-green shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Health Packages
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-medical-green animate-pulse" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Live Sync</span>
                    </div>
                    <Button 
                        variant="outline" 
                        className="h-12 gap-2 border-gray-200"
                        onClick={() => setIsUploadOpen(true)}
                    >
                        <Upload size={18} /> Import CSV
                    </Button>
                    {viewMode === 'tests' && (
                        <Button 
                            variant="outline" 
                            className="h-12 gap-2 border-gray-200 text-medical-green hover:bg-medical-green hover:text-white transition-all shadow-sm"
                            onClick={async () => {
                                const repaired = await repairAllTests();
                                setData(repaired);
                                alert(`Repair Complete: Recovered names for items that were showing as "Lab Test".`);
                            }}
                        >
                            <Grid3X3 size={18} /> Deep Repair
                        </Button>
                    )}
                    <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden md:block" />
                    <Button
                        onClick={handleSave}
                        className="h-12 gap-2 bg-dark-text hover:bg-black transition-all"
                    >
                        {isSaved ? <CheckCircle2 size={18} className="text-medical-green" /> : <Save size={18} />}
                        {isSaved ? 'Successfully Saved' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <SheetEditorUploadModal 
                isOpen={isUploadOpen} 
                onClose={() => setIsUploadOpen(false)} 
                onUpload={handleBulkUpload} 
                title={`Import ${viewMode === 'tests' ? 'Tests' : 'Packages'}`}
            />

            {/* Editor Container */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
                {/* Search & Actions */}
                <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${viewMode}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all text-gray-500 shadow-sm" title="Undo">
                            <Undo2 size={18} />
                        </button>
                        <button className="p-2.5 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all text-gray-500 shadow-sm" title="Redo">
                            <Redo2 size={18} />
                        </button>
                        <div className="w-[1px] h-6 bg-gray-200 mx-1" />
                        <button
                            onClick={addRow}
                            className="flex items-center gap-2 px-4 py-2.5 bg-medical-green text-white text-xs font-bold rounded-xl shadow-lg shadow-medical-green/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus size={16} /> Add New {viewMode === 'tests' ? 'Test' : 'Package'}
                        </button>
                    </div>
                </div>

                {/* Spreadsheet Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="w-12 p-4 border-b border-r border-gray-100 text-[10px] font-black text-gray-400">#</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest min-w-[200px]">{viewMode === 'tests' ? 'Test Name' : 'Package Name'}</th>
                                {viewMode === 'packages' && (
                                    <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Image URL</th>
                                )}
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Lab Partner</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-emerald-600 uppercase tracking-widest min-w-[180px]">Cities Available</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Category</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest min-w-[200px]">Description</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Price</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">MRP</th>
                                {viewMode === 'packages' && (
                                    <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Test Count</th>
                                )}
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">TAT</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Method</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest min-w-[250px]">
                                    {viewMode === 'tests' ? 'Parameters (Comma-sep)' : 'Parameters (Group:Name:Unit:Range)'}
                                </th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Fasting</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Sample</th>
                                <th className="p-4 border-b border-r border-gray-100 text-left text-xs font-bold text-dark-text uppercase tracking-widest">Status</th>
                                <th className="w-16 p-4 border-b border-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.length > 0 ? (
                                displayData.map((row, index) => (
                                    <tr key={row.id} className="hover:bg-soft-green/5 transition-colors group">
                                        <td className="p-4 border-b border-r border-gray-50 text-center text-xs font-bold text-gray-300">{index + 1}</td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="text"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-semibold text-dark-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all font-display"
                                                value={row.testName || row.name || ''}
                                                onChange={(e) => handleCellChange(row.id, viewMode === 'tests' ? 'testName' : 'name', e.target.value)}
                                            />
                                        </td>
                                        {viewMode === 'packages' && (
                                            <td className="p-0 border-b border-r border-gray-50 outline-none">
                                                <input
                                                    type="text"
                                                    className="w-full h-full p-4 bg-transparent outline-none text-[10px] font-mono text-blue-500 focus:bg-white"
                                                    value={row.image || ''}
                                                    placeholder="URL or data:image..."
                                                    onChange={(e) => handleCellChange(row.id, 'image', e.target.value)}
                                                />
                                            </td>
                                        )}
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="text"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-medium text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all"
                                                value={row.lab || row.labName || ''}
                                                onChange={(e) => handleCellChange(row.id, 'lab', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none min-w-[180px]">
                                            <input
                                                type="text"
                                                className="w-full h-full p-4 bg-transparent outline-none text-xs font-bold text-emerald-700 focus:bg-emerald-50/30 focus:ring-2 focus:ring-emerald-200 transition-all placeholder:text-gray-200"
                                                value={row.cities || ''}
                                                onChange={(e) => handleCellChange(row.id, 'cities', e.target.value)}
                                                placeholder="Ghaziabad, Noida — or: Pan India"
                                            />
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <select
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-medium text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all appearance-none cursor-pointer"
                                                value={row.category}
                                                onChange={(e) => handleCellChange(row.id, 'category', e.target.value)}
                                            >
                                                {testCategories.map(cat => (
                                                    <option key={cat.id} value={cat.filter}>{cat.name} ({cat.type})</option>
                                                ))}
                                                <option value="Health Packages">Health Packages</option>
                                                <option value="Vitamin">Vitamin</option>
                                                <option value="Blood Test">Blood Test</option>
                                                <option value="Pathology">Pathology</option>
                                                <option value="Radiology">Radiology</option>
                                            </select>
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="text"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-medium text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all"
                                                value={row.desc || ''}
                                                onChange={(e) => handleCellChange(row.id, 'desc', e.target.value)}
                                                placeholder="Short description..."
                                            />
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="number"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-black text-dark-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all"
                                                value={row.price}
                                                onChange={(e) => handleCellChange(row.id, 'price', parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="number"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-black text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all"
                                                value={row.originalPrice || row.price}
                                                onChange={(e) => handleCellChange(row.id, 'originalPrice', parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                        {viewMode === 'packages' && (
                                            <td className="p-0 border-b border-r border-gray-50 outline-none">
                                                <input
                                                    type="number"
                                                    className="w-full h-full p-4 bg-transparent outline-none text-sm font-black text-dark-text focus:bg-white transition-all"
                                                    value={row.testsCount || 0}
                                                    onChange={(e) => handleCellChange(row.id, 'testsCount', parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                        )}
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="text"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-medium text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all"
                                                value={row.tat || ''}
                                                onChange={(e) => handleCellChange(row.id, 'tat', e.target.value)}
                                                placeholder="e.g. 24 hrs"
                                            />
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="text"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-medium text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all font-mono"
                                                value={row.testMethod || 'EIA/CLIA'}
                                                onChange={(e) => handleCellChange(row.id, 'testMethod', e.target.value)}
                                                placeholder="EIA/CLIA"
                                            />
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none min-w-[300px]">
                                            <textarea
                                                className="w-full h-full min-h-[60px] p-4 bg-transparent outline-none text-[10px] font-black uppercase text-medical-green placeholder:text-gray-200 focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all font-mono resize-none leading-tight"
                                                value={viewMode === 'tests' 
                                                    ? (row.parameters || []).map(p => typeof p === 'object' ? (p.name || p.testName) : p).join(', ')
                                                    : (row.parameters || []).map(p => {
                                                        const group = p.groupName || p.testName || '';
                                                        const name = p.name || '';
                                                        const unit = p.unit || '';
                                                        const range = p.range || '';
                                                        return `${group}:${name}:${unit}:${range}`;
                                                    }).join(', ')
                                                }
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const parts = val.split(',').map(s => s.trim()).filter(Boolean);
                                                    
                                                    if (viewMode === 'tests') {
                                                        handleCellChange(row.id, 'parameters', parts);
                                                    } else {
                                                        const structured = parts.map((str, i) => {
                                                            const [group, name, unit, range] = str.split(':').map(s => s?.trim() || '');
                                                            return {
                                                                id: Date.now() + i,
                                                                groupName: group,
                                                                name: name || group, // Fallback to group if name missing
                                                                unit,
                                                                range
                                                            };
                                                        });
                                                        handleCellChange(row.id, 'parameters', structured);
                                                    }
                                                }}
                                                placeholder={viewMode === 'tests' ? "Bilirubin, SGOT, SGPT" : "Thyroid:T3:µg/dL:0.3-1.0, Thyroid:T4:µg/dL:5-12"}
                                            />
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <select
                                                className="w-full h-full p-4 bg-transparent outline-none text-xs font-bold text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all cursor-pointer"
                                                value={row.fasting}
                                                onChange={(e) => handleCellChange(row.id, 'fasting', e.target.value === 'true')}
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </td>
                                        <td className="p-0 border-b border-r border-gray-50 outline-none">
                                            <input
                                                type="text"
                                                className="w-full h-full p-4 bg-transparent outline-none text-sm font-medium text-grey-text focus:bg-white focus:ring-2 focus:ring-medical-green/30 transition-all"
                                                value={row.sampleType || ''}
                                                onChange={(e) => handleCellChange(row.id, 'sampleType', e.target.value)}
                                                placeholder="e.g. Blood"
                                            />
                                        </td>
                                        <td className="p-4 border-b border-r border-gray-50 outline-none">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${row.status === 'Active' ? 'bg-medical-green' : 'bg-gray-300'}`} />
                                                <select
                                                    className="bg-transparent outline-none text-[10px] font-black uppercase tracking-tighter"
                                                    value={row.status}
                                                    onChange={(e) => handleCellChange(row.id, 'status', e.target.value)}
                                                >
                                                    <option>Active</option>
                                                    <option>Inactive</option>
                                                    <option>Draft</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-50">
                                            <button
                                                onClick={() => deleteRow(row.id)}
                                                className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={viewMode === 'tests' ? 12 : 14} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Grid3X3 size={48} className="text-gray-200" />
                                            <div>
                                                <h4 className="text-lg font-black text-dark-text uppercase tracking-widest">No matching items</h4>
                                                <p className="text-sm text-grey-text font-medium">Try adjusting your filters or search term.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {hiddenCount > 0 && (
                                <tr className="bg-amber-50/50">
                                    <td colSpan={viewMode === 'tests' ? 12 : 14} className="p-4 text-center text-[10px] font-black text-amber-600 uppercase tracking-widest border-t border-amber-100">
                                        Showing first 100 of {filteredData.length} matches. Use search to find specific items.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Stats */}
                <div className="p-6 bg-gray-50/50 flex items-center justify-between">
                    <p className="text-xs font-bold text-grey-text uppercase tracking-widest">
                        Total Records: <span className="text-dark-text">{data.length}</span>
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-medical-green" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Auto-save Enabled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SheetEditor;
