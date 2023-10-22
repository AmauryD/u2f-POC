import { module, test } from 'qunit';
import { setupTest } from 'browser/tests/helpers';

module('Unit | Route | register', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:register');
    assert.ok(route);
  });
});
