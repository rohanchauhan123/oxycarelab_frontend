/**
 * Supabase API Service for OxyCare Labs
 * This module replaces IndexedDB and routes all CRUD operations to Supabase.
 */
import { supabase } from './supabase';

// Helper to handle generic CRUD mappings to our JSONB schema
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

const getTable = async (table) => {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(item => ({ id: item.id, ...item.data }));
};

const createItem = async (table, item, prefix = 'ID') => {
    const id = item.id || generateId(prefix);
    const { id: _, ...dataObj } = item; // Everything except ID goes into data column
    
    const { data, error } = await supabase.from(table).insert([{ id, data: dataObj }]).select();
    if (error) throw error;
    return { id: data[0].id, ...data[0].data };
};

const createBulkItems = async (table, items, prefix = 'ID') => {
    const rows = items.map(item => {
        const id = item.id || generateId(prefix);
        const { id: _, ...dataObj } = item;
        return { id, data: dataObj };
    });
    if (rows.length === 0) return [];
    
    const { data, error } = await supabase.from(table).insert(rows).select();
    if (error) throw error;
    return data.map(item => ({ id: item.id, ...item.data }));
};

const updateItem = async (table, id, dataObjToMerge) => {
    // 1. Fetch current data
    const { data: current, error: fetchErr } = await supabase.from(table).select('data').eq('id', String(id)).single();
    if (fetchErr) throw fetchErr;

    // 2. Merge
    const mergedData = { ...current.data, ...dataObjToMerge };

    // 3. Update
    const { data, error } = await supabase.from(table).update({ data: mergedData }).eq('id', String(id)).select();
    if (error) throw error;
    return { id: data[0].id, ...data[0].data };
};

const deleteItem = async (table, id) => {
    const stringId = String(id);
    console.log(`[deleteItem] Attempting to delete from ${table} where id = "${stringId}"`);
    
    // First, verify if the item is visible via SELECT
    const { data: checkData, error: checkError } = await supabase.from(table).select('id').eq('id', stringId);
    console.log(`[deleteItem] Pre-delete verification block:`, { checkData, checkError });
    
    if (checkData && checkData.length === 0) {
        console.warn(`[deleteItem] Warning: Item with id "${stringId}" does NOT exist or is blocked by RLS for SELECT.`);
    }

    const { data, error } = await supabase.from(table).delete().eq('id', stringId).select();
    
    console.log(`[deleteItem] Delete result:`, { data, error });
    
    if (error) throw error;
    if (!data || data.length === 0) {
        console.error(`Action failed: 0 rows deleted in table '${table}'. This usually means a Supabase RLS (Row Level Security) Policy is restricting Delete operations.`);
        throw new Error("Deletion blocked by database policies.");
    }
    return true;
};

// Extremely destructive: clears entire table and re-inserts. Used mainly for admin syncs.
const saveBulkOverride = async (table, items) => {
    // Delete all existing
    await supabase.from(table).delete().neq('id', 'RESERVED_NEVER_DELETE');
    
    if (items && items.length > 0) {
        const rows = items.map(item => {
            const { id, ...dataObj } = item;
            return { id: String(id || generateId('SYS')), data: dataObj };
        });
        const { error } = await supabase.from(table).insert(rows);
        if (error) throw error;
    }
    return items;
};

export const api = {
    // Packages API
    packages: {
        getAll: () => getTable('packages'),
        create: (pkg) => createItem('packages', pkg, 'PKG'),
        createBulk: (pkgs) => createBulkItems('packages', pkgs, 'PKG'),
        update: (id, data) => updateItem('packages', id, data),
        delete: (id) => deleteItem('packages', id),
        saveBulk: (packages) => saveBulkOverride('packages', packages)
    },

    // Users API
    users: {
        getAll: () => getTable('users'),
        create: (user) => createItem('users', user, 'USR'),
        update: (id, data) => updateItem('users', id, data),
        delete: (id) => deleteItem('users', id),
        updateStatus: (id, status) => updateItem('users', id, { status }),
        updateRole: (id, role) => updateItem('users', id, { role }),
        saveBulk: (users) => saveBulkOverride('users', users)
    },

    // Bookings API
    bookings: {
        getAll: () => getTable('bookings'),
        create: (booking) => createItem('bookings', booking, 'BKG'),
        update: (id, data) => updateItem('bookings', id, data),
        delete: (id) => deleteItem('bookings', id),
        getUserBookings: async (userId) => {
            // Because data is JSONB, we have to filter locally or use advanced Postgres JSON filtering.
            // For simplicity and to match old Dexie logic, let's filter locally for now.
            const all = await getTable('bookings');
            return all.filter(b => String(b.userId) === String(userId) || String(b.user) === String(userId));
        },
        updateStatus: (id, status) => updateItem('bookings', id, { status }),
        saveBulk: (bookings) => saveBulkOverride('bookings', bookings)
    },

    // Lab Partners API
    labs: {
        getAll: () => getTable('labs'),
        create: (lab) => createItem('labs', lab, 'LAB'),
        update: (id, data) => updateItem('labs', id, data),
        delete: (id) => deleteItem('labs', id),
        saveBulk: (labs) => saveBulkOverride('labs', labs)
    },

    // Tests API
    tests: {
        getAll: () => getTable('tests'),
        create: (test) => createItem('tests', test, 'TST'),
        update: (id, data) => updateItem('tests', id, data),
        delete: (id) => deleteItem('tests', id),
        saveAll: (tests) => saveBulkOverride('tests', tests)
    },

    // Members API
    members: {
        getAll: () => getTable('members'),
        create: (member) => createItem('members', member, 'MEM'),
        update: (id, data) => updateItem('members', id, data),
        delete: (id) => deleteItem('members', id),
        saveBulk: (members) => saveBulkOverride('members', members)
    },

    // Addresses API
    addresses: {
        getAll: () => getTable('addresses'),
        create: (address) => createItem('addresses', address, 'ADD'),
        update: (id, data) => updateItem('addresses', id, data),
        delete: (id) => deleteItem('addresses', id),
        saveBulk: (addresses) => saveBulkOverride('addresses', addresses)
    },

    // Callback Requests API
    callbackRequests: {
        getAll: () => getTable('callbacks'),
        create: async (request) => {
            const req = { ...request, status: 'Pending', createdAt: new Date().toISOString() };
            return createItem('callbacks', req, 'CB');
        },
        updateStatus: (id, status) => updateItem('callbacks', id, { status }),
        delete: (id) => deleteItem('callbacks', id),
        saveBulk: (reqs) => saveBulkOverride('callbacks', reqs)
    },

    // Lab Partnerships API
    partnerships: {
        getAll: () => getTable('partnerships'),
        create: async (request) => {
            const req = { ...request, status: 'Pending', createdAt: new Date().toISOString() };
            return createItem('partnerships', req, 'PR');
        },
        updateStatus: (id, status) => updateItem('partnerships', id, { status }),
        delete: (id) => deleteItem('partnerships', id),
        saveBulk: (parts) => saveBulkOverride('partnerships', parts)
    },

    // Job Applications API
    jobApplications: {
        getAll: () => getTable('jobs'),
        create: async (application) => {
            const app = { ...application, status: 'Pending', createdAt: new Date().toISOString() };
            return createItem('jobs', app, 'JA');
        },
        updateStatus: (id, status) => updateItem('jobs', id, { status }),
        delete: (id) => deleteItem('jobs', id),
        saveBulk: (jobs) => saveBulkOverride('jobs', jobs)
    },

    // Test Categories API
    categories: {
        getAll: () => getTable('categories'),
        create: (category) => {
            const cat = { ...category, status: category.status || 'Active' };
            return createItem('categories', cat, 'CAT');
        },
        update: (id, data) => updateItem('categories', id, data),
        delete: (id) => deleteItem('categories', id),
        saveBulk: (cats) => saveBulkOverride('categories', cats)
    },
    
    // Blogs API
    blogs: {
        getAll: () => getTable('blogs'),
        create: (blog) => createItem('blogs', blog, 'BLG'),
        update: (id, data) => updateItem('blogs', id, data),
        delete: (id) => deleteItem('blogs', id),
        saveBulk: (blogs) => saveBulkOverride('blogs', blogs)
    },

    // Dynamic Pricing & Lab Selection
    pricing: {
        calculate: async (params) => {
            const query = new URLSearchParams(params).toString();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/price?${query}`);
            if (!res.ok) throw new Error('Pricing fetch failed');
            return res.json();
        }
    },
    labSelection: {
        select: async (params) => {
            const query = new URLSearchParams(params).toString();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/lab/select?${query}`);
            if (!res.ok) throw new Error('Lab selection failed');
            return res.json();
        }
    },
    // Cities API
    cities: {
        getAll: () => getTable('cities'),
        create: (city) => createItem('cities', city, 'CTY'),
        update: (id, data) => updateItem('cities', id, data),
        delete: (id) => deleteItem('cities', id),
        saveBulk: (cities) => saveBulkOverride('cities', cities)
    }
};

export default api;
