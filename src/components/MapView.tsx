import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Map, 
  MapPin, 
  Navigation, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Truck,
  Clock,
  Fuel,
  Route,
  Target,
  Layers
} from "lucide-react";

interface BinLocation {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  lastUpdate: string;
  prediction: {
    timeToFull: string;
    priority: number;
  };
  type: 'general' | 'recycling' | 'compost' | 'hazardous';
}

interface RouteSegment {
  binId: string;
  estimatedTime: string;
  distance: string;
  co2Saved: string;
}

export const MapView = () => {
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'hybrid'>('street');
  const [showRoute, setShowRoute] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0);

  // Mock bin data
  const bins: BinLocation[] = [
    {
      id: 'BIN001',
      lat: 40.7128,
      lng: -74.0060,
      fillLevel: 85,
      status: 'warning',
      lastUpdate: '2 min ago',
      prediction: { timeToFull: '2h 30m', priority: 8 },
      type: 'general'
    },
    {
      id: 'BIN002', 
      lat: 40.7580,
      lng: -73.9855,
      fillLevel: 95,
      status: 'critical',
      lastUpdate: '1 min ago',
      prediction: { timeToFull: '45m', priority: 10 },
      type: 'recycling'
    },
    {
      id: 'BIN003',
      lat: 40.7505,
      lng: -73.9934,
      fillLevel: 45,
      status: 'normal',
      lastUpdate: '5 min ago', 
      prediction: { timeToFull: '8h 15m', priority: 3 },
      type: 'compost'
    },
    {
      id: 'BIN004',
      lat: 40.7282,
      lng: -73.7949,
      fillLevel: 78,
      status: 'normal',
      lastUpdate: '3 min ago',
      prediction: { timeToFull: '4h 20m', priority: 6 },
      type: 'general'
    },
    {
      id: 'BIN005',
      lat: 40.6892,
      lng: -74.0445,
      fillLevel: 12,
      status: 'offline',
      lastUpdate: '2h ago',
      prediction: { timeToFull: 'Unknown', priority: 1 },
      type: 'hazardous'
    }
  ];

  const optimizedRoute: RouteSegment[] = [
    { binId: 'BIN002', estimatedTime: '8:30 AM', distance: '0.8 km', co2Saved: '2.1 kg' },
    { binId: 'BIN001', estimatedTime: '9:15 AM', distance: '1.2 km', co2Saved: '1.8 kg' },
    { binId: 'BIN004', estimatedTime: '10:00 AM', distance: '2.1 km', co2Saved: '3.2 kg' },
    { binId: 'BIN003', estimatedTime: '10:45 AM', distance: '1.5 km', co2Saved: '2.7 kg' }
  ];

  useEffect(() => {
    if (showRoute) {
      const interval = setInterval(() => {
        setRouteProgress(prev => (prev + 1) % 101);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showRoute]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive border-destructive';
      case 'warning': return 'bg-warning border-warning';
      case 'normal': return 'bg-success border-success';
      case 'offline': return 'bg-muted border-muted';
      default: return 'bg-secondary border-secondary';
    }
  };

  const getBinTypeIcon = (type: string) => {
    switch (type) {
      case 'recycling': return '♻️';
      case 'compost': return '🌱';
      case 'hazardous': return '⚠️';
      default: return '🗑️';
    }
  };

  const getBinTypeColor = (type: string) => {
    switch (type) {
      case 'recycling': return 'text-iot-blue';
      case 'compost': return 'text-success';
      case 'hazardous': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Bin Map</h2>
          <p className="text-muted-foreground">Real-time bin monitoring and route optimization</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showRoute ? "default" : "outline"}
            onClick={() => setShowRoute(!showRoute)}
            size="sm"
          >
            <Route className="h-4 w-4 mr-2" />
            {showRoute ? 'Hide Route' : 'Show Route'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setMapView(mapView === 'street' ? 'satellite' : 'street')}
            size="sm"
          >
            <Layers className="h-4 w-4 mr-2" />
            {mapView}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Live Bin Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
              {/* Map Container */}
              <div className="absolute inset-0">
                {/* Street/Grid overlay */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Bin Markers */}
                {bins.map((bin, index) => (
                  <div
                    key={bin.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                      selectedBin?.id === bin.id ? 'z-20 scale-125' : 'z-10'
                    }`}
                    style={{
                      left: `${20 + (index * 15) + (index % 2 * 10)}%`,
                      top: `${25 + (index * 12) + (index % 3 * 8)}%`
                    }}
                    onClick={() => setSelectedBin(bin)}
                  >
                    {/* Bin Marker */}
                    <div className={`relative p-3 rounded-full border-2 ${getStatusColor(bin.status)} backdrop-blur-sm animate-pulse-glow`}>
                      <MapPin className="h-6 w-6 text-white" />
                      
                      {/* Fill Level Indicator */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-current flex items-center justify-center">
                        <span className="text-xs font-bold">{bin.fillLevel}%</span>
                      </div>
                      
                      {/* Bin Type Icon */}
                      <div className="absolute -bottom-1 -left-1 text-lg">
                        {getBinTypeIcon(bin.type)}
                      </div>
                    </div>

                    {/* Status Pulse for Critical Bins */}
                    {bin.status === 'critical' && (
                      <div className="absolute inset-0 rounded-full border-2 border-destructive animate-ping opacity-30" />
                    )}
                  </div>
                ))}

                {/* Optimized Route Path */}
                {showRoute && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 20% 25% Q 35% 37% 50% 49% T 80% 85%"
                        stroke="url(#routeGradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="10,5"
                        className="animate-data-flow"
                      />
                    </svg>
                    
                    {/* Moving Truck Icon */}
                    <div 
                      className="absolute transition-all duration-1000 ease-linear"
                      style={{
                        left: `${20 + (routeProgress * 0.6)}%`,
                        top: `${25 + (routeProgress * 0.6)}%`
                      }}
                    >
                      <div className="p-2 bg-primary rounded-full shadow-glow">
                        <Truck className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="sm" variant="secondary" className="p-2">
                    <Target className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="p-2">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span>Normal (&lt;70%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-warning rounded-full" />
                <span>Warning (70-90%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <span>Critical (&gt;90%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-muted rounded-full" />
                <span>Offline</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bin Details & Route Info */}
        <div className="space-y-6">
          {/* Selected Bin Details */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {selectedBin ? 'Bin Details' : 'Select a Bin'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBin ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{selectedBin.id}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`${getBinTypeColor(selectedBin.type)} border-current/30 bg-current/10`}
                        >
                          {getBinTypeIcon(selectedBin.type)} {selectedBin.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={selectedBin.status === 'critical' ? 'border-destructive text-destructive' : 
                                   selectedBin.status === 'warning' ? 'border-warning text-warning' : 
                                   'border-success text-success'}
                        >
                          {selectedBin.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{selectedBin.fillLevel}%</div>
                      <div className="text-xs text-muted-foreground">Fill Level</div>
                    </div>
                  </div>

                  <Progress value={selectedBin.fillLevel} className="h-3" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Last Update</div>
                      <div className="font-medium">{selectedBin.lastUpdate}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Priority</div>
                      <div className="font-medium">{selectedBin.prediction.priority}/10</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Predicted Full</div>
                      <div className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedBin.prediction.timeToFull}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/30">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Coordinates: {selectedBin.lat.toFixed(4)}, {selectedBin.lng.toFixed(4)}</div>
                      <div>Sensor Status: {selectedBin.status !== 'offline' ? 'Online' : 'Offline'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click on a bin marker to view details</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Optimized Route */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                Today's Optimized Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Route Summary */}
                <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gradient-glow border border-primary/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">4 Stops</div>
                    <div className="text-xs text-muted-foreground">Total Bins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success">9.8 kg</div>
                    <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                  </div>
                </div>

                {/* Route Progress */}
                {showRoute && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Route Progress</span>
                      <span>{routeProgress}%</span>
                    </div>
                    <Progress value={routeProgress} className="h-2" />
                  </div>
                )}

                {/* Route Steps */}
                <div className="space-y-3">
                  {optimizedRoute.map((segment, index) => (
                    <div key={segment.binId} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          showRoute && routeProgress > index * 25 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{segment.binId}</div>
                        <div className="text-xs text-muted-foreground">
                          ETA: {segment.estimatedTime} • {segment.distance}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-success">
                          <Fuel className="h-3 w-3" />
                          <span className="text-xs">{segment.co2Saved}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Start Route
                  </Button>
                  <Button size="sm" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Recalculate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};