
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, ChevronLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface FeedingSchedule {
  id: string;
  time: string;
  enabled: boolean;
  days: boolean[];
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Schedule = () => {
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([
    { 
      id: '1', 
      time: '08:00', 
      enabled: true, 
      days: [true, true, true, true, true, true, true] 
    },
    { 
      id: '2', 
      time: '18:00', 
      enabled: true, 
      days: [true, true, true, true, true, true, true] 
    }
  ]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggleSchedule = (id: string, enabled: boolean) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id ? { ...schedule, enabled } : schedule
      )
    );
    
    toast({
      title: enabled ? "Schedule Enabled" : "Schedule Disabled",
      description: `Feeding at ${schedules.find(s => s.id === id)?.time} is now ${enabled ? 'active' : 'disabled'}`,
    });
  };

  const handleToggleDay = (scheduleId: string, dayIndex: number) => {
    setSchedules(prev => 
      prev.map(schedule => {
        if (schedule.id === scheduleId) {
          const newDays = [...schedule.days];
          newDays[dayIndex] = !newDays[dayIndex];
          return { ...schedule, days: newDays };
        }
        return schedule;
      })
    );
  };

  const handleTimeChange = (id: string, time: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id ? { ...schedule, time } : schedule
      )
    );
  };

  const handleAddSchedule = () => {
    const newId = (Math.max(0, ...schedules.map(s => parseInt(s.id))) + 1).toString();
    const newSchedule: FeedingSchedule = {
      id: newId,
      time: '12:00',
      enabled: true,
      days: [true, true, true, true, true, true, true]
    };
    
    setSchedules(prev => [...prev, newSchedule]);
    
    toast({
      title: "New Schedule Added",
      description: "A new feeding schedule has been created",
    });
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    
    toast({
      title: "Schedule Removed",
      description: "The feeding schedule has been deleted",
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="container max-w-lg mx-auto pt-6 px-4 pb-16">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-primary ml-2">Feeding Schedule</h1>
      </header>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Feeding Time
                </CardTitle>
                <Switch 
                  checked={schedule.enabled} 
                  onCheckedChange={(checked) => handleToggleSchedule(schedule.id, checked)} 
                />
              </div>
              <CardDescription>
                Set automatic feeding time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <input 
                  type="time" 
                  value={schedule.time}
                  onChange={(e) => handleTimeChange(schedule.id, e.target.value)}
                  className="text-3xl font-bold bg-transparent border-none text-center focus:outline-none"
                />
              </div>
              
              <div className="flex justify-between">
                {daysOfWeek.map((day, index) => (
                  <Button
                    key={day}
                    variant={schedule.days[index] ? "default" : "outline"}
                    className="h-9 w-9 p-0 rounded-full"
                    onClick={() => handleToggleDay(schedule.id, index)}
                  >
                    {day.charAt(0)}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 ml-auto"
                onClick={() => handleDeleteSchedule(schedule.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleAddSchedule}
        >
          <Plus className="h-4 w-4" />
          Add New Schedule
        </Button>
      </div>
    </div>
  );
};

export default Schedule;
