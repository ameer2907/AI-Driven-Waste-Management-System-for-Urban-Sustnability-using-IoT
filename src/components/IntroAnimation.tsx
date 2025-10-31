import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Recycle, Brain, Wifi } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 3200),
      setTimeout(() => onComplete(), 5000),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary-dark))] to-[hsl(var(--accent))]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-full max-w-4xl px-8">
          {/* Main Title Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: step >= 0 ? 1 : 0, y: step >= 0 ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              AI Driven Predictive
              <br />
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Waste Management System
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 0 ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              For Urban Sustainability using IoT
            </motion.p>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
          >
            {[
              { icon: Brain, label: "AI Classification", delay: 0 },
              { icon: Wifi, label: "IoT Sensors", delay: 0.1 },
              { icon: Recycle, label: "Smart Recycling", delay: 0.2 },
              { icon: Leaf, label: "Sustainability", delay: 0.3 },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.5 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(255,255,255,0.1)",
                      "0 0 30px rgba(255,255,255,0.3)",
                      "0 0 20px rgba(255,255,255,0.1)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-sm text-white/90 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white/80 text-sm">Powered by:</span>
              <div className="flex gap-3 text-white font-semibold text-sm">
                <span>TensorFlow</span>
                <span>•</span>
                <span>IoT Sensors</span>
                <span>•</span>
                <span>React</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Loading Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 3 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-12 left-0 right-0"
          >
            <div className="max-w-md mx-auto">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-white to-blue-200"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <motion.p
                className="text-white/60 text-sm text-center mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Initializing AI Classification System...
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
