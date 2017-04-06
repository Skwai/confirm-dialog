describe('ConfirmDialog', function() {

  it('creates elements', function () {
    const confirm = new ConfirmDialog();
    assert.ok(confirm.element instanceof Node);
    assert.ok(confirm.element.parentNode.isSameNode(confirm.element.parentNode));
  });
});