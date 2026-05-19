'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type WalletType = 'handcash' | 'yours' | null;

interface UserProfile {
  handle: string;
  paymail: string;
  avatarUrl: string;
}

interface WalletContextType {
  walletType: WalletType;
  userProfile: UserProfile | null;
  isLoading: boolean;
  connectHandcash: () => void;
  connectYours: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('authToken');
      if (token) {
        window.location.href = `/api/auth/handcash/callback?authToken=${token}`;
        return;
      }
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setWalletType('handcash');
            setUserProfile({
              handle: data.user.publicProfile?.handle || data.user.handle,
              paymail: data.user.publicProfile?.paymail || data.user.paymail,
              avatarUrl: data.user.publicProfile?.avatarUrl || data.user.avatarUrl,
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      
      // Check Yours connection
      if (typeof window !== 'undefined' && window.yours) {
        try {
          const isConnected = await window.yours.isConnected();
          if (isConnected) {
            const addresses = await window.yours.getAddresses();
            setWalletType('yours');
            setUserProfile({
              handle: 'Yours User',
              paymail: addresses[0] || '',
              avatarUrl: '', // Default or generated
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const connectHandcash = () => {
    window.location.href = `/api/auth/handcash/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
  };

  const connectYours = async () => {
    if (typeof window !== 'undefined' && window.yours) {
      try {
        await window.yours.connect();
        const addresses = await window.yours.getAddresses();
        setWalletType('yours');
        setUserProfile({
          handle: 'Yours User',
          paymail: addresses[0] || '',
          avatarUrl: '',
        });
      } catch (err) {
        console.error('Failed to connect Yours Wallet', err);
      }
    } else {
      alert('Yours Wallet extension not found in browser.');
    }
  };

  const disconnect = async () => {
    if (walletType === 'handcash') {
      await fetch('/api/auth/logout', { method: 'POST' });
    } else if (walletType === 'yours') {
      if (typeof window !== 'undefined' && window.yours) {
        await window.yours.disconnect();
      }
    }
    setWalletType(null);
    setUserProfile(null);
  };

  return (
    <WalletContext.Provider value={{ walletType, userProfile, isLoading, connectHandcash, connectYours, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
