import { useCallback, useEffect, useState } from 'react';

import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from '../services/eventService';
import type { CreateEventData, EventType, UpdateEventData } from '../types/event';

export function useEvents(userId?: string) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    if (!userId) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const data = await getEvents();
      setEvents(data);
    } catch (loadError) {
      console.error(loadError);
      setError('Não foi possível carregar os eventos.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback(async (data: CreateEventData) => {
    const createdEvent = await createEvent(data);
    await loadEvents();

    return createdEvent;
  }, [loadEvents]);

  const editEvent = useCallback(
    async (eventId: string, data: UpdateEventData) => {
      if (!userId) {
        throw new Error('Usuário não informado');
      }

      const updatedEvent = await updateEvent(eventId, data);
      await loadEvents();

      return updatedEvent;
    },
    [loadEvents, userId]
  );

  const removeEvent = useCallback(
    async (eventId: string) => {
      if (!userId) {
        throw new Error('Usuário não informado');
      }

      await deleteEvent(eventId);
      await loadEvents();
    },
    [loadEvents, userId]
  );

  return {
    events,
    isLoading,
    error,
    setError,
    addEvent,
    editEvent,
    removeEvent,
    reloadEvents: loadEvents,
  };
}
