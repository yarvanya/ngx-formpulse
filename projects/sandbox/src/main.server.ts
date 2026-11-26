import {type BootstrapContext, bootstrapApplication} from '@angular/platform-browser';
import {App} from './app/app';
import {config} from './app/app.config.server';

export default async function bootstrap(bootstrap_context: BootstrapContext) {
  return bootstrapApplication(App, config, bootstrap_context);
}
