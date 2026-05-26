export type EventCategory = 'fair' | 'workshop' | 'lecture' | 'visit' | 'other';

export interface EventType {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  type?: EventCategory;
  isAttending?: boolean;
  notes?: string;
  rating?: number | null;
  userId: string;
  createdAt?: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location?: string;
  type?: EventCategory;
  isAttending?: boolean;
  notes?: string;
  rating?: number | null;
  userId: string;
}

export type UpdateEventData = Partial<Omit<CreateEventData, 'userId'>>;
