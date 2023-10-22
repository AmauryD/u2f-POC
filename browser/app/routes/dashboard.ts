import Route from '@ember/routing/route';
import Router from '@ember/routing/router';
import { service } from '@ember/service';
import SessionService from 'browser/services/session';

export default class DashboardRoute extends Route {
  @service declare session: SessionService;
  @service declare router: Router;

  public beforeModel() {
    if (!this.session.isLoggedIn()) {
      this.router.transitionTo('login');
    }
  }

  public model() {
    return {
      user: this.session.user,
    };
  }
}
