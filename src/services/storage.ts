const API_KEY_STORAGE_KEY = 'gemini_api_key';

export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function removeApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}