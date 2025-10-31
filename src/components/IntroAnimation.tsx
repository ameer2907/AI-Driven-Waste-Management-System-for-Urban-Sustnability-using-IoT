import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Recycle, Sparkles } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2200),
      setTimeout(() => onComplete(), 4000),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.15) 50%, hsl(var(--iot-blue) / 0.1) 100%)',
        }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0 
              }}
              animate={{ 
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative w-full max-w-5xl px-8 text-center">
          {/* Icon Row at Top */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: step >= 0 ? 1 : 0, y: step >= 0 ? 0 : -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-8 mb-16"
          >
            {[
              { icon: Brain, color: "text-success", delay: 0 },
              { icon: Recycle, color: "text-iot-cyan", delay: 0.15 },
              { icon: Sparkles, color: "text-iot-purple", delay: 0.3 },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0 
                }}
                transition={{ 
                  delay: item.delay, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200
                }}
                className="relative"
              >
                <motion.div
                  className={`p-5 rounded-2xl bg-card/50 backdrop-blur-xl border border-primary/20 ${item.color}`}
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(var(--primary-rgb), 0.1)",
                      "0 0 40px rgba(var(--primary-rgb), 0.3)",
                      "0 0 20px rgba(var(--primary-rgb), 0.1)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <item.icon className="h-10 w-10" strokeWidth={2} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: step >= 0 ? 1 : 0, y: step >= 0 ? 0 : 40 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-success via-primary to-iot-cyan bg-clip-text text-transparent">
                AI-Driven Predictive
              </span>
              <br />
              <span className="text-foreground">
                Waste Management System
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 1 ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Leveraging IoT sensors and machine learning to predict waste levels, optimize collection routes, and promote urban sustainability through intelligent analytics
            </motion.p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
          >
            {[
              { label: "Real-time IoT", color: "text-success" },
              { label: "ML Predictions", color: "text-iot-cyan" },
              { label: "Smart Analytics", color: "text-iot-purple" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className={`px-6 py-3 rounded-full bg-card/60 backdrop-blur-lg border border-border/50 ${item.color} font-semibold text-lg`}
              >
                {item.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Loading Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-success via-primary to-iot-cyan"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />
            </div>
            <motion.p
              className="text-muted-foreground text-sm text-center mt-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Initializing AI Classification System...
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};