
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Users, Clock } from 'lucide-react';

interface PickerStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
}

interface ChatSystemProps {
  pickers: PickerStatus[];
}

interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  type: 'individual' | 'broadcast';
  read: boolean;
}

const ChatSystem = ({ pickers }: ChatSystemProps) => {
  const [selectedPicker, setSelectedPicker] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'individual' | 'broadcast'>('individual');

  const [messages] = useState<Message[]>([
    {
      id: '1',
      from: 'John Smith',
      to: 'Supervisor',
      message: 'Need help with SKU-12345 in Zone A3, not finding it',
      timestamp: '2 min ago',
      type: 'individual',
      read: false
    },
    {
      id: '2',
      from: 'Supervisor',
      to: 'Sarah Johnson',
      message: 'Please help John in Zone A3 when you finish your current pick',
      timestamp: '5 min ago',
      type: 'individual',
      read: true
    },
    {
      id: '3',
      from: 'Supervisor',
      to: 'All Pickers',
      message: 'Reminder: Break time is at 3:00 PM',
      timestamp: '15 min ago',
      type: 'broadcast',
      read: true
    },
    {
      id: '4',
      from: 'Lisa Brown',
      to: 'Supervisor',
      message: 'Completed order ORD-2024-005, ready for next assignment',
      timestamp: '20 min ago',
      type: 'individual',
      read: true
    }
  ]);

  const quickMessages = [
    'Take a 15-minute break',
    'Move to Zone A for next pickups',
    'Priority order incoming',
    'Great job today!',
    'Need assistance in your area?',
    'Check bin location for discrepancies'
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const unreadCount = messages.filter(m => !m.read && m.to === 'Supervisor').length;

  return (
    <div className="space-y-6">
      {/* Chat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Chats</p>
                <p className="text-3xl font-bold">{pickers.filter(p => p.status === 'active').length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Unread Messages</p>
                <p className="text-3xl font-bold">{unreadCount}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Online Pickers</p>
                <p className="text-3xl font-bold">{pickers.filter(p => p.status !== 'offline').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Response Time</p>
                <p className="text-3xl font-bold">2.5m</p>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Picker List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => setSelectedPicker(null)}
                variant={selectedPicker === null ? "default" : "outline"}
                className="w-full justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Broadcast to All
              </Button>
              {pickers.map((picker) => (
                <div key={picker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                     onClick={() => setSelectedPicker(picker.id)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      picker.status === 'active' ? 'bg-green-500' :
                      picker.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{picker.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {picker.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {selectedPicker ? 
                `Chat with ${pickers.find(p => p.id === selectedPicker)?.name}` : 
                'Broadcast Messages'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Messages Display */}
            <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-4">
                {messages
                  .filter(m => selectedPicker ? 
                    (m.from === pickers.find(p => p.id === selectedPicker)?.name || 
                     m.to === pickers.find(p => p.id === selectedPicker)?.name) : 
                    m.type === 'broadcast'
                  )
                  .map((message) => (
                  <div key={message.id} className={`flex ${message.from === 'Supervisor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.from === 'Supervisor' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.from === 'Supervisor' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Messages */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Messages:</p>
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((msg, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setNewMessage(msg)}
                    className="text-xs"
                  >
                    {msg}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedPicker ? 
                  `Message ${pickers.find(p => p.id === selectedPicker)?.name}...` : 
                  'Broadcast message to all pickers...'
                }
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatSystem;
