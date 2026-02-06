// ===========================================================
// Homes That Heal by TerraLux - Website Interactions
// ===========================================================

// Modal functionality
const modal = document.getElementById('waitlistModal');
const openModalBtns = [
    document.getElementById('openWaitlistBtn'),
    document.getElementById('heroWaitlistBtn')
];
const closeModalBtn = document.getElementById('closeModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const modalOverlay = document.querySelector('.modal-overlay');

// Open modal
function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Close modal
function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scroll
    
    // Reset form if success message is showing
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('successMessage');
    if (!successMessage.classList.contains('hidden')) {
        form.style.display = 'block';
        successMessage.classList.add('hidden');
        form.reset();
    }
    
    // Reset multi-step form to step 1
    resetFormToStep1(form);
}

// Helper function to reset multi-step form
function resetFormToStep1(form) {
    const steps = form.querySelectorAll('.form-step');
    const indicators = form.querySelectorAll('.step-indicator');
    
    steps.forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    indicators.forEach((indicator, index) => {
        if (index === 0) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
        indicator.classList.remove('completed');
    });
}

// Attach event listeners
openModalBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
});

closeModalBtn.addEventListener('click', closeModal);
closeSuccessBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Smooth scroll for remaining anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Nav scroll behavior
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 4px 12px rgba(69, 86, 67, 0.08)';
        nav.style.background = 'rgba(250, 249, 246, 0.98)';
    } else {
        nav.style.boxShadow = 'none';
        nav.style.background = 'var(--cream)';
    }
});

// ===================================================
// Multi-step Form Handler (Reusable Component)
// ===================================================

function initMultiStepForm(formElement) {
    let currentStep = 1;
    const totalSteps = 2;
    
    const steps = formElement.querySelectorAll('.form-step');
    const stepIndicators = formElement.querySelectorAll('.step-indicator');
    const nextBtn = formElement.querySelector('.btn-next');
    const backBtn = formElement.querySelector('.btn-back');
    
    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepEl = formElement.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        // Update indicators
        stepIndicators.forEach((indicator, index) => {
            if (index < stepNumber) {
                indicator.classList.add('active');
                indicator.classList.add('completed');
            } else if (index + 1 === stepNumber) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active');
                indicator.classList.remove('completed');
            }
        });
        
        currentStep = stepNumber;
    }
    
    function validateStep(stepNumber) {
        const stepEl = formElement.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const inputs = stepEl.querySelectorAll('input[required], select[required]');
        
        for (let input of inputs) {
            if (!input.value.trim()) {
                input.focus();
                return false;
            }
            
            // Email validation
            if (input.type === 'email' && !input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                alert('Please enter a valid email address.');
                input.focus();
                return false;
            }
        }
        
        return true;
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    showStep(currentStep + 1);
                }
            }
        });
    }
    
    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    }
    
    // Initialize
    showStep(1);
}

// Reusable waitlist form handler
async function handleWaitlistSubmit(form, successMessageId, sourceLocation) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById(successMessageId);
    
    // Validate step 2 before submission
    const step2 = form.querySelector('.form-step[data-step="2"]');
    const inputs = step2.querySelectorAll('input[required], select[required]');
    for (let input of inputs) {
        if (!input.value.trim()) {
            alert('Please fill in all required fields.');
            input.focus();
            return;
        }
    }
    
    // Get form data
    const formData = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        projectType: form.projectType.value,
        budget: form.budget.value,
        timeline: form.timeline.value,
        timestamp: new Date().toISOString(),
        source: sourceLocation
    };
    
    // Validate
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.projectType || !formData.budget || !formData.timeline) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Disable button during submission
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';
    submitBtn.style.opacity = '0.6';
    
    try {
        // Store in localStorage for demo/backup
        const existingData = JSON.parse(localStorage.getItem('homesHealWaitlist') || '[]');
        existingData.push(formData);
        localStorage.setItem('homesHealWaitlist', JSON.stringify(existingData));
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Optional: Send to your backend/CRM (examples below)
        
        // Show success message
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Scroll to success message if in footer
        if (sourceLocation === 'footer') {
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Optional: Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup', {
                'event_category': 'engagement',
                'event_label': 'Homes That Heal - ' + sourceLocation,
                'value': formData.budget
            });
        }
        
        console.log('✅ Waitlist signup successful:', formData);
        
    } catch (error) {
        console.error('❌ Error submitting form:', error);
        alert('Oops! Something went wrong. Please try again or email us at hello@terra-lux.org');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
    }
}

// Initialize multi-step forms
const modalForm = document.getElementById('waitlistForm');
const footerForm = document.getElementById('footerWaitlistForm');

if (modalForm) {
    initMultiStepForm(modalForm);
    modalForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleWaitlistSubmit(this, 'successMessage', 'modal');
    });
}

if (footerForm) {
    initMultiStepForm(footerForm);
    footerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleWaitlistSubmit(this, 'footerSuccessMessage', 'footer');
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll(
        '.included-item, .benefit-card, .principle-item, .faq-item, .journey-step'
    );
    
    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeObserver.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target === Infinity ? '∞' : Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const text = num.textContent;
                if (text === '∞' || text === 'First') return;
                const value = parseInt(text.replace('+', ''));
                if (isNaN(value)) return;
                num.textContent = '0';
                setTimeout(() => {
                    animateCounter(num, value);
                }, 200);
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Console easter egg
console.log(
    '%c🌿 Homes That Heal by TerraLux',
    'font-size: 20px; font-weight: bold; color: #455643;'
);
console.log(
    '%cThe future of housing isn\'t less bad. It\'s regenerative.',
    'font-size: 14px; color: #5a6f57; font-style: italic;'
);
console.log(
    '%c\nInterested in our tech stack or want to collaborate?\nReach out: hello@terra-lux.org',
    'font-size: 12px; color: #8a8a8a;'
);

// Log waitlist data to console (for debugging)
const waitlistData = JSON.parse(localStorage.getItem('homesHealWaitlist') || '[]');
if (waitlistData.length > 0) {
    console.log(`📊 ${waitlistData.length} waitlist entries stored locally:`, waitlistData);
}

// Export for potential integration
window.HomesHealWaitlist = {
    getData: () => JSON.parse(localStorage.getItem('homesHealWaitlist') || '[]'),
    clearData: () => localStorage.removeItem('homesHealWaitlist'),
    exportCSV: function() {
        const data = this.getData();
        if (data.length === 0) {
            alert('No waitlist data to export');
            return;
        }
        
        // CSV headers
        const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Timeline', 'Updates', 'Timestamp'];
        const rows = data.map(entry => [
            entry.firstName,
            entry.lastName,
            entry.email,
            entry.phone || 'N/A',
            entry.projectType || 'N/A',
            entry.budget || 'N/A',
            entry.timeline || 'N/A',
            entry.updates ? 'Yes' : 'No',
            new Date(entry.timestamp).toLocaleString()
        ]);
        
        // Build CSV
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `homes-heal-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Helper: Export waitlist from console
// Usage: HomesHealWaitlist.exportCSV()
console.log('💡 Tip: Use HomesHealWaitlist.exportCSV() to download waitlist data');
