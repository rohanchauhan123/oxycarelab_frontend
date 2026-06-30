/**
 * WhatsApp OTP Service for OxyCare Labs
 * Calls the backend API which uses WhatsApp Cloud API to send real OTPs.
 * OTPs are stored in Supabase (server-side) for secure verification.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export const sendOTP = async (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const response = await fetch(`${BACKEND_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send OTP via WhatsApp');

    return { success: true, message: 'OTP sent to your WhatsApp number!' };
};

export const verifyOTP = async (phoneNumber, userOtp) => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const response = await fetch(`${BACKEND_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: String(userOtp) })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'OTP verification failed');

    return { success: true };
};
