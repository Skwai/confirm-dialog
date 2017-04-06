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
    this.cancelled = false;
    this.destroyed = false;
    this.loading = false;
    if (!(this.opts.parent instanceof Node)) {
      throw Error('`parent` is not a valid `HTMLElement`');
    }
    Object.assign(this, {
      handleConfirm: this.handleConfirm.bind(this),
      handleCancel: this.handleCancel.bind(this),
      handleEscape: this.handleEscape.bind(this),
    });
    this.render();
  }

  render() {
    if (this.element) {
      throw Error('Cannot render, `this.element` already exists');
    }
    this.element = document.createElement('div');
    this.element.classList.add(this.opts.className);
    this.element.innerHTML = this.template(this.opts);
    this.confirmButton = this.getConfirmButton();
    this.cancelButton = this.getCancelButton();
    this.opts.parent.appendChild(this.element);
    this.bindListeners();
  }

  destroy() {
    this.unbindListeners();
    if (this.element instanceof Node && !this.destroyed) {
      this.element.parentNode.removeChild(this.element);
      delete this.element;
      this.destroyed = true;
    }
    return this.destroyed;
  }

  handleEscape(ev) {
    if (ev.keyCode === ESCAPE_KEYCODE) {
      this.handleCancel(ev);
    }
  }

  getConfirmButton() {
    this.confirmButton = this.confirmButton || this.element.querySelector(`.${this.opts.className}__Confirm`);
    return this.confirmButton;
  }

  getCancelButton() {
    this.cancelButton = this.cancelButton || this.element.querySelector(`.${this.opts.className}__Cancel`);
    return this.cancelButton;
  }

  bindListeners() {
    const { element: el, cancelButton, confirmButton } = this;
    this.getConfirmButton().addEventListener('click', this.handleConfirm);
    if (this.opts.canCancel) {
      el.addEventListener('click', (ev) => ev.target.isSameNode(el) ? this.handleCancel() : ev);
      window.addEventListener('keyup', this.handleEscape);
      this.getCancelButton().addEventListener('click', this.handleCancel);
    }
  }

  unbindListeners() {
    window.removeEventListener('keyup', this.handleEscape);
  }

  confirm() {
    return this.handleConfirm();
  }

  cancel() {
    return this.handleCancel();
  }

  async handleCancel(ev) {
    if (!this.opts.canCancel || this.loading) {
      return;
    }
    this.loading = true;
    await this.opts.onCancel(ev);
    this.loading = false;
    this.destroy();
    return true;
  }

  async handleConfirm(ev) {
    if (this.loading) {
      return false;
    }
    this.loading = true;
    await this.opts.onConfirm(ev);
    this.loading = false;
    this.destroy();
    return true;
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
      <div
        class="${cn}__Content"
        role="alertdialog"
        aria-hidden="false"
        aria-labelledby=""
        aria-describedby=""
      >
        <header class="${cn}__Header">
          <h4 class="${cn}__Title">${title}</h4>
        </header>
        ${message ? `<div class="${cn}__Message">${message}</div>` : ''}
        <footer class="${cn}__Actions">
          ${confirmLabel ? `<button type="button" class="${cn}__Confirm">${confirmLabel}</button>` : ''}
          ${canCancel ? `<button type="button" class="${cn}__Cancel">${cancelLabel}</button>` : ''}
        </footer>
      </div>
    `;
  }
}
