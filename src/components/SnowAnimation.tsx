import { useEffect } from "react";

const SnowAnimation = () => {
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      snowflake.innerHTML = "❄";
      snowflake.style.left = Math.random() * 100 + "vw";
      snowflake.style.animationDuration = Math.random() * 3 + 7 + "s";
      snowflake.style.opacity = (Math.random() * 0.6 + 0.4).toString();
      snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
      
      // Alternate between left and right drift
      if (Math.random() > 0.5) {
        snowflake.style.animationName = "snowfall-left";
      }
      
      document.body.appendChild(snowflake);
      
      setTimeout(() => {
        snowflake.remove();
      }, 10000);
    };

    const interval = setInterval(createSnowflake, 200);
    
    // Create initial snowflakes
    for (let i = 0; i < 50; i++) {
      setTimeout(createSnowflake, Math.random() * 2000);
    }

    return () => {
      clearInterval(interval);
      document.querySelectorAll(".snowflake").forEach((s) => s.remove());
    };
  }, []);

  return null;
};

export default SnowAnimation;
