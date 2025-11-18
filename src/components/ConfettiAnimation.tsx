import { useEffect } from "react";

const ConfettiAnimation = () => {
  useEffect(() => {
    const colors = [
      "hsl(180, 100%, 50%)",
      "hsl(300, 100%, 50%)",
      "hsl(45, 100%, 50%)",
      "hsl(0, 90%, 55%)",
      "hsl(140, 80%, 45%)",
    ];

    const createConfetti = () => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
      confetti.style.animationDelay = Math.random() * 2 + "s";
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    };

    const interval = setInterval(createConfetti, 100);
    
    // Create initial confetti burst
    for (let i = 0; i < 100; i++) {
      setTimeout(createConfetti, Math.random() * 1000);
    }

    return () => {
      clearInterval(interval);
      document.querySelectorAll(".confetti").forEach((c) => c.remove());
    };
  }, []);

  return null;
};

export default ConfettiAnimation;
