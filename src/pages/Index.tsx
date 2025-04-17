import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to PIN screen after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative h-32 w-32 mx-auto">
          {/* Chicken silhouette icon */}
          <div className="absolute inset-0 bg-primary rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="h-16 w-16 text-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 6C9.5 6 8 8 8 10C8 12 9.5 14 12 14C14.5 14 16 12 16 10C16 8 14.5 6 12 6Z" 
                fill="currentColor" 
              />
              <path 
                d="M20 15.5C20 18.5 16.5 21 12 21C7.5 21 4 18.5 4 15.5C4 12.5 7.5 10 12 10C16.5 10 20 12.5 20 15.5Z" 
                fill="currentColor" 
              />
              <path 
                d="M12 4C12.8284 4 13.5 3.32843 13.5 2.5C13.5 1.67157 12.8284 1 12 1C11.1716 1 10.5 1.67157 10.5 2.5C10.5 3.32843 11.1716 4 12 4Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-primary">Clucky Coop Guardian</h1>
        <p className="text-xl text-muted-foreground">Your ESP32 Chicken Feeder Controller</p>
      </div>

      <div className="mt-12 flex items-center space-x-2 animate-bounce">
        <div className="h-2 w-2 rounded-full bg-primary opacity-75"></div>
        <div className="h-2 w-2 rounded-full bg-primary opacity-50"></div>
        <div className="h-2 w-2 rounded-full bg-primary opacity-25"></div>
      </div>
    </div>
  );
};

export default Index;

// Add fade-in animation
const styles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 1s ease-in;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
`;

// Add style tag to head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}
