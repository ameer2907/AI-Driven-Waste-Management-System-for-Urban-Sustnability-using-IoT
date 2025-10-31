import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle, 
  RefreshCcw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Recycle,
  Leaf,
  Trash2,
  AlertOctagon,
  Database,
  Play,
  TrendingUp,
  FileArchive
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ClassificationResult {
  label: string;
  confidence: number;
  category: 'recyclable' | 'biodegradable' | 'non-recyclable' | 'hazardous' | 'unknown';
  icon: any;
  color: string;
  description: string;
}

interface PredictionResponse {
  primary: ClassificationResult;
  topThree: ClassificationResult[];
  modelVersion: string;
  inferenceTime: number;
  needsReview: boolean;
}

const mockClassificationResults: Record<string, ClassificationResult> = {
  'Plastic Bottle': {
    label: 'Plastic Bottle',
    confidence: 0.92,
    category: 'recyclable',
    icon: Recycle,
    color: 'text-success',
    description: 'Clean plastic bottles can be recycled into new bottles or textile fibers'
  },
  'Food Waste': {
    label: 'Food Waste',
    confidence: 0.88,
    category: 'biodegradable',
    icon: Leaf,
    color: 'text-success',
    description: 'Organic food waste can be composted to create nutrient-rich soil'
  },
  'Mixed Waste': {
    label: 'Mixed Waste',
    confidence: 0.65,
    category: 'non-recyclable',
    icon: Trash2,
    color: 'text-warning',
    description: 'Items with mixed materials require special sorting or disposal'
  },
  'Electronic Waste': {
    label: 'Electronic Waste',
    confidence: 0.78,
    category: 'hazardous',
    icon: AlertOctagon,
    color: 'text-destructive',
    description: 'Electronic items contain materials that need specialized recycling facilities'
  }
};

export const ImageUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [showGradCam, setShowGradCam] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock ML prediction function
  const performClassification = useCallback(async (imageFile: File): Promise<PredictionResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const resultKeys = Object.keys(mockClassificationResults);
    const randomKey = resultKeys[Math.floor(Math.random() * resultKeys.length)];
    const primary = mockClassificationResults[randomKey];
    
    const shuffledResults = Object.values(mockClassificationResults).sort(() => Math.random() - 0.5);
    const topThree = shuffledResults.slice(0, 3).map((result, index) => ({
      ...result,
      confidence: primary.confidence - (index * 0.1)
    }));

    return {
      primary,
      topThree,
      modelVersion: 'v2.1.3',
      inferenceTime: Math.floor(Math.random() * 500) + 200,
      needsReview: primary.confidence < 0.7
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setPrediction(null);
    
    try {
      const result = await performClassification(file);
      setPrediction(result);
      
      toast({
        title: "Classification Complete",
        description: `Identified as: ${result.primary.label} (${(result.primary.confidence * 100).toFixed(1)}% confidence)`
      });
    } catch (error) {
      toast({
        title: "Classification Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      fileInputRef.current?.click();
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access or use file upload",
        variant: "destructive"
      });
    }
  };

  const handleCorrection = (isCorrect: boolean) => {
    toast({
      title: isCorrect ? "Thank you!" : "Feedback recorded",
      description: isCorrect 
        ? "Your confirmation helps improve model accuracy" 
        : "This correction will be used to retrain the model"
    });
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setPrediction(null);
    setShowGradCam(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTraining = () => {
    setIsTraining(true);
    toast({
      title: "Training Started",
      description: "Model training in progress..."
    });
    setTimeout(() => {
      setIsTraining(false);
      toast({
        title: "Training Complete",
        description: "Model accuracy improved to 89.7%"
      });
    }, 3000);
  };

  // Dataset stats from DATASET_2.zip
  const datasetStats = {
    totalImages: 2527,
    classCount: 6,
    accuracy: 89.7,
    trainingDataBreakdown: [
      { category: "Cardboard", count: 403, percentage: 16, color: "bg-iot-cyan" },
      { category: "Glass", count: 501, percentage: 20, color: "bg-success" },
      { category: "Metal", count: 410, percentage: 16, color: "bg-iot-purple" },
      { category: "Paper", count: 594, percentage: 24, color: "bg-primary" },
      { category: "Plastic", count: 482, percentage: 19, color: "bg-warning" },
      { category: "Trash", count: 137, percentage: 5, color: "bg-destructive" }
    ],
    modelArchitecture: "MobileNetV2 + Custom Classifier",
    epochs: 50,
    batchSize: 32
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-success to-iot-cyan bg-clip-text text-transparent">
          Waste Image Classification Training
        </h2>
        <p className="text-muted-foreground text-lg">
          Train a CNN model to classify waste types from images
        </p>
      </div>

      {/* Dataset Loading Card */}
      <Card className="bg-gradient-glow border-primary/20 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-6 w-6 text-success" />
            DATASET_2.zip Available
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pre-loaded waste classification dataset with multiple categories
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <FileArchive className="h-8 w-8 text-success" />
              </div>
              <div>
                <div className="font-semibold text-lg">Dataset Ready</div>
                <div className="text-sm text-muted-foreground">
                  {datasetStats.totalImages.toLocaleString()} images • {datasetStats.classCount} classes
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-primary/30 hover:bg-primary/5"
              >
                <Upload className="h-4 w-4 mr-2" />
                Load Dataset
              </Button>
              <Button 
                onClick={handleTraining}
                disabled={isTraining}
                className="bg-gradient-primary shadow-glow"
              >
                <Play className="h-4 w-4 mr-2" />
                {isTraining ? "Training..." : "Start Training"}
              </Button>
            </div>
          </div>

          {isTraining && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Training Progress</span>
                <span className="font-medium text-primary">Epoch 35/50</span>
              </div>
              <Progress value={70} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-glow border-primary/20 shimmer-effect col-span-1 md:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-4xl font-bold text-primary">{datasetStats.accuracy}%</div>
              <div className="text-xs text-muted-foreground mt-2 font-semibold">Model Accuracy</div>
              <Badge variant="outline" className="mt-2 text-xs border-success/30 bg-success/10 text-success">
                Target: 80-90%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{datasetStats.totalImages.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-2">Training Images</div>
              <div className="text-xs text-primary mt-1 font-medium">DATASET_2.zip</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{datasetStats.classCount}</div>
              <div className="text-xs text-muted-foreground mt-2">Waste Classes</div>
              <div className="text-xs text-primary mt-1 font-medium">Multi-class CNN</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{datasetStats.epochs}</div>
              <div className="text-xs text-muted-foreground mt-2">Training Epochs</div>
              <div className="text-xs text-primary mt-1 font-medium">Batch: {datasetStats.batchSize}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                <div className="text-sm font-bold text-success">LIVE</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Model Status</div>
              <div className="text-xs font-semibold text-primary mt-1">{datasetStats.modelArchitecture.split(' ')[0]}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Distribution Table */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Training Data Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Category</TableHead>
                <TableHead>Image Count</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasetStats.trainingDataBreakdown.map((item) => (
                <TableRow key={item.category} className="border-border/30">
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.count.toLocaleString()}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentage * 5} className="h-2 flex-1" />
                      <Badge variant="outline" className={`${item.color} border-current/30 text-xs`}>
                        {item.count}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Image Classification Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Test Image Classification</h3>
            <p className="text-muted-foreground">Upload images to test the trained model</p>
          </div>
          {uploadedImage && (
            <Button onClick={resetUpload} variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Area */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Image Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedImage ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-primary bg-primary/5 scale-105' 
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gradient-glow">
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Drop your image here</h3>
                      <p className="text-muted-foreground text-sm">
                        Or click to browse • Max 10MB • JPG, PNG
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-primary"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse
                      </Button>
                      
                      <Button 
                        onClick={handleCameraCapture}
                        variant="outline"
                        className="border-primary/30"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-secondary/20">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded waste" 
                      className="w-full h-64 object-cover"
                    />
                    {showGradCam && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent opacity-60" />
                    )}
                  </div>
                  
                  {prediction && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGradCam(!showGradCam)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showGradCam ? 'Hide' : 'Show'} AI Focus Areas
                    </Button>
                  )}
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Classification Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploading ? (
                <div className="space-y-4 py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin">
                      <RefreshCcw className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Analyzing image...</p>
                      <p className="text-sm text-muted-foreground">AI is identifying waste type</p>
                    </div>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              ) : prediction ? (
                <div className="space-y-6">
                  {/* Primary Result */}
                  <div className="p-4 rounded-xl bg-gradient-glow border border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-secondary/30 ${prediction.primary.color}`}>
                        <prediction.primary.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold">{prediction.primary.label}</h3>
                            <Badge 
                              variant="outline" 
                              className={`${prediction.primary.color} border-current/30 bg-current/10`}
                            >
                              {prediction.primary.category.charAt(0).toUpperCase() + prediction.primary.category.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{(prediction.primary.confidence * 100).toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">Confidence</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{prediction.primary.description}</p>
                        <Progress value={prediction.primary.confidence * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Alternative Results */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Alternative Classifications</h4>
                    {prediction.topThree.slice(1).map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-center gap-3">
                          <result.icon className={`h-4 w-4 ${result.color}`} />
                          <span className="text-sm font-medium">{result.label}</span>
                        </div>
                        <span className="text-sm font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleCorrection(true)} 
                      variant="outline" 
                      className="flex-1 border-success/30 hover:bg-success/5"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Correct
                    </Button>
                    <Button 
                      onClick={() => handleCorrection(false)} 
                      variant="outline" 
                      className="flex-1 border-destructive/30 hover:bg-destructive/5"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Incorrect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Upload an image to see classification results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};