import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, Thermometer, Droplets, Wifi, Zap } from "lucide-react";

const SmartBinModel = () => {
  const binRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={binRef}>
      {/* Main Bin Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.4, 3, 32]} />
        <meshStandardMaterial 
          color="#1e40af" 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>

      {/* Bin Lid */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[1.25, 1.2, 0.2, 32]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>

      {/* Ultrasonic Sensor (Top) */}
      <group position={[0, 1.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.15, 0.3]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
        {/* Sensor Eyes */}
        <mesh position={[-0.1, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.1, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Sensor Label */}
        <Html position={[0, 0.3, 0]} center>
          <div className="bg-success/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm">
            Ultrasonic Sensor
          </div>
        </Html>
      </group>

      {/* Temperature Sensor (Side) */}
      <group position={[1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
        </mesh>
        <Html position={[0.5, 0, 0]} center>
          <div className="bg-destructive/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm">
            Temperature
          </div>
        </Html>
      </group>

      {/* Humidity Sensor (Side) */}
      <group position={[-1.3, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
        </mesh>
        <Html position={[-0.5, 0, 0]} center>
          <div className="bg-primary/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm">
            Humidity
          </div>
        </Html>
      </group>

      {/* IoT Module (Side) */}
      <group position={[0, -0.8, 1.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.15]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
        </mesh>
        {/* LED Indicator */}
        <mesh position={[0, 0.15, 0.08]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#10b981" 
            emissive="#10b981" 
            emissiveIntensity={2}
          />
        </mesh>
        <Html position={[0, -0.4, 0]} center>
          <div className="bg-purple-600/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm">
            IoT Module
          </div>
        </Html>
      </group>

      {/* Weight Sensor (Bottom) */}
      <group position={[0, -1.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.4, 1.4, 0.15, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
        <Html position={[0, -0.3, 0]} center>
          <div className="bg-warning/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm">
            Load Cell Sensor
          </div>
        </Html>
      </group>

      {/* Waste Level Indicator */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[1.15, 1.35, 2.4, 32]} />
        <meshStandardMaterial 
          color="#22c55e" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ground Plane */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

export const HardwareModel3D = () => {
  const [selectedInfo, setSelectedInfo] = useState<string>("overview");

  const sensorSpecs = [
    {
      id: "ultrasonic",
      name: "HC-SR04 Ultrasonic",
      icon: Waves,
      purpose: "Fill Level Detection",
      range: "2cm - 400cm",
      accuracy: "±3mm",
      color: "text-success"
    },
    {
      id: "temperature",
      name: "DHT22 Sensor",
      icon: Thermometer,
      purpose: "Temperature Monitoring",
      range: "-40°C to 80°C",
      accuracy: "±0.5°C",
      color: "text-destructive"
    },
    {
      id: "humidity",
      name: "DHT22 Sensor",
      icon: Droplets,
      purpose: "Humidity Detection",
      range: "0-100% RH",
      accuracy: "±2%",
      color: "text-primary"
    },
    {
      id: "iot",
      name: "ESP32 WiFi Module",
      icon: Wifi,
      purpose: "Data Transmission",
      connectivity: "WiFi 802.11 b/g/n",
      power: "3.3V",
      color: "text-purple-500"
    },
    {
      id: "weight",
      name: "HX711 Load Cell",
      icon: Zap,
      purpose: "Weight Measurement",
      capacity: "0-50kg",
      accuracy: "±10g",
      color: "text-warning"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">3D Hardware Model</h2>
        <p className="text-muted-foreground">
          Interactive view of smart waste bin with IoT sensors and connectivity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Model Viewer */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Smart Bin Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-secondary/30 to-secondary/10 border border-border/30">
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[4, 3, 4]} />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={3}
                  maxDistance={10}
                  autoRotate
                  autoRotateSpeed={1.5}
                />
                
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={1}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />
                <spotLight
                  position={[0, 10, 0]}
                  angle={0.3}
                  penumbra={1}
                  intensity={0.5}
                  castShadow
                />

                <SmartBinModel />
              </Canvas>

              {/* Control Hints */}
              <div className="absolute bottom-4 left-4 bg-secondary/80 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-muted-foreground">
                <p>🖱️ Drag to rotate • Scroll to zoom • Right-click to pan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Specifications */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Sensor Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensorSpecs.map((sensor) => (
                <div
                  key={sensor.id}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-all cursor-pointer"
                  onClick={() => setSelectedInfo(sensor.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-background/50 ${sensor.color}`}>
                      <sensor.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{sensor.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{sensor.purpose}</p>
                      <div className="space-y-1">
                        {sensor.range && (
                          <Badge variant="outline" className="text-xs">
                            Range: {sensor.range}
                          </Badge>
                        )}
                        {sensor.accuracy && (
                          <Badge variant="outline" className="text-xs ml-1">
                            {sensor.accuracy}
                          </Badge>
                        )}
                        {sensor.connectivity && (
                          <Badge variant="outline" className="text-xs">
                            {sensor.connectivity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Architecture */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>System Architecture & Data Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gradient-glow border border-primary/20 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Waves className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">1. Data Collection</h4>
              <p className="text-xs text-muted-foreground">
                Sensors collect real-time data on fill level, temperature, humidity, and weight
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <Wifi className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">2. IoT Transmission</h4>
              <p className="text-xs text-muted-foreground">
                ESP32 module transmits data via WiFi to cloud server every 30 seconds
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 text-center">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-semibold mb-2">3. AI Processing</h4>
              <p className="text-xs text-muted-foreground">
                Machine learning models analyze data and predict optimal collection times
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 text-center">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-3">
                <Thermometer className="h-6 w-6 text-warning" />
              </div>
              <h4 className="font-semibold mb-2">4. Dashboard Display</h4>
              <p className="text-xs text-muted-foreground">
                Real-time visualization on web dashboard with alerts and analytics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
