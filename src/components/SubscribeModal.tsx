import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address.');
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage("You're in. Welcome to TheWaqarMind.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to subscribe right now. Please try again.');
    }
  };

  const handleClose = () => {
    if (status !== 'loading') {
      onClose();
      setEmail('');
      setMessage('');
      setStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md"
            >
              <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-[#E1E0CC]/20 shadow-2xl overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                
                {/* Close button */}
                <button
                  onClick={handleClose}
                  disabled={status === 'loading'}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-[#E1E0CC]" />
                </button>

                <div className="p-8 relative">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-amber-400" />
                    </div>
                  </div>

                  {/* Heading */}
                  <h2 className="text-2xl font-medium text-[#E1E0CC] text-center mb-2 tracking-wide">
                    Stay in the Mind
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                    Subscribe to receive new thoughts, stories, ideas, and updates from TheWaqarMind.
                  </p>

                  {/* Form */}
                  {status === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-[#E1E0CC] font-medium mb-2">{message}</p>
                      <p className="text-sm text-gray-400">Check your inbox for a confirmation message.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="sr-only">
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          disabled={status === 'loading'}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#E1E0CC] placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          autoComplete="email"
                        />
                      </div>

                      {status === 'error' && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-400 text-center"
                          role="alert"
                        >
                          {message}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg text-[#E1E0CC] font-medium tracking-wide hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/10"
                      >
                        {status === 'loading' ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Subscribing...
                          </span>
                        ) : (
                          'Subscribe'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
