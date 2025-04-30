import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LogForm from './components/LogForm/LogForm';
import LogDisplay from './components/LogDisplay/LogDisplay';
import MapComponent from './components/MapComponent/MapComponent';
import NotFound from './components/NotFound/NotFound';
import 'leaflet/dist/leaflet.css';
import './styles/variables.css';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="App">
          <Routes>
            <Route path="/" element={<LogForm />} />
            <Route path="/logs" element={<LogDisplay />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;