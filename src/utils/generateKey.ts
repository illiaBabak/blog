const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateKey = (length: number): string => {
  const timestamp = Date.now().toString();
  const timestampLength = timestamp.length;
  let randomString = '';

  for (let i = 0; i < length - timestampLength; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    randomString += CHARACTERS.charAt(randomIndex);
  }

  return randomString + timestamp;
};
