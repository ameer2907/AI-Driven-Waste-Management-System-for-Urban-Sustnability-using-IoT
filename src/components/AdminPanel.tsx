import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Brain, 
  Database, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCcw,
  Download,
  Upload,
  Eye,
  Users,
  Clock,
  Activity,
  BarChart3,
  Shield,
  Zap,
  HardDrive
} from "lucide-react";

interface ModelVersion {
  id: string;
  version: string;
  accuracy: number;
  status: 'active' | 'testing' | 'deprecated';
  deployedAt: string;
  trainingData: number;
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

interface TrainingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  progress: number;
  dataPoints: number;
  corrections: number;
  estimatedCompletion?: string;
}

export const AdminPanel = () => {
  const [autoRetrain, setAutoRetrain] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState<string>('v2.1.3');

  // Mock data
  const modelVersions: ModelVersion[] = [
    {
      id: 'model_1',
      version: 'v2.1.3',
      accuracy: 87.2,
      status: 'active',
      deployedAt: '2024-01-15',
      trainingData: 45000,
      performance: { precision: 0.89, recall: 0.85, f1Score: 0.87 }
    },
    {
      id: 'model_2', 
      version: 'v2.1.2',
      accuracy: 84.1,
      status: 'deprecated',
      deployedAt: '2023-12-20',
      trainingData: 38000,
      performance: { precision: 0.86, recall: 0.82, f1Score: 0.84 }
    },
    {
      id: 'model_3',
      version: 'v2.2.0-beta',
      accuracy: 89.5,
      status: 'testing',
      deployedAt: '2024-01-20',
      trainingData: 52000,
      performance: { precision: 0.91, recall: 0.88, f1Score: 0.89 }
    }
  ];

  const trainingJobs: TrainingJob[] = [
    {
      id: 'job_1',
      status: 'running',
      startTime: '2024-01-20 14:30',
      progress: 65,
      dataPoints: 1200,
      corrections: 340,
      estimatedCompletion: '2h 15m'
    },
    {
      id: 'job_2',
      status: 'completed',
      startTime: '2024-01-19 09:00',
      progress: 100,
      dataPoints: 850,
      corrections: 290
    },
    {
      id: 'job_3',
      status: 'pending',
      startTime: 'Scheduled',
      progress: 0,
      dataPoints: 450,
      corrections: 180
    }
  ];

  const systemMetrics = {
    totalPredictions: 125643,
    accuracyTrend: '+2.3%',
    userCorrections: 3287,
    modelUptime: '99.97%',
    avgResponseTime: 247,
    errorRate: '0.12%'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'testing': return 'bg-iot-blue text-white';
      case 'deprecated': return 'bg-muted text-muted-foreground';
      case 'running': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleModelSwitch = (modelId: string) => {
    setSelectedModel(modelId);
    // In a real app, this would trigger a model deployment
  };

  const triggerRetraining = () => {
    // In a real app, this would start a new training job
    console.log('Triggering model retraining...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Model Administration</h2>
          <p className="text-muted-foreground">Manage ML models, training, and system performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={triggerRetraining} className="bg-gradient-primary">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Trigger Retraining
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Predictions', value: systemMetrics.totalPredictions.toLocaleString(), change: '+1.2k today', icon: Brain, color: 'text-primary' },
          { label: 'Accuracy', value: '87.2%', change: systemMetrics.accuracyTrend, icon: TrendingUp, color: 'text-success' },
          { label: 'Corrections', value: systemMetrics.userCorrections.toLocaleString(), change: '+45 today', icon: Users, color: 'text-iot-blue' },
          { label: 'Uptime', value: systemMetrics.modelUptime, change: '30 days', icon: Shield, color: 'text-success' },
          { label: 'Response', value: `${systemMetrics.avgResponseTime}ms`, change: '-12ms', icon: Zap, color: 'text-warning' },
          { label: 'Error Rate', value: systemMetrics.errorRate, change: '-0.03%', icon: AlertTriangle, color: 'text-destructive' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className="text-lg font-bold">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                <div className="text-xs text-success mt-1">{metric.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">Model Versions</TabsTrigger>
          <TabsTrigger value="training">Training Jobs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Model Versions & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelVersions.map((model) => (
                  <div key={model.id} className="p-4 rounded-lg border border-border/30 bg-secondary/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold">{model.version}</h3>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{model.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Deployed</div>
                        <div className="font-medium">{model.deployedAt}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Training Data</div>
                        <div className="font-medium">{model.trainingData.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Precision</div>
                        <div className="font-medium">{(model.performance.precision * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Recall</div>
                        <div className="font-medium">{(model.performance.recall * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">F1 Score</div>
                        <div className="font-medium">{(model.performance.f1Score * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {model.status !== 'active' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleModelSwitch(model.id)}
                          className="bg-gradient-primary"
                        >
                          Deploy Model
                        </Button>
                      )}
                      {model.status === 'active' && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                          Currently Active
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Active Training Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-lg border border-border/30 bg-secondary/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Training Job #{job.id.split('_')[1]}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{job.progress}%</div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                    </div>

                    {job.status === 'running' && (
                      <Progress value={job.progress} className="mb-3" />
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Started</div>
                        <div className="font-medium">{job.startTime}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Data Points</div>
                        <div className="font-medium">{job.dataPoints.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">User Corrections</div>
                        <div className="font-medium">{job.corrections}</div>
                      </div>
                      {job.estimatedCompletion && (
                        <div>
                          <div className="text-muted-foreground">ETA</div>
                          <div className="font-medium">{job.estimatedCompletion}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {job.status === 'running' && (
                        <>
                          <Button size="sm" variant="outline" className="border-destructive text-destructive">
                            Stop Job
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Logs
                          </Button>
                        </>
                      )}
                      {job.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download Model
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Model Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-Retraining</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically retrain model when sufficient corrections are collected
                      </div>
                    </div>
                    <Switch checked={autoRetrain} onCheckedChange={setAutoRetrain} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Confidence Threshold</span>
                      <span className="text-sm text-muted-foreground">{(confidenceThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Predictions below this confidence will be flagged for manual review
                    </div>
                    <Progress value={confidenceThreshold * 100} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/30">
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Training Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Model Config
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">GPU Usage</span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Memory</span>
                      <span className="text-sm text-muted-foreground">12.4/16 GB</span>
                    </div>
                    <Progress value={77.5} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Storage</span>
                      <span className="text-sm text-muted-foreground">245/500 GB</span>
                    </div>
                    <Progress value={49} className="h-2" />
                  </div>
                </div>

                <div className="pt-3 border-t border-border/30">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">4</div>
                      <div className="text-xs text-muted-foreground">Active Models</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-success">99.7%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Classification Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Recyclable', count: 45234, percent: 42, color: 'bg-success' },
                      { label: 'Biodegradable', count: 28901, percent: 27, color: 'bg-iot-blue' },
                      { label: 'Non-recyclable', count: 21456, percent: 20, color: 'bg-warning' },
                      { label: 'Hazardous', count: 11780, percent: 11, color: 'bg-destructive' }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.count.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{item.percent}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Accuracy by Category</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Plastic', accuracy: 92.1 },
                      { label: 'Paper', accuracy: 88.7 },
                      { label: 'Organic', accuracy: 85.3 },
                      { label: 'Electronics', accuracy: 91.8 },
                      { label: 'Glass', accuracy: 94.2 }
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{item.label}</span>
                          <span className="text-sm font-medium">{item.accuracy}%</span>
                        </div>
                        <Progress value={item.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">User Feedback</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-success/10 border border-success/30">
                      <div className="text-lg font-bold text-success">89.4%</div>
                      <div className="text-xs text-muted-foreground">Correct Classifications</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <div className="text-lg font-bold text-destructive">10.6%</div>
                      <div className="text-xs text-muted-foreground">User Corrections</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Recent Improvements</div>
                    <div className="text-xs space-y-1">
                      <div>• Plastic bottle detection +4.2%</div>
                      <div>• Food waste classification +2.8%</div>
                      <div>• Mixed material handling +3.1%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};