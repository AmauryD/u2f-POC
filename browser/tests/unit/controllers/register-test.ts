import { module, test } from 'qunit';
import { setupTest } from 'browser/tests/helpers';

module('Unit | Controller | register', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:register');
    assert.ok(controller);
  });
});
