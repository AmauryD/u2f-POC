import Route from '@ember/routing/route';
import Router from '@ember/routing/router';
import { service } from '@ember/service';
import SessionService from 'browser/services/session';

export default class ApplicationRoute extends Route {
  @service declare session: SessionService;
  @service declare router: Router;

  beforeModel() {
    this.router.transitionTo('dashboard');
  }
}
