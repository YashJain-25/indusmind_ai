import React from "react";
import { History, Lightbulb } from "lucide-react";
import { LessonItem } from "../../types";
import { LessonsLearnedEngine } from "../LessonsLearnedEngine";

interface LessonsModuleProps {
  lessons: LessonItem[];
}

export const LessonsLearnedModule: React.FC<LessonsModuleProps> = ({ lessons }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Lessons Learned AI Engine */}
      <LessonsLearnedEngine />

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Indexed Cross-Plant Failure Memory Repository
            </h2>
            <p className="text-xs text-slate-500">
              Historical lessons learned database records automatically indexed into the vector graph.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((les) => (
            <div
              key={les.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-mono">
                  {les.equipmentCategory}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Logged: {les.dateLogged}
                </span>
              </div>

              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                {les.title}
              </h3>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">Root Cause Identified:</div>
                <p className="text-slate-600 dark:text-slate-400">{les.rootCause}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" /> Key Takeaway & Standard Fix:
                </div>
                <p className="text-slate-700 dark:text-slate-300">{les.keyTakeaway}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

