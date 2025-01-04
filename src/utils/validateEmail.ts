const re = /\S+@\S+\.\S+/;

export const validateEmail = (email: string): boolean => re.test(email);
