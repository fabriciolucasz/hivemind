export function profilePresenter(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile
      ? {
          id: user.profile.id,
          age: user.profile.age,
          interests: user.profile.interests,
        }
      : null,
  };
}
