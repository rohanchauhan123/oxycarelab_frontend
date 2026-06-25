import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createClient as createRedisClient } from 'redis';
import NodeCache from 'node-cache';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SALT_KEY = process.env.VITE_PHONEPE_CLIENT_SECRET;
const SALT_INDEX = process.env.VITE_PHONEPE_CLIENT_VERSION || '1';
const MERCHANT_ID = process.env.VITE_PHONEPE_CLIENT_ID;
const ENV = process.env.VITE_PHONEPE_ENV || 'STAGING';

const API_URLS = {
    STAGING: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
    PRODUCTION: 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
};

// Supabase Admin Client
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Caching Setup
const localCache = new NodeCache({ stdTTL: 600 }); // 10 mins default
let redisClient = null;

if (process.env.REDIS_URL) {
    redisClient = createRedisClient({ url: process.env.REDIS_URL });
    redisClient.on('error', err => console.error('Redis Client Error', err));
    redisClient.connect().catch(console.error);
}

const getCache = async (key) => {
    if (redisClient?.isOpen) return await redisClient.get(key);
    return localCache.get(key);
};

const setCache = async (key, value, ttl = 600) => {
    if (redisClient?.isOpen) await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    localCache.set(key, value, ttl);
};

app.get('/', (req, res) => {
    res.json({ success: true, message: "OxyCare Labs API Server is running." });
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, status: "healthy", message: "OxyCare Labs API Server is running." });
});

app.post('/api/payment/create', async (req, res) => {
    try {
        const { gateway, amount, orderId, userId, phone, credentials } = req.body;
        
        // Use credentials from request if provided, otherwise fallback to .env
        const activeMerchantId = credentials?.merchantId || MERCHANT_ID;
        const activeSaltKey = credentials?.secretKey || SALT_KEY;
        const activeSaltIndex = credentials?.apiKey || SALT_INDEX; // Standardized key mapping
        const activeEnv = credentials?.env || ENV;

        const payload = {
            merchantId: activeMerchantId,
            merchantTransactionId: orderId,
            merchantUserId: userId,
            amount: amount * 100, // convert to paise
            redirectUrl: `https://${req.get('host')}/order-confirmation?id=${orderId}`,
            redirectMode: "REDIRECT",
            callbackUrl: "https://oxycarelabs.com/api/callback",
            mobileNumber: phone,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const fullURL = base64Payload + "/pg/v1/pay" + activeSaltKey;
        const checksum = crypto.createHash('sha256').update(fullURL).digest('hex') + "###" + activeSaltIndex;

        const apiUrl = activeEnv === 'PRODUCTION' ? API_URLS.PRODUCTION : API_URLS.STAGING;

        const response = await axios.post(apiUrl, {
            request: base64Payload
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'accept': 'application/json'
            }
        });

        if (response.data.success) {
            res.json({
                success: true,
                paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
            });
        } else {
            res.status(400).json({ success: false, error: response.data.message });
        }

    } catch (error) {
        console.error('PhonePe Backend Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// --- DYNAMIC PRICING ENGINE ---

app.get('/api/price', async (req, res) => {
    try {
        const { type, id, city, user_type } = req.query;
        if (!type || !id || !city) return res.status(400).json({ error: 'Missing parameters' });

        const cacheKey = `price:${type}:${id}:${city}:${user_type || 'guest'}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.json(typeof cached === 'string' ? JSON.parse(cached) : cached);

        let pricingRow = null;
        let labSelected = null;

        // Step 1: Fetch pricing row (Priority Resolution)
        const table = type === 'test' ? 'test_pricing' : 'package_pricing';
        const idKey = type === 'test' ? 'test_id' : 'package_id';

        const { data: pricingData } = await supabase
            .from(table)
            .select('*')
            .eq(idKey, id)
            .eq('city', city)
            .eq('is_active', true)
            .order('selling_price', { ascending: true }); // Prefer cheaper if multiple

        if (pricingData && pricingData.length > 0) {
            pricingRow = pricingData[0];
            // Fetch lab name
            const { data: labData } = await supabase.from('labs').select('data').eq('id', pricingRow.lab_id).single();
            labSelected = labData?.data?.name || pricingRow.lab_id;
        } else {
            // Fallback to default test price (City level or Global)
            const { data: entityData } = await supabase.from(type === 'test' ? 'tests' : 'packages').select('data').eq('id', id).single();
            if (!entityData) return res.status(404).json({ error: 'Entity not found' });
            
            pricingRow = {
                lab_cost: entityData.data.price || 0,
                margin_type: 'fixed',
                margin_value: 0,
                selling_price: entityData.data.price || 0
            };
            labSelected = "Default Provider";
        }

        // Step 2: Determine base price
        let final_price = 0;
        if (pricingRow.selling_price) {
            final_price = pricingRow.selling_price;
        } else {
            if (pricingRow.margin_type === 'fixed') {
                final_price = Number(pricingRow.lab_cost) + Number(pricingRow.margin_value);
            } else {
                final_price = Number(pricingRow.lab_cost) * (1 + Number(pricingRow.margin_value) / 100);
            }
        }

        // Step 3: Apply constraints
        if (pricingRow.min_price && final_price < pricingRow.min_price) final_price = pricingRow.min_price;
        if (pricingRow.max_price && final_price > pricingRow.max_price) final_price = pricingRow.max_price;

        // Step 4: Apply pricing rules
        const { data: rules } = await supabase.from('pricing_rules').select('*').eq('is_active', true).order('priority', { ascending: false });
        const applied_rules = [];

        if (rules) {
            for (const rule of rules) {
                let conditionMet = false;
                const cond = rule.condition_json;

                if (rule.rule_type === 'time_based') {
                    const hour = new Date().getHours();
                    if (hour >= cond.start_hour && hour <= cond.end_hour) conditionMet = true;
                } else if (rule.rule_type === 'user_type' && user_type === cond.user_type) {
                    conditionMet = true;
                }

                if (conditionMet) {
                    if (rule.adjustment_type === 'increase') {
                        final_price += rule.adjustment_value;
                    } else {
                        final_price -= rule.adjustment_value;
                    }
                    applied_rules.push(rule.rule_type);
                }
            }
        }

        const response = {
            base_price: pricingRow.selling_price || pricingRow.lab_cost,
            final_price: Math.round(final_price),
            applied_rules,
            lab_selected: labSelected,
            city
        };

        await setCache(cacheKey, response);
        res.json(response);

    } catch (error) {
        console.error('Pricing Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- LAB SELECTION ENGINE ---

app.get('/api/lab/select', async (req, res) => {
    try {
        const { test_id, package_id, city } = req.query;
        const entity_id = test_id || package_id;
        const type = test_id ? 'test' : 'package';

        if (!entity_id || !city) return res.status(400).json({ error: 'Missing test_id/package_id or city' });

        const table = type === 'test' ? 'test_pricing' : 'package_pricing';
        const idKey = type === 'test' ? 'test_id' : 'package_id';

        const { data: options, error } = await supabase
            .from(table)
            .select(`*, labs(id, data)`)
            .eq(idKey, entity_id)
            .eq('city', city)
            .eq('is_active', true);

        if (error) throw error;
        if (!options || options.length === 0) return res.status(404).json({ error: 'No labs found for this city' });

        // Ranking Logic
        const ranked = options.map(opt => {
            const lab = opt.labs;
            const labData = lab.data || {};
            
            // Score = (weight_cost * lowest_cost_rank) + (weight_sla * fastest_sla_rank) + (weight_rating * rating_rank)
            // For simplicity, we'll use raw values for initial implementation
            const score = (labData.rating || 0) * 10 - (opt.lab_cost / 100); 
            
            return {
                id: lab.id,
                name: labData.name,
                cost: opt.selling_price || opt.lab_cost,
                rating: labData.rating,
                sla: labData.sla_report_time,
                score
            };
        }).sort((a, b) => b.score - a.score);

        res.json(ranked[0]);

    } catch (error) {
        console.error('Lab Selection Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin Post Routes
app.post('/api/admin/test-pricing', async (req, res) => {
    const { data, error } = await supabase.from('test_pricing').upsert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

app.post('/api/admin/package-pricing', async (req, res) => {
    const { data, error } = await supabase.from('package_pricing').upsert(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`PhonePe Backend Server running on port ${PORT} (${ENV} mode)`);
});

export default app;
