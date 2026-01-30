
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

import DashboardPage from './pages/DashboardPage';
import ExtractPage from './pages/ExtractPage';
import CampaignsPage from './pages/CampaignsPage';
import SonicLabPage from './pages/SonicLabPage';
import AutomationsPage from './pages/AutomationsPage';
import BattleModePage from './pages/BattleModePage';
import LeadHunterPage from './pages/LeadHunterPage';
import VideoStudioPage from './pages/VideoStudioPage';
import SchedulerPage from './pages/SchedulerPage';
import LiveSessionPage from './pages/LiveSessionPage';
import AffiliateHubPage from './pages/AffiliateHubPage';
import BrandSimulatorPage from './pages/BrandSimulatorPage';
import AgentForgePage from './pages/AgentForgePage';
import SiteBuilderPage from './pages/SiteBuilderPage';
import LandingPage from './pages/LandingPage';
import SharedProfilePage from './pages/SharedProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/extract" element={<ExtractPage />} />
          <Route path="/simulator" element={<BrandSimulatorPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/agents" element={<AgentForgePage />} />
          <Route path="/builder" element={<SiteBuilderPage />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/video" element={<VideoStudioPage />} />
          <Route path="/leads" element={<LeadHunterPage />} />
          <Route path="/sonic" element={<SonicLabPage />} />
          <Route path="/live" element={<LiveSessionPage />} />
          <Route path="/affiliate" element={<AffiliateHubPage />} />
          <Route path="/automations" element={<AutomationsPage />} />
          <Route path="/battle" element={<BattleModePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/share/:id" element={<SharedProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
