export interface DailyLog {
  id: string;
  date: string;
  time: string;
  text: string;
  tags: string[];
  emoji: string;
  profileId: string;
  createdAt?: string;
}

export interface CreateDailyLogData {
  text: string;
  tags: string[];
  emoji: string;
  date: string;
  time: string;
  userId: string;
}
