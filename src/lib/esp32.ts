
// ESP32 Connection Simulator Class
// This simulates the connection and data exchange with an ESP32 device
// In a real app, this would be replaced with actual BLE or WiFi communication

import { LocalNotifications } from '@capacitor/local-notifications';
import temperatureHistory from './temperatureHistory';

export class ESP32Connection {
  private static instance: ESP32Connection;
  private isConnected: boolean = false;
  private temperature: number = 24.5;
  private feedLevel: number = 65;
  private schedules: {time: string, enabled: boolean, days: boolean[]}[] = [];
  private onTemperatureChange: ((temp: number) => void) | null = null;
  private onFeedLevelChange: ((level: number) => void) | null = null;
  private onConnectionChange: ((status: boolean) => void) | null = null;
  private tempInterval: number | null = null;
  private feedInterval: number | null = null;

  // Private constructor for singleton pattern
  private constructor() {}

  // Get singleton instance
  public static getInstance(): ESP32Connection {
    if (!ESP32Connection.instance) {
      ESP32Connection.instance = new ESP32Connection();
    }
    return ESP32Connection.instance;
  }

  // Connect to ESP32
  public async connect(ipAddress: string = '192.168.1.100'): Promise<boolean> {
    // Simulate connection delay
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        if (this.onConnectionChange) this.onConnectionChange(true);
        
        // Start simulating data
        this.startDataSimulation();
        
        resolve(true);
      }, 2000);
    });
  }

  // Disconnect from ESP32
  public disconnect(): void {
    this.isConnected = false;
    if (this.onConnectionChange) this.onConnectionChange(false);
    
    // Stop data simulation
    this.stopDataSimulation();
  }

  // Get connection status
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get current temperature
  public getTemperature(): number {
    return this.temperature;
  }

  // Get current feed level
  public getFeedLevel(): number {
    return this.feedLevel;
  }

  // Get feeding schedules
  public getSchedules(): {time: string, enabled: boolean, days: boolean[]}[] {
    return [...this.schedules];
  }

  // Update feeding schedules
  public updateSchedules(schedules: {time: string, enabled: boolean, days: boolean[]}[]): void {
    this.schedules = [...schedules];
  }

  // Trigger a manual feeding
  public async triggerFeeding(): Promise<boolean> {
    if (!this.isConnected) return false;
    
    // Simulate feeding action
    this.feedLevel = Math.max(0, this.feedLevel - 2);
    if (this.onFeedLevelChange) this.onFeedLevelChange(this.feedLevel);
    
    return true;
  }

  // Register for temperature updates
  public onTemperatureUpdate(callback: (temp: number) => void): void {
    this.onTemperatureChange = callback;
  }

  // Register for feed level updates
  public onFeedLevelUpdate(callback: (level: number) => void): void {
    this.onFeedLevelChange = callback;
  }

  // Register for connection status updates
  public onConnectionUpdate(callback: (status: boolean) => void): void {
    this.onConnectionChange = callback;
  }

  // Start simulating data changes (temperature and feed level)
  private startDataSimulation(): void {
    // Simulate temperature changes
    this.tempInterval = window.setInterval(() => {
      // Random temperature fluctuation (+/- 0.2°C)
      this.temperature = Number((this.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1));
      
      // Log temperature in history
      temperatureHistory.addReading(this.temperature);
      
      if (this.onTemperatureChange) this.onTemperatureChange(this.temperature);
    }, 10000);

    // Simulate feed level decreasing
    this.feedInterval = window.setInterval(() => {
      this.feedLevel = Math.max(0, this.feedLevel - 0.5);
      if (this.onFeedLevelChange) this.onFeedLevelChange(this.feedLevel);
      
      // Send notification when feed level is low
      if (this.feedLevel === 20) {
        this.sendLowFeedNotification();
      }
    }, 15000);
  }

  // Stop data simulation
  private stopDataSimulation(): void {
    if (this.tempInterval) clearInterval(this.tempInterval);
    if (this.feedInterval) clearInterval(this.feedInterval);
  }

  // Send notification for low feed level
  private async sendLowFeedNotification(): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Low Feed Level Alert',
            body: 'Your chicken feeder is running low on feed (20%). Please refill soon.',
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
            sound: null,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }
}

export default ESP32Connection.getInstance();
