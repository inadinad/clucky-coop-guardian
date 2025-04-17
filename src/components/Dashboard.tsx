
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Thermometer, 
  BellRing, 
  Clock, 
  Settings, 
  AlertTriangle 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import esp32 from "@/lib/esp32";
import TemperatureChart from "@/components/TemperatureChart";

const Dashboard = () => {
  const [temperature, setTemperature] = useState(esp32.getTemperature());
  const [feedLevel, setFeedLevel] = useState(esp32.getFeedLevel());
  const [isConnected, setIsConnected] = useState(esp32.getConnectionStatus());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Register for real-time updates from ESP32
    esp32.onTemperatureUpdate(setTemperature);
    esp32.onFeedLevelUpdate(setFeedLevel);
    esp32.onConnectionUpdate(setIsConnected);
    
    // Connect to ESP32 if not already connected
    if (!esp32.getConnectionStatus()) {
      esp32.connect().then(connected => {
        if (connected) {
          toast({
            title: "Connected to Chicken Feeder",
            description: "Successfully connected to your device",
          });
        }
      });
    }

    // Notify about low feed if already low on connection
    if (esp32.getFeedLevel() <= 20) {
      toast({
        title: "Low Feed Level",
        description: "Feed storage is running low. Please refill soon.",
        variant: "destructive",
      });
    }

    // Clean up when component unmounts
    return () => {
      // We don't disconnect because we want to keep the connection alive
      // Just remove the listeners
      esp32.onTemperatureUpdate(null);
      esp32.onFeedLevelUpdate(null);
      esp32.onConnectionUpdate(null);
    };
  }, [toast]);

  const handleTemperatureDisplay = () => {
    if (temperature < 20) return { text: "Cold", color: "text-blue-500" };
    if (temperature > 30) return { text: "Hot", color: "text-red-500" };
    return { text: "Normal", color: "text-green-500" };
  };

  const tempStatus = handleTemperatureDisplay();

  return (
    <div className="container max-w-lg mx-auto pt-6 px-4 pb-16">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Chicken Coop Guardian</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <Settings className="h-6 w-6" />
        </Button>
      </header>

      <div className="space-y-4">
        {/* Status card */}
        <Card className={`border-l-4 ${isConnected ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Status</h3>
              <p className={isConnected ? "text-green-500" : "text-red-500"}>
                {isConnected ? "Connected" : "Connecting..."}
              </p>
            </div>
            <div className={`rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="feed">Feed Level</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Temperature card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Thermometer className="mr-2 h-5 w-5 text-primary" />
                    Temperature
                  </CardTitle>
                  <span className={`font-medium ${tempStatus.color}`}>{tempStatus.text}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{temperature}°C</div>
              </CardContent>
            </Card>

            {/* Feed level card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BellRing className="mr-2 h-5 w-5 text-primary" />
                  Feed Level
                </CardTitle>
                <CardDescription>
                  Current storage fill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{feedLevel}%</span>
                    {feedLevel <= 20 && (
                      <span className="text-destructive flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" /> Low
                      </span>
                    )}
                  </div>
                  <Progress value={feedLevel} className="h-3" 
                    style={{
                      background: feedLevel <= 20 ? 'rgba(239, 68, 68, 0.2)' : undefined
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Schedule Quick View */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Next Feeding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-xl font-semibold">08:00 AM</div>
                  <Button onClick={() => navigate('/schedule')}>
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Manual Feed Button */}
            <Card className="bg-primary/10 border-primary">
              <CardContent className="p-4">
                <Button 
                  className="w-full py-6 text-lg" 
                  onClick={() => {
                    if (isConnected) {
                      esp32.triggerFeeding().then(success => {
                        if (success) {
                          toast({
                            title: "Feeding Triggered",
                            description: "Manual feeding has been activated",
                          });
                        }
                      });
                    } else {
                      toast({
                        title: "Cannot Feed",
                        description: "Device is not connected",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={!isConnected}
                >
                  Feed Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="temperature" className="mt-4">
            <TemperatureChart timeRange={6} />
          </TabsContent>

          <TabsContent value="feed" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Feed Storage</CardTitle>
                <CardDescription>
                  Current feed level and consumption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current Level</span>
                    <span className="font-medium">{feedLevel}%</span>
                  </div>
                  <Progress value={feedLevel} className="h-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <div className="text-sm text-muted-foreground">Estimated Empty</div>
                    <div className="font-semibold">
                      {feedLevel > 0 ? `In ${Math.ceil(feedLevel / 5)} days` : 'Now'}
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <div className="text-sm text-muted-foreground">Daily Usage</div>
                    <div className="font-semibold">~5% per day</div>
                  </div>
                </div>

                <Button className="w-full" variant="default" size="lg">
                  Refill Feed Storage
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
