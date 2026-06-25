import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ebeafepfvlqefjcqmgoy.supabase.co';
const supabaseKey = 'sb_publishable_A_m2o_KDvbteCBiZLQ5Xvw_Y9fwACnL';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    try {
        console.log('Fetching packages...');
        const { data, error } = await supabase.from('packages').select('*');
        if (error) throw error;
        console.log('Total packages in DB:', data.length);
        data.forEach(pkg => {
            console.log(`- ID: ${pkg.id}, Name: ${pkg.data?.name}, Status: ${pkg.data?.status}`);
        });
    } catch (e) {
        console.error('Error:', e.message);
    }
}

check();
