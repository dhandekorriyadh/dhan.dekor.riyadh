function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      title: urlParams.get('title'),
      description: urlParams.get('description'),
      image: urlParams.get('image')
    };
  }
  
  function loadServiceDetails() {
    const params = getQueryParams();
  
    if (params.title && params.description && params.image) {
      const blogDetailContainer = document.getElementById('blog-detail-container');
  
      blogDetailContainer.innerHTML = 
        `<div class="blog-image-container">
          <!-- إضافة ميزة التحميل الكسول (lazy loading) للصور -->
          <img src="${params.image || 'img/five.jpg'}" alt="ابو حسين للدهانات وجميع انواع الديكورات" width="600" height="400" loading="lazy">
          <h1 class="blog-title">${params.title || 'عنوان الخدمة'}</h1>
          <ul class="nav nav-tabs mt-5">
            <li class="nav-item">
              <a class="nav-link active" href="index.html">الرئيسية</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="tab" href="#">${params.title || 'عنوان الخدمة'}</a>
            </li>
          </ul>
        </div>
        <div class="blog-content">
          <h3> ${params.title || 'عنوان الخدمة'}:</h3>
          <p>${params.description || 'الوصف غير متوفر'}</p>
        </div>`;
    } else {
      console.error('البيانات مفقودة أو غير صحيحة.');
    }
  }
  
  async function loadAllProjects() {
    try {
      const response = await fetch('projects.json');
      const data = await response.json();
  
      if (Array.isArray(data)) {
        const portfolioContainer = document.getElementById('portfolio-container');
  
        // تصفية البيانات لاستخراج الصور فقط
        const imagesOnly = data.filter(item => item.type === 'image'); 
  
        // عرض الصور فقط
        imagesOnly.forEach((item, index) => {
          const portfolioItem = document.createElement('div');
          portfolioItem.classList.add('col-lg-4', 'col-md-6', 'portfolio-item');
          portfolioItem.setAttribute('data-aos', 'fade-up');
          portfolioItem.setAttribute('data-aos-delay', (index * 100).toString());
  
          portfolioItem.innerHTML = `
            <div class="portfolio-item">
              <!-- استخدام ميزة التحميل الكسول (lazy loading) للصور -->
              <img src="${item.image}" alt="ابو حسين لجميع انواع الدهانات والديكورات" class="img-fluid" data-bs-toggle="modal" data-bs-target="#portfolioModal" data-image="${item.image}" width="600" height="400" loading="lazy">
            </div>
          `;
          
          portfolioContainer.appendChild(portfolioItem);
        });
      }
    } catch (error) {
      console.error("خطأ في تحميل الأعمال:", error);
    }
  }
  
  // عرض الصورة في نافذة منبثقة
  $('#portfolio-container').on('click', 'img', function() {
    const imageSrc = $(this).data('image');
    $('#modalImage').attr('src', imageSrc);
  });
  
  window.onload = function() {
    loadServiceDetails();
    loadAllProjects();
  };
  