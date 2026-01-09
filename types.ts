export enum GameState {
  MENU = 'MENU',
  GAMEPLAY = 'GAMEPLAY'
}

export interface DialogueLine {
  text: string;
  type: 'action' | 'dialogue' | 'choice';
  choices?: string[];
}

export interface WhisperResponse {
  whisper: string;
}
