import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ebeafepfvlqefjcqmgoy.supabase.co';
const supabaseKey = 'sb_publishable_A_m2o_KDvbteCBiZLQ5Xvw_Y9fwACnL';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    try {
        console.log('Fetching pkg-1...');
        const { data: current, error: fetchErr } = await supabase.from('packages').select('data').eq('id', 'pkg-1').single();
        if (fetchErr) throw fetchErr;
        console.log('Current data:', current.data);

        console.log('Attempting to update status to "Deleted"...');
        const mergedData = { ...current.data, status: 'Deleted' };
        const { data, error } = await supabase.from('packages').update({ data: mergedData }).eq('id', 'pkg-1').select();
        if (error) throw error;
        
        console.log('Update result:', data);
        if (data && data.length > 0) {
            console.log('Successfully updated status in DB!');
        } else {
            console.log('Warning: No rows were updated!');
        }

        // Fetch again to verify
        const { data: verify, error: fetchErr2 } = await supabase.from('packages').select('*').eq('id', 'pkg-1').single();
        if (fetchErr2) throw fetchErr2;
        console.log('Verified data in DB:', verify.data);

    } catch (e) {
        console.error('Error:', e.message);
    }
}

run();
