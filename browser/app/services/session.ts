import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export interface User {
  username: string;
  email: string;
}

export default class SessionService extends Service {
  @tracked public user?: User;
  @tracked public accessToken?: string;

  public async logUser(accessToken: string) {
    this.accessToken = accessToken;
    this.user = await this.getUser();
  }

  public async getUser() {
    const response = await fetch('http://localhost:3000/profile', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const user = await response.json();
    return user as User;
  }

  public isLoggedIn() {
    return this.accessToken !== undefined;
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:session')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('session') declare altName: SessionService;`.
declare module '@ember/service' {
  interface Registry {
    session: SessionService;
  }
}
