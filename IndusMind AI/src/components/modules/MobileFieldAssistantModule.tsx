import React, { useState } from "react";
import {
  Smartphone,
  QrCode,
  Mic,
  CheckCircle2,
  Wrench,
  Wifi,
  ShieldCheck,
  Camera,
  RotateCw
} from "lucide-react";
import { WorkOrder } from "../../types";

interface MobileProps {
  workOrders: WorkOrder[];
}

export const MobileFieldAssistantModule: React.FC<MobileProps> = ({ workOrders }) => {
  const [qrScanning, setQrScanning] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSimulateQRScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setScannedAsset("P-101 Centrifugal Pump");
    }, 1500);
  };

  const handleSimulateVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setVoiceNote("Inspected P-101 bearing housing. Replaced Viton seal and aligned with laser tool.");
      }, 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Scout™ Mobile Field Assistant
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Field technician companion with QR asset scanning, voice note dictation & offline/online sync.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-600">
          <Wifi className="w-4 h-4" />
          <span>Online Sync Active</span>
        </div>
      </div>

      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-md bg-slate-950 text-white rounded-[2.5rem] p-4 border-8 border-slate-800 shadow-2xl space-y-4">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between px-3 pt-1 text-[10px] text-slate-400 font-mono border-b border-slate-800/80 pb-2">
          <span>09:41 AM</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto"></div>
          <span>100% ⚡</span>
        </div>

        {/* Scout App Interface Header */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase text-cyan-300 font-mono">
              Field Technician App
            </span>
            <div className="text-xs font-black">Rajesh Kumar (Senior Tech)</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[10px] font-mono">
            Plant 04
          </span>
        </div>

        {/* Quick QR Scanner & Camera Action */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5">
            <QrCode className="w-4 h-4 text-cyan-400" /> Asset Tag Quick Scanner
          </div>

          {qrScanning ? (
            <div className="py-6 text-xs text-cyan-400 font-mono animate-pulse flex items-center justify-center space-x-2">
              <Camera className="w-5 h-5 animate-spin" />
              <span>Scanning Industrial Barcode/QR Tag...</span>
            </div>
          ) : scannedAsset ? (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 font-bold flex items-center justify-between">
              <span>Scanned: {scannedAsset}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <button
              onClick={handleSimulateQRScan}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white shadow-md shadow-cyan-600/30"
            >
              Scan Equipment QR Code
            </button>
          )}
        </div>

        {/* Assigned Field Work Orders */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono px-1">
            My Dispatched Work Orders ({workOrders.length})
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {workOrders.map((wo) => (
              <div
                key={wo.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
                  <span>{wo.orderId}</span>
                  <span className="text-rose-400">{wo.priority}</span>
                </div>
                <div className="font-bold text-white text-xs">{wo.equipmentCode} Overhaul</div>
                <p className="text-[10px] text-slate-400 truncate">{wo.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Note Recording Dictation */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-blue-400" /> Voice Maintenance Note
            </span>
            <button
              onClick={handleSimulateVoice}
              className={`p-1.5 rounded-lg text-[10px] font-bold font-mono ${
                isRecording ? "bg-rose-600 text-white animate-pulse" : "bg-blue-600 text-white"
              }`}
            >
              {isRecording ? "Recording..." : "Hold to Record"}
            </button>
          </div>

          {voiceNote && (
            <div className="p-2.5 rounded-xl bg-slate-800 text-[11px] text-slate-200 leading-tight border border-slate-700">
              "{voiceNote}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
