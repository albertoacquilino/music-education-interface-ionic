
export type StudyGroup = {
  name: string;
  password: string;
};

export type DeviceInfo = {
  id: string;
  model: string;
  platform: string;
  osVersion: string;
};

export type Activity = {
  tempo: number;
  lowNote: number;
  highNote: number;
  useFlatsAndSharps: boolean;
  mode: string;
  useDynamics: boolean;
  startTime: Date;
  endTime?: Date;
  device: DeviceInfo;
  action?: 'finished' | 'interrupted';
  duration?: number;
  group?: string | null;
  user?: string | null;

};
