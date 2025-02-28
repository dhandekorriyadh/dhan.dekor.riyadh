// عرض الصورة في نافذة منبثقة
$('#portfolio-container').on('click', '.portfolio-item img', function() {
    const imageSrc = $(this).data('image');
    $('#modalImage').attr('src', imageSrc).show(); // عرض الصورة
    $('#modalVideo').hide(); // إخفاء الفيديو
  });
  
  // عند النقر على الفيديو
  $('#portfolio-container').on('click', '.portfolio-item video', function() {
    const videoSrc = $(this).data('video');
    $('#videoFrame').attr('src', videoSrc).show(); // تحميل الفيديو
    $('#modalImage').hide(); // إخفاء الصورة
    $('#modalVideo').show(); // عرض الفيديو
  });
  
  const textArray = [
    "معلم دهانات وديكورات الرياض",
    "أبو فهمي للدهانات الداخلية والخارجية",
    "جميع أنواع الديكورات المنزلية",
    "دهانات وديكورات في شمال وجنوب الرياض بأفضل اشكالها وأنواعها",
    "دهانات وديكورات في البديعة، السويدي، نجم الدين، شفاء، ولحزم",
    "خدمات دهانات وديكورات وترميم في جنوب الرياض وشمال الرياض",
    "دهانات وديكورات جبسية مع جبس ماي وجبس بور",
    "رقم التواصل : 0550852093",
    "رقم التواصل : 0574709693"
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = "";
  let isEnd = false;
  const typingElement = document.getElementById("typing-effect1");
  
  function type() {
    if (textIndex === textArray.length) {
      textIndex = 0; // Reset to start
    }
  
    currentText = textArray[textIndex];
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }
  
    typingElement.innerHTML = currentText.substring(0, charIndex);
  
    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => {
        isDeleting = true;
      }, 2000); // Wait for 2 seconds after typing the full text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex++;
      setTimeout(type, 500); // Wait for 500ms before starting to type the next word
      return;
    }
  
    setTimeout(type, isDeleting ? 100 : 200); // Speed of typing or deleting
  }
  
  async function loadNavItems() {
    try {
      const response = await fetch('services.json');
      const data = await response.json();
      if (Array.isArray(data)) {
        const navbarItemsContainer = document.getElementById('navbar-items');
        const screenWidth = window.innerWidth;
  
        // عرض جميع العناصر في الشاشات الصغيرة أو عرض 5 فقط في الشاشات الكبيرة
        const itemsToShow = screenWidth < 768 ? data : data.slice(0, 5);
        itemsToShow.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.classList.add('nav-item');
          const link = document.createElement('a');
          link.classList.add('nav-link', 'text-white');
          
          link.href = `service-details.html?title=${encodeURIComponent(item.title)}&description=${encodeURIComponent(item.description)}&image=${encodeURIComponent(item.image)}`;
          link.setAttribute('data-title', encodeURIComponent(item.title));
          link.setAttribute('data-description', encodeURIComponent(item.description));
          link.setAttribute('data-image', encodeURIComponent(item.image));
          link.textContent = item.title;
          listItem.appendChild(link);
          navbarItemsContainer.appendChild(listItem);
        });
  
        // إنشاء قائمة منسدلة للعناصر المتبقية
        if (screenWidth >= 768 && data.length > 5) {
          const dropdownItem = document.createElement('li');
          dropdownItem.classList.add('nav-item', 'dropdown');
          const dropdownLink = document.createElement('a');
          dropdownLink.classList.add('nav-link', 'dropdown-toggle', 'text-white');
          dropdownLink.href = '#';
          dropdownLink.id = 'navbarDropdown';
          dropdownLink.setAttribute('role', 'button');
          dropdownLink.setAttribute('data-bs-toggle', 'dropdown');
          dropdownLink.setAttribute('aria-expanded', 'false');
          dropdownLink.textContent = 'المزيد';
  
          const dropdownMenu = document.createElement('ul');
          dropdownMenu.classList.add('dropdown-menu', 'text-end');
          dropdownMenu.setAttribute('aria-labelledby', 'navbarDropdown');
  
          const remainingItems = data.slice(5);
          remainingItems.forEach((item) => {
            const dropdownListItem = document.createElement('li');
            const dropdownItemLink = document.createElement('a');
            dropdownItemLink.classList.add('dropdown-item');
            dropdownItemLink.href = `service-details.html?title=${encodeURIComponent(item.title)}&description=${encodeURIComponent(item.description)}&image=${encodeURIComponent(item.image)}`;
            dropdownItemLink.textContent = item.title;
            dropdownListItem.appendChild(dropdownItemLink);
            dropdownMenu.appendChild(dropdownListItem);
          });
  
          dropdownItem.appendChild(dropdownLink);
          dropdownItem.appendChild(dropdownMenu);
          navbarItemsContainer.appendChild(dropdownItem);
        }
      }
    } catch (error) {
      console.error("خطأ في تحميل عناصر التنقل:", error);
    }
  }
  
  async function loadContactInfo() {
    try {
      const response = await fetch('contact-info.json');
      const data = await response.json();
      
      // تحديث بيانات البريد الإلكتروني ورقم الهاتف
      document.getElementById('email-link').textContent = data.email;
      document.getElementById('email-link').href = `mailto:${data.email}`;
      document.getElementById('phone-number').textContent = data.phone;
      
      // تحديث روابط الشبكات الاجتماعية
      document.getElementById('twitter-link').href = data.social_links.twitter;
      document.getElementById('facebook-link').href = data.social_links.facebook;
      document.getElementById('instagram-link').href = data.social_links.instagram;
      document.getElementById('linkedin-link').href = data.social_links.linkedin;
    } catch (error) {
      console.error("خطأ في تحميل بيانات الاتصال:", error);
    }
  }
  
  async function loadCarouselImages() {
    try {
      const response = await fetch('projects.json');
      const data = await response.json();
      const carouselInner = document.getElementById('carousel-inner');
      
      // تصفية العناصر التي تحتوي على صور فقط
      const images = data.filter(item => item.type === 'image');
  
      // تحميل الصور فقط في الكاروسيل
      images.forEach((item, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
          carouselItem.classList.add('active');
        }
  
        const imgElement = document.createElement('img');
        imgElement.src = item.image;
        imgElement.classList.add('d-block', 'w-100', 'hero-carousel-img');
        imgElement.alt = 'ابو فهمي لجميع انواع الدهانات والديكورات';
  
        carouselItem.appendChild(imgElement);
        carouselInner.appendChild(carouselItem);
      });
    } catch (error) {
      console.error("خطأ في تحميل الصور:", error);
    }
  }
  
  async function loadServices() {
    try {
      const response = await fetch('services.json');
      const data = await response.json();
  
      const servicesContainer = document.getElementById('services-container');
      const services = data.slice(0, 4);
  
      services.forEach((service, index) => {
        const serviceColumn = document.createElement('div');
        serviceColumn.classList.add('col-xl-3', 'col-md-6');
        serviceColumn.setAttribute('data-aos', 'fade-up');
        serviceColumn.setAttribute('data-aos-delay', (index + 1) * 100);
  
        const iconBox = document.createElement('div');
        iconBox.classList.add('icon-box');
        const icon = document.createElement('div');
        icon.classList.add('icon');
  
        const img = document.createElement('img');
        img.src = service.image;
        img.classList.add('d-block', 'w-100', 'rounded-circle');
        img.alt = service.title;
  
        const title = document.createElement('h4');
        title.classList.add('title');
        const link = document.createElement('a');
        link.href = `service-details.html?title=${encodeURIComponent(service.title)}&description=${encodeURIComponent(service.description)}&image=${encodeURIComponent(service.image)}`;
        link.classList.add('stretched-link');
        link.textContent = service.title;
  
        icon.appendChild(img);
        iconBox.appendChild(icon);
        iconBox.appendChild(title);
        title.appendChild(link);
  
        serviceColumn.appendChild(iconBox);
        servicesContainer.appendChild(serviceColumn);
      });
    } catch (error) {
      console.error("خطأ في تحميل الخدمات:", error);
    }
  }
  

// الدالة التي ستقوم بتحميل الخدمات من ملف services.json
async function loadServices_b() {
  try {
      const response = await fetch('services.json');
      const data = await response.json();

      if (Array.isArray(data)) {
        const sliderContent = document.getElementById('slider-content');
        data.forEach((item, index) => {
          const slide = document.createElement('div');
          slide.classList.add('swiper-slide', 'card', 'text-center', 'border-0', 'shadow');
          slide.setAttribute('data-aos','fade-up');
          slide.innerHTML = `
            <img src="${item.image || 'img/five.jpg'}" alt="ابو فهمي للدهانات وجميع انواع الديكورات" width="150px" height="150px" class="img-fluid rounded-circle custom-img">
            <div class="card-body">
              <h3 class="card-title py-2">
                <a href="service-details.html?title=${encodeURIComponent(item.title)}&description=${encodeURIComponent(item.description)}&image=${encodeURIComponent(item.image)}" class="btn btn-primary btn-lg text-white p-2">
                  ${item.title || 'اسم الخدمة غير موجود'}
                </a>
              </h3>
            </div>
          `;
          sliderContent.appendChild(slide);
        });
        initializeSwiper('.slider-wrapper');
      }
    } catch (error) {
      console.error("خطأ في تحميل بيانات السلايدر:", error);
    }
  }

  async function loadPortfolioItems() {
    try {
      const response = await fetch('projects.json');
      const data = await response.json();
      const portfolioItems = data.slice(0, 6);
  
      if (Array.isArray(portfolioItems)) {
        const portfolioContainer = document.getElementById('portfolio-container');
        
        portfolioItems.forEach((item, index) => {
          const portfolioItem = document.createElement('div');
          portfolioItem.classList.add('col-lg-4', 'col-md-6');
          portfolioItem.setAttribute('data-aos', 'fade-up');
          portfolioItem.setAttribute('data-aos-delay', (index * 100).toString());
  
          // التحقق من نوع العنصر (هل هو صورة أو فيديو)
          if (item.type === "image") {
            portfolioItem.innerHTML = `
              <div class="portfolio-item">
                <img src="${item.image}" alt="ابو فهمي لجميع انواع الدهانات والديكورات" class="img-fluid" 
                     data-bs-toggle="modal" data-bs-target="#portfolioModal" data-image="${item.image}">
              </div>
            `;
          } else if (item.type === "video") {
            portfolioItem.innerHTML = `
              <div class="portfolio-item">
                <div class="video-thumbnail">
                  <video class="img-fluid" data-bs-toggle="modal" data-bs-target="#portfolioModal" data-video="${item.video}" controls>
                    <source src="${item.video}" type="video/mp4">
                  </video>
                </div>
              </div>
            `;
          }
  
          portfolioContainer.appendChild(portfolioItem);
        });
      }
    } catch (error) {
      console.error("خطأ في تحميل الأعمال:", error);
    }
  }
  
// عند النقر على الصورة
  $('#portfolio-container').on('click', '.portfolio-item img', function() {
    const imageSrc = $(this).data('image');
    $('#modalImage').attr('src', imageSrc).show(); // عرض الصورة
    $('#modalVideo').hide(); // إخفاء الفيديو
  });

  // عند النقر على الفيديو
  $('#portfolio-container').on('click', '.portfolio-item video', function() {
    const videoSrc = $(this).data('video');
    $('#videoFrame').attr('src', videoSrc).show(); // تحميل الفيديو
    $('#modalImage').hide(); // إخفاء الصورة
    $('#modalVideo').show(); // عرض الفيديو
  });



  // دالة لتهيئة الـ Swiper
  function initializeSwiper(selector) {
    new Swiper(selector, {
      loop: true,
      grabCursor: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  window.onload = function() {
    loadNavItems();
    type();
    loadContactInfo();
    loadCarouselImages();
    loadServices();
    loadServices_b();
    loadPortfolioItems();
    AOS.init();
  };
  