import { CheckCircle, AlertTriangle, XCircle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "warning" | "error" | "offline" | "processing";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const StatusIndicator = ({ 
  status, 
  size = "md", 
  showText = false, 
  animated = true,
  className 
}: StatusIndicatorProps) => {
  const configs = {
    online: {
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
      text: "Online",
      animation: animated ? "animate-pulse-glow" : ""
    },
    warning: {
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10", 
      borderColor: "border-warning/30",
      text: "Warning",
      animation: animated ? "animate-pulse" : ""
    },
    error: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      text: "Error",
      animation: animated ? "animate-pulse" : ""
    },
    offline: {
      icon: XCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
      borderColor: "border-muted/30",
      text: "Offline",
      animation: ""
    },
    processing: {
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      text: "Processing",
      animation: animated ? "animate-pulse-glow" : ""
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: showText ? "text-xs gap-1" : "p-1",
    md: showText ? "text-sm gap-2" : "p-2",
    lg: showText ? "text-base gap-3" : "p-3"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  if (showText) {
    return (
      <div className={cn(
        "inline-flex items-center rounded-full px-3 py-1 border",
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        className
      )}>
        <Icon className={cn(iconSizes[size], config.color, config.animation)} />
        <span className={cn("font-medium", config.color)}>
          {config.text}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center justify-center rounded-full",
      config.bgColor,
      sizeClasses[size],
      className
    )}>
      <Icon className={cn(iconSizes[size], config.color, config.animation)} />
    </div>
  );
};