import type {FpLocale} from './fp-locale';
import {getFormPulseConfig} from './form-pulse-registry';
import {isObject, isString} from '../utilities/core.utility';
import {findLocalePack, resolveLocale} from './locale-resolver';

const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;
const LIST_SEPARATOR = ', ';

type MessageFormatter = {format(error_parameters: object): string}['format'];

export type MessageSource = string | MessageFormatter;

export interface MessageRequest {
  readonly validatorKey: string;
  readonly englishMessage: MessageSource;
  readonly errorParameters: Readonly<Record<string, unknown>>;
  readonly inlineLocale?: FpLocale | undefined;
  readonly inlineMessage?: MessageSource | undefined;
}

function stringifyParameter(parameter_value: unknown): string {
  if (Array.isArray(parameter_value)) {
    const items: readonly unknown[] = parameter_value;
    return items.map((item) => stringifyParameter(item)).join(LIST_SEPARATOR);
  }
  return isObject(parameter_value) ? JSON.stringify(parameter_value) : String(parameter_value);
}

function formatMessage(message_source: MessageSource, error_parameters: Readonly<Record<string, unknown>>): string {
  if (!isString(message_source)) {
    return message_source(error_parameters);
  }
  return message_source.replace(PLACEHOLDER_PATTERN, (placeholder: string, parameter_name: string) => (
    Object.hasOwn(error_parameters, parameter_name) ? stringifyParameter(error_parameters[parameter_name]) : placeholder
  ));
}

export function resolveMessage(message_request: MessageRequest): string {
  const formPulseConfig = getFormPulseConfig();
  const messageOverrides: Readonly<Partial<Record<string, MessageSource>>> = formPulseConfig.messages ?? {};
  const locale = resolveLocale(message_request.inlineLocale, formPulseConfig);
  const localeMessages: Readonly<Partial<Record<string, MessageSource>>> = findLocalePack(locale, formPulseConfig)?.messages ?? {};
  const messageSource = message_request.inlineMessage
    ?? messageOverrides[message_request.validatorKey]
    ?? localeMessages[message_request.validatorKey]
    ?? message_request.englishMessage;
  return formatMessage(messageSource, message_request.errorParameters);
}
