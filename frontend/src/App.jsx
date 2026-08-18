import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { DiseaseDetection } from './pages/DiseaseDetection';
import { FarmingChat } from './pages/FarmingChat';
import { CropRecommendation } from './pages/CropRecommendation';
import { FertilizerAdvisory } from './pages/FertilizerAdvisory';
import { IrrigationAdvisory } from './pages/IrrigationAdvisory';
import { WeatherAdvisory } from './pages/WeatherAdvisory';
import { HistoryPage } from './pages/HistoryPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <main className="content-area">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/disease" element={<DiseaseDetection />} />
                <Route path="/chat" element={<FarmingChat />} />
                <Route path="/crop" element={<CropRecommendation />} />
                <Route path="/fertilizer" element={<FertilizerAdvisory />} />
                <Route path="/irrigation" element={<IrrigationAdvisory />} />
                <Route path="/weather" element={<WeatherAdvisory />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
