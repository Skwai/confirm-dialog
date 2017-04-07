const CLASS_NAME = "ConfirmDialog";

describe('ConfirmDialog', function() {
  it('renders to document.body by default', function () {
    const confirm = new ConfirmDialog();
    assert.ok(confirm.element instanceof Node);
    assert.ok(confirm.element.parentNode.isSameNode(confirm.element.parentNode));
  });

  it('renders element to supplied parent', function() {
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    const confirm = new ConfirmDialog({ parent });
    assert.ok(confirm.element.parentNode.isSameNode(parent));
  });

  it('renders title', function() {
    const title = "Example Title";
    const confirm = new ConfirmDialog({ title });
    const el = confirm.element.querySelector(`.${CLASS_NAME}__Title`);
    assert.equal(el.innerText, title);
  })

  it('renders message', function() {
    const message = "Example description";
    const confirm = new ConfirmDialog({ message });
    const el = confirm.element.querySelector(`.${CLASS_NAME}__Message`);
    assert.equal(el.innerText, message);
  });

  it('renders confirm label', function() {
    const confirmLabel = "Test Confirm";
    const confirm = new ConfirmDialog({ confirmLabel });
    const el = confirm.confirmButton;
    assert.equal(el.innerText, confirmLabel);
  });

  it('renders cancel label', function() {
    const cancelLabel = "Test Cancel";
    const confirm = new ConfirmDialog({ cancelLabel });
    const el = confirm.cancelButton;
    assert.equal(el.innerText, cancelLabel);
  });

  it('fires confirm callback on confirm click', function() {
    return new Promise((resolve, reject) => {
      const onConfirm = () => resolve();
      const confirm = new ConfirmDialog({ onConfirm });
      confirm.confirmButton.click();
    });
  });

  it('fires cancel callback on cancel click', function() {
    return new Promise((resolve, reject) => {
      const onCancel = () => resolve();
      const confirm = new ConfirmDialog({ onCancel });
      confirm.cancelButton.click();
    });
  });

  it('cannot cancel if `canCancel` is `false`', function() {
    const confirm = new ConfirmDialog({ canCancel: false });
    confirm.cancel();
    assert.ok(confirm.element instanceof Node);
    assert.equal(confirm.cancelled, false);
    assert.equal(confirm.cancelButton, undefined);
  });

  it('destroys DOM when cancelled', function() {
    return new Promise((resolve, reject) => {
      const confirm = new ConfirmDialog();
      confirm.cancel().then(() => {
        assert.ok(confirm.cancelled, 'sets cancelled to true when cancelled');
        assert.ok(confirm.destroyed, 'sets destroyed to true when destroyed');
        assert.notOk(confirm.element, 'destroys dom element');
        resolve();
      });
    });
  });

  it('does not cancel if onCancel is rejected', function() {
    return new Promise((resolve, reject) => {
      const onCancel = () => Promise.reject();
      const confirm = new ConfirmDialog({ onCancel });
      confirm.cancel()
        .then(() => reject('should not return resolved promise'))
        .catch(() => confirm.cancelled === false ? resolve() : reject('cancelled should be false'))
    });
  });

  it('does not confirm if onConfirm is rejected', function() {
    return new Promise((resolve, reject) => {
      const onConfirm = () => Promise.reject();
      const confirm = new ConfirmDialog({ onConfirm });
      confirm.confirm()
        .then(() => reject('should not return resolved promise'))
        .catch(() => confirm.confirmed === false ? resolve() : reject('confirmed should be false'))
    });
  });

  it('awaits promise before cancelling', function(done) {
    const onCancel = () => new Promise((resolve) => {
      setTimeout(resolve, 100);
    }).then(done);
    const confirm = new ConfirmDialog({ onCancel });
    const cancel = confirm.cancel();
    assert.ok(cancel instanceof Promise);
  })

  it('fires cancel callback on root element click', function() {
    return new Promise((resolve, reject) => {
      const onCancel = resolve;
      const confirm = new ConfirmDialog({ onCancel });
      confirm.element.click();
    });
  });

  it('does not fire cancel callback on root element child click', function() {
    return new Promise((resolve, reject) => {
      const onCancel = reject;
      const confirm = new ConfirmDialog({ onCancel });
      confirm.element.firstElementChild.click();
      setTimeout(resolve, 100);
    });
  });
});