export function authPresenter(data: any) {
  return {
    token: data.token,
    user: {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    },
  };
}