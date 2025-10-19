/**
 * Ishrealm Sponsorship Popup System
 * Simple, direct popup implementation
 */

// Global variables
let sponsorPopup = null;
let sponsorBackdrop = null;
let sponsorInitialized = false;

// Configuration
const SPONSOR_CONFIG = {
    showDelay: 10000,        // Show after 10 seconds
    remindDelay: 30 * 60 * 1000, // Remind after 30 minutes
    sponsorUrl: 'https://grabtap.com/c/ishrealm?utm_source=app_share&utm_medium=share&utm_campaign=community_page&utm_content=ishrealm',
    storageKey: 'sponsor_dismissed'
};

// Initialize sponsor popup
function initSponsorPopup() {
    console.log('🎮 Initializing sponsor popup...');
    
    // Get elements
    sponsorPopup = document.getElementById('sponsor-popup');
    sponsorBackdrop = document.getElementById('sponsor-backdrop');
    
    if (!sponsorPopup || !sponsorBackdrop) {
        console.error('❌ Sponsor popup elements not found!');
        console.log('Looking for:', {
            popup: sponsorPopup,
            backdrop: sponsorBackdrop
        });
        return;
    }
    
    console.log('✅ Sponsor popup elements found');
    
    // Check if already dismissed
    if (localStorage.getItem(SPONSOR_CONFIG.storageKey)) {
        console.log('📝 Sponsor popup already dismissed');
        return;
    }
    
    // Setup event listeners
    setupSponsorEvents();
    
    // Schedule show
    setTimeout(() => {
        showSponsorPopup();
    }, SPONSOR_CONFIG.showDelay);
    
    sponsorInitialized = true;
    console.log('✅ Sponsor popup initialized successfully');
}

// Setup event listeners
function setupSponsorEvents() {
    const closeBtn = document.getElementById('sponsor-close');
    const laterBtn = document.getElementById('sponsor-later');
    const linkBtn = document.getElementById('sponsor-link');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', dismissSponsorPopup);
        console.log('✅ Close button event listener added');
    }
    
    if (laterBtn) {
        laterBtn.addEventListener('click', remindLaterSponsorPopup);
        console.log('✅ Later button event listener added');
    }
    
    if (linkBtn) {
        linkBtn.addEventListener('click', openSponsorLink);
        console.log('✅ Link button event listener added');
    }
    
    if (sponsorBackdrop) {
        sponsorBackdrop.addEventListener('click', remindLaterSponsorPopup);
        console.log('✅ Backdrop event listener added');
    }
}

// Show popup
function showSponsorPopup() {
    if (!sponsorPopup || !sponsorBackdrop) {
        console.error('❌ Cannot show popup - elements not found');
        return;
    }
    
    console.log('🎮 Showing sponsor popup...');
    
    // Add active classes
    sponsorPopup.classList.add('active');
    sponsorBackdrop.classList.add('active');
    
    console.log('✅ Sponsor popup shown');
}

// Hide popup
function hideSponsorPopup() {
    if (!sponsorPopup || !sponsorBackdrop) {
        console.error('❌ Cannot hide popup - elements not found');
        return;
    }
    
    console.log('🎮 Hiding sponsor popup...');
    
    // Remove active classes
    sponsorPopup.classList.remove('active');
    sponsorBackdrop.classList.remove('active');
    
    console.log('✅ Sponsor popup hidden');
}

// Dismiss permanently
function dismissSponsorPopup() {
    console.log('❌ Dismissing sponsor popup permanently');
    localStorage.setItem(SPONSOR_CONFIG.storageKey, 'true');
    hideSponsorPopup();
}

// Remind later
function remindLaterSponsorPopup() {
    console.log('⏰ Sponsor popup - remind later');
    hideSponsorPopup();
    
    // Show again after delay
    setTimeout(() => {
        showSponsorPopup();
    }, SPONSOR_CONFIG.remindDelay);
}

// Open sponsor link
function openSponsorLink() {
    console.log('🔗 Opening sponsor link');
    window.open(SPONSOR_CONFIG.sponsorUrl, '_blank');
    dismissSponsorPopup();
}

// Test functions (for debugging)
function testSponsorPopup() {
    console.log('🧪 Testing sponsor popup...');
    showSponsorPopup();
}

function resetSponsorPopup() {
    console.log('🔄 Resetting sponsor popup...');
    localStorage.removeItem(SPONSOR_CONFIG.storageKey);
    console.log('✅ Sponsor popup reset - will show again');
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing sponsor popup...');
    initSponsorPopup();
});

// Make test functions globally available
window.testSponsor = {
    show: testSponsorPopup,
    reset: resetSponsorPopup,
    hide: hideSponsorPopup
};