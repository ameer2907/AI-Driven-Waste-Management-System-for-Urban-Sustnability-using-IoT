import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info
} from "lucide-react";

interface Bin3DViewerProps {
  fillLevel: number;
  status: 'normal' | 'warning' | 'critical';
  temperature?: number;
  humidity?: number;
}

export const Bin3DViewer = ({ 
  fillLevel, 
  status, 
  temperature = 24, 
  humidity = 65 
}: Bin3DViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const binWidth = 100 * zoom;
      const binHeight = 180 * zoom;
      const perspective = 0.6;

      // Apply rotation transform
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      // Draw 3D bin with perspective
      const drawBinFace = (x: number, y: number, w: number, h: number, brightness: number) => {
        const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
        
        const baseColor = status === 'critical' ? '239, 68, 68' : 
                         status === 'warning' ? '251, 191, 36' : 
                         '34, 197, 94';
        
        gradient.addColorStop(0, `rgba(${baseColor}, ${brightness * 0.8})`);
        gradient.addColorStop(1, `rgba(${baseColor}, ${brightness * 0.4})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        
        // Border
        ctx.strokeStyle = `rgba(${baseColor}, ${brightness})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
      };

      // 3D Bin Body (Front face)
      const binX = centerX - binWidth / 2;
      const binY = centerY - binHeight / 2;
      drawBinFace(binX, binY, binWidth, binHeight, 1);

      // Right side face (3D effect)
      const sideWidth = binWidth * perspective;
      ctx.beginPath();
      ctx.moveTo(binX + binWidth, binY);
      ctx.lineTo(binX + binWidth + sideWidth, binY - sideWidth * 0.5);
      ctx.lineTo(binX + binWidth + sideWidth, binY + binHeight - sideWidth * 0.5);
      ctx.lineTo(binX + binWidth, binY + binHeight);
      ctx.closePath();
      
      const sideGradient = ctx.createLinearGradient(
        binX + binWidth, binY, 
        binX + binWidth + sideWidth, binY
      );
      const sideColor = status === 'critical' ? '220, 38, 38' : 
                       status === 'warning' ? '217, 119, 6' : 
                       '22, 163, 74';
      sideGradient.addColorStop(0, `rgba(${sideColor}, 0.7)`);
      sideGradient.addColorStop(1, `rgba(${sideColor}, 0.3)`);
      ctx.fillStyle = sideGradient;
      ctx.fill();

      // Top lid
      ctx.beginPath();
      ctx.moveTo(binX, binY);
      ctx.lineTo(binX + binWidth, binY);
      ctx.lineTo(binX + binWidth + sideWidth, binY - sideWidth * 0.5);
      ctx.lineTo(binX + sideWidth, binY - sideWidth * 0.5);
      ctx.closePath();
      
      const topGradient = ctx.createLinearGradient(binX, binY, binX + binWidth, binY);
      topGradient.addColorStop(0, 'rgba(71, 85, 105, 0.8)');
      topGradient.addColorStop(1, 'rgba(51, 65, 85, 0.6)');
      ctx.fillStyle = topGradient;
      ctx.fill();

      // Fill level indicator (waste inside)
      const fillHeight = (binHeight - 20) * (fillLevel / 100);
      const wasteY = binY + binHeight - 10 - fillHeight;
      
      const wasteGradient = ctx.createLinearGradient(
        binX + 10, wasteY,
        binX + 10, binY + binHeight - 10
      );
      wasteGradient.addColorStop(0, 'rgba(100, 116, 139, 0.6)');
      wasteGradient.addColorStop(1, 'rgba(71, 85, 105, 0.9)');
      
      ctx.fillStyle = wasteGradient;
      ctx.fillRect(binX + 10, wasteY, binWidth - 20, fillHeight);

      // Animated particles rising from waste
      const particleCount = 8;
      const time = Date.now() / 1000;
      for (let i = 0; i < particleCount; i++) {
        const offset = (time + i * 0.5) % 2;
        const particleY = wasteY - offset * 40;
        const particleX = binX + 30 + Math.sin(time + i) * 20;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${0.6 - offset * 0.3})`;
        ctx.fill();
      }

      // IoT Sensor indicator (blinking LED)
      const ledX = binX + binWidth - 20;
      const ledY = binY + 30;
      const blink = Math.sin(time * 3) > 0;
      
      ctx.beginPath();
      ctx.arc(ledX, ledY, 4, 0, Math.PI * 2);
      ctx.fillStyle = blink ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 0.3)';
      ctx.fill();
      
      if (blink) {
        ctx.beginPath();
        ctx.arc(ledX, ledY, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [fillLevel, status, rotation, zoom]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
  };

  return (
    <Card className={`bg-gradient-card border-border/50 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-primary" />
            3D Bin Visualization
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Canvas */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-border/30">
          <canvas
            ref={canvasRef}
            className="w-full h-80 cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          />
          
          {/* Controls Overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRotate}
              className="backdrop-blur-sm bg-background/80"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomIn}
              className="backdrop-blur-sm bg-background/80"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}
              className="backdrop-blur-sm bg-background/80"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="backdrop-blur-sm bg-background/80"
            >
              Reset
            </Button>
          </div>

          {/* Status Badge Overlay */}
          <div className="absolute top-4 left-4">
            <Badge 
              className={`${
                status === 'critical' ? 'bg-destructive text-destructive-foreground' :
                status === 'warning' ? 'bg-warning text-warning-foreground' :
                'bg-success text-success-foreground'
              } backdrop-blur-sm`}
            >
              {status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Sensor Readings */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-gradient-glow border border-primary/20">
            <div className="text-2xl font-bold text-primary">{fillLevel}%</div>
            <div className="text-xs text-muted-foreground mt-1">Fill Level</div>
            <Progress value={fillLevel} className="h-1.5 mt-2" />
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <div className="text-2xl font-bold">{temperature}°C</div>
            <div className="text-xs text-muted-foreground mt-1">Temperature</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <div className="text-2xl font-bold">{humidity}%</div>
            <div className="text-xs text-muted-foreground mt-1">Humidity</div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-iot-blue/10 border border-iot-blue/30">
          <Info className="h-4 w-4 text-iot-blue mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Interactive 3D model showing real-time bin status with IoT sensor data. 
            Rotate and zoom to inspect the bin from different angles.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};