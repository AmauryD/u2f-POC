import Controller from '@ember/controller';
import { action } from '@ember/object';
import Router from '@ember/routing/router';
import { service } from '@ember/service';
import { client } from '@passwordless-id/webauthn';
import { getChallenge } from 'browser/utils/challenge';

export function formDataToObject(formData: FormData) {
  const object: Record<string, unknown> = {};
  formData.forEach((value, key) => (object[key] = value));
  return object;
}

export default class RegisterController extends Controller {
  @service declare router: Router;

  @action
  async register(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    const nounce = await getChallenge();

    const registration = await client.register(
      data.get('username') as string,
      nounce,
      {
        authenticatorType: 'auto',
        userVerification: 'required',
        timeout: 60000,
        attestation: false,
        userHandle: crypto.randomUUID(),
      },
    );

    await fetch('http://localhost:3000/register', {
      body: JSON.stringify({
        registration: registration,
        userData: formDataToObject(data),
        nounce,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.router.transitionTo('login');
  }
}
