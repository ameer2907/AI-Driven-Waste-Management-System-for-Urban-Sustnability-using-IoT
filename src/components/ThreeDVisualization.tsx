import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder, Sphere } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Zap, 
  Thermometer, 
  Wifi, 
  Battery,
  RotateCcw,
  Play,
  Pause
} from "lucide-react";
import * as THREE from "three";

// Smart Bin 3D Model Component
const SmartBin = ({ position, fillLevel = 70, isActive = true }: any) => {
  const binRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (binRef.current && isActive) {
        binRef.current.rotation.y += 0.005;
      }
    }, 16);
    return () => clearInterval(interval);
  }, [isActive]);

  const binColor = fillLevel > 85 ? "#ef4444" : fillLevel > 70 ? "#f97316" : "#22c55e";
  const glowIntensity = hovered ? 0.8 : 0.3;

  return (
    <group 
      ref={binRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Bin Body */}
      <Cylinder
        args={[1, 1.2, 3, 8]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.7} 
          roughness={0.3}
          emissive={hovered ? "#1a1a1a" : "#000000"}
        />
      </Cylinder>

      {/* Fill Level Indicator */}
      <Cylinder
        args={[0.95, 1.15, (fillLevel / 100) * 2.8, 8]}
        position={[0, -1.4 + (fillLevel / 100) * 1.4, 0]}
      >
        <meshStandardMaterial 
          color={binColor}
          transparent
          opacity={0.6}
          emissive={binColor}
          emissiveIntensity={0.2}
        />
      </Cylinder>

      {/* Ultrasonic Sensor */}
      <Box args={[0.3, 0.1, 0.2]} position={[0, 1.6, 1]}>
        <meshStandardMaterial 
          color="#4ade80" 
          emissive="#22c55e"
          emissiveIntensity={isActive ? glowIntensity : 0.1}
        />
      </Box>

      {/* Temperature Sensor */}
      <Cylinder args={[0.05, 0.05, 0.4]} position={[0.8, 0.5, 0.8]}>
        <meshStandardMaterial 
          color="#f97316"
          emissive="#ea580c"
          emissiveIntensity={isActive ? 0.4 : 0.1}
        />
      </Cylinder>

      {/* WiFi Module */}
      <Box args={[0.2, 0.15, 0.05]} position={[0, 1.4, -1.1]}>
        <meshStandardMaterial 
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={isActive ? 0.5 : 0.1}
        />
      </Box>

      {/* Status Light */}
      <Sphere args={[0.08]} position={[0, 1.8, 0]}>
        <meshStandardMaterial 
          color={isActive ? "#22c55e" : "#ef4444"}
          emissive={isActive ? "#16a34a" : "#dc2626"}
          emissiveIntensity={1}
        />
      </Sphere>

      {/* Data Transmission Visualization */}
      {isActive && (
        <group>
          {[...Array(3)].map((_, i) => (
            <Sphere 
              key={i}
              args={[0.02 + i * 0.01]} 
              position={[0, 2.5 + i * 0.3, 0]}
            >
              <meshStandardMaterial 
                color="#4ade80"
                transparent
                opacity={0.6 - i * 0.2}
                emissive="#22c55e"
                emissiveIntensity={0.5}
              />
            </Sphere>
          ))}
        </group>
      )}

      {/* Labels */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`Fill: ${fillLevel}%`}
      </Text>
    </group>
  );
};

// Network Visualization Component
const NetworkVisualization = () => {
  return (
    <group>
      {/* Central Hub */}
      <Sphere args={[0.3]} position={[0, 5, 0]}>
        <meshStandardMaterial 
          color="#4ade80"
          emissive="#22c55e"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Network Lines */}
      {[
        [-3, 0, -2],
        [3, 0, -2], 
        [-2, 0, 3],
        [2, 0, 3]
      ].map((pos, i) => (
        <group key={i}>
          <Box 
            args={[0.02, Math.sqrt(Math.pow(pos[0], 2) + 25 + Math.pow(pos[2], 2)), 0.02]}
            position={[pos[0] / 2, 2.5, pos[2] / 2]}
            rotation={[0, 0, Math.atan2(pos[0], 5)]}
          >
            <meshStandardMaterial 
              color="#4ade80"
              transparent
              opacity={0.3}
              emissive="#22c55e"
              emissiveIntensity={0.2}
            />
          </Box>
        </group>
      ))}
      
      <Text
        position={[0, 6, 0]}
        fontSize={0.3}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        IoT Gateway
      </Text>
    </group>
  );
};

export const ThreeDVisualization = () => {
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState("single");
  
  const binData = [
    { position: [-3, 0, -2], fillLevel: 85, id: "A001" },
    { position: [3, 0, -2], fillLevel: 95, id: "A002" },
    { position: [-2, 0, 3], fillLevel: 45, id: "B003" },
    { position: [2, 0, 3], fillLevel: 73, id: "C004" }
  ];

  const sensorSpecs = [
    {
      name: "Ultrasonic Distance Sensor",
      model: "HC-SR04",
      range: "2cm - 4m",
      accuracy: "±3mm",
      power: "5V DC",
      icon: Zap,
      color: "text-success"
    },
    {
      name: "Temperature Sensor",
      model: "DS18B20",
      range: "-55°C to +125°C",
      accuracy: "±0.5°C",
      power: "3.0V - 5.5V",
      icon: Thermometer,
      color: "text-iot-orange"
    },
    {
      name: "WiFi Module",
      model: "ESP8266",
      frequency: "2.4GHz",
      range: "100m",
      power: "3.3V",
      icon: Wifi,
      color: "text-iot-blue"
    },
    {
      name: "Battery Management",
      model: "Li-ion 18650",
      capacity: "3000mAh",
      voltage: "3.7V",
      life: "500+ cycles",
      icon: Battery,
      color: "text-primary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">3D Hardware Model</h2>
          <p className="text-muted-foreground">Interactive visualization of smart bin IoT components</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "single" ? "default" : "outline"}
            onClick={() => setViewMode("single")}
            size="sm"
          >
            Single Bin
          </Button>
          <Button
            variant={viewMode === "network" ? "default" : "outline"}
            onClick={() => setViewMode("network")}
            size="sm"
          >
            Network View
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsRotating(!isRotating)}
            size="sm"
          >
            {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Visualization */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Interactive 3D Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
              <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight 
                  position={[0, 15, 0]} 
                  angle={0.3} 
                  penumbra={1} 
                  intensity={0.5}
                  castShadow
                />
                
                {viewMode === "single" ? (
                  <SmartBin position={[0, 0, 0]} fillLevel={75} isActive={isRotating} />
                ) : (
                  <group>
                    <NetworkVisualization />
                    {binData.map((bin, index) => (
                      <SmartBin 
                        key={index}
                        position={bin.position} 
                        fillLevel={bin.fillLevel}
                        isActive={isRotating}
                      />
                    ))}
                  </group>
                )}
                
                {/* Ground Plane */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                  <planeGeometry args={[20, 20]} />
                  <meshStandardMaterial color="#1a1a1a" transparent opacity={0.5} />
                </mesh>
                
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={isRotating}
                  autoRotateSpeed={2}
                />
              </Canvas>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse-glow" />
                <span>Active Sensors</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-iot-orange rounded-full" />
                <span>Temperature Monitor</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-iot-blue rounded-full" />
                <span>Network Connection</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Specifications */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Hardware Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sensorSpecs.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div key={index} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-glow ${spec.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{spec.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{spec.model}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Range:</span>
                          <span className="font-medium">{spec.range}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-medium">{spec.accuracy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Power:</span>
                          <span className="font-medium">{spec.power}</span>
                        </div>
                        {spec.life && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Life:</span>
                            <span className="font-medium">{spec.life}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6 p-4 rounded-lg bg-gradient-glow border border-primary/20">
              <div className="text-center">
                <Badge className="bg-primary text-primary-foreground mb-2">
                  System Integration
                </Badge>
                <p className="text-sm text-muted-foreground">
                  All sensors communicate via I2C/SPI protocols to a central microcontroller (Arduino Nano/ESP32) 
                  which processes data and transmits to cloud via WiFi/4G.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};