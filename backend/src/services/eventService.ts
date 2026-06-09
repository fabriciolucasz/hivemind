import { prisma } from '../database/prisma';

interface CreateEventRequest {
  title: string;
  description?: string;
  date: string | Date;
  location?: string;
  type?: string;
  isAttending?: boolean;
  notes?: string;
  rating?: number | null;
  userId: string;
}

type UpdateEventRequest = Partial<Omit<CreateEventRequest, 'userId'>>;

async function findProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Perfil nao encontrado');
  }

  return profile;
}

export async function createEventService(data: CreateEventRequest) {
  if (!data.title || !data.date || !data.userId) {
    throw new Error('Titulo, data e usuario sao obrigatorios');
  }

  const profile = await findProfileByUserId(data.userId);

  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      location: data.location,
      type: data.type || 'other',
      isAttending: data.isAttending ?? false,
      notes: data.notes,
      rating: data.rating,
      profileId: profile.id,
    },
  });
}

export async function getEventsService(userId: string) {
  if (!userId) {
    throw new Error('Usuario nao informado');
  }

  return prisma.event.findMany({
    where: {
      profile: {
        userId,
      },
    },
    orderBy: { date: 'asc' },
  });
}

export async function updateEventService(
  id: string,
  userId: string,
  data: UpdateEventRequest,
) {
  const event = await prisma.event.findFirst({
    where: {
      id,
      profile: {
        userId,
      },
    },
  });

  if (!event) {
    throw new Error('Evento nao encontrado');
  }

  return prisma.event.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.isAttending !== undefined && { isAttending: data.isAttending }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.rating !== undefined && { rating: data.rating }),
    },
  });
}

export async function deleteEventService(id: string, userId: string) {
  const event = await prisma.event.findFirst({
    where: {
      id,
      profile: {
        userId,
      },
    },
  });

  if (!event) {
    throw new Error('Evento nao encontrado');
  }

  await prisma.event.delete({
    where: { id },
  });
}
