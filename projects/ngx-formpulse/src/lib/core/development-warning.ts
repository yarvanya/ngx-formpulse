const WARNING_PREFIX = '[FormPulse]';

const REPORTED_WARNINGS = new Set<string>();

function isDevelopmentMode(): boolean {
  return typeof ngDevMode === 'undefined' || Boolean(ngDevMode);
}

export function warnOnceInDevelopment(warning_message: string): void {
  if (!isDevelopmentMode() || REPORTED_WARNINGS.has(warning_message)) {
    return;
  }
  REPORTED_WARNINGS.add(warning_message);
  console.warn(`${WARNING_PREFIX} ${warning_message}`);
}

export function resetDevelopmentWarnings(): void {
  REPORTED_WARNINGS.clear();
}
