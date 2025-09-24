import { RefreshCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "glow" | "pulse";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  variant = "default", 
  className, 
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const variants = {
    default: "text-primary",
    glow: "text-primary animate-pulse-glow",
    pulse: "text-primary-glow animate-pulse"
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative">
        <Loader2 className={cn(
          "animate-spin",
          sizeClasses[size],
          variants[variant]
        )} />
        {variant === "glow" && (
          <div className={cn(
            "absolute inset-0 animate-spin opacity-20",
            sizeClasses[size]
          )}>
            <RefreshCcw className="w-full h-full text-primary-glow" />
          </div>
        )}
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};