// Gallery Data
const galleryData = [
    {
        id: 1,
        title: "Grafted Tomato Plants",
        description: "Disease resistant varieties with 95% success rate",
        category: "plants",
        image: "img/bg-img/4.jpg",
        likes: 0
    },
    {
        id: 2,
        title: "Grafted Chili Plants",
        description: "High yield varieties for maximum profit",
        category: "plants",
        image: "img/bg-img/5.jpg",
        likes: 0
    },
    {
        id: 3,
        title: "Grafted Brinjal Plants",
        description: "Long harvest period with superior quality",
        category: "plants",
        image: "img/bg-img/6.jpg",
        likes: 0
    },
    {
        id: 4,
        title: "Grafted Capsicum",
        description: "Premium quality bell peppers",
        category: "plants",
        image: "img/bg-img/7.jpg",
        likes: 0
    },
    {
        id: 5,
        title: "Modern Greenhouse",
        description: "Climate controlled environment for optimal growth",
        category: "nursery",
        image: "img/bg-img/1.jpg",
        likes: 0
    },
    {
        id: 6,
        title: "Nursery Infrastructure",
        description: "State-of-the-art facilities with latest technology",
        category: "nursery",
        image: "img/bg-img/2.jpg",
        likes: 0
    },
    {
        id: 7,
        title: "Expert Grafting",
        description: "Precision grafting techniques by skilled professionals",
        category: "grafting",
        image: "img/bg-img/3.jpg",
        likes: 0
    },
    {
        id: 8,
        title: "Grafting Laboratory",
        description: "Advanced setup for grafting operations",
        category: "grafting",
        image: "img/bg-img/8.jpg",
        likes: 0
    },
    {
        id: 9,
        title: "Successful Farmer - Rajesh",
        description: "40% yield increase with our grafted plants",
        category: "farmers",
        image: "img/bg-img/team1.png",
        likes: 0
    },
    {
        id: 10,
        title: "Successful Farmer - Sunita",
        description: "5 years of partnership and growing success",
        category: "farmers",
        image: "img/bg-img/team2.png",
        likes: 0
    },
    {
        id: 11,
        title: "Seedling Trays",
        description: "Organized seedling production system",
        category: "nursery",
        image: "img/bg-img/9.jpg",
        likes: 0
    },
    {
        id: 12,
        title: "Quality Control",
        description: "Every plant undergoes strict quality checks",
        category: "nursery",
        image: "img/bg-img/10.jpg",
        likes: 0
    }
];

let currentFilter = 'all';
let currentImageIndex = 0;
let filteredData = [...galleryData];
let totalLikes = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGallery(galleryData);
    initializeEventListeners();
    initializeCursorGlow();
    updateStats();
    animateOnScroll();
});

// Render Gallery
function renderGallery(data) {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    
    data.forEach((item, index) => {
        const card = createGalleryCard(item, index);
        grid.appendChild(card);
    });
    
    // Staggered animation
    gsap.from('.gallery-item', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

// Create Gallery Card
function createGalleryCard(item, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.setAttribute('data-category', item.category);
    div.style.animationDelay = `${index * 0.1}s`;
    
    div.innerHTML = `
        <div class="gallery-card" data-tilt>
            <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
            <div class="gallery-actions">
                <button class="action-btn like-btn" onclick="toggleLike(${item.id}, this)">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn" onclick="openModal(${item.id})">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
            <div class="gallery-overlay">
                <span class="gallery-category">${getCategoryEmoji(item.category)} ${item.category}</span>
                <h3 class="gallery-title">${item.title}</h3>
                <p class="gallery-description">${item.description}</p>
            </div>
        </div>
    `;
    
    // Add 3D tilt effect
    const card = div.querySelector('.gallery-card');
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
    
    return div;
}

// Get Category Emoji
function getCategoryEmoji(category) {
    const emojis = {
        plants: '🌱',
        nursery: '🏡',
        grafting: '🔬',
        farmers: '👨🌾'
    };
    return emojis[category] || '🌿';
}

// Filter Gallery
function filterGallery(category) {
    currentFilter = category;
    
    if (category === 'all') {
        filteredData = [...galleryData];
    } else {
        filteredData = galleryData.filter(item => item.category === category);
    }
    
    // Animate out
    gsap.to('.gallery-item', {
        y: 30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
            renderGallery(filteredData);
            updateStats();
        }
    });
}

// Search Gallery
function searchGallery(query) {
    const searchTerm = query.toLowerCase();
    
    let results = galleryData;
    
    if (currentFilter !== 'all') {
        results = results.filter(item => item.category === currentFilter);
    }
    
    if (searchTerm) {
        results = results.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    }
    
    filteredData = results;
    
    gsap.to('.gallery-item', {
        y: 30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
            renderGallery(filteredData);
            updateStats();
        }
    });
}

// Toggle Like
function toggleLike(id, button) {
    const item = galleryData.find(i => i.id === id);
    
    if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        item.likes--;
        totalLikes--;
    } else {
        button.classList.add('liked');
        item.likes++;
        totalLikes++;
        
        // Heart animation
        gsap.from(button, {
            scale: 1.5,
            duration: 0.3,
            ease: 'back.out'
        });
    }
    
    updateStats();
}

// Open Modal
function openModal(id) {
    const item = galleryData.find(i => i.id === id);
    currentImageIndex = galleryData.indexOf(item);
    
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    
    modalImage.src = item.image;
    modalTitle.textContent = item.title;
    modalCategory.textContent = `${getCategoryEmoji(item.category)} ${item.category}`;
    
    modal.classList.add('active');
    
    // Animate modal
    gsap.from('.modal-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out'
    });
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    
    gsap.to('.modal-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            modal.classList.remove('active');
        }
    });
}

// Next Image
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryData.length;
    updateModalImage();
}

// Previous Image
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
    updateModalImage();
}

// Update Modal Image
function updateModalImage() {
    const item = galleryData[currentImageIndex];
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    
    gsap.to(modalImage, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            modalImage.src = item.image;
            modalTitle.textContent = item.title;
            modalCategory.textContent = `${getCategoryEmoji(item.category)} ${item.category}`;
            
            gsap.to(modalImage, {
                opacity: 1,
                duration: 0.3
            });
        }
    });
}

// Update Stats
function updateStats() {
    const imageCount = document.getElementById('imageCount');
    const likeCount = document.getElementById('likeCount');
    
    animateNumber(imageCount, filteredData.length);
    animateNumber(likeCount, totalLikes);
}

// Animate Number
function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    
    gsap.to({ value: current }, {
        value: target,
        duration: 0.5,
        onUpdate: function() {
            element.textContent = Math.round(this.targets()[0].value);
        }
    });
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterGallery(filter);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchGallery(e.target.value);
        }, 300);
    });
    
    // Modal close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'ArrowRight') {
            nextImage();
        }
        if (e.key === 'ArrowLeft') {
            prevImage();
        }
    });
    
    // Modal close on outside click
    document.getElementById('imageModal').addEventListener('click', (e) => {
        if (e.target.id === 'imageModal') {
            closeModal();
        }
    });
}

// Cursor Glow Effect
function initializeCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// Animate on Scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// gallery-premium.js (updated version)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize stats
    updateStats();
    
    // Gallery data with both images and videos
    const galleryData = [
        {
            id: 1,
            title: "Grafting Process Demonstration",
            category: "grafting",
            type: "video", // Add type property
            src: "videos/grafting-demo.mp4",
            thumbnail: "img/gallery/grafting-thumb.jpg",
            likes: 42,
            description: "Step-by-step grafting technique"
        },
        {
            id: 2,
            title: "Nursery Overview",
            category: "nursery",
            type: "video",
            src: "videos/nursery-tour.mp4",
            thumbnail: "img/gallery/nursery-thumb.jpg",
            likes: 38,
            description: "Complete nursery facility tour"
        },
        {
            id: 3,
            title: "Premium Tomato Plants",
            category: "plants",
            type: "image",
            src: "img/gallery/tomato-plant.jpg",
            thumbnail: "img/gallery/tomato-thumb.jpg",
            likes: 56,
            description: "Healthy grafted tomato plants"
        },
        {
            id: 4,
            title: "Farmer Training Session",
            category: "farmers",
            type: "video",
            src: "videos/farmer-training.mp4",
            thumbnail: "img/gallery/training-thumb.jpg",
            likes: 29,
            description: "Farmers learning new techniques"
        },
        {
            id: 5,
            title: "Quality Check Process",
            category: "process",
            type: "video",
            src: "videos/quality-check.mp4",
            thumbnail: "img/gallery/quality-thumb.jpg",
            likes: 31,
            description: "Plant quality inspection"
        },
        {
            id: 6,
            title: "Greenhouse Interior",
            category: "nursery",
            type: "image",
            src: "img/gallery/greenhouse.jpg",
            thumbnail: "img/gallery/greenhouse-thumb.jpg",
            likes: 47,
            description: "State-of-the-art greenhouse"
        }
    ];

    // Initialize gallery
    renderGallery(galleryData);
    initializeFiltering(galleryData);
    initializeSearch(galleryData);
});

function renderGallery(data) {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    data.forEach(item => {
        const galleryItem = createGalleryItem(item);
        galleryGrid.appendChild(galleryItem);
    });
    
    // Update stats
    updateStats();
}

function createGalleryItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = `gallery-item ${item.category}`;
    itemDiv.setAttribute('data-id', item.id);
    itemDiv.setAttribute('data-type', item.type);
    
    let mediaElement;
    
    if (item.type === 'video') {
        mediaElement = `
            <div class="video-container">
                <video class="gallery-video" preload="metadata" poster="${item.thumbnail}">
                    <source src="${item.src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        `;
    } else {
        mediaElement = `
            <div class="image-container">
                <img src="${item.src}" alt="${item.title}" loading="lazy">
            </div>
        `;
    }
    
    itemDiv.innerHTML = `
        ${mediaElement}
        <div class="gallery-info">
            <div class="gallery-category">${getCategoryIcon(item.category)} ${item.category}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="gallery-stats">
                <button class="like-btn" data-id="${item.id}">
                    <i class="far fa-heart"></i>
                    <span class="like-count">${item.likes}</span>
                </button>
                <span class="media-type">${item.type === 'video' ? '🎬 Video' : '🖼️ Image'}</span>
            </div>
        </div>
    `;
    
    // Add click event
    itemDiv.addEventListener('click', () => openModal(item));
    
    // Add like button event
    const likeBtn = itemDiv.querySelector('.like-btn');
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleLike(item.id);
    });
    
    // Add video play event
    if (item.type === 'video') {
        const videoContainer = itemDiv.querySelector('.video-container');
        const video = itemDiv.querySelector('.gallery-video');
        const playBtn = itemDiv.querySelector('.fa-play');
        
        videoContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
                videoContainer.classList.add('playing');
            } else {
                video.pause();
                videoContainer.classList.remove('playing');
            }
        });
        
        video.addEventListener('click', (e) => e.stopPropagation());
    }
    
    return itemDiv;
}

function getCategoryIcon(category) {
    const icons = {
        'plants': '🌱',
        'nursery': '🏡',
        'grafting': '🔬',
        'farmers': '👨‍🌾',
        'process': '⚙️'
    };
    return icons[category] || '📷';
}

function openModal(item) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    if (item.type === 'video') {
        modalImage.style.display = 'none';
        // You might want to create a separate video element for the modal
        modalTitle.textContent = item.title;
        modalCategory.textContent = `${item.category} • 🎬 Video`;
    } else {
        modalImage.style.display = 'block';
        modalImage.src = item.src;
        modalTitle.textContent = item.title;
        modalCategory.textContent = item.category;
    }
    
    // Store current item for navigation
    modal.currentItem = item;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleLike(itemId) {
    // Update like count in localStorage or backend
    const likeBtn = document.querySelector(`.like-btn[data-id="${itemId}"]`);
    const likeCount = likeBtn.querySelector('.like-count');
    
    let currentLikes = parseInt(likeCount.textContent);
    currentLikes++;
    likeCount.textContent = currentLikes;
    
    // Update like button state
    likeBtn.innerHTML = `<i class="fas fa-heart"></i> <span class="like-count">${currentLikes}</span>`;
    
    // Update total like count
    updateStats();
}

function updateStats() {
    const imageCount = document.querySelectorAll('.gallery-item').length;
    const likeCounts = Array.from(document.querySelectorAll('.like-count'))
        .reduce((sum, el) => sum + parseInt(el.textContent), 0);
    
    document.getElementById('imageCount').textContent = imageCount;
    document.getElementById('likeCount').textContent = likeCounts;
}

function initializeFiltering(data) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            let filteredData;
            
            if (filter === 'all') {
                filteredData = data;
            } else {
                filteredData = data.filter(item => item.category === filter);
            }
            
            renderGallery(filteredData);
        });
    });
}

function initializeSearch(data) {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            renderGallery(data);
            return;
        }
        
        const filteredData = data.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
        
        renderGallery(filteredData);
    });
}