export function safeParseJson<T>(payload: unknown): T | null {
  try {
    if (payload === null) return null;

    if (typeof payload === 'object') return payload as T;

    if (typeof payload === 'string') {
      return JSON.parse(payload) as T;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
