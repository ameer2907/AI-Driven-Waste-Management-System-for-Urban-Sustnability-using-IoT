import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Route, 
  Navigation, 
  Clock, 
  Fuel, 
  MapPin, 
  Truck,
  Play,
  RotateCcw,
  TrendingUp
} from "lucide-react";

export const RouteOptimization = () => {
  const [activeRoute, setActiveRoute] = useState("optimal");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const routes = [
    {
      id: "optimal",
      name: "AI Optimized Route",
      distance: "47.2 km",
      duration: "3h 24min",
      fuelSaving: "28%",
      bins: 23,
      efficiency: 94,
      stops: [
        { id: "A001", location: "Central Park", fillLevel: 85, priority: "high" },
        { id: "A002", location: "Times Square", fillLevel: 95, priority: "critical" },
        { id: "B003", location: "Brooklyn Bridge", fillLevel: 45, priority: "low" },
        { id: "C004", location: "Washington Square", fillLevel: 73, priority: "medium" },
        { id: "D005", location: "High Line", fillLevel: 92, priority: "high" }
      ]
    },
    {
      id: "traditional",
      name: "Traditional Fixed Route",
      distance: "68.7 km",
      duration: "4h 52min", 
      fuelSaving: "0%",
      bins: 35,
      efficiency: 67,
      stops: []
    }
  ];

  const currentRoute = routes.find(r => r.id === activeRoute) || routes[0];

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "medium": return "bg-iot-blue text-white";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const stats = [
    {
      title: "Distance Saved",
      value: "21.5 km",
      improvement: "+31%",
      icon: Route,
      color: "text-success"
    },
    {
      title: "Time Saved",
      value: "1h 28min",
      improvement: "+30%",
      icon: Clock,
      color: "text-iot-blue"
    },
    {
      title: "Fuel Efficiency",
      value: "28%",
      improvement: "+28%",
      icon: Fuel,
      color: "text-primary"
    },
    {
      title: "Bins per Route",
      value: "23",
      improvement: "-34%",
      icon: MapPin,
      color: "text-iot-orange"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Route Optimization</h2>
          <p className="text-muted-foreground">AI-powered dynamic routing for maximum efficiency</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isOptimizing ? (
              <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isOptimizing ? "Optimizing..." : "Optimize Routes"}
          </Button>
        </div>
      </div>

      {/* Efficiency Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 text-success mr-1" />
                      <span className="text-sm text-success">{stat.improvement}</span>
                      <span className="text-muted-foreground text-sm ml-1">vs traditional</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-glow ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Comparison */}
        <Card className="lg:col-span-1 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Route Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {routes.map((route) => (
              <div 
                key={route.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  activeRoute === route.id 
                    ? 'border-primary bg-primary/5 shadow-glow' 
                    : 'border-border/50 hover:border-border'
                }`}
                onClick={() => setActiveRoute(route.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{route.name}</h4>
                  {route.id === "optimal" && (
                    <Badge className="bg-primary text-primary-foreground">
                      Recommended
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">{route.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{route.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className="font-medium">{route.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bins:</span>
                    <span className="font-medium">{route.bins}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Route Efficiency</span>
                    <span className="text-xs font-medium">{route.efficiency}%</span>
                  </div>
                  <Progress value={route.efficiency} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Route Details */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              {currentRoute.name} - Collection Sequence
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentRoute.id === "optimal" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    Optimized sequence based on fill levels and traffic patterns
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    5 Priority Stops
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {currentRoute.stops.map((stop, index) => (
                    <div 
                      key={stop.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border/30"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{stop.id}</p>
                            <p className="text-sm text-muted-foreground">{stop.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{stop.fillLevel}% Full</p>
                            <Badge 
                              className={`text-xs ${getPriorityColor(stop.priority)}`}
                            >
                              {stop.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress value={stop.fillLevel} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gradient-glow border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">Route Optimization Benefits</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Carbon Reduction:</span>
                      <span className="font-medium ml-2">2.3 tons CO₂</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost Savings:</span>
                      <span className="font-medium ml-2">$340/week</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Traditional Fixed Route</p>
                <p className="text-muted-foreground">
                  Sequential collection following predetermined paths regardless of bin status
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};