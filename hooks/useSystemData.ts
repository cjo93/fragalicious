import { useQuery } from '@tanstack/react-query';
import * as Api from '../lib/api';
import * as Types from '../lib/types';

// 1. useLineage
export function useLineage(rootId: string) {
  return useQuery<Types.FamilyMapData>({
    queryKey: ['lineage', rootId],
    queryFn: async () => {
      const { data } = await Api.api.get(`/analyze/lineage/${rootId}`);
      // Defensive mapping to plain objects
      return {
        nodes: (data.nodes || []).map((n: any) => ({ ...n })),
        edges: (data.edges || []).map((e: any) => ({ ...e })),
      };
    },
    enabled: !!rootId,
  });
}

// 2. useGlitchDetails
export function useGlitchDetails(glitchId: string | null) {
  return useQuery<Types.DebugReport>({
    queryKey: ['glitch', glitchId],
    queryFn: async () => {
      if (!glitchId) throw new Error('No glitchId');
      const { data } = await Api.api.post(`/narrative/explain-glitch`, { glitchId });
      return data as Types.DebugReport;
    },
    enabled: !!glitchId,
  });
}

// 3. useSystemWeather
export function useSystemWeather() {
  return useQuery<any>({
    queryKey: ['weather'],
    queryFn: async () => {
      const { data } = await Api.api.get(`/analyze/daily-weather`);
      return data;
    },
    refetchInterval: 60000, // 1 minute
  });
}
