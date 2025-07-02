
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mic, MicOff, Volume2, Headphones } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'picker' | 'supervisor';
}

interface VoicePickingProps {
  onBack: () => void;
  user: User;
  isOnline: boolean;
}

const VoicePicking = ({ onBack, user, isOnline }: VoicePickingProps) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [currentItem, setCurrentItem] = useState({
    sku: 'SKU-12345',
    name: 'HealthKart Whey Protein 1kg',
    quantity: 2,
    location: 'A3-B2-01'
  });

  const voiceCommands = [
    { command: '"Next Item"', action: 'Move to next item in picklist' },
    { command: '"Picked"', action: 'Mark current item as picked' },
    { command: '"Not Found"', action: 'Report item not found' },
    { command: '"Repeat"', action: 'Repeat current item details' },
    { command: '"Help"', action: 'Get voice assistance' },
    { command: '"Complete"', action: 'Complete current picklist' }
  ];

  useEffect(() => {
    // Simulate speech recognition
    if (isListening) {
      const timer = setTimeout(() => {
        const commands = ['Next Item', 'Picked', 'Not Found', 'Repeat'];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        setLastCommand(randomCommand);
        setIsListening(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isListening]);

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Voice-Enabled Picking</h1>
              <p className="text-sm text-gray-600">Hands-free warehouse operations</p>
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
        {/* Voice Control Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Voice Control Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Toggle */}
              <div className="text-center">
                <Button
                  onClick={handleVoiceToggle}
                  className={`w-32 h-32 rounded-full text-white border-0 shadow-lg transition-all duration-200 ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                  }`}
                >
                  {isListening ? (
                    <div className="flex flex-col items-center">
                      <MicOff className="h-8 w-8" />
                      <span className="text-sm mt-2">Stop</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Mic className="h-8 w-8" />
                      <span className="text-sm mt-2">Start</span>
                    </div>
                  )}
                </Button>
                <p className="text-sm text-gray-600 mt-4">
                  {isListening ? 'Listening for commands...' : 'Tap to activate voice control'}
                </p>
              </div>

              {/* Last Command */}
              {lastCommand && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Last Command Recognized:</h4>
                  <p className="text-green-700 font-medium">"{lastCommand}"</p>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-blue-800">Voice Status</h4>
                  <p className="text-blue-600">{isListening ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-purple-800">Recognition</h4>
                  <p className="text-purple-600">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Item Display */}
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Current Item - Voice Guided
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{currentItem.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-100">SKU:</p>
                    <p className="font-semibold">{currentItem.sku}</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Quantity:</p>
                    <p className="font-semibold">{currentItem.quantity}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-blue-100">Location:</p>
                    <p className="font-semibold text-lg">{currentItem.location}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => speakText(`Pick ${currentItem.quantity} units of ${currentItem.name} from location ${currentItem.location}`)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Speak Item Details
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full">
                  ✅ Picked
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  ❌ Not Found
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voice Commands Reference */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Voice Commands Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voiceCommands.map((cmd, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">{cmd.command}</h4>
                  <p className="text-sm text-gray-600">{cmd.action}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Voice Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Speech Speed</h4>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">Slow</Button>
                  <Button size="sm" className="bg-purple-500 text-white">Normal</Button>
                  <Button size="sm" variant="outline">Fast</Button>
                </div>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Voice Feedback</h4>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-blue-500 text-white">Enabled</Button>
                  <Button size="sm" variant="outline">Disabled</Button>
                </div>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Language</h4>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-green-500 text-white">English</Button>
                  <Button size="sm" variant="outline">Hindi</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoicePicking;
