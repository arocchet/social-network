'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = "OK" 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--bgLevel1)] rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--textNeutral)]">
              {title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-[var(--bgLevel2)]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-[var(--textMinimal)] mb-6">
          {message}
        </p>
        
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}