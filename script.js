document.addEventListener('DOMContentLoaded', () => {
  // Current year for footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Smooth scrolling for nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Hero slider functionality
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-controls .dot');
  let currentSlide = 0;
  const slideInterval = 5000;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      dots[i].classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  let autoSlide = setInterval(nextSlide, slideInterval);
  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      clearInterval(autoSlide);
      currentSlide = parseInt(e.target.dataset.slide, 10);
      showSlide(currentSlide);
      autoSlide = setInterval(nextSlide, slideInterval);
    });
  });
  showSlide(currentSlide);

  // Product filtering
  const applyFiltersBtn = document.getElementById('apply-filters');
  const allProductsGrid = document.querySelector('.all-products-grid');
  const productCards = allProductsGrid 
    ? Array.from(allProductsGrid.querySelectorAll('.product-card')) 
    : [];

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const seriesFilter = document.getElementById('series-filter').value;
      const sizeFilter = document.getElementById('size-filter').value;
      const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
      const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

      productCards.forEach(card => {
        const { series, size, price } = card.dataset;
        const matches = (
          (seriesFilter === 'all' || series === seriesFilter) &&
          (sizeFilter === 'all' || parseInt(size, 10) === parseInt(sizeFilter, 10)) &&
          (price >= minPrice && price <= maxPrice)
        );
        card.classList.toggle('hidden', !matches);
      });
    });
  }

  // Smart navigation (search-based scroll to section or product)
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const query = searchInput.value.toLowerCase().trim();

        // Section keyword map
        const sectionMap = {
          'contact': 'contact',
          'contacts': 'contact',
          'support': 'contact',
          'qled': 'qled',
          '4k': 'qled',
          'about': 'about',
          'who we are': 'about',
          'tv': 'qled'
        };

        // Try match with section name
        const key = Object.keys(sectionMap).find(k => query.includes(k));
        const secId = key && sectionMap[key];
        const section = secId && document.getElementById(secId);

        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Try match with product image alt text
          const productCards = document.querySelectorAll('.product-card');
          let found = false;

          productCards.forEach(card => {
            const img = card.querySelector('img');
            if (img && img.alt.toLowerCase().includes(query)) {
              card.scrollIntoView({ behavior: 'smooth' });
              card.classList.add('highlight');
              setTimeout(() => card.classList.remove('highlight'), 2000);
              found = true;
            }
          });

          if (!found) {
            alert('No matching product or section found.');
          }
        }
      }
    });
  }

  // ✅ Live product model search using <img alt="..."> instead of <h3>
  if (searchInput && productCards.length > 0) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();

      if (query === '') {
        productCards.forEach(card => card.classList.remove('hidden'));
        return;
      }

      productCards.forEach(card => {
        const imgAlt = card.querySelector('img')?.alt.toLowerCase() || '';
        const matches = imgAlt.includes(query);
        card.classList.toggle('hidden', !matches);
      });
    });
  }

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scrollToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) scrollBtn.style.display = 'block';
    else scrollBtn.style.display = 'none';
  });
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Read More toggles
  [
    ['read-more-btn', 'more-text'],
    ['screen-size-btn', 'screen-size-more'],
    ['energy-btn', 'energy-more']
  ].forEach(([btnId, textId]) => {
    const btn = document.getElementById(btnId);
    const txt = document.getElementById(textId);
    if (btn && txt) {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const show = txt.style.display !== 'inline';
        txt.style.display = show ? 'inline' : 'none';
        btn.textContent = show ? 'Read Less' : 'Read More';
      });
    }
  });

  // View Details toggle
  document.querySelectorAll('.toggle-details').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const details = document.getElementById(targetId);
      if (!details) return;

      const show = details.style.display === 'none';
      details.style.display = show ? 'block' : 'none';
      btn.textContent = show ? 'Hide Details' : 'View Details';
    });
  });
});
