import { useState, useEffect } from "react";
import { Calendar, Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<"pre-christmas" | "christmas" | "pre-newyear">("pre-christmas");

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const christmas = new Date(currentYear, 11, 25); // Dec 25
    const dec29 = new Date(currentYear, 11, 29); // Dec 29
    const newYear = new Date(currentYear + 1, 0, 1); // Jan 1 next year

    // Determine current phase
    if (now < christmas) {
      setTargetDate(christmas);
      setMessage("Until Christmas");
      setPhase("pre-christmas");
    } else if (now >= christmas && now < dec29) {
      setMessage("Merry Christmas! 🎄");
      setPhase("christmas");
    } else {
      setTargetDate(newYear);
      setMessage("Until New Year");
      setPhase("pre-newyear");
    }
  }, []);

  useEffect(() => {
    if (phase === "christmas") return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, phase]);

  if (phase === "christmas") {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg">
          <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            {message}
          </h2>
          <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8 animate-fade-in-up">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-accent" />
        <p className="text-xl md:text-2xl font-semibold text-foreground">{message}</p>
      </div>
      <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center p-4 md:p-6 bg-card rounded-xl shadow-lg min-w-[80px] md:min-w-[100px] border border-border"
          >
            <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {item.value.toString().padStart(2, "0")}
            </span>
            <span className="text-sm md:text-base text-muted-foreground uppercase tracking-wide">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
