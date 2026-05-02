import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsConnected(state.isConnected ?? true);
      } catch {
        setIsConnected(true);
      }
    };

    check();

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') check();
    });

    return () => subscription.remove();
  }, []);

  return { isConnected };
}
