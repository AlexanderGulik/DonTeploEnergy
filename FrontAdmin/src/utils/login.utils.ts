const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+{}-]{6,35}$/;

export function validateUsername(username: string) {
  return usernameRegex.test(username);
}

export function validatePassword(password: string) {
  return passwordRegex.test(password);
}
