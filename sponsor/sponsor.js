/**
 * Ishrealm Sponsorship Popup System
 * Modular, reusable sponsorship popup for anime streaming sites
 */

class SponsorPopup {
    constructor(options = {}) {
        this.options = {
            showDelay: 10000,        // Show after 10 seconds
            remindDelay: 30 * 60 * 1000, // Remind after 30 minutes
            sponsorUrl: 'https://grabtap.com/c/ishrealm?utm_source=app_share&utm_medium=share&utm_campaign=community_page&utm_content=ishrealm',
            storageKey: 'sponsor_dismissed',
            ...options
        };
        
        this.popup = null;
        this.backdrop = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Only initialize if elements exist
        this.popup = document.getElementById('sponsor-popup');
        this.backdrop = document.getElementById('sponsor-backdrop');
        
        if (!this.popup || !this.backdrop) {
            console.log('Sponsor popup elements not found, skipping initialization');
            return;
        }
        
        // Check if already dismissed
        if (localStorage.getItem(this.options.storageKey)) {
            console.log('Sponsor popup already dismissed');
            return;
        }
        
        this.setupEventListeners();
        this.scheduleShow();
        this.isInitialized = true;
        
        console.log('Sponsor popup initialized');
    }
    
    setupEventListeners() {
        const closeBtn = document.getElementById('sponsor-close');
        const laterBtn = document.getElementById('sponsor-later');
        const linkBtn = document.getElementById('sponsor-link');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.dismiss());
        }
        
        if (laterBtn) {
            laterBtn.addEventListener('click', () => this.remindLater());
        }
        
        if (linkBtn) {
            linkBtn.addEventListener('click', () => this.openSponsorLink());
        }
        
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.remindLater());
        }
    }
    
    scheduleShow() {
        setTimeout(() => {
            this.show();
        }, this.options.showDelay);
    }
    
    show() {
        if (!this.isInitialized || !this.popup || !this.backdrop) return;
        
        this.popup.classList.add('active');
        this.backdrop.classList.add('active');
        
        console.log('Sponsor popup shown');
    }
    
    hide() {
        if (!this.popup || !this.backdrop) return;
        
        this.popup.classList.remove('active');
        this.backdrop.classList.remove('active');
        
        console.log('Sponsor popup hidden');
    }
    
    dismiss() {
        localStorage.setItem(this.options.storageKey, 'true');
        this.hide();
        
        console.log('Sponsor popup dismissed permanently');
    }
    
    remindLater() {
        this.hide();
        
        // Show again after delay
        setTimeout(() => {
            this.show();
        }, this.options.remindDelay);
        
        console.log(`Sponsor popup will show again in ${this.options.remindDelay / 60000} minutes`);
    }
    
    openSponsorLink() {
        window.open(this.options.sponsorUrl, '_blank');
        this.dismiss();
        
        console.log('Sponsor link opened');
    }
    
    // Public method to manually show popup (for testing)
    forceShow() {
        this.show();
    }
    
    // Public method to reset dismissal (for testing)
    reset() {
        localStorage.removeItem(this.options.storageKey);
        console.log('Sponsor popup reset - will show again');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sponsor popup
    window.sponsorPopup = new SponsorPopup();
    
    // Make it globally accessible for testing
    window.testSponsor = {
        show: () => window.sponsorPopup?.forceShow(),
        reset: () => window.sponsorPopup?.reset(),
        hide: () => window.sponsorPopup?.hide()
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SponsorPopup;
}
