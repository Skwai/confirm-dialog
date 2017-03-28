const DEFAULTS = {
  cancelLabel: 'Cancel',
  canCancel: true,
  className: 'ConfirmDialog',
  confirmLabel: 'Confirm',
  message: null,
  onCancel: () => {},
  onConfirm: () => {},
  parent: document.body,
  title: 'Please Confirm',
};

const ESCAPE_KEYCODE = 27;

export default class ConfirmDialog {
  constructor(args) {
    this.opts = Object.assign({}, DEFAULTS, args);
    if (!(this.opts.parent instanceof Node)) {
      throw Error('`parent` is not a valid `Node`');
    }
    Object.assign(this, {
      handleConfirm: this.handleConfirm.bind(this),
      handleCancel: this.handleCancel.bind(this),
      handleEscape: this.handleEscape.bind(this),
    });
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.template(this.opts);
    document.body.appendChild(this.element);
    this.bindListeners();
  }

  destroy() {
    this.unbindListeners();
    this.element.parentNode.removeChild(this.element);
    delete this.element;
  }

  handleEscape(ev) {
    if (ev.keyCode === ESCAPE_KEYCODE) {
      this.handleCancel(ev);
    }
  }

  bindListeners() {
    const { element: el } = this;
    const { canCancel } = this.opts;
    if (canCancel) {
      el.addEventListener('click', (ev) => {
        if (ev.target.isSameNode(el)) {
          this.handleCancel();
        }
      });
      window.addEventListener('keyup', this.handleEscape);
    }
  }

  unbindListeners() {
    window.removeEventListener('keyup', this.handleEscape);
  }

  async handleCancel(ev) {
    await this.onCancel(ev);
    this.destroy();
  }

  async handleConfirm(ev) {
    await this.onConfirm(ev);
    this.destroy();
  }

  template({
    canCancel,
    cancelLabel,
    className: cn,
    confirmLabel,
    message,
    title,
  }) {
    return `
      <div class="${cn}__Content">
        <header class="${cn}__Header">
          <h4 class="${cn}__Title">${title}</h4>
        </header>
        ${message ? `<div class="${cn}__Message">${message}</div>` : ''}
        <div class="${cn}__Actions">
          ${confirmLabel ? `<button class="${cn}__Confirm">${confirmLabel}</button>` : ''}
          ${canCancel ? `<button class="${cn}__Cancel">${cancelLabel}</button>` : ''}
        </div>
      </div>
    `;
  }
}