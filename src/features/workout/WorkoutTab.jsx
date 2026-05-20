import { CheckCircle2, ChevronDown, Timer, Dumbbell } from 'lucide-react';
import ExercisePlayButton from '../../components/exercise/ExercisePlayButton';
import ExerciseProgressChart from '../../components/workout/ExerciseProgressChart';
import {
  formatWeightDisplay,
  normalizeSessionFieldValue,
} from '../../utils/sessionValues';

export default function WorkoutTab({ app }) {
  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {app.activeBlocks.length === 0 ? (
        <div
          className={`rounded-3xl p-10 text-center border mt-8 shadow-xl ${app.isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'}`}
        >
          <Dumbbell size={40} className={`mx-auto mb-4 ${app.isDark ? 'text-white/10' : 'text-slate-200'}`} />
          <p className={`font-bold text-sm ${app.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            No tenés rutinas activas.
          </p>
          <p
            className={`text-xs mt-4 uppercase font-bold tracking-wider ${app.isDark ? 'text-purple-400' : 'text-purple-600'}`}
          >
            Ve a &quot;Rutina&quot; y tocá + para crear una
          </p>
        </div>
      ) : app.currentRoutineExercises.length === 0 ? (
        <div
          className={`rounded-3xl p-10 text-center border mt-8 shadow-xl ${app.isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'}`}
        >
          <Dumbbell size={40} className={`mx-auto mb-4 ${app.isDark ? 'text-white/10' : 'text-slate-200'}`} />
          <p className={`font-bold text-sm ${app.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            No hay ejercicios en esta rutina.
          </p>
          {!app.currentBlock?.isArchived && (
            <p
              className={`text-xs mt-4 uppercase font-bold tracking-wider ${app.isDark ? 'text-purple-400' : 'text-purple-600'}`}
            >
              Ve a &quot;Rutina&quot; para configurarla
            </p>
          )}
        </div>
      ) : (
        app.currentRoutineExercises.map((ex, exIdx) => {
          const exKey = `${app.activeRoutineId}-${exIdx}`;
          const isCompleted = !!app.currentDayData.completed?.[exKey];
          const isExpanded = app.expandedEx === exIdx;
          const wPrefix = `${app.activeRoutineId}-${exIdx}`;
          const numSets = parseInt(ex.sets, 10) || 0;
          const sessions = app.currentDayData.sessions || {};

          return (
            <div
              key={`${ex.exId ?? 'ex'}-${exIdx}-${ex.customName}`}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isCompleted
                  ? app.isDark
                    ? 'border-purple-500/30 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                    : 'border-purple-200 bg-purple-50 shadow-sm'
                  : app.isDark
                    ? 'border-white/5 bg-[#121212] shadow-xl'
                    : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div
                className="p-5 flex items-center justify-between cursor-pointer gap-3"
                onClick={() => {
                  if (!isExpanded) app.prefillExerciseIfNeeded?.(exIdx);
                  app.setExpandedEx(isExpanded ? null : exIdx);
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    app.toggleComplete(exIdx);
                  }}
                  className={`shrink-0 transition-transform hover:scale-110 ${
                    isCompleted ? 'text-purple-500' : ''
                  }`}
                  aria-label={isCompleted ? 'Marcar incompleto' : 'Marcar completo'}
                >
                  <CheckCircle2
                    size={26}
                    fill={isCompleted ? (app.isDark ? '#050505' : '#ffffff') : 'none'}
                    className={
                      isCompleted
                        ? 'text-purple-500'
                        : app.isDark
                          ? 'text-white/10 hover:text-white/30'
                          : 'text-slate-200 hover:text-slate-400'
                    }
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-black text-sm leading-tight truncate ${
                      isCompleted
                        ? app.isDark
                          ? 'text-white/30 line-through'
                          : 'text-slate-400 line-through'
                        : app.isDark
                          ? 'text-white'
                          : 'text-slate-800'
                    }`}
                  >
                    {ex.customName}
                  </h3>
                  <p className={`text-[10px] font-bold mt-0.5 ${app.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {numSets} series · {ex.targetReps} reps
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <ExercisePlayButton
                    isDark={app.isDark}
                    onClick={(e) => {
                      e.stopPropagation();
                      app.openExerciseVideo(ex);
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      app.openRestTimer(90);
                    }}
                    className={`p-2 rounded-xl transition-colors border ${
                      app.isDark
                        ? 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/10'
                        : 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-100'
                    }`}
                    title="Descansar"
                  >
                    <Timer size={18} />
                  </button>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                      app.isDark ? 'text-white/30' : 'text-slate-400'
                    }`}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className={`px-5 pb-5 border-t ${app.isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  <div className="space-y-3 mt-4">
                    {Array.from({ length: numSets }, (_, setIdx) => (
                      <div key={setIdx} className="flex gap-3 items-center">
                        <span
                          className={`w-8 text-center text-xs font-black shrink-0 ${
                            app.isDark ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {setIdx + 1}
                        </span>
                        <div className="flex-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="—"
                            value={formatWeightDisplay(sessions[`${wPrefix}-s${setIdx}-w`])}
                            onChange={(e) => app.updateSessionData(exIdx, setIdx, 'w', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full text-[16px] font-bold rounded-xl py-2.5 px-3 text-center outline-none border transition-colors ${
                              app.isDark
                                ? 'text-white bg-white/5 border-white/10 focus:border-purple-500'
                                : 'text-purple-600 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="—"
                            value={normalizeSessionFieldValue(
                              sessions[`${wPrefix}-s${setIdx}-r`],
                              'r'
                            )}
                            onChange={(e) => app.updateSessionData(exIdx, setIdx, 'r', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full text-[16px] font-bold rounded-xl py-2.5 px-3 text-center outline-none border transition-colors ${
                              app.isDark
                                ? 'text-white bg-white/5 border-white/10 focus:border-purple-500'
                                : 'text-purple-600 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <ExerciseProgressChart
                    exerciseName={ex.customName}
                    routineId={app.activeRoutineId}
                    diary={app.diary}
                    routines={app.routines}
                    isDark={app.isDark}
                  />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
