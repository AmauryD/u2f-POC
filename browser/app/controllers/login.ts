import Controller from '@ember/controller';
import { action } from '@ember/object';
import Router from '@ember/routing/router';
import { service } from '@ember/service';
import { client } from '@passwordless-id/webauthn';
import SessionService from 'browser/services/session';
import { loginChallenge } from 'browser/utils/challenge';

export default class LoginController extends Controller {
  @service declare router: Router;
  @service declare session: SessionService;

  @action
  async login(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const { nounce, authenticators } = await loginChallenge(
      data.get('username') as string,
    );

    const authentication = await client.authenticate(authenticators, nounce, {
      authenticatorType: 'auto',
      userVerification: 'preferred',
      timeout: 60000,
    });

    const response = await fetch('http://localhost:3000/login', {
      body: JSON.stringify({
        authentication: authentication,
        nounce,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { accessToken } = await response.json();
    await this.session.logUser(accessToken);

    this.router.transitionTo('dashboard');
  }
}
