// User notification preferences, stored per account in localStorage.

export interface Preferences {
  dailyReminder: boolean;
  budgetAlerts: boolean;
}

export const DEFAULT_PREFS: Preferences = { dailyReminder: true, budgetAlerts: true };

const PREFS_KEY = 'sakuwise_prefs_v1';
export const PREFS_EVENT = 'sakuwise-prefs-changed';

function keyFor(email?: string | null): string {
  return `${PREFS_KEY}:${email?.trim().toLowerCase() || 'guest'}`;
}

export function loadPrefs(email?: string | null): Preferences {
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (raw) {
      const p = JSON.parse(raw) as Partial<Preferences>;
      return {
        dailyReminder: typeof p.dailyReminder === 'boolean' ? p.dailyReminder : DEFAULT_PREFS.dailyReminder,
        budgetAlerts: typeof p.budgetAlerts === 'boolean' ? p.budgetAlerts : DEFAULT_PREFS.budgetAlerts,
      };
    }
  } catch (e) {
    console.error('Failed to load preferences', e);
  }
  return DEFAULT_PREFS;
}

export function savePrefs(email: string | null | undefined, prefs: Preferences): void {
  try {
    localStorage.setItem(keyFor(email), JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences', e);
  }
  // Let other components (e.g. the header bell) refresh right away
  window.dispatchEvent(new Event(PREFS_EVENT));
}
