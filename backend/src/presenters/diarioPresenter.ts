export function diarioPresenter(
  relato: any
) {

  return {
    id: relato.id,
    texto: relato.texto,
    data: relato.data,
    hora: relato.hora,
    tags: relato.tags,
    emoji: relato.emoji,
    userId: relato.userId,
    createdAt: relato.createdAt,
  };

}