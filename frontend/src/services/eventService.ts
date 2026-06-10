import { api } from './api';
import type { CreateEventData, EventType, UpdateEventData } from '../types/event';

export async function getEvents(): Promise<EventType[]> {
  const response = await api.get('/events');
  return response.data;
}

export async function createEvent(eventData: CreateEventData): Promise<EventType> {
  const response = await api.post('/events', eventData);
  return response.data;
}

export async function updateEvent(
  id: string,
  eventData: UpdateEventData,
): Promise<EventType> {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
}

export async function deleteEvent(id: string) {
  await api.delete(`/events/${id}`);
}
