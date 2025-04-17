
// Temperature history tracking for visualization

export interface TemperatureDataPoint {
  time: Date;
  value: number;
}

export class TemperatureHistory {
  private static instance: TemperatureHistory;
  private history: TemperatureDataPoint[] = [];
  private maxPoints: number = 144; // Store 24 hours of data (at 10 min intervals)
  
  // Private constructor for singleton
  private constructor() {
    // Initialize with some sample data
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const baseTemp = 24;
      // Daily cycle - cooler at night, warmer in day
      const hourCycle = Math.sin((time.getHours() / 24) * Math.PI * 2) * 3;
      // Add some random noise
      const noise = (Math.random() * 0.6) - 0.3;
      
      this.history.unshift({
        time,
        value: +(baseTemp + hourCycle + noise).toFixed(1)
      });
    }
  }
  
  // Get singleton instance
  public static getInstance(): TemperatureHistory {
    if (!TemperatureHistory.instance) {
      TemperatureHistory.instance = new TemperatureHistory();
    }
    return TemperatureHistory.instance;
  }
  
  // Add new temperature reading
  public addReading(temperature: number): void {
    this.history.push({
      time: new Date(),
      value: temperature
    });
    
    // Trim history if too long
    if (this.history.length > this.maxPoints) {
      this.history.shift();
    }
  }
  
  // Get full history
  public getHistory(): TemperatureDataPoint[] {
    return [...this.history];
  }
  
  // Get recent history (last n hours)
  public getRecentHistory(hours: number = 6): TemperatureDataPoint[] {
    const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return this.history.filter(point => point.time >= cutoffTime);
  }
  
  // Get statistics
  public getStats(): { min: number; max: number; avg: number } {
    if (this.history.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    
    const values = this.history.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    return {
      min: +min.toFixed(1),
      max: +max.toFixed(1),
      avg: +avg.toFixed(1)
    };
  }
  
  // Clear history
  public clearHistory(): void {
    this.history = [];
  }
}

export default TemperatureHistory.getInstance();
