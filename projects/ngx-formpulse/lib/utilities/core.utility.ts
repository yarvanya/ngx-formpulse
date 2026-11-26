export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isFunction(value: unknown): value is (...function_arguments: never[]) => unknown {
  return typeof value === 'function';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}
