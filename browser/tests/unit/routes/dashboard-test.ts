import { module, test } from 'qunit';
import { setupTest } from 'browser/tests/helpers';

module('Unit | Route | dashboard', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:dashboard');
    assert.ok(route);
  });
});
