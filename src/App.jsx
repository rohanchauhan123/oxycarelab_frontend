import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/utils/ScrollToTop';
import Navbar from './components/layout/Navbar';
import FloatingCart from './components/ui/FloatingCart';
import ExpertPopup from './components/ui/ExpertPopup';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BookTest from './pages/BookTest';
import HealthPackages from './pages/HealthPackages';
import PartnerLabsPage from './pages/PartnerLabsPage';
import Checkout from './pages/Checkout';
import PolicyPage from './pages/PolicyPage';
import HealthCheckFlow from './pages/HealthCheckFlow';
import ResultScreen from './pages/ResultScreen';

import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import HomeCollection from './pages/HomeCollection';
import UploadPrescription from './pages/UploadPrescription';
import HelpSupport from './pages/HelpSupport';
import Blog from './pages/Blog';
import Offers from './pages/Offers';
import LabDetails from './pages/LabDetails';
import ItemDetails from './pages/ItemDetails';
import OrderConfirmation from './pages/OrderConfirmation';
import PartnerWithUs from './pages/PartnerWithUs';
import Careers from './pages/Careers';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import AdminPrescriptions from './pages/admin/Prescriptions';
import AdminBookings from './pages/admin/Bookings';
import AdminLabRequests from './pages/admin/LabRequests';
import AdminLabs from './pages/admin/Labs';
import AdminPackages from './pages/admin/Packages';
import AdminAnalytics from './pages/admin/Analytics';
import AdminUsers from './pages/admin/Users';
import AdminSheetEditor from './pages/admin/SheetEditor';
import AdminNotifications from './pages/admin/Notifications';
import AdminPaymentSettings from './pages/admin/PaymentSettings';
import AdminBlogs from './pages/admin/Blogs';
import AdminCallbackRequests from './pages/admin/CallbackRequests';
import AdminCategoryManager from './pages/admin/CategoryManager';
import AdminJobApplications from './pages/admin/JobApplications';
import AdminPartnerships from './pages/admin/Partnerships';
import AdminSlotManagement from './pages/admin/SlotManagement';
import AdminLocationManager from './pages/admin/LocationManager';
import AdminPricingDashboard from './pages/admin/PricingDashboard';
import AdminRuleEngine from './pages/admin/RuleEngine';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import BottomNav from './components/layout/BottomNav';

// User Dashboard
import UserLayout from './components/dashboard/UserLayout';
import UserOverview from './pages/dashboard/Overview';
import UserReports from './pages/dashboard/Reports';
import UserBookings from './pages/dashboard/MyBookings';
import UserProfile from './pages/dashboard/Profile';
import UserAddresses from './pages/dashboard/Addresses';
import UserMembers from './pages/dashboard/Members';
import UserInvoices from './pages/dashboard/Invoices';
import ErrorBoundary from './components/utils/ErrorBoundary';

const DatabaseErrorBanner = () => {
  const { dbError } = useData();
  if (!dbError) return null;
  return (
    <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 24px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #fca5a5', zIndex: 99999, position: 'relative', fontFamily: 'sans-serif' }}>
      ⚠️ Database Connection Error: {dbError}. The application is running in OFFLINE mock mode. Your changes will not be saved.
    </div>
  );
};

const App = () => {
  console.log('App component executing');
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <DataProvider>
              <DatabaseErrorBanner />
              <Router>
                <ScrollToTop />
                <Routes>
                  {/* Main Website Routes - Using Pathless Layout to prevent route leakage */}
                  <Route element={<><Navbar /><FloatingCart /><ExpertPopup /><Outlet /><Footer /></>}>
                    <Route path="/" element={<Home />} />
                    <Route path="health-check" element={<HealthCheckFlow />} />
                    <Route path="results" element={<ResultScreen />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="book-test" element={<BookTest />} />
                    <Route path="health-packages" element={<HealthPackages />} />
                    <Route path="partner-labs" element={<PartnerLabsPage />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="terms-conditions" element={<PolicyPage />} />
                    <Route path="privacy-policy" element={<PolicyPage />} />
                    <Route path="cancellation-policy" element={<PolicyPage />} />
                    <Route path="refund-policy" element={<PolicyPage />} />
                    <Route path="faq" element={<PolicyPage />} />
                    <Route path="home-collection" element={<HomeCollection />} />
                    <Route path="upload-prescription" element={<UploadPrescription />} />
                    <Route path="help-support" element={<HelpSupport />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="offers" element={<Offers />} />
                    <Route path="lab/:id" element={<LabDetails />} />
                    <Route path="item-details/:id" element={<ItemDetails />} />
                    <Route path="order-confirmation" element={<OrderConfirmation />} />
                    <Route path="partner-with-us" element={<PartnerWithUs />} />
                    <Route path="careers" element={<Careers />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="complete-profile" element={<CompleteProfile />} />
                  </Route>

                  {/* User Dashboard Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <UserLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<UserOverview />} />
                    <Route path="reports" element={<UserReports />} />
                    <Route path="bookings" element={<UserBookings />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="addresses" element={<UserAddresses />} />
                    <Route path="members" element={<UserMembers />} />
                    <Route path="invoices" element={<UserInvoices />} />
                  </Route>

                  {/* Admin Dashboard Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                    <Route index element={<AdminOverview />} />
                    <Route path="prescriptions" element={<AdminPrescriptions />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="lab-requests" element={<AdminLabRequests />} />
                    <Route path="labs" element={<AdminLabs />} />
                    <Route path="packages" element={<AdminPackages />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="sheet-editor" element={<AdminSheetEditor />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="callback-requests" element={<AdminCallbackRequests />} />
                    <Route path="categories" element={<AdminCategoryManager />} />
                    <Route path="job-applications" element={<AdminJobApplications />} />
                    <Route path="partnerships" element={<AdminPartnerships />} />
                    <Route path="slots" element={<AdminSlotManagement />} />
                    <Route path="cities" element={<AdminLocationManager />} />
                    <Route path="pricing" element={<AdminPricingDashboard />} />
                    <Route path="rules" element={<AdminRuleEngine />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="payment-settings" element={<AdminPaymentSettings />} />
                  </Route>
                </Routes>
                <BottomNav />
              </Router>
            </DataProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
