// ============================================
// M/S Supraon Enterprises - Main TypeScript
// ============================================

interface HeroTile {
  id: string;
  name: string;
  category: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  color: string;
}

type FilterType = 'all' | 'floral' | 'divine' | 'modern' | 'nature';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
  initializeHeroGrid();
  initializeGallery();
  initializeScrollReveal();
  initializeForm();
  initializeLightbox();
});

// ============================================
// Hero Grid Initialization
// ============================================
function initializeHeroGrid(): void {
  const heroGrid = document.getElementById('heroGrid');
  if (!heroGrid) return;

  const heroTiles: HeroTile[] = [
    { id: 'SE-1', name: 'Marble Arch', category: 'modern', color: '#E8D5C4' },
    { id: 'SE-2', name: 'Rose Vase', category: 'floral', color: '#D4A5A5' },
    { id: 'SE-3', name: 'Rose Vine', category: 'floral', color: '#8B6F47' }
  ];

  heroGrid.innerHTML = heroTiles.map((tile: HeroTile): string => `
    <div class="hero-tile" data-id="${tile.id}">
      <div class="hero-tile-inner" style="background: linear-gradient(135deg, ${tile.color} 0%, ${adjustBrightness(tile.color, -20)} 100%);">
        ${tile.id}
      </div>
      <div class="hero-tile-lbl">${tile.name}</div>
    </div>
  `).join('');
}

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num: number = parseInt(hex.replace('#', ''), 16);
  const amt: number = Math.round(2.55 * percent);
  const R: number = (num >> 16) + amt;
  const G: number = (num >> 8 & 0x00FF) + amt;
  const B: number = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

// ============================================
// Gallery Initialization
// ============================================
function initializeGallery(): void {
  const galleryGrid = document.getElementById('galleryGrid');
  const filterRow = document.getElementById('filterRow');
  
  if (!galleryGrid || !filterRow) return;

  const products: Product[] = [
    { id: 'SE-1', name: 'Marble Arch', code: 'SE-1', category: 'modern', color: '#E8D5C4' },
    { id: 'SE-2', name: 'Rose Vase (Dark Diamond)', code: 'SE-2', category: 'floral', color: '#D4A5A5' },
    { id: 'SE-3', name: 'Rose Vine (Wood Panel)', code: 'SE-3', category: 'floral', color: '#8B6F47' },
    { id: 'SE-4', name: 'Floral Elegance (Gold Frame)', code: 'SE-4', category: 'floral', color: '#C8973A' },
    { id: 'SE-5', name: 'Fruit Bounty', code: 'SE-5', category: 'nature', color: '#A68550' },
    { id: 'SE-6', name: 'Divine (Vishnu Family)', code: 'SE-6', category: 'divine', color: '#7A6B4D' },
    { id: 'SE-7', name: 'Mosque Arch', code: 'SE-7', category: 'divine', color: '#8B8B7A' },
    { id: 'SE-8', name: 'Peacock & Butterfly', code: 'SE-8', category: 'nature', color: '#4A5F6F' },
    { id: 'SE-9', name: 'Tulip (Ivory Tufted)', code: 'SE-9', category: 'floral', color: '#E8E0D0' },
    { id: 'SE-10', name: 'Classic Medallion', code: 'SE-10', category: 'modern', color: '#9B8B7E' },
    { id: 'SE-11', name: 'Ganesh (Om)', code: 'SE-11', category: 'divine', color: '#6B5B4F' },
    { id: 'SE-12', name: 'Radha Krishna', code: 'SE-12', category: 'divine', color: '#7A5A3A' },
    { id: 'SE-13', name: 'Radha Krishna (Peacock)', code: 'SE-13', category: 'divine', color: '#5A4A3A' }
  ];

  function renderGallery(filter: FilterType = 'all'): void {
    if (!galleryGrid) return;
    
    const filtered: Product[] = filter === 'all' 
      ? products 
      : products.filter((p: Product): boolean => p.category === filter);
    
    galleryGrid.innerHTML = filtered.map((product: Product): string => `
      <div class="pcard" data-category="${product.category}" onclick="openLightbox('${product.id}')">
        <div class="pcard-img">
          <div class="pcard-ph" style="background: linear-gradient(135deg, ${product.color} 0%, ${adjustBrightness(product.color, -15)} 100%);">
            ${product.code}
          </div>
          <div class="pcard-overlay">
            <div class="pcard-overlay-code">${product.code}</div>
            <div class="pcard-overlay-cta">Click to enquire →</div>
          </div>
        </div>
        <div class="pcard-info">
          <div class="pcard-code">${product.code}</div>
          <div class="pcard-name">${product.name}</div>
        </div>
      </div>
    `).join('');
  }

  // Filter buttons
  const filterButtons: NodeListOf<Element> = filterRow.querySelectorAll('.fbtn');
  filterButtons.forEach((btn: Element): void => {
    btn.addEventListener('click', (): void => {
      filterButtons.forEach((b: Element): void => b.classList.remove('active'));
      (btn as HTMLElement).classList.add('active');
      const filter = (btn as HTMLElement).getAttribute('data-filter') as FilterType;
      renderGallery(filter);
    });
  });

  // Initial render
  renderGallery();
}

// ============================================
// Scroll Reveal Animation
// ============================================
function initializeScrollReveal(): void {
  const revealElements: NodeListOf<Element> = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry: IntersectionObserverEntry): void => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((el: Element): void => observer.observe(el));
}

// ============================================
// Lightbox
// ============================================
let currentLightboxId: string | null = null;

function openLightbox(id: string): void {
  currentLightboxId = id;
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.add('open');
  }
}

function closeLightbox(): void {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
  }
}

function initializeLightbox(): void {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lbClose');
  
  if (!lightbox) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e: MouseEvent): void => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

// ============================================
// Contact Form
// ============================================
function initializeForm(): void {
  const sendBtn = document.getElementById('sendBtn');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', (): void => {
    const nameElement = document.getElementById('fname') as HTMLInputElement;
    const phoneElement = document.getElementById('fphone') as HTMLInputElement;
    const designElement = document.getElementById('fdesign') as HTMLSelectElement;
    const messageElement = document.getElementById('fmessage') as HTMLTextAreaElement;

    const name: string = nameElement.value.trim();
    const phone: string = phoneElement.value.trim();
    const design: string = designElement.value.trim();
    const message: string = messageElement.value.trim();

    if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    // Construct WhatsApp message
    let whatsappMsg: string = `Hello! I'm interested in your door designs.\n\n`;
    whatsappMsg += `Name: ${name}\n`;
    whatsappMsg += `Phone: ${phone}\n`;
    if (design) whatsappMsg += `Design Interest: ${design}\n`;
    if (message) whatsappMsg += `Message: ${message}\n`;

    // Encode for WhatsApp
    const encoded: string = encodeURIComponent(whatsappMsg);
    
    // WhatsApp API URL
    const whatsappNumber: string = '919430062204'; // Replace with actual business number
    const whatsappUrl: string = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  });
}

// ============================================
// Utility: Get random color
// ============================================
function getRandomColor(): string {
  const colors: string[] = ['#E8D5C4', '#D4A5A5', '#8B6F47', '#C8973A', '#A68550', '#7A6B4D', '#4A5F6F'];
  return colors[Math.floor(Math.random() * colors.length)];
}
