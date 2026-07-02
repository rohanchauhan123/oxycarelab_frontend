import React from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import PopularPackages from '../components/home/PopularPackages';
import RadiologySection from '../components/home/RadiologySection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import GoogleReviews from '../components/home/GoogleReviews';
import FAQSection from '../components/home/FAQSection';

const Home = () => {
    return (
        <main className="bg-white">
            {/* 1. Hero */}
            <Hero />

            {/* 2. How It Works */}
            <HowItWorks />

            {/* 3. Auto-sliding package cards */}
            <PopularPackages />

            {/* 4. Radiology & Imaging — dark section */}
            <RadiologySection />

            {/* 5. Why Choose Us */}
            <WhyChooseUs />

            {/* 6. Google Reviews */}
            <GoogleReviews />

            {/* 7. FAQ */}
            <FAQSection />
        </main>
    );
};

export default Home;
