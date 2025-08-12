// Aesop Header JavaScript

class AesopHeader {
  constructor() {
    this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    this.mobileMenuClose = document.getElementById('mobile-menu-close');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.searchToggle = document.getElementById('search-toggle');
    this.searchBar = document.getElementById('search-bar');
    this.body = document.body;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initEscapeKey();
  }

  bindEvents() {
    // Mobile menu events
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    if (this.mobileMenuClose) {
      this.mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
    }

    // Search events
    if (this.searchToggle) {
      this.searchToggle.addEventListener('click', () => this.toggleSearch());
    }

    // Close mobile menu when clicking on overlay
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener('click', (e) => {
        if (e.target === this.mobileMenu) {
          this.closeMobileMenu();
        }
      });
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (this.searchBar && this.searchBar.classList.contains('is-open')) {
        if (!this.searchBar.contains(e.target) && !this.searchToggle.contains(e.target)) {
          this.closeSearch();
        }
      }
    });
  }

  initEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeSearch();
      }
    });
  }

  toggleMobileMenu() {
    if (this.mobileMenu.classList.contains('is-open')) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenu.classList.add('is-open');
    this.body.style.overflow = 'hidden';
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');

    // Focus the close button for accessibility
    this.mobileMenuClose.focus();
  }

  closeMobileMenu() {
    this.mobileMenu.classList.remove('is-open');
    this.body.style.overflow = '';
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  toggleSearch() {
    if (this.searchBar.classList.contains('is-open')) {
      this.closeSearch();
    } else {
      this.openSearch();
    }
  }

  openSearch() {
    this.searchBar.classList.add('is-open');
    this.searchToggle.setAttribute('aria-expanded', 'true');

    // Focus the search input
    const searchInput = this.searchBar.querySelector('.aesop-header__search-input');
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    }
  }

  closeSearch() {
    this.searchBar.classList.remove('is-open');
    this.searchToggle.setAttribute('aria-expanded', 'false');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AesopHeader();
});

// Sticky header behavior
class AesopStickyHeader extends HTMLElement {
  constructor() {
    super();
    this.header = this.querySelector('.aesop-header');
    this.headerHeight = this.header.offsetHeight;
    this.currentScrollTop = 0;
    this.isHeaderSticky = this.getAttribute('data-sticky-type') !== 'none';

    if (this.isHeaderSticky) {
      this.init();
    }
  }

  init() {
    this.onScrollHandler = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScrollHandler, { passive: true });
    this.setHeaderHeight();
  }

  setHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.headerHeight) {
      this.header.classList.add('is-scrolled');
    } else {
      this.header.classList.remove('is-scrolled');
    }

    this.currentScrollTop = scrollTop;
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScrollHandler);
  }
}

// Define custom element
customElements.define('sticky-header', AesopStickyHeader);
