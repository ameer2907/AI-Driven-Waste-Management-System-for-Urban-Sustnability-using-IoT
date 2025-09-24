import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trash2, 
  TrendingUp, 
  MapPin, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel
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
                      <span className={`text-sm ${stat.changeType === 'increase' ? 'text-success' : 'text-iot-orange'}`}>
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