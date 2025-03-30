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

let textArray = [];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = "";
let isEnd = false;
const typingElement = document.getElementById("typing-effect1"); // العنصر الذي سيعرض الكتابة

// تحميل البيانات من ملف JSON باستخدام async/await
async function loadTextData() {
  try {
    const response = await fetch('text_hero.json');
    const data = await response.json();
    textArray = data.textArray; // تعيين البيانات المسترجعة من ملف JSON إلى textArray

    // تحديث النصوص في العناصر المحددة باستخدام البيانات المحملة
    document.getElementById('hero_p').textContent = data.texthero.hero_p;
    document.getElementById('hero_h2').textContent = data.texthero.hero_h2;

    type(); // بدء الكتابة بعد تحميل البيانات
  } catch (error) {
    console.error('Error loading text data:', error);
  }
}

// بدء الكتابة
function type() {
  if (textIndex === textArray.length) {
    textIndex = 0; // إعادة التعيين إلى بداية النصوص
  }

  currentText = textArray[textIndex];
  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingElement.innerHTML = currentText.substring(0, charIndex); // عرض النص الجزئي في العنصر

  // إذا وصلنا إلى نهاية النص، ننتظر لمدة 2 ثانية قبل البدء في الحذف
  if (!isDeleting && charIndex === currentText.length) {
    setTimeout(() => {
      isDeleting = true; // تفعيل الحذف بعد كتابة النص كامل
    }, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false; // إذا تم حذف النص بالكامل، ننتقل للنص التالي
    textIndex++;
    setTimeout(type, 500); // الانتظار لمدة 500 مللي ثانية قبل البدء في كتابة النص التالي
    return;
  }

  setTimeout(type, isDeleting ? 100 : 200); // تحديد سرعة الكتابة أو الحذف
}

async function loadSeoData() {
  try {
    const response = await fetch('seo_data.json');
    const data = await response.json();

    // إضافة بيانات الميتا إلى الصفحة
    document.title = data.title;
    document.querySelector('meta[name="keywords"]').setAttribute("content", data.keywords);
    document.querySelector('meta[name="author"]').setAttribute("content", data.author);
    document.querySelector('meta[name="description"]').setAttribute("content", data.description);
    document.querySelector('meta[name="robots"]').setAttribute("content", data.robots);
    document.querySelector('link[rel="canonical"]').setAttribute("href", data.canonical);

    // إضافة sitemap
    const sitemapLink = document.createElement('link');
    sitemapLink.rel = 'sitemap';
    sitemapLink.type = 'application/xml';
    sitemapLink.href = data.additional_metadata.sitemap;
    document.head.appendChild(sitemapLink);

    // إضافة hreflang
    const hreflangLink = document.createElement('link');
    hreflangLink.rel = 'alternate';
    hreflangLink.href = data.additional_metadata.hreflang.href;
    hreflangLink.hreflang = data.additional_metadata.hreflang.lang;
    document.head.appendChild(hreflangLink);

    // إضافة favicon
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.href = data.additional_metadata.favicon;
    faviconLink.type = 'image/png';
    document.head.appendChild(faviconLink);

    // إضافة apple-touch-icon
    const appleIconLink = document.createElement('link');
    appleIconLink.rel = 'apple-touch-icon';
    appleIconLink.sizes = '180x180';
    appleIconLink.href = data.additional_metadata.apple_touch_icon;
    document.head.appendChild(appleIconLink);

    // إضافة بيانات الميتا
    const ratingMeta = document.createElement('meta');
    ratingMeta.name = 'rating';
    ratingMeta.content = data.additional_metadata.meta_rating;
    document.head.appendChild(ratingMeta);

    const copyrightMeta = document.createElement('meta');
    copyrightMeta.name = 'copyright';
    copyrightMeta.content = data.additional_metadata.meta_copyright;
    document.head.appendChild(copyrightMeta);

    // Open Graph Tags
    document.querySelector('meta[property="og:locale"]').setAttribute("content", data.og.locale);
    document.querySelector('meta[property="og:type"]').setAttribute("content", data.og.type);
    document.querySelector('meta[property="og:title"]').setAttribute("content", data.og.title);
    document.querySelector('meta[property="og:url"]').setAttribute("content", data.og.url);
    document.querySelector('meta[property="og:description"]').setAttribute("content", data.og.description);
    document.querySelector('meta[property="og:site_name"]').setAttribute("content", data.og.site_name);
    document.querySelector('meta[property="og:image"]').setAttribute("content", data.og.image);

    // Twitter Tags
    document.querySelector('meta[name="twitter:title"]').setAttribute("content", data.twitter.title);
    document.querySelector('meta[name="twitter:description"]').setAttribute("content", data.twitter.description);
    document.querySelector('meta[name="twitter:image"]').setAttribute("content", data.twitter.image);
    document.querySelector('meta[name="twitter:url"]').setAttribute("content", data.twitter.url);

    // Schema JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(data.schema);
    document.head.appendChild(script);
  } catch (error) {
    console.error("خطأ في تحميل بيانات SEO:", error);
  }
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

async function loadAboutsection() {
  try {
    const response = await fetch('about.json');
    const data = await response.json();
    
    // تحقق من أن data.aboutUs موجودة
    if (data.aboutUs) {
      // إضافة البيانات إلى القسم "من نحن"
      const aboutSection = document.querySelector('#about .content');
      const aboutImage = document.querySelector('#about-image');
      
      // تحديث النصوص في قسم "من نحن"
      if (aboutSection) {
        aboutSection.innerHTML = `
          <h2>${data.aboutUs.title}</h2>
          <p>${data.aboutUs.description}</p>
          <p>للتواصل معنا: ${data.aboutUs.contact.phone}</p>
        `;
      }

      // إضافة الصورة
      if (aboutImage) {
        aboutImage.src = data.aboutUs.image;
      }
    } else {
      console.error("عنصر 'aboutUs' غير موجود في البيانات");
    }
  } catch (error) {
    console.error("خطأ في تحميل البيانات:", error);
  }
}

async function website_info() {
  try {
    const response = await fetch('website-info.json');
    const data = await response.json();
    // تحديث بيانات البريد الإلكتروني ورقم الهاتف
   // تحديث رقم الهاتف
document.getElementById('phone-number').textContent = data.contact_info.phone;
// تحديث اسم الموقع
const siteNameElement = document.querySelector('.site-name');
if (siteNameElement) {
  siteNameElement.innerHTML = `<span>.</span> ${data.site_name.site_n}`;
}
const phoneWatElement = document.querySelector('.btn-get-started.phone_wat');
if (phoneWatElement) {
  phoneWatElement.href = data.contact_info.phone_wat; // من الـ JSON
}
const phonetelElement = document.querySelector('.cta-btn phone_tel');
if (phonetelElement) {
  phonetelElement.href = data.contact_info.phone_tel; // من الـ JSON
}
document.getElementById("location").innerText = data.contact_info.location;
document.getElementById("phone").innerText = data.contact_info.phone;
document.getElementById("working_hours").innerText = data.contact_info.working_hours;
    // تحديث روابط الشبكات الاجتماعية
    /*
    document.getElementById('twitter-link').href = data.social_links.twitter;
    document.getElementById('facebook-link').href = data.social_links.facebook;
    document.getElementById('instagram-link').href = data.social_links.instagram;
    document.getElementById('linkedin-link').href = data.social_links.linkedin;
    */
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
              <video src="${item.video}" controls class="img-fluid" 
                     data-bs-toggle="modal" data-bs-target="#portfolioModal" data-video="${item.video}">
              </video>
            </div>
          `;
        }

        portfolioContainer.appendChild(portfolioItem);
      });
    }
  } catch (error) {
    console.error("خطأ في تحميل بيانات المحفظة:", error);
  }
}


        // دالة لتحميل البيانات من ملف JSON باستخدام async/await
        async function loadCallToActionData() {
            try {
                const response = await fetch('call-to-action.json'); // تحميل البيانات من ملف JSON
                const data = await response.json(); // تحويل البيانات إلى JSON
                
                // التأكد من أن البيانات تحتوي على القيم المطلوبة
                if (data && data.title && data.description && data.ctaButtonText && data.ctaButtonLink) {
                    // تحديث المحتوى داخل الصفحة
                    const titleElement = document.getElementById('cta-title');
                    const descriptionElement = document.getElementById('cta-description');
                    const buttonElement = document.getElementById('cta-btn');
                    
                    // تحديث النصوص والروابط
                    titleElement.textContent = data.title;
                    descriptionElement.textContent = data.description;
                    buttonElement.textContent = data.ctaButtonText;
                    buttonElement.setAttribute('href', data.ctaButtonLink);
                } else {
                    console.error("البيانات غير مكتملة في ملف JSON");
                }
            } catch (error) {
                console.error("حدث خطأ في تحميل البيانات:", error);
            }
        }

        
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

window.onload = async function() {
  loadSeoData();
  await loadNavItems(); // تأكد من تحميل عناصر التنقل أولاً
  await loadTextData(); // تحميل البيانات الخاصة بالكتابة
  loadAboutsection();
  website_info();
  loadCarouselImages();
  loadServices();
  loadServices_b();
  loadPortfolioItems();
  loadCallToActionData();
  AOS.init(); // تأكد من تفعيل الـ AOS بعد تحميل المحتوى
};
