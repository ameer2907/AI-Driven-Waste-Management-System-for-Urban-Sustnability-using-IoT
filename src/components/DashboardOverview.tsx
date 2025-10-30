import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bin3DViewer } from "@/components/Bin3DViewer";
import { 
  Trash2, 
  TrendingUp, 
  MapPin, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Activity,
  BarChart3
} from "lucide-react";

export const DashboardOverview = () => {
  const stats = [
    {
      title: "Total Smart Bins",
      value: "127",
      change: "+12",
      changeType: "increase",
      icon: Trash2,
      color: "text-primary"
    },
    {
      title: "Collection Efficiency",
      value: "87%",
      change: "+5%",
      changeType: "increase", 
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Fuel Savings",
      value: "34%",
      change: "+8%",
      changeType: "increase",
      icon: Fuel,
      color: "text-iot-blue"
    },
    {
      title: "Avg Fill Level",
      value: "68%",
      change: "-2%",
      changeType: "decrease",
      icon: Zap,
      color: "text-warning"
    }
  ];

  const alerts = [
    { id: 1, type: "critical", message: "Bin #A23 - Overflow detected", time: "2 min ago", location: "Central Park" },
    { id: 2, type: "warning", message: "Bin #B15 - 95% full", time: "15 min ago", location: "Main Street" },
    { id: 3, type: "info", message: "Route optimization completed", time: "1h ago", location: "District 3" },
  ];

  const recentCollections = [
    { id: 1, binId: "A45", location: "Park Avenue", fillLevel: 78, predictedFull: "2h", status: "scheduled" },
    { id: 2, binId: "B23", location: "City Center", fillLevel: 92, predictedFull: "30min", status: "priority" },
    { id: 3, binId: "C67", location: "University St", fillLevel: 45, predictedFull: "6h", status: "normal" },
    { id: 4, binId: "D12", location: "Market Square", fillLevel: 89, predictedFull: "1h", status: "scheduled" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                       <span className={`text-sm ${stat.changeType === 'increase' ? 'text-success' : 'text-warning'}`}>
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground text-sm ml-1">vs last week</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-glow ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3D Bin Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Bin3DViewer 
          fillLevel={85} 
          status="warning"
          temperature={24}
          humidity={67}
        />

        {/* System Performance Chart */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              System Performance (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Collection Efficiency Over Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Collection Efficiency</span>
                  <span className="text-sm text-success">+12% vs yesterday</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-1">
                  {[65, 72, 68, 78, 82, 75, 87, 84, 91, 85, 89, 87].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-primary-glow rounded-t transition-all duration-500 hover:opacity-80"
                        style={{ height: `${value}%` }}
                      />
                      {index % 3 === 0 && (
                        <span className="text-xs text-muted-foreground">{index * 2}h</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Waste Type Distribution */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Waste Type Distribution</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Recyclable</span>
                      <span className="text-xs font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2 bg-secondary/30" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Organic</span>
                      <span className="text-xs font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2 bg-secondary/30" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">General</span>
                      <span className="text-xs font-medium">22%</span>
                    </div>
                    <Progress value={22} className="h-2 bg-secondary/30" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Hazardous</span>
                      <span className="text-xs font-medium">8%</span>
                    </div>
                    <Progress value={8} className="h-2 bg-secondary/30" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Alerts */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Real-time Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'critical' ? 'bg-destructive animate-pulse-glow' :
                  alert.type === 'warning' ? 'bg-warning' : 'bg-iot-blue'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Collection Schedule */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Smart Collection Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCollections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-mono font-bold text-primary">{collection.binId}</div>
                    <div className="text-xs text-muted-foreground">{collection.location}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{collection.fillLevel}% Full</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          collection.status === 'priority' ? 'border-destructive text-destructive' :
                          collection.status === 'scheduled' ? 'border-warning text-warning' :
                          'border-success text-success'
                        }`}
                      >
                        {collection.status}
                      </Badge>
                    </div>
                    <Progress value={collection.fillLevel} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Predicted full in: {collection.predictedFull}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};