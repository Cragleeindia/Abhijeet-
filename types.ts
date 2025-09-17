
export enum AppState {
  IMPORTING,
  ANALYZING,
  EDITING,
}

export interface Shot {
  id: string;
  duration: number; // in seconds
  description: string;
  transition: string;
  effect: string;
  caption: string;
  userMediaId?: string; // ID of the user's media filling this shot
}

export interface VideoTemplate {
  shots: Shot[];
  totalDuration: number;
}

export interface UserMedia {
  id:string;
  file: File;
  previewUrl: string;
}
