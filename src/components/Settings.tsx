
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState({
    full_name: profile?.full_name || '',
    employee_id: profile?.employee_id || '',
    notifications: true,
    sound_alerts: true,
    auto_sync: true,
  });

  const handleUpdateProfile = async () => {
    if (!profile?.id) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: settings.full_name,
          employee_id: settings.employee_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={settings.full_name}
                onChange={(e) => setSettings({ ...settings, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                value={settings.employee_id}
                onChange={(e) => setSettings({ ...settings, employee_id: e.target.value })}
                placeholder="Enter your employee ID"
              />
            </div>
          </div>
          <Button onClick={handleUpdateProfile} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sound_alerts">Sound Alerts</Label>
            <Switch
              id="sound_alerts"
              checked={settings.sound_alerts}
              onCheckedChange={(checked) => setSettings({ ...settings, sound_alerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto_sync">Auto Sync</Label>
            <Switch
              id="auto_sync"
              checked={settings.auto_sync}
              onCheckedChange={(checked) => setSettings({ ...settings, auto_sync: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Role:</strong> {profile?.role}
            </div>
            <div>
              <strong>Employee ID:</strong> {profile?.employee_id}
            </div>
            <div>
              <strong>Warehouse:</strong> {profile?.warehouse_id ? 'Assigned' : 'Not Assigned'}
            </div>
            <div>
              <strong>Status:</strong> <span className="text-green-600">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
