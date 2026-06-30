import React from 'react';
import Hero from '../components/home/Hero';
import ProblemCards from '../components/home/ProblemCards';
import HowItWorks from '../components/home/HowItWorks';
import PopularPackages from '../components/home/PopularPackages';
import WhyChooseUs from '../components/home/WhyChooseUs';
import GoogleReviews from '../components/home/GoogleReviews';
import FAQSection from '../components/home/FAQSection';

const Home = () => {
    return (
        <main className="bg-white">
            {/* 1. Hero — Bold headline, search bar, symptom pills, stats */}
            <Hero />

            {/* 2. Symptom quick-select cards */}
            <ProblemCards />

            {/* 3. How It Works — Dark animated section */}
            <HowItWorks />

            {/* 4. Auto-sliding package cards carousel */}
            <PopularPackages />

            {/* 5. Why Choose Us — 6 benefit cards */}
            <WhyChooseUs />

            {/* 6. Google Reviews — Elfsight widget */}
            <GoogleReviews />

            {/* 7. FAQ */}
            <FAQSection />
        </main>
    );
};

export default Home;
