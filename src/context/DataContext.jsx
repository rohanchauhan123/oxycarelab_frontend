import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const defaultPackages = [
    { 
        id: 'pkg-1', 
        name: 'Essential Health Checkup', 
        category: 'Full Body', 
        price: 999, 
        originalPrice: 1999, 
        testsCount: 62,
        tests: '62 Parameters Included', 
        tag: 'Best Seller', 
        status: 'Active', 
        desc: 'Comprehensive blood test covering 60+ vital parameters including Vitamin D, B12, and HbA1c. Ideal for initial screening and annual health monitoring.',
        fasting: true,
        tat: '24 Hours',
        sampleType: 'Blood',
        labName: 'CRL',
        rating: '4.8',
        bookedCount: '12.4k',
        parameters: [
            { id: 1, name: 'Vitamin D (25-OH)', unit: 'ng/mL', range: '30-100' },
            { id: 2, name: 'Vitamin B12', unit: 'pg/mL', range: '211-911' },
            { id: 3, name: 'HbA1c', unit: '%', range: '4.0-5.6' },
            { id: 4, name: 'Lipid Profile', unit: 'mg/dL', range: 'N/A' },
            { id: 5, name: 'Liver Function Test', unit: 'U/L', range: 'N/A' },
            { id: 6, name: 'Kidney Function Test', unit: 'mg/dL', range: 'N/A' }
        ]
    },
    { 
        id: 'pkg-2', 
        name: 'Advanced Cardiac Profile', 
        category: 'Heart', 
        price: 2499, 
        originalPrice: 4500, 
        testsCount: 45, 
        tests: '45 Parameters Included',
        tag: 'Focused', 
        status: 'Active', 
        desc: 'Specialized profile for heart health, including Lipid Profile, High-sensitivity C-reactive protein (hs-CRP), and Homocysteine.',
        fasting: true,
        tat: '12 Hours',
        sampleType: 'Blood',
        labName: 'Hitech Pathology',
        rating: '4.9',
        bookedCount: '5.2k',
        parameters: [
            { id: 1, name: 'Lipid Profile', unit: 'mg/dL', range: 'N/A' },
            { id: 2, name: 'High-sensitivity CRP', unit: 'mg/L', range: '0-3' },
            { id: 3, name: 'Homocysteine', unit: 'µmol/L', range: '5.0-15.0' },
            { id: 4, name: 'Lipoprotein (a)', unit: 'mg/dL', range: '0-30' }
        ]
    },
    { 
        id: 'pkg-3', 
        name: 'Women Wellness Platinum', 
        category: 'Women Health', 
        price: 3999, 
        originalPrice: 7999, 
        testsCount: 88, 
        tests: '88 Parameters Included',
        tag: 'Premium', 
        status: 'Active', 
        desc: 'The ultimate health checkup for women, covering 85+ parameters including Thyroid, Thyroid Antibodies, and Iron Studies.',
        fasting: true,
        tat: '24-48 Hours',
        sampleType: 'Blood & Urine',
        labName: 'Healthians',
        rating: '4.7',
        bookedCount: '8.9k',
        parameters: [
            { id: 1, name: 'Thyroid Profile (T3, T4, TSH)', unit: 'µIU/mL', range: '0.45-4.5' },
            { id: 2, name: 'Iron Studies', unit: 'µg/dL', range: '50-170' },
            { id: 3, name: 'Calcium', unit: 'mg/dL', range: '8.6-10.2' },
            { id: 4, name: 'Vitamin D', unit: 'ng/mL', range: '30-100' },
            { id: 5, name: 'Complete Blood Count', unit: 'cells/mcL', range: 'N/A' }
        ]
    }
];

const defaultCategories = [
    { id: 'cat-1', name: 'Full Body Checkup', filter: 'Full Body', type: 'Pathology', status: 'Active' },
    { id: 'cat-2', name: 'Thyroid Care', filter: 'Thyroid', type: 'Pathology', status: 'Active' },
    { id: 'cat-3', name: 'Diabetes', filter: 'Diabetes', type: 'Pathology', status: 'Active' },
    { id: 'cat-4', name: 'Kidney Function', filter: 'Kidney', type: 'Pathology', status: 'Active' },
    { id: 'cat-5', name: 'Liver Care', filter: 'Liver', type: 'Pathology', status: 'Active' },
    { id: 'cat-6', name: 'Cardiac Profile', filter: 'Heart', type: 'Pathology', status: 'Active' },
    { id: 'cat-7', name: 'MRI Scans', filter: 'MRI', type: 'Radiology', status: 'Active' },
    { id: 'cat-8', name: 'CT Scans', filter: 'CT', type: 'Radiology', status: 'Active' },
    { id: 'cat-9', name: 'X-Ray', filter: 'X-Ray', type: 'Radiology', status: 'Active' },
    { id: 'cat-10', name: 'Ultrasounds', filter: 'Ultrasound', type: 'Radiology', status: 'Active' }
];

const defaultLabs = [
    { id: 'LAB-1', name: 'Healthians', location: 'Multiple Cities', address: 'Pan India Presence', timing: '24 Hours Open', accreditation: 'NABL, ISO Certified', rating: '4.8', status: 'Active' },
    { id: 'LAB-2', name: 'CRL', location: 'Delhi NCR', address: 'Plot No. 2, Sector 18, Noida, Uttar Pradesh 201301', timing: '24 Hours Open', accreditation: 'NABL, ISO Certified', rating: '4.9', status: 'Active' },
    { id: 'LAB-3', name: 'Hitech Pathology', location: 'Gurugram', address: 'Shop No. 15, Sector 14 Market, Gurugram, Haryana 122001', timing: '8:00 AM - 10:00 PM', accreditation: 'NABL Accredited', rating: '4.7', status: 'Active' },
    { id: 'LAB-4', name: 'City Lab', location: 'Delhi', address: 'B-1/4, Pusa Road, New Delhi, Delhi 110005', timing: '7:30 AM - 9:00 PM', accreditation: 'ISO 9001:2015', rating: '4.5', status: 'Active' },
    { id: 'LAB-5', name: 'Modern Diagnostics', location: 'Noida', address: 'C-56/21, Sector 62, Noida, Uttar Pradesh 201309', timing: '8:00 AM - 8:00 PM', accreditation: 'NABL, CAP Accredited', rating: '4.8', status: 'Active' }
];

const defaultBlogs = [
    { 
        id: 'blog-default-1', 
        title: 'Why Regular Health Screenings are the Foundation of a Long Life', 
        excerpt: 'Preventive diagnostics can detect potential health issues before they become serious. Learn why a biannual checkup is essential for everyone.', 
        category: 'Wellness', 
        author: 'Dr. Aarti Sharma', 
        image: '/assets/blogs/preventive_care.png', 
        date: '18 Feb 2026',
        readTime: '5 Min Read',
        content: `Regular health screenings are more than just a medical formality...`
    },
    { 
        id: 'blog-default-2', 
        title: 'The Revolution of Home Sample Collection in Diagnostics', 
        excerpt: 'Gone are the days of long clinic waits. Discover how OxyCare Labs is bringing world-class lab testing to your living room with safety and precision.', 
        category: 'New Technology', 
        author: 'Sandeep Varma', 
        image: '/assets/blogs/home_collection.png', 
        date: '22 Feb 2026',
        readTime: '4 Min Read',
        content: `Technology has transformed how we access healthcare...`
    }
];

const defaultTests = [
    { id: 't-1', name: 'Thyroid Stimulating Hormone (TSH)', price: 499, originalPrice: 999, category: 'Thyroid', labName: 'CRL', rating: '4.8', status: 'Active', sampleType: 'Blood', tat: '12 Hours' },
    { id: 't-2', name: 'Complete Blood Count (CBC)', price: 399, originalPrice: 799, category: 'Blood Test', labName: 'Healthians', rating: '4.9', status: 'Active', sampleType: 'Blood', tat: '8 Hours' },
    { id: 't-3', name: 'Lipid Profile', price: 699, originalPrice: 1200, category: 'Heart', labName: 'Hitech Pathology', rating: '4.7', status: 'Active', sampleType: 'Blood', tat: '18 Hours' },
    { id: 't-4', name: 'HbA1c (Diabetes)', price: 549, originalPrice: 1100, category: 'Diabetes', labName: 'Modern Diagnostics', rating: '4.8', status: 'Active', sampleType: 'Blood', tat: '12 Hours' },
    { id: 't-5', name: 'Vitamin D Level', price: 999, originalPrice: 1999, category: 'Vitamin', labName: 'CRL', rating: '4.6', status: 'Active', sampleType: 'Blood', tat: '24 Hours' }
];

const defaultOffers = [
    { id: 'OFF-1', title: "FLAT 50% OFF", desc: "On all Health Packages for first-time users", code: "OXYCARE50", expires: "28 Feb 2026", color: "bg-medical-green", bgLight: "bg-medical-green/5" },
    { id: 'OFF-2', title: "Extra ₹200 OFF", desc: "On orders above ₹2000 for returning customers", code: "HEALTH200", expires: "15 Mar 2026", color: "bg-blue-600", bgLight: "bg-blue-50" }
];

const defaultSlots = ["06:30 AM to 07:30 AM", "07:30 AM to 08:30 AM", "08:30 AM to 09:30 AM", "09:30 AM to 10:30 AM", "10:30 AM to 11:30 AM", "12:30 PM to 01:30 PM", "01:30 PM to 02:30 PM"];
const defaultCityList = [
    { id: 'CTY-1', name: 'Bangalore', state: 'Karnataka' },
    { id: 'CTY-2', name: 'Mumbai', state: 'Maharashtra' },
    { id: 'CTY-3', name: 'Delhi', state: 'Delhi' }
];

export const DataProvider = ({ children }) => {
    const [dbError, setDbError] = useState(null);
    const [packages, setPackages] = useState([]);
    const [testCategories, setTestCategories] = useState([]);
    const [labs, setLabs] = useState([]);
    const [tests, setTests] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [offers, setOffers] = useState([]);
    const [slots, setSlots] = useState([]);
    const [callbackRequests, setCallbackRequests] = useState([]);
    const [partnerships, setPartnerships] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const [serviceableCities, setServiceableCities] = useState([]);
    const [paymentSettings, setPaymentSettings] = useState({
        activeGateway: 'phonepe',
        isActive: false,
        env: 'sandbox',
        gateways: {
            phonepe: { apiKey: '', secretKey: '', merchantId: '' },
            paytm: { apiKey: '', secretKey: '', merchantId: '' },
            razorpay: { apiKey: '', secretKey: '', merchantId: '' },
            cashfree: { apiKey: '', secretKey: '', merchantId: '' }
        }
    });
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const initData = async () => {
            console.log('DataContext: Initializing Data from API (Supabase)...');
            try {
                // Because API is decoupled, we just await fetch all.
                const [
                    pkgs, cats, lbs, tsts, blgs, 
                    mbrs, addrs, usrs, bkngs, cbrq,
                    ptrn, jvbs, ctys
                ] = await Promise.all([
                    api.packages.getAll(),
                    api.categories.getAll(),
                    api.labs.getAll(),
                    api.tests.getAll(),
                    api.blogs.getAll(),
                    api.members.getAll(),
                    api.addresses.getAll(),
                    api.users.getAll(),
                    api.bookings.getAll(),
                    api.callbackRequests.getAll(),
                    api.partnerships.getAll(),
                    api.jobApplications.getAll(),
                    api.cities.getAll()
                ]);

                // Filter out 'Deleted' items (Soft Delete support)
                const filterDeleted = (arr) => (Array.isArray(arr) ? arr.filter(item => item && item.status !== 'Deleted' && String(item.status).toLowerCase() !== 'deleted') : []);

                setPackages(filterDeleted(pkgs));
                setTestCategories(filterDeleted(cats));
                setLabs(filterDeleted(lbs));
                setTests(filterDeleted(tsts));
                setBlogs(filterDeleted(blgs));
                setMembers(filterDeleted(mbrs));
                setAddresses(filterDeleted(addrs));
                setUsers(filterDeleted(usrs));
                setBookings(filterDeleted(bkngs));
                setCallbackRequests(filterDeleted(cbrq));
                setPartnerships(filterDeleted(ptrn));
                setJobApplications(filterDeleted(jvbs));
                setServiceableCities(filterDeleted(ctys));

                // Auto-Hydration for completely new projects connecting for the first time
                if (pkgs.length === 0) {
                    console.log('Hydrating default packages...');
                    await api.packages.saveBulk(defaultPackages);
                    setPackages(defaultPackages);
                } 

                if (cats.length === 0) {
                    await api.categories.saveBulk(defaultCategories);
                    setTestCategories(defaultCategories);
                } 

                if (lbs.length === 0) {
                    await api.labs.saveBulk(defaultLabs);
                    setLabs(defaultLabs);
                } 

                if (tsts.length === 0) {
                    await api.tests.saveAll(defaultTests);
                    setTests(defaultTests);
                } 
                
                if (blgs.length === 0) {
                    await api.blogs.saveBulk(defaultBlogs);
                    setBlogs(defaultBlogs);
                } 

                if (ctys.length === 0) {
                    await api.cities.saveBulk(defaultCityList);
                    setServiceableCities(defaultCityList);
                }

                // Static Defaults fallback
                setOffers(defaultOffers);
                setSlots(defaultSlots);

                // Load Payment Settings
                const savedPayment = localStorage.getItem('oxycare_payment_settings');
                if (savedPayment) {
                    try {
                        const parsed = JSON.parse(savedPayment);
                        if (parsed && typeof parsed === 'object') setPaymentSettings(parsed);
                    } catch (e) {
                        console.error("Failed to parse payment settings:", e);
                    }
                }
                
                console.log('DataContext: Initialization Complete.');
            } catch (globalError) {
                console.error('CRITICAL: DataContext Initialization Failed Entirely:', globalError);
                setDbError(globalError.message || String(globalError));
                // Fallbacks to keep app alive
                setPackages(defaultPackages);
                setLabs(defaultLabs);
                setTestCategories(defaultCategories);
                setBlogs(defaultBlogs);
            } finally {
                setIsDataLoaded(true);
            }
        };

        if (!isDataLoaded) initData();
    }, [isDataLoaded]);

    const clearAllData = async () => {
        // Clear all arrays
        setPackages([]); setLabs([]); setTests([]); setTestCategories([]);
        // This is a highly destructive action in a cloud env, currently omitting 'api.table.saveBulk([])' 
        // to prevent users from wiping DB unless explicitly intended.
        localStorage.clear();
        window.location.reload();
    };

    // Packages
    const addPackage = async (pkg) => { const newPkg = await api.packages.create(pkg); setPackages(prev => [...prev, newPkg]); return newPkg; };
    const addPackages = async (newPkgs) => { const created = await api.packages.createBulk(newPkgs); setPackages(prev => [...prev, ...created]); return created; };
    const updatePackage = async (id, updatedPkg) => { const updated = await api.packages.update(id, updatedPkg); setPackages(prev => prev.map(p => p.id === id ? updated : p)); return updated; };
    const deletePackage = async (id) => { 
        // Soft Delete: Update status to 'Deleted' instead of hard DELETE to bypass RLS restrictions
        await api.packages.update(id, { status: 'Deleted' }); 
        setPackages(prev => prev.filter(p => p.id !== id)); 
    };
    const togglePackageStatus = async (id) => {
        const pkg = packages.find(p => p.id === id);
        if (!pkg) return;
        const newStatus = String(pkg.status).toLowerCase() === 'active' ? 'Inactive' : 'Active';
        return updatePackage(id, { status: newStatus });
    };
    const saveAllPackages = async (newData) => { const saved = await api.packages.saveBulk(newData); setPackages(saved); return saved; };

    // Labs
    const addLab = async (lab) => { const newLab = await api.labs.create(lab); setLabs(prev => [...prev, newLab]); return newLab; };
    const updateLab = async (id, updatedLab) => { const updated = await api.labs.update(id, updatedLab); setLabs(prev => prev.map(l => l.id === id ? updated : l)); return updated; };
    const deleteLab = async (id) => { 
        await api.labs.update(id, { status: 'Deleted' }); 
        setLabs(prev => prev.filter(l => l.id !== id)); 
    };

    // Tests
    const repairAllTests = async () => { console.log('Repair deprecated with cloud backend.'); return tests; };
    const addTest = async (test) => { const newTest = await api.tests.create(test); setTests(prev => [...prev, newTest]); };
    const updateTest = async (id, updatedTest) => { const updated = await api.tests.update(id, updatedTest); setTests(prev => prev.map(t => t.id === id ? updated : t)); };
    const deleteTest = async (id) => { 
        await api.tests.update(id, { status: 'Deleted' }); 
        setTests(prev => prev.filter(t => t.id !== id)); 
    };
    const saveAllTests = async (newData) => { const saved = await api.tests.saveAll(newData); setTests(saved); return saved; };

    // Categories
    const addCategory = async (cat) => { const newCat = await api.categories.create(cat); setTestCategories(prev => [...prev, newCat]); return newCat; };
    const updateCategory = async (id, updatedCat) => { const updated = await api.categories.update(id, updatedCat); setTestCategories(prev => prev.map(c => c.id === id ? updated : c)); return updated; };
    const deleteCategory = async (id) => { 
        await api.categories.update(id, { status: 'Deleted' }); 
        setTestCategories(prev => prev.filter(c => c.id !== id)); 
    };

    // Addresses
    const addAddress = async (addr, userId) => { const newAddr = await api.addresses.create({ ...addr, userId }); setAddresses(prev => [...prev, newAddr]); return newAddr; };
    const updateAddress = async (id, updatedAddr) => { const updated = await api.addresses.update(id, updatedAddr); setAddresses(prev => prev.map(a => a.id === id ? updated : a)); };
    const deleteAddress = async (id) => { await api.addresses.delete(id); setAddresses(prev => prev.filter(a => a.id !== id)); };

    // Members
    const addMember = async (m, userId) => { const newMember = await api.members.create({ ...m, userId }); setMembers(prev => [...prev, newMember]); return newMember; };
    const updateMember = async (id, updatedMember) => { const updated = await api.members.update(id, updatedMember); setMembers(prev => prev.map(m => m.id === id ? updated : m)); };
    const deleteMember = async (id) => { await api.members.delete(id); setMembers(prev => prev.filter(m => m.id !== id)); };

    // Users
    const addUser = async (user) => { const newUser = await api.users.create(user); setUsers(prev => [...prev, newUser]); };
    const updateUser = async (id, updatedUser) => { const updated = await api.users.update(id, updatedUser); setUsers(prev => prev.map(u => u.id === id ? updated : u)); };
    const deleteUser = async (id) => { await api.users.delete(id); setUsers(prev => prev.filter(u => u.id !== id)); };

    // Bookings
    const addBooking = async (booking) => { const newBooking = await api.bookings.create(booking); setBookings(prev => [...prev, newBooking]); };
    const updateBooking = async (id, updatedBooking) => { const updated = await api.bookings.update(id, updatedBooking); setBookings(prev => prev.map(b => b.id === id ? updated : b)); };
    const cancelBooking = (id) => updateBooking(id, { status: 'Cancelled' });
    const rescheduleBooking = (id, newDate, newTime) => updateBooking(id, { date: newDate, time: newTime });
    const deleteBooking = async (id) => { await api.bookings.delete(id); setBookings(prev => prev.filter(b => b.id !== id)); };

    // Blogs
    const addBlog = async (blog) => { const newBlog = await api.blogs.create(blog); setBlogs(prev => [newBlog, ...prev]); };
    const updateBlog = async (id, updatedBlog) => { const updated = await api.blogs.update(id, updatedBlog); setBlogs(prev => prev.map(b => b.id === id ? updated : b)); };
    const deleteBlog = async (id) => { 
        await api.blogs.update(id, { status: 'Deleted' }); 
        setBlogs(prev => prev.filter(b => b.id !== id)); 
    };

    // Callback Requests
    const addCallbackRequest = async (req) => { const newReq = await api.callbackRequests.create(req); setCallbackRequests(prev => [newReq, ...prev]); return newReq; };
    const updateCallbackStatus = async (id, status) => { const updated = await api.callbackRequests.updateStatus(id, status); setCallbackRequests(prev => prev.map(r => r.id === id ? updated : r)); return updated; };
    const deleteCallbackRequest = async (id) => { 
        await api.callbackRequests.updateStatus(id, 'Deleted'); 
        setCallbackRequests(prev => prev.filter(r => r.id !== id)); 
    };
    const refreshCallbackRequests = async () => { const reqs = await api.callbackRequests.getAll(); setCallbackRequests(reqs); return reqs; };

    // Partnerships
    const addPartnership = async (req) => { const newReq = await api.partnerships.create(req); setPartnerships(prev => [...prev, newReq]); return newReq; };
    const updatePartnershipStatus = async (id, status) => { const updated = await api.partnerships.updateStatus(id, status); setPartnerships(prev => prev.map(r => r.id === id ? updated : r)); return updated; };
    const deletePartnership = async (id) => { 
        await api.partnerships.updateStatus(id, 'Deleted'); 
        setPartnerships(prev => prev.filter(r => r.id !== id)); 
    };

    // Job Applications
    const addJobApplication = async (app) => { const newApp = await api.jobApplications.create(app); setJobApplications(prev => [...prev, newApp]); return newApp; };
    const updateJobApplicationStatus = async (id, status) => { const updated = await api.jobApplications.updateStatus(id, status); setJobApplications(prev => prev.map(a => a.id === id ? updated : a)); return updated; };
    const deleteJobApplication = async (id) => { 
        await api.jobApplications.updateStatus(id, 'Deleted'); 
        setJobApplications(prev => prev.filter(a => a.id !== id)); 
    };

    const updateSlots = async (newSlots) => { setSlots(newSlots); };

    // Cities
    const addCity = async (city) => { 
        const newCity = await api.cities.create(city); 
        setServiceableCities(prev => [...prev, newCity]); 
        return newCity; 
    };
    const updateCity = async (id, updatedCity) => { 
        const updated = await api.cities.update(id, updatedCity); 
        setServiceableCities(prev => prev.map(c => c.id === id ? updated : c)); 
        return updated;
    };
    const deleteCity = async (id) => { 
        await api.cities.delete(id); 
        setServiceableCities(prev => prev.filter(c => c.id !== id)); 
    };
    const removeDemoData = async () => { console.warn("removeDemoData disabled in Cloud backend."); return true; };

    return (
        <DataContext.Provider value={{
            packages, addPackage, addPackages, updatePackage, deletePackage, togglePackageStatus, saveAllPackages,
            labs, addLab, updateLab, deleteLab,
            tests, addTest, updateTest, deleteTest, saveAllTests, repairAllTests,
            testCategories, setTestCategories, addCategory, updateCategory, deleteCategory,
            addresses, addAddress, updateAddress, deleteAddress,
            members, addMember, updateMember, deleteMember,
            users, addUser, updateUser, deleteUser,
            bookings, addBooking, updateBooking, cancelBooking, rescheduleBooking, deleteBooking,
            blogs, addBlog, updateBlog, deleteBlog,
            offers, setOffers,
            callbackRequests, addCallbackRequest, updateCallbackStatus, deleteCallbackRequest, refreshCallbackRequests,
            partnerships, addPartnership, updatePartnershipStatus, deletePartnership,
            jobApplications, addJobApplication, updateJobApplicationStatus, deleteJobApplication,
            serviceableCities, addCity, updateCity, deleteCity,
            paymentSettings, setPaymentSettings,
            removeDemoData,
            slots, updateSlots,
            clearAllData,
            isDataLoaded,
            dbError
        }}>
            {children}
        </DataContext.Provider>
    );
};
