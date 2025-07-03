
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, Upload, AlertTriangle, Package, X, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  role: 'picker' | 'supervisor';
}

interface DamageReportProps {
  onBack: () => void;
  user: User;
  isOnline: boolean;
}

interface DamageReport {
  id: string;
  sku: string;
  itemName: string;
  damageType: string;
  description: string;
  photos: { url: string; name: string; blob?: Blob }[];
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

const DamageReport = ({ onBack, user, isOnline }: DamageReportProps) => {
  const [currentReport, setCurrentReport] = useState({
    sku: '',
    itemName: '',
    damageType: '',
    description: '',
    photos: [] as { url: string; name: string; blob?: Blob }[]
  });

  const [reports, setReports] = useState<DamageReport[]>([
    {
      id: 'DR001',
      sku: 'SKU-12345',
      itemName: 'HealthKart Whey Protein 1kg',
      damageType: 'packaging',
      description: 'Container has visible cracks on the side',
      photos: [{ url: '', name: 'photo1.jpg' }],
      timestamp: '10 min ago',
      status: 'pending'
    },
    {
      id: 'DR002',
      sku: 'SKU-67890',
      itemName: 'Multivitamin Tablets',
      damageType: 'expiry',
      description: 'Product expired 2 months ago',
      photos: [{ url: '', name: 'photo2.jpg' }, { url: '', name: 'photo3.jpg' }],
      timestamp: '1 hour ago',
      status: 'reviewed'
    }
  ]);

  const [showCamera, setShowCamera] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const damageTypes = [
    { id: 'packaging', label: 'Packaging Damage', icon: '📦' },
    { id: 'expiry', label: 'Expired Product', icon: '⏰' },
    { id: 'quality', label: 'Quality Issue', icon: '⚠️' },
    { id: 'wrong-item', label: 'Wrong Item', icon: '🔄' },
    { id: 'quantity', label: 'Quantity Mismatch', icon: '🔢' },
    { id: 'other', label: 'Other Issue', icon: '❓' }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
      
      toast({
        title: "Camera Started 📸",
        description: "Position the item and tap to capture photo.",
      });
    } catch (error) {
      console.error('Failed to start camera:', error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions or try uploading a file instead.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `damage_photo_${timestamp}.jpg`;
            
            const newPhoto = {
              url,
              name: filename,
              blob
            };
            
            setCurrentReport(prev => ({
              ...prev,
              photos: [...prev.photos, newPhoto]
            }));
            
            toast({
              title: "Photo Captured! 📸",
              description: `Photo saved as ${filename}`,
            });
            
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          const newPhoto = {
            url,
            name: file.name,
            blob: file
          };
          
          setCurrentReport(prev => ({
            ...prev,
            photos: [...prev.photos, newPhoto]
          }));
          
          toast({
            title: "Photo Uploaded! 📁",
            description: `${file.name} has been added to the report.`,
          });
        } else {
          toast({
            title: "Invalid File Type",
            description: "Please upload only image files (JPG, PNG, etc.)",
            variant: "destructive"
          });
        }
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const photo = currentReport.photos[index];
    if (photo.url) {
      URL.revokeObjectURL(photo.url);
    }
    
    setCurrentReport(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    
    toast({
      title: "Photo Removed",
      description: `${photo.name} has been removed from the report.`,
    });
  };

  const viewPhoto = (photo: { url: string; name: string }) => {
    setSelectedPhoto(photo);
  };

  const handleSubmitReport = () => {
    if (currentReport.sku && currentReport.damageType && currentReport.description) {
      const newReport: DamageReport = {
        id: `DR${String(reports.length + 1).padStart(3, '0')}`,
        ...currentReport,
        timestamp: 'Just now',
        status: 'pending'
      };
      setReports([newReport, ...reports]);
      
      // Reset form
      currentReport.photos.forEach(photo => {
        if (photo.url) {
          URL.revokeObjectURL(photo.url);
        }
      });
      
      setCurrentReport({
        sku: '',
        itemName: '',
        damageType: '',
        description: '',
        photos: []
      });
      
      toast({
        title: "Report Submitted Successfully! ✅",
        description: `Damage report ${newReport.id} has been created and will be reviewed by the supervisor.`,
      });
    } else {
      toast({
        title: "Incomplete Report",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Damage Reporting</h1>
              <p className="text-sm text-gray-600">Report damaged or incorrect items</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Report Form */}
          <Card className="shadow-lg border-2 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Report New Damage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Item Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                  <input
                    type="text"
                    value={currentReport.sku}
                    onChange={(e) => setCurrentReport({...currentReport, sku: e.target.value})}
                    placeholder="Enter SKU (e.g., SKU-12345)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={currentReport.itemName}
                    onChange={(e) => setCurrentReport({...currentReport, itemName: e.target.value})}
                    placeholder="Enter item name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Damage Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Damage Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {damageTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={currentReport.damageType === type.id ? "default" : "outline"}
                      onClick={() => setCurrentReport({...currentReport, damageType: type.id})}
                      className="justify-start text-sm h-12"
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={currentReport.description}
                  onChange={(e) => setCurrentReport({...currentReport, description: e.target.value})}
                  placeholder="Describe the damage or issue in detail..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Photo Capture Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                
                {/* Camera View */}
                {showCamera && (
                  <div className="mb-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-64 object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-red-500 rounded-lg"></div>
                      </div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <Button
                          onClick={capturePhoto}
                          className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16"
                        >
                          <Camera className="h-6 w-6" />
                        </Button>
                        <Button
                          onClick={stopCamera}
                          variant="destructive"
                          className="rounded-full w-16 h-16"
                        >
                          <X className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo Controls */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      onClick={startCamera}
                      disabled={showCamera}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-12"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      {showCamera ? 'Camera Active' : 'Open Camera'}
                    </Button>
                    
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex-1 h-12"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {/* Photo Preview Grid */}
                  {currentReport.photos.length > 0 && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Captured Photos:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {currentReport.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-20 object-cover rounded border cursor-pointer"
                              onClick={() => viewPhoto(photo)}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => viewPhoto(photo)}
                                className="h-6 w-6 p-0"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removePhoto(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">{photo.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReport}
                disabled={!currentReport.sku || !currentReport.damageType || !currentReport.description}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white h-12"
              >
                <Upload className="h-5 w-5 mr-2" />
                Submit Damage Report
              </Button>
            </CardContent>
          </Card>

          {/* Previous Reports */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{report.itemName}</h4>
                        <p className="text-sm text-gray-600">SKU: {report.sku}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500">{report.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                        {damageTypes.find(t => t.id === report.damageType)?.icon}
                        {damageTypes.find(t => t.id === report.damageType)?.label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{report.description}</p>
                    
                    {report.photos.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{report.photos.length} photo(s) attached</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Emergency Report</h4>
                <p className="text-sm text-red-700 mb-3">For hazardous or urgent issues</p>
                <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                  🚨 Emergency
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Batch Report</h4>
                <p className="text-sm text-blue-700 mb-3">Report multiple similar issues</p>
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                  📋 Batch Mode
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Quality Check</h4>
                <p className="text-sm text-green-700 mb-3">General quality inspection</p>
                <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                  ✅ Quality Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-w-full max-h-full object-contain rounded"
            />
            <Button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
            <p className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
              {selectedPhoto.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageReport;
