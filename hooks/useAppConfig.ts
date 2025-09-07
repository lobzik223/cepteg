import { useCallback, useEffect, useState } from 'react';
import { appConfigService } from '../services/AppConfigService';
import { AppConfig, PromotionalCard } from '../types/AppConfig';

interface UseAppConfigReturn {
  appConfig: AppConfig | null;
  promotionalCards: PromotionalCard[];
  topPromotionalCards: PromotionalCard[];
  bottomPromotionalCards: PromotionalCard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchPromotionalCards: () => Promise<void>;
}

export const useAppConfig = (): UseAppConfigReturn => {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [promotionalCards, setPromotionalCards] = useState<PromotionalCard[]>([]);
  const [topPromotionalCards, setTopPromotionalCards] = useState<PromotionalCard[]>([]);
  const [bottomPromotionalCards, setBottomPromotionalCards] = useState<PromotionalCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const config = await appConfigService.getAppConfig();
      setAppConfig(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch app config');
      console.error('Error fetching app config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPromotionalCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cards = await appConfigService.getPromotionalCards();
      const topCards = await appConfigService.getTopPromotionalCards();
      const bottomCards = await appConfigService.getBottomPromotionalCards();
      
      setPromotionalCards(cards);
      setTopPromotionalCards(topCards);
      setBottomPromotionalCards(bottomCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promotional cards');
      console.error('Error fetching promotional cards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAppConfig();
  }, [fetchAppConfig]);

  const refetchPromotionalCards = useCallback(async () => {
    await fetchPromotionalCards();
  }, [fetchPromotionalCards]);

  useEffect(() => {
    fetchAppConfig();
    fetchPromotionalCards();
  }, [fetchAppConfig, fetchPromotionalCards]);

  return {
    appConfig,
    promotionalCards,
    topPromotionalCards,
    bottomPromotionalCards,
    loading,
    error,
    refetch,
    refetchPromotionalCards,
  };
};
