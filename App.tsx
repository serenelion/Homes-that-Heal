
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ARScene } from './components/ARScene';
import { CameraFeed } from './components/CameraFeed';
import { AppPhase, DetectedObject, RiskLevel, Product } from './types';
import { LABEL_TO_RISK, PRODUCT_DATABASE } from './constants';
import { analyzeRoomSnapshot, generateSpatialHealthRecord, playAudioGuidance } from './services/geminiService';
import { 
  Zap, 
  ShieldCheck, 
  Camera, 
  RefreshCw, 
  ShoppingCart, 
  FileText, 
  ChevronRight,
  Info,
  AlertTriangle,
  Download
} from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.ONBOARDING);
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Reference for the video element (though handled in CameraFeed, we might need snapshots)
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const startScan = async () => {
    setPhase(AppPhase.CALIBRATION);
    await playAudioGuidance("Welcome to Homes That Heal. Stand in the center of your room and slowly pan your device to identify electromagnetic stressors.");
    setTimeout(() => setPhase(AppPhase.SCANNING), 3000);
  };

  const captureAndAnalyze = async () => {
    if (phase !== AppPhase.SCANNING) return;
    setIsScanning(true);
    
    try {
      // In a real app, we'd grab the video frame. For this demo, we simulate a spatial placement.
      // We trigger Gemini to "confirm" what the camera sees via snapshots.
      const mockLabels = ['router', 'laptop', 'bed'];
      const newObjects: DetectedObject[] = mockLabels.map((label, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        label,
        risk: LABEL_TO_RISK[label] || RiskLevel.LOW,
        position: [
          (Math.random() - 0.5) * 4, // X
          (Math.random() - 0.5) * 2, // Y
          -3 - Math.random() * 2     // Z (depth)
        ],
        timestamp: Date.now(),
        productMatch: PRODUCT_DATABASE[label]
      }));

      setObjects(prev => [...prev, ...newObjects]);
      await playAudioGuidance(`Detected ${newObjects.length} potential energy leaks.`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const harmonize = async () => {
    setPhase(AppPhase.HARMONIZING);
    await playAudioGuidance("Initiating harmonization grid. Deploying Terralux protection nodes to neutralize identified stressors.");
    
    // Generate the report via Gemini Pro
    const reportText = await generateSpatialHealthRecord(objects.map(o => o.label));
    setReport(reportText);
    
    setTimeout(() => {
      setPhase(AppPhase.SUMMARY);
    }, 2000);
  };

  const addToCart = () => {
    setCartCount(objects.length);
    alert(`${objects.length} Terralux solutions added to your cart.`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-between p-6">
      
      {/* AR Background Layer */}
      {(phase === AppPhase.SCANNING || phase === AppPhase.HARMONIZING || phase === AppPhase.SUMMARY) && (
        <>
          <CameraFeed />
          <ARScene objects={objects} phase={phase} />
        </>
      )}

      {/* Top HUD */}
      <div className="z-10 w-full flex justify-between items-start">
        <div className="glass-panel p-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/40">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold tracking-widest text-emerald-400">HOMES THAT HEAL</h1>
            <p className="text-[10px] opacity-60 font-mono">SPATIAL SCANNER v2.0</p>
          </div>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-4">
          <div className="flex flex-col items-end">
             <span className="text-[10px] opacity-60 font-mono">CART</span>
             <span className="text-sm font-bold font-mono">{cartCount} ITEMS</span>
          </div>
          <ShoppingCart className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Main UI Switching */}
      <div className="z-10 w-full max-w-md flex-1 flex flex-col justify-center items-center">
        
        {phase === AppPhase.ONBOARDING && (
          <div className="glass-panel p-8 rounded-3xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
              <Camera className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Make the Invisible Visible</h2>
            <p className="text-sm opacity-70 leading-relaxed">
              Scan your sanctuary to visualize EMF hotspots and receive a custom-engineered Harmonization Grid.
            </p>
            <button 
              onClick={startScan}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Start Consultation <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {phase === AppPhase.CALIBRATION && (
          <div className="glass-panel p-8 rounded-3xl text-center space-y-4 animate-pulse">
            <RefreshCw className="w-12 h-12 text-emerald-400 mx-auto animate-spin" />
            <h2 className="text-xl font-bold">Calibrating Spatial Sensors</h2>
            <p className="text-sm opacity-60">Hold your device at chest height and stand in the center of the room...</p>
          </div>
        )}

        {phase === AppPhase.SCANNING && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <div className="w-64 h-64 border-2 border-emerald-500/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute inset-0 border-t-2 border-emerald-400 rounded-full animate-spin duration-[3000ms]" />
             </div>
          </div>
        )}

        {phase === AppPhase.SUMMARY && report && (
          <div className="glass-panel p-6 rounded-3xl w-full max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar animate-in slide-in-from-bottom duration-700">
             <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-widest">
                <FileText className="w-4 h-4" /> Spatial Health Record
             </div>
             <div className="prose prose-invert prose-sm">
                <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-90">{report}</p>
             </div>
             <div className="pt-4 border-t border-white/10 space-y-3">
                <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest">Recommended Prescription</h3>
                {objects.map(obj => (
                  <div key={obj.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                    <img src={obj.productMatch?.image} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <div className="text-[10px] font-bold">{obj.productMatch?.name}</div>
                      <div className="text-[10px] opacity-60">${obj.productMatch?.price}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="z-10 w-full max-w-md pb-4 space-y-4">
        {phase === AppPhase.SCANNING && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                DETECTION: ACTIVE ({objects.length} NODES)
              </span>
              <button 
                onClick={captureAndAnalyze}
                disabled={isScanning}
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
              >
                <Camera className={`w-6 h-6 ${isScanning ? 'animate-pulse text-amber-400' : 'text-white'}`} />
              </button>
            </div>
            
            <button 
              onClick={harmonize}
              disabled={objects.length === 0}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                objects.length > 0 ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20' : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-6 h-6" /> Harmonize Space
            </button>
          </div>
        )}

        {phase === AppPhase.SUMMARY && (
          <div className="grid grid-cols-2 gap-3">
             <button 
              onClick={() => window.location.reload()}
              className="py-4 rounded-2xl bg-white/10 font-bold flex items-center justify-center gap-2 hover:bg-white/20"
             >
                <RefreshCw className="w-5 h-5" /> Retest
             </button>
             <button 
              onClick={addToCart}
              className="py-4 rounded-2xl bg-emerald-500 text-emerald-950 font-bold flex items-center justify-center gap-2 hover:bg-emerald-400"
             >
                <ShoppingCart className="w-5 h-5" /> Checkout
             </button>
             <button 
              onClick={() => alert('Downloading Spatial Health Record (.glb)...')}
              className="col-span-2 py-3 rounded-2xl border border-white/20 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/5"
             >
                <Download className="w-4 h-4" /> Export 3D Spatial Record
             </button>
          </div>
        )}
      </div>

      {/* Environmental HUD Detail Overlay */}
      {phase === AppPhase.SCANNING && (
        <div className="absolute top-24 left-6 pointer-events-none space-y-2">
          <div className="glass-panel px-3 py-1 rounded-full text-[10px] font-mono flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            RF RADIATION DETECTED
          </div>
          <div className="glass-panel px-3 py-1 rounded-full text-[10px] font-mono flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            DIRTY ELECTRICITY: ELEVATED
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
