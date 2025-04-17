
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5ee578e4a434482197463685b616bc33',
  appName: 'Clucky Coop Guardian',
  webDir: 'dist',
  server: {
    url: 'https://5ee578e4-a434-4821-9746-3685b616bc33.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    // Add Android-specific configurations
    AndroidNotifications: {
      icon: "ic_stat_icon_config_sample",
      color: "#488AFF"
    }
  }
};

export default config;
