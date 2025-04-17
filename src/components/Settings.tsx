
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Bell, 
  Wifi, 
  Key, 
  Lock,
  LogOut,
  RefreshCw,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lowFeedAlert, setLowFeedAlert] = useState(20);
  const [autoConnect, setAutoConnect] = useState(true);
  const [deviceIp, setDeviceIp] = useState('192.168.1.100');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleChangePin = () => {
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinError('PIN must be exactly 4 digits');
      return;
    }
    
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    
    // In a real app, this would securely save the new PIN
    toast({
      title: "PIN Updated",
      description: "Your security PIN has been changed successfully",
    });
    
    setIsChangingPin(false);
    setNewPin('');
    setConfirmPin('');
    setPinError('');
  };

  const handleRefreshConnection = () => {
    toast({
      title: "Reconnecting...",
      description: "Attempting to connect to your ESP32 device",
    });
    
    // Use our ESP32 simulation class
    const esp32 = require("@/lib/esp32").default;
    
    // Disconnect first if already connected
    if (esp32.getConnectionStatus()) {
      esp32.disconnect();
    }
    
    // Try to connect with the current IP address
    esp32.connect(deviceIp).then(success => {
      if (success) {
        toast({
          title: "Connected",
          description: "Successfully connected to your ESP32 device",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to your ESP32 device",
          variant: "destructive",
        });
      }
    });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="container max-w-lg mx-auto pt-6 px-4 pb-16">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-primary ml-2">Settings</h1>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Manage app notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Enable Notifications</span>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled} 
              />
            </div>
            
            {notificationsEnabled && (
              <div className="ml-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Low Feed Alert Threshold</span>
                  <span className="text-xs text-muted-foreground">({lowFeedAlert}%)</span>
                </div>
                <Input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={lowFeedAlert}
                  onChange={(e) => setLowFeedAlert(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connection</CardTitle>
            <CardDescription>ESP32 connection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                <span>Auto-connect on startup</span>
              </div>
              <Switch 
                checked={autoConnect} 
                onCheckedChange={setAutoConnect} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviceIp">Device IP Address</Label>
              <div className="flex gap-2">
                <Input 
                  id="deviceIp"
                  value={deviceIp} 
                  onChange={(e) => setDeviceIp(e.target.value)}
                  placeholder="192.168.1.100" 
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefreshConnection}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security</CardTitle>
            <CardDescription>PIN and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isChangingPin} onOpenChange={setIsChangingPin}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Change Security PIN
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Security PIN</DialogTitle>
                  <DialogDescription>
                    Enter a new 4-digit PIN for app security
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPin">New PIN (4 digits)</Label>
                    <Input 
                      id="newPin"
                      type="password" 
                      inputMode="numeric" 
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPin">Confirm PIN</Label>
                    <Input 
                      id="confirmPin"
                      type="password" 
                      inputMode="numeric" 
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                    />
                  </div>
                  
                  {pinError && (
                    <p className="text-sm text-destructive">{pinError}</p>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsChangingPin(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleChangePin}>
                    Save PIN
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Help & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              User Guide
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Device Manual
            </Button>
          </CardContent>
        </Card>

        <Separator />
        
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
