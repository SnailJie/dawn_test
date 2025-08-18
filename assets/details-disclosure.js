class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.hoverTimeout = null;
    this.isHoverEnabled = window.matchMedia('(min-width: 990px)').matches;

    // 监听屏幕尺寸变化
    window.matchMedia('(min-width: 990px)').addEventListener('change', (e) => {
      this.isHoverEnabled = e.matches;
      if (!this.isHoverEnabled) {
        this.removeHoverListeners();
      } else {
        this.addHoverListeners();
      }
    });

    if (this.isHoverEnabled) {
      this.addHoverListeners();
    }
  }

  addHoverListeners() {
    this.onMouseEnterBound = this.onMouseEnter.bind(this);
    this.onMouseLeaveBound = this.onMouseLeave.bind(this);
    this.addEventListener('mouseenter', this.onMouseEnterBound);
    this.addEventListener('mouseleave', this.onMouseLeaveBound);
  }

  removeHoverListeners() {
    if (this.onMouseEnterBound) {
      this.removeEventListener('mouseenter', this.onMouseEnterBound);
    }
    if (this.onMouseLeaveBound) {
      this.removeEventListener('mouseleave', this.onMouseLeaveBound);
    }
  }

  onMouseEnter() {
    if (!this.isHoverEnabled) return;

    // 清除任何存在的关闭延时
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // 打开菜单
    this.open();
  }

  onMouseLeave() {
    if (!this.isHoverEnabled) return;

    // 延迟关闭菜单，给用户时间移动到子菜单
    this.hoverTimeout = setTimeout(() => {
      this.close();
      this.hoverTimeout = null;
    }, 300); // 300ms延迟
  }

  open() {
    if (!this.mainDetailsToggle.hasAttribute('open')) {
      this.mainDetailsToggle.setAttribute('open', '');
      this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', 'true');
      this.onToggle();
    }
  }

  close() {
    // 清除悬浮延时
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', 'false');
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
