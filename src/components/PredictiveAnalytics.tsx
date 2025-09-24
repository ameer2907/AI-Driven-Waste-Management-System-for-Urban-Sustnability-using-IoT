import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Brain, 
  BarChart3, 
  Calendar, 
  Clock,
  Target,
  Zap,
  AlertTriangle
} from "lucide-react";

export const PredictiveAnalytics = () => {
  const predictions = [
    {
      id: "A001",
      location: "Central Park",
      currentFill: 67,
      predictedFull: "4h 23min",
      confidence: 94,
      trend: "increasing",
      factors: ["Weekend traffic", "Event nearby", "Weather sunny"]
    },
    {
      id: "A002", 
      location: "Times Square",
      currentFill: 89,
      predictedFull: "1h 12min", 
      confidence: 98,
      trend: "critical",
      factors: ["High foot traffic", "Tourist area", "Peak hours"]
    },
    {
      id: "B003",
      location: "Brooklyn Bridge",
      currentFill: 34,
      predictedFull: "12h 45min",
      confidence: 87,
      trend: "stable",
      factors: ["Low activity", "Weekday pattern", "Regular usage"]
    },
    {
      id: "C004",
      location: "Washington Square",
      currentFill: 78,
      predictedFull: "2h 56min",
      confidence: 91,
      trend: "accelerating",
      factors: ["University area", "Lunch peak", "Student activity"]
    }
  ];

  const mlModels = [
    {
      name: "LSTM Time Series",
      accuracy: "94.2%",
      purpose: "Fill level prediction",
      status: "active",
      lastTrained: "2 days ago"
    },
    {
      name: "Random Forest",
      accuracy: "89.7%", 
      purpose: "Route optimization",
      status: "active",
      lastTrained: "1 day ago"
    },
    {
      name: "ARIMA Seasonal",
      accuracy: "87.3%",
      purpose: "Demand forecasting", 
      status: "training",
      lastTrained: "6 hours ago"
    },
    {
      name: "Neural Network",
      accuracy: "92.1%",
      purpose: "Anomaly detection",
      status: "active", 
      lastTrained: "3 hours ago"
    }
  ];

  const weeklyPredictions = [
    { day: "Mon", predicted: 85, actual: 82, bins: 127 },
    { day: "Tue", predicted: 78, actual: 76, bins: 127 },
    { day: "Wed", predicted: 92, actual: 89, bins: 127 },
    { day: "Thu", predicted: 88, actual: 91, bins: 127 },
    { day: "Fri", predicted: 96, actual: 94, bins: 127 },
    { day: "Sat", predicted: 94, actual: null, bins: 127 },
    { day: "Sun", predicted: 87, actual: null, bins: 127 }
  ];

  const insights = [
    {
      title: "Peak Collection Hours",
      value: "2-4 PM",
      description: "Optimal time window for maximum efficiency",
      icon: Clock,
      color: "text-iot-blue"
    },
    {
      title: "Weekly Pattern",  
      value: "Friday +23%",
      description: "Highest waste generation day",
      icon: Calendar,
      color: "text-iot-orange"
    },
    {
      title: "Prediction Accuracy",
      value: "94.2%",
      description: "Average model performance",
      icon: Target,
      color: "text-success"
    },
    {
      title: "Early Warnings",
      value: "17 alerts",
      description: "Prevented overflow incidents this week",
      icon: AlertTriangle,
      color: "text-warning"
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "critical": return "text-destructive";
      case "accelerating": return "text-warning";
      case "increasing": return "text-iot-orange";
      case "stable": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "critical": return AlertTriangle;
      case "accelerating": return TrendingUp;
      case "increasing": return TrendingUp;
      case "stable": return Target;
      default: return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
          <p className="text-muted-foreground">AI-powered waste generation forecasting and insights</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary text-primary-foreground">
            <Brain className="h-4 w-4 mr-2" />
            Retrain Models
          </Button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{insight.title}</p>
                    <p className="text-2xl font-bold mt-1">{insight.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-glow ${insight.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Predictions */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Real-time Fill Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictions.map((prediction) => {
              const TrendIcon = getTrendIcon(prediction.trend);
              return (
                <div key={prediction.id} className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold font-mono">{prediction.id}</h4>
                      <p className="text-sm text-muted-foreground">{prediction.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${getTrendColor(prediction.trend)} border-current`}>
                        <TrendIcon className="h-3 w-3 mr-1" />
                        {prediction.trend}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Current Fill</span>
                        <span className="font-medium">{prediction.currentFill}%</span>
                      </div>
                      <Progress value={prediction.currentFill} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Predicted Full:</span>
                        <p className="font-medium">{prediction.predictedFull}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <p className="font-medium">{prediction.confidence}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground">Factors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prediction.factors.map((factor, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ML Models Status */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              ML Models Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mlModels.map((model, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{model.name}</h4>
                    <p className="text-sm text-muted-foreground">{model.purpose}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      model.status === "active" 
                        ? "border-success text-success bg-success/10" 
                        : "border-warning text-warning bg-warning/10"
                    }
                  >
                    {model.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <span className="font-medium">{model.accuracy}</span>
                    </div>
                    <Progress 
                      value={parseFloat(model.accuracy)} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Trained:</span>
                    <span className="font-medium">{model.lastTrained}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 rounded-lg bg-gradient-glow border border-primary/20">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Model Ensemble Performance</h4>
                <div className="text-3xl font-bold text-primary mb-1">92.8%</div>
                <p className="text-sm text-muted-foreground">
                  Combined accuracy using weighted ensemble approach
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Prediction Accuracy */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Weekly Prediction vs Actual Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weeklyPredictions.map((day, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-secondary/30">
                <div className="font-semibold mb-2">{day.day}</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Predicted</div>
                    <div className="font-medium text-primary">{day.predicted}%</div>
                  </div>
                  {day.actual && (
                    <div>
                      <div className="text-xs text-muted-foreground">Actual</div>
                      <div className="font-medium text-success">{day.actual}%</div>
                    </div>
                  )}
                  {!day.actual && (
                    <div className="text-xs text-muted-foreground italic">Pending</div>
                  )}
                </div>
                <div className="mt-2">
                  <Progress 
                    value={day.actual || day.predicted} 
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-gradient-glow">
              <div className="text-2xl font-bold text-primary">4.2%</div>
              <div className="text-sm text-muted-foreground">Avg Prediction Error</div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-glow">
              <div className="text-2xl font-bold text-success">87</div>
              <div className="text-sm text-muted-foreground">Overflow Prevented</div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-glow">
              <div className="text-2xl font-bold text-iot-blue">34%</div>
              <div className="text-sm text-muted-foreground">Route Efficiency Gain</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};