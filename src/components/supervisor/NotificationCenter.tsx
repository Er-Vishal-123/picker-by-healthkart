
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PickerStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
}

interface NotificationCenterProps {
  pickers: PickerStatus[];
}

interface Notification {
  id: string;
  type: 'system' | 'priority' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: string;
  sent: boolean;
  recipients: string[];
}

const NotificationCenter = ({ pickers }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'priority',
      title: 'High Priority Order',
      message: 'Order ORD-2024-015 requires immediate attention - VIP customer',
      timestamp: '5 min ago',
      sent: true,
      recipients: ['John Smith', 'Sarah Johnson']
    },
    {
      id: '2',
      type: 'system',
      title: 'WMS Sync Issue',
      message: 'Connection to warehouse management system temporarily unstable',
      timestamp: '15 min ago',
      sent: true,
      recipients: ['All Pickers']
    },
    {
      id: '3',
      type: 'alert',
      title: 'Zone A3 Exception',
      message: 'Multiple "not found" reports in Zone A3 - cycle count recommended',
      timestamp: '30 min ago',
      sent: false,
      recipients: ['Mike Chen']
    },
    {
      id: '4',
      type: 'info',
      title: 'Shift Change Reminder',
      message: 'Next shift starts at 4:00 PM - handover required',
      timestamp: '1 hour ago',
      sent: true,
      recipients: ['All Pickers']
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    type: 'info' as 'system' | 'priority' | 'alert' | 'info',
    title: '',
    message: '',
    recipients: [] as string[]
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'priority': return 'bg-red-100 text-red-800 border-red-200';
      case 'alert': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'system': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'priority': return <AlertTriangle className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'system': return <Bell className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleSendNotification = () => {
    if (newNotification.title && newNotification.message) {
      const notification: Notification = {
        id: Date.now().toString(),
        ...newNotification,
        timestamp: 'Just now',
        sent: true
      };
      setNotifications([notification, ...notifications]);
      setNewNotification({
        type: 'info',
        title: '',
        message: '',
        recipients: []
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Priority Alerts</p>
                <p className="text-3xl font-bold">{notifications.filter(n => n.type === 'priority').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">System Alerts</p>
                <p className="text-3xl font-bold">{notifications.filter(n => n.type === 'system').length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Sent Today</p>
                <p className="text-3xl font-bold">{notifications.filter(n => n.sent).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pending</p>
                <p className="text-3xl font-bold">{notifications.filter(n => !n.sent).length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send New Notification */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send New Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notification Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['priority', 'alert', 'system', 'info'].map((type) => (
                  <Button
                    key={type}
                    variant={newNotification.type === type ? "default" : "outline"}
                    onClick={() => setNewNotification({...newNotification, type: type as any})}
                    className="justify-start text-sm"
                  >
                    {getTypeIcon(type)}
                    <span className="ml-2 capitalize">{type}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="Enter notification title"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                placeholder="Enter notification message"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <div className="space-y-2">
                <Button
                  variant={newNotification.recipients.includes('All Pickers') ? "default" : "outline"}
                  onClick={() => {
                    const recipients = newNotification.recipients.includes('All Pickers') 
                      ? [] 
                      : ['All Pickers'];
                    setNewNotification({...newNotification, recipients});
                  }}
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  All Pickers
                </Button>
                <div className="grid grid-cols-1 gap-1">
                  {pickers.map((picker) => (
                    <Button
                      key={picker.id}
                      variant={newNotification.recipients.includes(picker.name) ? "default" : "outline"}
                      onClick={() => {
                        const recipients = newNotification.recipients.includes(picker.name)
                          ? newNotification.recipients.filter(r => r !== picker.name)
                          : [...newNotification.recipients.filter(r => r !== 'All Pickers'), picker.name];
                        setNewNotification({...newNotification, recipients});
                      }}
                      className="justify-start text-sm"
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        picker.status === 'active' ? 'bg-green-500' :
                        picker.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      {picker.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSendNotification}
              disabled={!newNotification.title || !newNotification.message || newNotification.recipients.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(notification.type)}>
                        {getTypeIcon(notification.type)}
                        <span className="ml-1 capitalize">{notification.type}</span>
                      </Badge>
                      {notification.sent ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{notification.timestamp}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Recipients:</span>
                    <div className="flex flex-wrap gap-1">
                      {notification.recipients.map((recipient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationCenter;
