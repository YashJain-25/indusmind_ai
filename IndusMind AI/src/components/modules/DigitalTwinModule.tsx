import React, { useState } from "react";
import {
  Box,
  Activity,
  Thermometer,
  Gauge,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  FileText,
  Sliders,
  ShieldCheck,
  Zap,
  Clock
} from "lucide-react";
import { EquipmentTwin } from "../../types";

interface DigitalTwinModuleProps {
  equipment: EquipmentTwin[];
  onUpdateEquipment: (eq: EquipmentTwin) => void;
  onNavigateModule: (module: any) => void;
}

export const DigitalTwinModule: React.FC<DigitalTwinModuleProps> = ({
  equipment,
  onUpdateEquipment,
  onNavigateModule
}) => {
  const [selectedAsset, setSelectedAsset] = useState<EquipmentTwin>(equipment[0]);
  const [simulatingFault, setSimulatingFault] = useState(false);

  const handleSimulateVibrationSpike = () => {
    setSimulatingFault(true);
    const updated: EquipmentTwin = {
      ...selectedAsset,
      vibration: 11.2,
      temperature: 94.5,
      status: "Critical",
      healthScore: 35,
      rulDays: 3,
      sensorHistory: [
        ...selectedAsset.sensorHistory,
        {
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          vibration: 11.2,
          temperature: 94.5,
          pressure: selectedAsset.pressure
        }
      ]
    };
    setSelectedAsset(updated);
    onUpdateEquipment(updated);

    setTimeout(() => {
      setSimulatingFault(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-slate-50 text-slate-900 border border-indigo-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
              Equipment Digital Twin Engine
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Interactive asset telemetry, 3D component schematics, and live sensor stream simulation.
            </p>
          </div>
        </div>

        {/* Asset Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {equipment.map((eq) => (
            <button
              key={eq.id}
              onClick={() => setSelectedAsset(eq)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                selectedAsset.id === eq.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {eq.code}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 3D / Component Schematic Area */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                  {selectedAsset.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    selectedAsset.status === "Critical"
                      ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                      : selectedAsset.status === "Warning"
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {selectedAsset.status}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {selectedAsset.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {selectedAsset.plant} • {selectedAsset.location}
              </p>
            </div>

            <button
              onClick={handleSimulateVibrationSpike}
              disabled={simulatingFault}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/30 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{simulatingFault ? "Injecting..." : "Inject Sensor Fault"}</span>
            </button>
          </div>

          {/* Interactive Schematic Visualizer */}
          <div className="relative h-72 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Animated Industrial Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Simulated 3D Pump Housing Graphics */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-40 h-28 rounded-2xl border-4 flex flex-col items-center justify-center p-3 text-center transition-all shadow-2xl ${
                  selectedAsset.status === "Critical"
                    ? "border-rose-500 bg-rose-950/60 animate-pulse text-rose-200"
                    : selectedAsset.status === "Warning"
                    ? "border-amber-500 bg-amber-950/60 text-amber-200"
                    : "border-blue-500 bg-blue-950/60 text-blue-200"
                }`}
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center animate-spin">
                  <RotateCw className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-xs font-mono mt-2">
                  {selectedAsset.code} Impeller
                </span>
                <span className="text-[10px] opacity-80">{selectedAsset.rpm} RPM</span>
              </div>

              {/* Bearing Hotspot Callouts */}
              <div className="mt-4 flex items-center space-x-6">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                  Drive-End Bearing: <span className="font-bold text-amber-400">{selectedAsset.vibration} mm/s</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                  Housing Temp: <span className="font-bold text-rose-400">{selectedAsset.temperature}°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateModule("copilot")}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
            >
              <Zap className="w-4 h-4" />
              <span>Ask Cortex™ About {selectedAsset.code}</span>
            </button>

            <button
              onClick={() => onNavigateModule("maintenance")}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all hover:bg-slate-200"
            >
              <Wrench className="w-4 h-4" />
              <span>Create Work Order</span>
            </button>
          </div>
        </div>

        {/* Right Live Telemetry Telemetrics */}
        <div className="lg:col-span-5 space-y-4">
          {/* Health & RUL Cards */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Asset Health Score
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {selectedAsset.healthScore}%
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedAsset.healthScore < 50
                    ? "bg-rose-500"
                    : selectedAsset.healthScore < 75
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${selectedAsset.healthScore}%` }}
              ></div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Sentinel RUL Countdown:
              </span>
              <span className="font-mono font-bold text-sm">
                {selectedAsset.rulDays} Days Left
              </span>
            </div>
          </div>

          {/* Sensor Telemetry Dials */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-500" /> Real-time Sensor Telemetry
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Vibration */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Vibration Peak</div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-1">
                  {selectedAsset.vibration} <span className="text-xs text-slate-400 font-normal">mm/s</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Max: {selectedAsset.vibrationMax} mm/s</div>
              </div>

              {/* Temperature */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Bearing Temp</div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-1">
                  {selectedAsset.temperature} <span className="text-xs text-slate-400 font-normal">°C</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Max: {selectedAsset.temperatureMax} °C</div>
              </div>
            </div>
          </div>

          {/* Recommended Spare Parts */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-emerald-500" /> Linked Inventory Spares
            </h3>

            <div className="space-y-2">
              {selectedAsset.spareParts.map((sp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{sp.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Code: {sp.code}</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-[10px]">
                    Qty: {sp.Qty} in stock
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
