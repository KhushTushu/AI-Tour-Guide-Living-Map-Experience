
export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates: { x: number; y: number }; // Percentage values for SVG map
  image: string;
  description: string;
  category: 'Adventure' | 'Historical' | 'Cultural' | 'Nature' | 'Beach';
  funFact: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPostcard?: boolean;
  postcardData?: Destination;
}

export interface Itinerary {
  destination: string;
  days: {
    day: number;
    title: string;
    activities: string[];
  }[];
}
