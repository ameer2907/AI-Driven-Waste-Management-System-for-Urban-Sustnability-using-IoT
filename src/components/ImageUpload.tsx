import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCcw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Info,
  Recycle,
  Leaf,
  Trash2,
  AlertOctagon
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
  gradCamUrl: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock ML prediction function
  const performClassification = useCallback(async (imageFile: File): Promise<PredictionResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock classification based on filename or random selection
    const resultKeys = Object.keys(mockClassificationResults);
    const randomKey = resultKeys[Math.floor(Math.random() * resultKeys.length)];
    const primary = mockClassificationResults[randomKey];
    
    // Generate top 3 results
    const shuffledResults = Object.values(mockClassificationResults).sort(() => Math.random() - 0.5);
    const topThree = shuffledResults.slice(0, 3).map((result, index) => ({
      ...result,
      confidence: primary.confidence - (index * 0.1)
    }));

    return {
      primary,
      topThree,
      gradCamUrl: '/placeholder-gradcam.jpg', // Mock Grad-CAM image
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

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Perform classification
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
        description: "Please try again or contact support if the issue persists",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // For now, just trigger file input - in a real app, you'd implement camera capture
      fileInputRef.current?.click();
      
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access or use the file upload option",
        variant: "destructive"
      });
    }
  };

  const handleCorrection = (isCorrect: boolean) => {
    toast({
      title: isCorrect ? "Thank you for confirming!" : "Feedback recorded",
      description: isCorrect 
        ? "Your confirmation helps improve our model accuracy" 
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Waste Classification</h2>
          <p className="text-muted-foreground">Upload images to identify waste type and disposal method</p>
        </div>
        {uploadedImage && (
          <Button onClick={resetUpload} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Upload New Image
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
                      Or click to browse files • Max 10MB • JPG, PNG supported
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    
                    <Button 
                      onClick={handleCameraCapture}
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/5"
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
                    alt="Uploaded waste item" 
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
                    <p className="text-sm text-muted-foreground">Our AI is identifying the waste type</p>
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

                {/* Top 3 Results */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Alternative Classifications
                  </h4>
                  <div className="space-y-2">
                    {prediction.topThree.map((result, index) => {
                      const Icon = result.icon;
                      return (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 ${result.color}`} />
                            <span className="font-medium">{result.label}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Feedback */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Was this classification correct?</h4>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleCorrection(true)}
                      variant="outline"
                      className="flex-1 border-success/30 hover:bg-success/10 text-success"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Correct
                    </Button>
                    <Button
                      onClick={() => handleCorrection(false)}
                      variant="outline"
                      className="flex-1 border-destructive/30 hover:bg-destructive/10 text-destructive"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Incorrect
                    </Button>
                  </div>
                </div>

                {/* Technical Details */}
                {prediction.needsReview && (
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="font-medium text-warning">Manual Review Recommended</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Low confidence score - this classification will be reviewed by our team
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Model: {prediction.modelVersion}</div>
                  <div>Processing time: {prediction.inferenceTime}ms</div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload an image to see AI classification results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};