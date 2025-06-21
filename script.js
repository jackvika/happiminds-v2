document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu__toggle');
    const mobileMenu = document.querySelector('.nav__list');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
            
            // Update aria-expanded attribute
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    let currentTestimonial = 0;

    if (testimonials.length > 0 && prevButton && nextButton) {
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }

        prevButton.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        });

        nextButton.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        });

        // Show first testimonial initially
        showTestimonial(currentTestimonial);
    }

    // Video Play Button
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // In a real implementation, this would launch a modal with the video
            alert('Video player would open here!');
        });
    }

    // Kid-friendly hover effects
    const kidButtons = document.querySelectorAll('.btn--kid');
    kidButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(-2deg)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animate || 'fadeIn';
                    entry.target.classList.add(animation);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        elements.forEach(element => {
            element.style.opacity = '0';
            observer.observe(element);
        });
    };

    animateOnScroll();

    // Easter egg - logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        let clickCount = 0;
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                alert("🌈 You found our secret! Here's a virtual high-five! ✋");
                clickCount = 0;
            }
        });
    }
});

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInDown {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInLeft {
    from { 
      opacity: 0;
      transform: translateX(-20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from { 
      opacity: 0;
      transform: translateX(20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .fadeIn { animation: fadeIn 0.6s ease-out forwards; }
  .fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
  .fadeInLeft { animation: fadeInLeft 0.6s ease-out forwards; }
  .fadeInRight { animation: fadeInRight 0.6s ease-out forwards; }
`;
document.head.appendChild(style);