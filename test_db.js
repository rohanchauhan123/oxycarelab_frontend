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

        console.log('\nFetching tests...');
        const { data: tests, error: err2 } = await supabase.from('tests').select('*');
        if (err2) throw err2;
        console.log('Total tests in DB:', tests.length);
        tests.forEach(t => {
            console.log(`- ID: ${t.id}, Name: ${t.data?.name}, Status: ${t.data?.status}`);
        });

    } catch (e) {
        console.error('Error:', e.message);
    }
}

check();
