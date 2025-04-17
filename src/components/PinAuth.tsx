
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const PinAuth = () => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // In a real app, this would be securely stored or validated against an API
  const correctPin = ['1', '2', '3', '4']; 
  
  useEffect(() => {
    // Check if all digits are filled
    if (pin.every(digit => digit !== '') && activeIndex === 4) {
      validatePin();
    }
  }, [pin, activeIndex]);

  const handleNumberPress = (number: string) => {
    if (activeIndex < 4) {
      const newPin = [...pin];
      newPin[activeIndex] = number;
      setPin(newPin);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleBackspace = () => {
    if (activeIndex > 0) {
      const newPin = [...pin];
      newPin[activeIndex - 1] = '';
      setPin(newPin);
      setActiveIndex(activeIndex - 1);
      setError('');
    }
  };

  const validatePin = () => {
    if (pin.join('') === correctPin.join('')) {
      navigate('/dashboard');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin(['', '', '', '']);
      setActiveIndex(0);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Chicken Coop Guardian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative h-20 w-80">
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="flex gap-4">
                    {pin.map((digit, index) => (
                      <div 
                        key={index} 
                        className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold
                                  ${index === activeIndex - 1 || (index === 3 && activeIndex === 4) 
                                    ? 'border-primary bg-primary/10' 
                                    : 'border-muted-foreground/20'}`}
                      >
                        {digit ? '•' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-center text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  variant="outline"
                  className="h-14 text-xl"
                  onClick={() => handleNumberPress(number.toString())}
                >
                  {number}
                </Button>
              ))}
              <Button
                variant="outline"
                className="h-14 text-xl col-start-2"
                onClick={() => handleNumberPress('0')}
              >
                0
              </Button>
              <Button
                variant="outline"
                className="h-14"
                onClick={handleBackspace}
              >
                ⌫
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinAuth;
