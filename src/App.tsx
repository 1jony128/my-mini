import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { AppProvider } from '@/components/providers/app-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

// Pages
import LandingPage from '@/pages/LandingPage'
import ChatPage from '@/pages/ChatPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import UpgradePage from '@/pages/UpgradePage'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import GptBezVpnPage from '@/pages/GptBezVpnPage'
import SitemapPage from '@/pages/SitemapPage'

function App() {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/payments/success" element={<PaymentSuccessPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/gpt-bez-vpn" element={<GptBezVpnPage />} />
            <Route path="/sitemap.xml" element={<SitemapPage />} />
          </Routes>
          <Toaster position="top-right" />
        </AppProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}

export default App
