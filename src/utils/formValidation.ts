export const ValidateEmail = (email: string) => {
  const validEmailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  return !!email.match(validEmailRegex);
};

export const ValidateNewPassword = (password: string) => {
  // At least 1 number, at least 1 special character and a length from 6-16 characters.
  const validPasswordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  return !!password.match(validPasswordRegex);
};
