import axios from 'axios';

import type { CreateEventData, EventType, UpdateEventData } from '../types/event';

const API_URL = 'http://localhost:3000/events';

export async function getEvents(userId: string): Promise<EventType[]> {
  const response = await axios.get(`${API_URL}?userId=${userId}`);

  return response.data;
}

export async function createEvent(eventData: CreateEventData): Promise<EventType> {
  const response = await axios.post(API_URL, eventData);

  return response.data;
}

export async function updateEvent(
  id: string,
  userId: string,
  eventData: UpdateEventData,
): Promise<EventType> {
  const response = await axios.put(`${API_URL}/${id}?userId=${userId}`, eventData);

  return response.data;
}

export async function deleteEvent(id: string, userId: string) {
  await axios.delete(`${API_URL}/${id}?userId=${userId}`);
}
