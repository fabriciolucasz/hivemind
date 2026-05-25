export function dailyLogPresenter(
  dailyLog: any
) {

  return {
    id: dailyLog.id,
    text: dailyLog.text,
    date: dailyLog.date,
    time: dailyLog.time,
    tags: dailyLog.tags,
    emoji: dailyLog.emoji,
    profileId: dailyLog.profileId,
    createdAt: dailyLog.createdAt,
  };

}
