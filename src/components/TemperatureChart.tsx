
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import temperatureHistory, { TemperatureDataPoint } from '@/lib/temperatureHistory';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TemperatureChartProps {
  timeRange?: number; // in hours
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ timeRange = 6 }) => {
  const [data, setData] = useState<TemperatureDataPoint[]>([]);
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0 });
  const [selectedRange, setSelectedRange] = useState(timeRange);
  
  useEffect(() => {
    // Get initial data
    updateChartData(selectedRange);
    
    // Update data every minute
    const interval = setInterval(() => {
      updateChartData(selectedRange);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [selectedRange]);
  
  const updateChartData = (hours: number) => {
    const historyData = temperatureHistory.getRecentHistory(hours);
    setData(historyData);
    setStats(temperatureHistory.getStats());
  };
  
  // Format date for chart display
  const formatXAxis = (dateTime: Date) => {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format data for recharts
  const formattedData = data.map(point => ({
    time: point.time,
    temperature: point.value
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Temperature History</span>
          <div className="text-sm font-normal space-x-2">
            <Button 
              variant={selectedRange === 6 ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedRange(6)}
            >
              6h
            </Button>
            <Button 
              variant={selectedRange === 12 ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedRange(12)}
            >
              12h
            </Button>
            <Button 
              variant={selectedRange === 24 ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedRange(24)}
            >
              24h
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Temperature readings over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Min</div>
            <div className="font-medium text-lg">{stats.min}°C</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Average</div>
            <div className="font-medium text-lg">{stats.avg}°C</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Max</div>
            <div className="font-medium text-lg">{stats.max}°C</div>
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatXAxis}
                  stroke="rgba(0,0,0,0.2)"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  stroke="rgba(0,0,0,0.2)"
                />
                <Tooltip
                  formatter={(value) => [`${value}°C`, 'Temperature']}
                  labelFormatter={(label) => {
                    if (typeof label === 'object' && label instanceof Date) {
                      return label.toLocaleString();
                    }
                    return label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No temperature data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureChart;
