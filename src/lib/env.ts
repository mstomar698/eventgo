export const getEnvVar = (name: string): string | undefined => {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    return undefined;
  }
  return value;
};

export const requireEnvVar = (name: string): string => {
  const value = getEnvVar(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};
