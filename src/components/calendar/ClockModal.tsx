import { useState, useEffect, useRef, useCallback } from "react";
import { X, Play, Pause, RotateCcw, Plus, Trash2, Bell, Timer, Clock, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "clock" | "timer" | "alarm" | "stopwatch";

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export function ClockModal({ isOpen, onClose }: ClockModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("clock");
  
  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);
  
  // Alarm state
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState("08:00");
  const [newAlarmLabel, setNewAlarmLabel] = useState("");

  // Update clock every second
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === 0) {
            setTimerMinutes((m) => {
              if (m === 0) {
                setTimerRunning(false);
                toast.success("Timer finished!");
                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  // Stopwatch logic
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 10);
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [stopwatchRunning]);

  // Check alarms
  useEffect(() => {
    if (!isOpen) return;
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      
      alarms.forEach((alarm) => {
        if (alarm.enabled && alarm.time === currentTimeStr && now.getSeconds() === 0) {
          toast.info(`🔔 Alarm: ${alarm.label || "Time's up!"}`);
        }
      });
    }, 1000);
    
    return () => clearInterval(checkAlarms);
  }, [isOpen, alarms]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const formatStopwatch = (time: number) => {
    const minutes = Math.floor(time / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const centiseconds = time % 100;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  };

  const addAlarm = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      label: newAlarmLabel,
      enabled: true,
    };
    setAlarms([...alarms, newAlarm]);
    setNewAlarmLabel("");
    toast.success("Alarm added");
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((a) => a.id !== id));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "clock" as TabType, icon: Clock, label: "Clock" },
    { id: "timer" as TabType, icon: Timer, label: "Timer" },
    { id: "alarm" as TabType, icon: Bell, label: "Alarm" },
    { id: "stopwatch" as TabType, icon: StopCircle, label: "Stopwatch" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-md mx-4 rounded-xl bg-card border border-border shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary animate-pulse" />
            Clock & Timer
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:rotate-90 transition-transform" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className={cn("h-3.5 w-3.5", activeTab === tab.id && "animate-bounce")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 min-h-[280px]">
          {/* Clock Tab */}
          {activeTab === "clock" && (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
              <div className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent tabular-nums tracking-wider">
                {formatTime(currentTime)}
              </div>
              <div className="mt-3 text-lg text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
              <div className="mt-4 flex gap-2">
                <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                  {currentTime.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop()}
                </div>
              </div>
            </div>
          )}

          {/* Timer Tab */}
          {activeTab === "timer" && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className={cn(
                "text-6xl font-mono font-bold tabular-nums transition-all duration-300",
                timerRunning ? "text-amber-500 animate-pulse" : "text-foreground"
              )}>
                {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
              </div>
              
              {!timerRunning && (
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center rounded-lg border border-border bg-background text-sm"
                  />
                  <span className="text-muted-foreground">min</span>
                </div>
              )}
              
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={cn(
                    "gap-2 transition-all duration-200 hover:scale-105",
                    timerRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"
                  )}
                >
                  {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {timerRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setTimerRunning(false); setTimerMinutes(5); setTimerSeconds(0); }}
                  className="gap-2 hover:rotate-180 transition-transform duration-500"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          )}

          {/* Alarm Tab */}
          {activeTab === "alarm" && (
            <div className="animate-fade-in">
              {/* Add Alarm */}
              <div className="flex gap-2 mb-4">
                <input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm"
                />
                <input
                  type="text"
                  placeholder="Label (optional)"
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-sm"
                />
                <Button size="sm" onClick={addAlarm} className="hover:scale-110 transition-transform">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Alarm List */}
              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {alarms.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">No alarms set</p>
                ) : (
                  alarms.map((alarm) => (
                    <div
                      key={alarm.id}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200",
                        alarm.enabled
                          ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20"
                          : "border-border bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Bell className={cn("h-4 w-4", alarm.enabled && "animate-swing")} />
                        <div>
                          <div className="font-mono font-semibold">{alarm.time}</div>
                          {alarm.label && <div className="text-xs text-muted-foreground">{alarm.label}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAlarm(alarm.id)}
                          className={cn(
                            "w-10 h-5 rounded-full transition-colors duration-200 relative",
                            alarm.enabled ? "bg-amber-500" : "bg-muted"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                              alarm.enabled ? "left-5" : "left-0.5"
                            )}
                          />
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:text-red-500 hover:scale-110 transition-all"
                          onClick={() => deleteAlarm(alarm.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Stopwatch Tab */}
          {activeTab === "stopwatch" && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className={cn(
                "text-5xl font-mono font-bold tabular-nums transition-all duration-300",
                stopwatchRunning && "text-blue-500"
              )}>
                {formatStopwatch(stopwatchTime)}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => setStopwatchRunning(!stopwatchRunning)}
                  className={cn(
                    "gap-2 transition-all duration-200 hover:scale-105",
                    stopwatchRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-500 hover:bg-blue-600"
                  )}
                >
                  {stopwatchRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {stopwatchRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setStopwatchRunning(false); setStopwatchTime(0); }}
                  className="gap-2 hover:rotate-180 transition-transform duration-500"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              {stopwatchTime > 0 && !stopwatchRunning && (
                <div className="mt-4 text-sm text-muted-foreground animate-fade-in">
                  Final time: {formatStopwatch(stopwatchTime)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
