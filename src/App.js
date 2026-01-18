import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Calendar,
  BarChart3,
  Edit2,
  CheckCircle2,
  ArrowRight,
  Timer,
  TrendingUp,
  AlertTriangle,
  Download,
  Upload,
} from "lucide-react";

// --- DADOS INICIAIS ---
const initialPlanTemplate = [
  {
    id: "d1",
    title: "D1 – Lower | Força Técnica",
    focus: "Output de força, controle",
    exercises: [
      {
        id: "d1-1",
        name: "Leg Press (pés médios)",
        target: "4×6–8",
        notes: "Pausa de 1s no fundo",
      },
      {
        id: "d1-2",
        name: "RDL (Barra/Halter)",
        target: "4×6",
        notes: "Excêntrica controlada (3s)",
      },
      {
        id: "d1-3",
        name: "Hack Squat (Leve)",
        target: "3×8",
        notes: "Técnico",
      },
      { id: "d1-4", name: "Mesa Flexora", target: "3×8–10", notes: "" },
      { id: "d1-5", name: "Panturrilha Sentado", target: "3×12–15", notes: "" },
    ],
  },
  {
    id: "d2",
    title: "D2 – Upper | Força Técnica",
    focus: "Empurrar/puxar eficiente",
    exercises: [
      {
        id: "d2-1",
        name: "Supino Máq. ou Barra",
        target: "4×5–6",
        notes: "S1: 30",
      },
      {
        id: "d2-2",
        name: "Remada Máq. ou Chest-Sup",
        target: "4×6–8",
        notes: "S1: 5 placas",
      },
      {
        id: "d2-3",
        name: "Desenv. Máq. ou Halter",
        target: "3×6–8",
        notes: "S1: 20",
      },
      {
        id: "d2-4",
        name: "Puxada Neutra",
        target: "3×8",
        notes: "S1: 8 placas",
      },
      {
        id: "d2-5",
        name: "Face Pull",
        target: "2×12–15",
        notes: "S1: 4 placas",
      },
    ],
  },
  {
    id: "d3",
    title: "D3 – Capacidade + Mobilidade",
    focus: "Gasto energético sem fadiga",
    exercises: [
      {
        id: "d3-1",
        name: "Sled Push / Remo",
        target: "30–40s",
        notes: "Circuito 4-6 voltas",
      },
      {
        id: "d3-2",
        name: "Kettlebell Swing",
        target: "15 reps",
        notes: "Circuito 4-6 voltas",
      },
      {
        id: "d3-3",
        name: "Prancha",
        target: "30s",
        notes: "Circuito 4-6 voltas",
      },
      {
        id: "d3-4",
        name: "Mobilidade Quadril",
        target: "10 min",
        notes: "Finalização",
      },
    ],
  },
  {
    id: "d4",
    title: "D4 – Lower | Unilateral",
    focus: "Força relativa, assimetrias",
    exercises: [
      {
        id: "d4-1",
        name: "Bulgarian Split Squat",
        target: "3×6–8/perna",
        notes: "",
      },
      { id: "d4-2", name: "Step-up Médio", target: "3×8/perna", notes: "" },
      { id: "d4-3", name: "Hip Thrust", target: "3×8", notes: "" },
      { id: "d4-4", name: "Flexora Unilateral", target: "2×10", notes: "" },
      {
        id: "d4-5",
        name: "Suitcase Carry",
        target: "3×30m por lado",
        notes: "",
      },
    ],
  },
  {
    id: "d5",
    title: "D5 – Upper | Volume Técnico",
    focus: "Manter massa sem exaustão",
    exercises: [
      {
        id: "d5-1",
        name: "Supino Inclinado Halter",
        target: "3×8–10",
        notes: "",
      },
      { id: "d5-2", name: "Remada Baixa Neutra", target: "3×8–10", notes: "" },
      { id: "d5-3", name: "Elevação Lateral", target: "3×12", notes: "" },
      {
        id: "d5-4",
        name: "Bíceps Máq. ou Halter",
        target: "2×10–12",
        notes: "",
      },
      {
        id: "d5-5",
        name: "Tríceps Corda ou Máq.",
        target: "2×10–12",
        notes: "",
      },
    ],
  },
];

export default function App() {
  // --- ESTADOS ---
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [logs, setLogs] = useState([]);

  const [activeScreen, setActiveScreen] = useState("home");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Inputs Logger
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Modais
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExTarget, setNewExTarget] = useState("");
  const [newExNotes, setNewExNotes] = useState("");

  // --- INICIALIZAÇÃO E PERSISTÊNCIA ---
  useEffect(() => {
    // Carregar dados ao iniciar
    const savedPlan = localStorage.getItem("gym_local_plan_v1");
    const savedLogs = localStorage.getItem("gym_local_logs_v1");

    if (savedPlan) {
      setWorkoutPlan(JSON.parse(savedPlan));
    } else {
      setWorkoutPlan(initialPlanTemplate);
    }

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Salvar automaticamente sempre que houver mudança
  useEffect(() => {
    if (workoutPlan.length > 0) {
      localStorage.setItem("gym_local_plan_v1", JSON.stringify(workoutPlan));
    }
  }, [workoutPlan]);

  useEffect(() => {
    localStorage.setItem("gym_local_logs_v1", JSON.stringify(logs));
  }, [logs]);

  // --- HELPER: 1RM & Plateau ---
  const calculate1RM = (weight, reps) => {
    if (!weight || !reps) return 0;
    return Math.round(weight * (1 + reps / 30));
  };

  const checkPlateau = (exerciseId) => {
    const history = logs.filter((l) => l.exerciseId === exerciseId);
    if (history.length < 3) return null;

    // Pegar as 3 últimas sessões DISTINTAS
    const uniqueDates = [
      ...new Set(history.map((l) => new Date(l.date).toDateString())),
    ].slice(0, 3);
    if (uniqueDates.length < 3) return null;

    const bestOfSessions = uniqueDates.map((date) => {
      const sessionLogs = history.filter(
        (l) => new Date(l.date).toDateString() === date
      );
      return Math.max(...sessionLogs.map((l) => l.weight));
    });

    const improvement = bestOfSessions[0] - bestOfSessions[2]; // [0] é a mais recente

    if (improvement <= 0) {
      return {
        detected: true,
        msg: "Carga estagnada há 3 sessões.",
        suggestion: "Considere um Deload ou varie as reps.",
      };
    }
    return null;
  };

  // --- LOGIC: TIMER ---
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      setTimerSeconds(0);
    } else {
      setIsTimerRunning(true);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- NAVIGATION ---
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setActiveScreen("dayView");
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    const history = logs.filter((l) => l.exerciseId === exercise.id);
    if (history.length > 0) {
      setCurrentWeight(history[0].weight);
      setCurrentReps(history[0].reps);
    } else {
      setCurrentWeight("");
      setCurrentReps("");
    }
    setActiveScreen("logger");
  };

  const handleBack = () => {
    if (activeScreen === "logger") setActiveScreen("dayView");
    else if (activeScreen === "dayView") setActiveScreen("home");
  };

  // --- CRUD: LOGS ---
  const saveLog = () => {
    if (!currentWeight || !currentReps) return;

    const newLog = {
      id: Date.now().toString(),
      exerciseId: selectedExercise.id,
      dayId: selectedDay.id,
      date: new Date().toISOString(),
      weight: parseFloat(currentWeight),
      reps: parseFloat(currentReps),
      volume: parseFloat(currentWeight) * parseFloat(currentReps),
    };

    setLogs([newLog, ...logs]);
  };

  const deleteLog = (logId) => {
    if (!window.confirm("Apagar este registro?")) return;
    setLogs(logs.filter((l) => l.id !== logId));
  };

  // --- CRUD: PLAN ---
  const deleteExerciseFromPlan = (dayId, exId) => {
    if (
      !window.confirm("Remover exercício do plano? O histórico será mantido.")
    )
      return;

    const updatedPlan = workoutPlan.map((day) => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        exercises: day.exercises.filter((ex) => ex.id !== exId),
      };
    });

    setWorkoutPlan(updatedPlan);
    if (selectedDay) setSelectedDay(updatedPlan.find((d) => d.id === dayId));
  };

  const handleAddExercise = () => {
    if (!newExName) return;
    const newEx = {
      id: Date.now().toString(),
      name: newExName,
      target: newExTarget || "3x10",
      notes: newExNotes,
    };

    const updatedPlan = workoutPlan.map((day) => {
      if (day.id !== selectedDay.id) return day;
      return { ...day, exercises: [...day.exercises, newEx] };
    });

    setWorkoutPlan(updatedPlan);
    setSelectedDay(updatedPlan.find((d) => d.id === selectedDay.id));
    setIsAddingExercise(false);
    setNewExName("");
    setNewExTarget("");
    setNewExNotes("");
  };

  // --- BACKUP & RESTORE ---
  const downloadData = () => {
    const data = { plan: workoutPlan, logs: logs };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gym-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const uploadData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.plan && data.logs) {
          if (
            window.confirm("Isso irá substituir seus dados atuais. Continuar?")
          ) {
            setWorkoutPlan(data.plan);
            setLogs(data.logs);
            alert("Dados importados com sucesso!");
          }
        }
      } catch (err) {
        alert("Arquivo inválido.");
      }
    };
    reader.readAsText(file);
  };

  // --- RENDERS ---

  const renderHome = () => (
    <div className="space-y-4 pb-20 animate-fade-in">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus Treinos</h1>
          <p className="text-slate-400 text-sm">Offline • Local</p>
        </div>
        <div className="flex gap-2">
          <label className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer">
            <Upload size={18} />
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={uploadData}
            />
          </label>
          <button
            onClick={downloadData}
            className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
            title="Backup"
          >
            <Download size={18} />
          </button>
        </div>
      </header>

      <div className="grid gap-4">
        {workoutPlan.map((day) => {
          const today = new Date().toDateString();
          const dayExIds = day.exercises ? day.exercises.map((e) => e.id) : [];
          const doneToday = logs.some(
            (l) =>
              dayExIds.includes(l.exerciseId) &&
              new Date(l.date).toDateString() === today
          );

          return (
            <div
              key={day.id}
              onClick={() => handleDayClick(day)}
              className={`p-5 rounded-2xl border transition-all active:scale-95 cursor-pointer relative overflow-hidden group
                ${
                  doneToday
                    ? "bg-slate-800 border-green-500/30"
                    : "bg-slate-800 border-slate-700 hover:border-orange-500/50"
                }`}
            >
              {doneToday && (
                <div className="absolute top-0 right-0 bg-green-500/20 px-2 py-1 rounded-bl-lg">
                  <CheckCircle2 size={14} className="text-green-400" />
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-slate-100">
                    {day.title.split("|")[0]}
                  </h3>
                  <p className="text-orange-400 text-sm font-medium">
                    {day.title.split("|")[1] || day.focus}
                  </p>
                </div>
                <ArrowRight
                  className="text-slate-600 group-hover:text-orange-500 transition-colors"
                  size={20}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="pb-24 animate-fade-in h-full flex flex-col">
      <header className="mb-6 flex items-center gap-4 sticky top-0 bg-slate-950/90 backdrop-blur py-4 z-10">
        <button
          onClick={handleBack}
          className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white leading-tight">
            {selectedDay.title.split("–")[0]}
          </h2>
          <p className="text-xs text-slate-400">{selectedDay.focus}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-3">
        {selectedDay.exercises.map((ex, idx) => {
          const history = logs.filter((l) => l.exerciseId === ex.id);
          const bestSet =
            history.length > 0
              ? history.reduce((prev, curr) =>
                  prev.weight > curr.weight ? prev : curr
                )
              : null;
          const todayLogs = logs.filter(
            (l) =>
              l.exerciseId === ex.id &&
              new Date(l.date).toDateString() === new Date().toDateString()
          );
          const plateau = checkPlateau(ex.id);

          return (
            <div
              key={ex.id}
              className="bg-slate-800 rounded-xl p-4 border border-slate-700 relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  onClick={() => handleExerciseClick(ex)}
                  className="font-bold text-lg text-white flex-1 cursor-pointer hover:text-orange-400 transition-colors"
                >
                  <span className="text-slate-500 text-sm mr-2 font-mono">
                    #{idx + 1}
                  </span>
                  {ex.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      deleteExerciseFromPlan(selectedDay.id, ex.id)
                    }
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div
                onClick={() => handleExerciseClick(ex)}
                className="cursor-pointer"
              >
                <div className="bg-slate-900/50 p-2 rounded-lg mb-2 flex justify-between items-center border border-slate-700/50">
                  <span className="text-orange-400 font-mono text-sm font-bold">
                    {ex.target}
                  </span>
                  {todayLogs.length > 0 && (
                    <CheckCircle2 size={16} className="text-green-500" />
                  )}
                </div>
                {ex.notes && (
                  <p className="text-xs text-slate-400 mb-2 italic">
                    "{ex.notes}"
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 border-t border-slate-700/50 pt-2">
                  {bestSet && (
                    <span className="flex items-center gap-1">
                      <BarChart3 size={12} /> PR: {bestSet.weight}kg
                    </span>
                  )}
                  {bestSet && (
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} /> Est. 1RM:{" "}
                      {calculate1RM(bestSet.weight, bestSet.reps)}kg
                    </span>
                  )}
                </div>
                {plateau && plateau.detected && (
                  <div className="mt-2 bg-yellow-900/20 text-yellow-500 text-xs p-2 rounded flex items-center gap-2">
                    <AlertTriangle size={12} /> {plateau.msg}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <button
          onClick={() => setIsAddingExercise(true)}
          className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Adicionar Exercício
        </button>
      </div>

      {isAddingExercise && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700">
            <h3 className="text-white font-bold mb-4">Novo Exercício</h3>
            <div className="space-y-3">
              <input
                placeholder="Nome"
                className="w-full bg-slate-800 text-white p-3 rounded border border-slate-700"
                value={newExName}
                onChange={(e) => setNewExName(e.target.value)}
              />
              <input
                placeholder="Meta (ex: 3x10)"
                className="w-full bg-slate-800 text-white p-3 rounded border border-slate-700"
                value={newExTarget}
                onChange={(e) => setNewExTarget(e.target.value)}
              />
              <input
                placeholder="Notas"
                className="w-full bg-slate-800 text-white p-3 rounded border border-slate-700"
                value={newExNotes}
                onChange={(e) => setNewExNotes(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsAddingExercise(false)}
                  className="flex-1 py-2 text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddExercise}
                  className="flex-1 bg-orange-600 text-white rounded py-2 font-bold"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLogger = () => {
    const todayLogs = logs.filter(
      (l) =>
        l.exerciseId === selectedExercise.id &&
        new Date(l.date).toDateString() === new Date().toDateString()
    );
    const history = logs.filter((l) => l.exerciseId === selectedExercise.id);
    const sortedHistory = [...history].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const prevHistory = sortedHistory.filter(
      (l) => new Date(l.date).toDateString() !== new Date().toDateString()
    );

    const plateau = checkPlateau(selectedExercise.id);
    const est1RM = calculate1RM(currentWeight, currentReps);

    return (
      <div className="pb-6 h-full flex flex-col animate-fade-in">
        <header className="mb-4 flex items-center gap-4">
          <button
            onClick={() => setActiveScreen("dayView")}
            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white leading-none truncate">
              {selectedExercise.name}
            </h2>
            <p className="text-orange-400 text-xs mt-1 font-mono">
              {selectedExercise.target}
            </p>
          </div>
        </header>

        {plateau && plateau.detected && (
          <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm mb-1">
              <AlertTriangle size={16} /> Platô Detectado
            </div>
            <p className="text-slate-400 text-xs">{plateau.suggestion}</p>
          </div>
        )}

        <div
          onClick={toggleTimer}
          className={`flex items-center justify-between p-3 rounded-xl mb-4 cursor-pointer transition-all border ${
            isTimerRunning
              ? "bg-orange-900/20 border-orange-500/50"
              : "bg-slate-800 border-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <Timer
              size={20}
              className={
                isTimerRunning
                  ? "text-orange-500 animate-pulse"
                  : "text-slate-400"
              }
            />
            <span className="text-sm text-slate-300 font-medium">Descanso</span>
          </div>
          <span
            className={`font-mono text-xl font-bold ${
              isTimerRunning ? "text-orange-400" : "text-slate-400"
            }`}
          >
            {formatTime(timerSeconds)}
          </span>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl mb-6 relative overflow-hidden">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wider text-center">
                Peso
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="w-full bg-slate-900 text-3xl font-mono text-white p-4 rounded-xl border border-slate-700 focus:border-orange-500 outline-none text-center"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-wider text-center">
                Reps
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={currentReps}
                onChange={(e) => setCurrentReps(e.target.value)}
                className="w-full bg-slate-900 text-3xl font-mono text-white p-4 rounded-xl border border-slate-700 focus:border-orange-500 outline-none text-center"
                placeholder="0"
              />
            </div>
          </div>

          {est1RM > 0 && (
            <div className="text-center mb-4 text-xs text-slate-500 font-mono">
              Est. 1RM: <span className="text-white font-bold">{est1RM}kg</span>
            </div>
          )}

          <button
            onClick={saveLog}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <Save size={20} /> Registrar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {todayLogs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Hoje
              </h3>
              <div className="space-y-2">
                {todayLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center bg-slate-800/80 p-3 rounded-lg border-l-4 border-orange-500 animate-fade-in"
                  >
                    <span className="text-slate-500 font-mono text-xs w-4">
                      #{todayLogs.length - idx}
                    </span>
                    <div className="flex gap-4">
                      <span className="text-white font-bold">
                        {log.weight}
                        <span className="text-xs font-normal text-slate-500">
                          kg
                        </span>
                      </span>
                      <span className="text-white font-bold">
                        {log.reps}
                        <span className="text-xs font-normal text-slate-500">
                          reps
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="text-slate-600 hover:text-red-500 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Histórico
          </h3>
          <div className="space-y-3">
            {prevHistory.length === 0 ? (
              <p className="text-slate-600 text-sm italic text-center py-4">
                Vazio.
              </p>
            ) : (
              prevHistory.map((log, i) => {
                const showDate =
                  i === 0 ||
                  new Date(log.date).toDateString() !==
                    new Date(prevHistory[i - 1].date).toDateString();
                return (
                  <div key={log.id}>
                    {showDate && (
                      <div className="text-xs text-orange-500/80 font-bold mt-4 mb-1 flex items-center gap-1">
                        <Calendar size={10} />{" "}
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex justify-between text-sm bg-slate-900/30 p-2 rounded border border-slate-800/50">
                      <span className="text-slate-300 font-medium w-20">
                        {log.weight}kg
                      </span>
                      <span className="text-slate-300 w-16 text-center">
                        x {log.reps}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-orange-500/30">
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col">
        <main className="flex-1 p-5 h-screen overflow-hidden flex flex-col">
          {activeScreen === "home" && renderHome()}
          {activeScreen === "dayView" && renderDayView()}
          {activeScreen === "logger" && renderLogger()}
        </main>
      </div>
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
