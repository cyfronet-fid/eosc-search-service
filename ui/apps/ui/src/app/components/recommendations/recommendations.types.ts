export interface IRecommendation {
  id: string;
  title: string;
  url: string;
  description: string;
  organisation: string;
}
export interface IRecommendationResponse {
  isRand: boolean;
  message?: string;
  recommendations: IRecommendation[];
}

export interface RecommendationStateProps {
  panelId: string;
  status: 'pending' | 'loaded' | 'error';
}
