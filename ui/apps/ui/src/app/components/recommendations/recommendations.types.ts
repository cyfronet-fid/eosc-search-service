export interface IRecommendation {
  id: string;
  title: string;
  url: string;
  description: string;
  organisation: string;
}

export interface RecommendationStateProps {
  panelId: string;
  status: 'pending' | 'loaded' | 'error';
}
