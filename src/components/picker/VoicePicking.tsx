
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mic, MicOff, Volume2, Headphones } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

// Define SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: any) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const VoicePicking = ({ onBack, user, isOnline }: VoicePickingProps) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [currentItem, setCurrentItem] = useState({
    sku: 'SKU-12345',
    name: 'HealthKart Whey Protein 1kg',
    quantity: 2,
    location: 'A3-B2-01'
  });
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const voiceCommands = [
    { command: '"Next Item"', action: 'Move to next item in picklist' },
    { command: '"Picked"', action: 'Mark current item as picked' },
    { command: '"Not Found"', action: 'Report item not found' },
    { command: '"Repeat"', action: 'Repeat current item details' },
    { command: '"Help"', action: 'Get voice assistance' },
    { command: '"Complete"', action: 'Complete current picklist' }
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          console.log('Voice recognition started');
          setIsListening(true);
        };

        recognitionRef.current.onend = () => {
          console.log('Voice recognition ended');
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Voice recognition error:', event);
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Failed to recognize speech. Please try again.",
            variant: "destructive"
          });
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);

          if (finalTranscript) {
            handleVoiceCommand(finalTranscript.toLowerCase().trim());
          }
        };
      }
    } else {
      console.log('Speech recognition not supported');
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    setLastCommand(command);

    if (command.includes('picked') || command.includes('pick')) {
      handleItemPicked();
    } else if (command.includes('not found') || command.includes('missing')) {
      handleItemNotFound();
    } else if (command.includes('repeat') || command.includes('again')) {
      speakCurrentItem();
    } else if (command.includes('next') || command.includes('skip')) {
      handleNextItem();
    } else if (command.includes('help')) {
      speakHelp();
    } else if (command.includes('complete') || command.includes('finish')) {
      handleComplete();
    } else {
      speakText("Command not recognized. Say 'help' for available commands.");
    }
  };

  const handleItemPicked = () => {
    toast({
      title: "Item Marked as Picked ✅",
      description: `${currentItem.name} has been picked successfully.`,
    });
    speakText("Item marked as picked. Moving to next item.");
    // Here you would typically update the backend
  };

  const handleItemNotFound = () => {
    toast({
      title: "Item Not Found ❌",
      description: `${currentItem.name} reported as not found.`,
      variant: "destructive"
    });
    speakText("Item marked as not found. Check alternate locations or contact supervisor.");
  };

  const handleNextItem = () => {
    // Simulate moving to next item
    const nextItem = {
      sku: 'SKU-67890',
      name: 'Multivitamin Tablets 60ct',
      quantity: 1,
      location: 'B1-C2-03'
    };
    setCurrentItem(nextItem);
    speakText(`Next item: ${nextItem.quantity} units of ${nextItem.name} from location ${nextItem.location}`);
  };

  const handleComplete = () => {
    speakText("Completing current picklist. Good job!");
    toast({
      title: "Picklist Complete 🎉",
      description: "All items have been processed successfully.",
    });
  };

  const speakHelp = () => {
    const helpMessage = "Available commands: Say 'picked' to mark item as picked, 'not found' for missing items, 'repeat' to hear current item again, 'next' for next item, or 'complete' to finish.";
    speakText(helpMessage);
  };

  const speakCurrentItem = () => {
    const message = `Current item: Pick ${currentItem.quantity} units of ${currentItem.name} from location ${currentItem.location}`;
    speakText(message);
  };

  const handleVoiceToggle = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        toast({
          title: "Voice Control Activated 🎤",
          description: "Listening for voice commands...",
        });
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        toast({
          title: "Voice Control Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => console.log('Speech started');
      utterance.onend = () => console.log('Speech ended');
      utterance.onerror = (event) => console.error('Speech error:', event);
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
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
                  disabled={!isSupported}
                  className={`w-32 h-32 rounded-full text-white border-0 shadow-lg transition-all duration-200 ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                  } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  {!isSupported 
                    ? 'Voice recognition not supported in this browser'
                    : isListening 
                      ? 'Listening for commands...' 
                      : 'Tap to activate voice control'
                  }
                </p>
              </div>

              {/* Live Transcript */}
              {transcript && (
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Live Transcript:</h4>
                  <p className="text-blue-700 italic">"{transcript}"</p>
                </div>
              )}

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
                  <p className="text-purple-600">{isSupported ? 'Ready' : 'Not Supported'}</p>
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
                onClick={speakCurrentItem}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Speak Item Details
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleItemPicked}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  ✅ Picked
                </Button>
                <Button 
                  onClick={handleItemNotFound}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
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

        {/* Quick Test Commands */}
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle>Quick Test Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => handleVoiceCommand('picked')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Test "Picked"
              </Button>
              <Button
                onClick={() => handleVoiceCommand('not found')}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Test "Not Found"
              </Button>
              <Button
                onClick={() => handleVoiceCommand('repeat')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Test "Repeat"
              </Button>
              <Button
                onClick={() => handleVoiceCommand('help')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Test "Help"
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoicePicking;
