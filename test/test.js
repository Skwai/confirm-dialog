const CLASS_NAME = "ConfirmDialog";

describe('ConfirmDialog', function() {
  it('creates elements', function () {
    const confirm = new ConfirmDialog();
    assert.ok(confirm.element instanceof Node);
    assert.ok(confirm.element.parentNode.isSameNode(confirm.element.parentNode));
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