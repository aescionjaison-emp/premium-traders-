import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Layout & Motion Enhancements
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { QuickViewModal } from './components/common/QuickViewModal.js';
import { EnquiryModal } from './components/common/EnquiryModal.js';
import { WhatsAppFloating } from './components/common/WhatsAppFloating.js';
import { ScrollProgressBar } from './components/common/ScrollProgressBar.js';

// Customer Pages
import { HomePage } from './pages/customer/HomePage.js';
import { CatalogPage } from './pages/customer/CatalogPage.js';
import { CategoryShowcasePage } from './pages/customer/CategoryShowcasePage.js';
import { ProductDetailPage } from './pages/customer/ProductDetailPage.js';
import { InspiredSpacesPage } from './pages/customer/InspiredSpacesPage.js';
import { ContactPage } from './pages/customer/ContactPage.js';

// Admin Layout & Pages
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.js';
import { ProductFormPage } from './pages/admin/ProductFormPage.js';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage.js';
import { AdminCollectionsPage } from './pages/admin/AdminCollectionsPage.js';
import { AdminBrandsPage } from './pages/admin/AdminBrandsPage.js';
import { AdminHomepageBuilderPage } from './pages/admin/AdminHomepageBuilderPage.js';
import { AdminMediaLibraryPage } from './pages/admin/AdminMediaLibraryPage.js';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage.js';
import { AdminNavigationPage } from './pages/admin/AdminNavigationPage.js';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

// Customer Layout Shell
const CustomerLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgressBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <QuickViewModal />
      <EnquiryModal />
      <WhatsAppFloating />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route
          path="/tiles"
          element={
            <CategoryShowcasePage
              forcedSlug="tiles"
              defaultTitle="LARGE FORMAT TILES & PORCELAIN"
              defaultSubtitle="Monumental 1200x2400mm glazed vitrified porcelain slabs, bookmatched marble aesthetics, and high-traffic floor collections."
            />
          }
        />
        <Route
          path="/granite"
          element={
            <CategoryShowcasePage
              forcedSlug="granite"
              defaultTitle="EXOTIC NATURAL GRANITE & QUARTZITE"
              defaultSubtitle="Raw gangsaw slabs direct from Ongole and Tuscan quarries, high-density mirror polishing, and tactile leathered worktop finishes."
            />
          }
        />
        <Route
          path="/wood"
          element={
            <CategoryShowcasePage
              forcedSlug="wood"
              defaultTitle="FINE WOODWORKS & BURMA TEAK DOORS"
              defaultSubtitle="Master-crafted solid teak entrance pivot portals, acoustic smoked oak slat wall panels, and calibrated IS 710 marine plywood."
            />
          }
        />
        <Route
          path="/electrical"
          element={
            <CategoryShowcasePage
              forcedSlug="electrical"
              defaultTitle="LUXURY SWITCHES & ARCHITECTURAL LIGHTING"
              defaultSubtitle="Solid brushed brass faceplates, low-voltage anti-glare magnetic track modules, and whisper BLDC silent fans."
            />
          }
        />
        <Route path="/category/:slug" element={<CategoryShowcasePage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/inspired-spaces" element={<InspiredSpacesPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin CMS Dashboard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="collections" element={<AdminCollectionsPage />} />
        <Route path="brands" element={<AdminBrandsPage />} />
        <Route path="homepage" element={<AdminHomepageBuilderPage />} />
        <Route path="media" element={<AdminMediaLibraryPage />} />
        <Route path="banners" element={<AdminHomepageBuilderPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="navigation" element={<AdminNavigationPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="contact" element={<AdminSettingsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
