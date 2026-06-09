import { prisma } from '../database/prisma';
import type { UpdateProfileRequest } from '../models/profileModel';

function normalizeInterests(interests: UpdateProfileRequest['interests']) {
  if (Array.isArray(interests)) {
    return interests
      .map((interest) => interest.trim())
      .filter(Boolean);
  }

  if (typeof interests === 'string') {
    return interests
      .split(',')
      .map((interest) => interest.trim())
      .filter(Boolean);
  }

  return undefined;
}

export async function getProfileService(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
}

export async function updateProfileService(
  userId: string,
  data: UpdateProfileRequest,
) {
  const interests = normalizeInterests(data.interests);

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name ? { name: data.name } : {}),
      profile: {
        upsert: {
          create: {
            age: data.age ?? null,
            interests: interests ?? [],
          },
          update: {
            ...(data.age !== undefined ? { age: data.age } : {}),
            ...(interests !== undefined ? { interests } : {}),
          },
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return user;
}

export async function deleteAccountService(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!profile) {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return;
  }

  await prisma.$transaction(async (tx) => {
    const vocationalTests = await tx.vocationalTest.findMany({
      where: {
        profileId: profile.id,
      },
      select: {
        id: true,
      },
    });

    const events = await tx.event.findMany({
      where: {
        profileId: profile.id,
      },
      select: {
        id: true,
      },
    });

    const recommendations = await tx.recommendation.findMany({
      where: {
        profileId: profile.id,
      },
      select: {
        id: true,
      },
    });

    await tx.testAnswer.deleteMany({
      where: {
        vocationalTestId: {
          in: vocationalTests.map((test) => test.id),
        },
      },
    });

    await tx.observationEvent.deleteMany({
      where: {
        eventId: {
          in: events.map((event) => event.id),
        },
      },
    });

    await tx.recommendedCourse.deleteMany({
      where: {
        recommendationId: {
          in: recommendations.map((recommendation) => recommendation.id),
        },
      },
    });

    await tx.vocationalTest.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.event.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.recommendation.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.dailyLog.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.academicRecord.deleteMany({
      where: {
        profileId: profile.id,
      },
    });

    await tx.profile.delete({
      where: {
        id: profile.id,
      },
    });

    await tx.user.delete({
      where: {
        id: userId,
      },
    });
  });
}
