import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function VaultPinPad({ onUnlocked }) {
  const [isPinSet, setIsPinSet] = useState(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState('check'); // 'check', 'setup-1', 'setup-2', 'verify'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const inputRefs = useRef([]);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/vault-pin-status');
      if (res.data.isPinSet) {
        setIsPinSet(true);
        setStep('verify');
      } else {
        setIsPinSet(false);
        setStep('setup-1');
      }
    } catch (err) {
      setError('Failed to check vault status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (index, value, isConfirm = false) => {
    // Only allow numbers
    if (value && !/^[0-9]+$/.test(value)) return;
    
    // Use last char if multiple entered
    const digit = value.slice(-1);
    
    const targetArr = isConfirm ? confirmPin : pin;
    const setTarget = isConfirm ? setConfirmPin : setPin;
    
    const newArr = [...targetArr];
    newArr[index] = digit;
    setTarget(newArr);
    setError('');

    // Auto focus next
    if (digit && index < 3) {
      inputRefs.current[index + 1].focus();
    }
    
    // Auto submit if all 4 entered
    if (index === 3 && digit) {
      if (step === 'setup-1') {
        setTimeout(() => {
          setStep('setup-2');
          inputRefs.current[0].focus();
        }, 300);
      } else if (step === 'setup-2') {
        submitSetup(newArr.join(''));
      } else if (step === 'verify') {
        submitVerify(newArr.join(''));
      }
    }
  };

  const handleKeyDown = (index, e, isConfirm = false) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const submitSetup = async (finalPin) => {
    const originalPin = pin.join('');
    if (originalPin !== finalPin) {
      setError('PINs do not match. Try again.');
      setStep('setup-1');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setTimeout(() => inputRefs.current[0].focus(), 100);
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/set-vault-pin', { pin: finalPin });
      setIsPinSet(true);
      setStep('verify');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setError('PIN set successfully! Please enter it to unlock.');
    } catch (err) {
      setError('Failed to set PIN.');
      setStep('setup-1');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async (enteredPin) => {
    try {
      setLoading(true);
      await api.post('/auth/verify-vault-pin', { pin: enteredPin });
      
      // Store unlock time in sessionStorage so it stays unlocked for this session (or 15 mins)
      sessionStorage.setItem('vaultUnlocked', Date.now().toString());
      onUnlocked();
    } catch (err) {
      setError('Incorrect PIN');
      setPin(['', '', '', '']);
      setTimeout(() => inputRefs.current[0].focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'check') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const isConfirmStep = step === 'setup-2';
  const currentPin = isConfirmStep ? confirmPin : pin;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl border border-gray-200/50 p-8 rounded-3xl shadow-2xl shadow-indigo-900/10 w-full text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
            {step === 'verify' ? <Lock size={32} /> : <ShieldAlert size={32} />}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'setup-1' ? 'Secure your Vault' : 
             step === 'setup-2' ? 'Confirm your PIN' : 
             'Unlock Vault'}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {step === 'setup-1' ? 'Create a 4-digit PIN to protect your private documents.' : 
             step === 'setup-2' ? 'Please re-enter your 4-digit PIN.' : 
             'Enter your 4-digit PIN to access secured documents.'}
          </p>

          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={currentPin[index]}
                onChange={(e) => handlePinChange(index, e.target.value, isConfirmStep)}
                onKeyDown={(e) => handleKeyDown(index, e, isConfirmStep)}
                disabled={loading}
                autoFocus={index === 0}
                className="w-14 h-16 text-center text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none disabled:opacity-50"
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm font-medium ${error.includes('success') ? 'text-green-600' : 'text-rose-500'}`}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {loading && (
            <div className="mt-4 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
