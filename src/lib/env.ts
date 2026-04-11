export const getEnvVar = (name: string): string | undefined => {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    return undefined;
  }
  return value;
};

export const getFirstEnvVar = (...names: string[]): string | undefined => {
  for (const name of names) {
    const value = getEnvVar(name);
    if (value) {
      return value;
    }
  }
  return undefined;
};

export const requireEnvVar = (name: string): string => {
  const value = getEnvVar(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const requireFirstEnvVar = (...names: string[]): string => {
  const value = getFirstEnvVar(...names);
  if (!value) {
    throw new Error(`Missing required environment variable. Tried: ${names.join(', ')}`);
  }
  return value;
};
