async function loadAllProjects() {
    try {
      const response = await fetch('projects.json');
      const data = await response.json();
      if (Array.isArray(data)) {
        const portfolioContainer = document.getElementById('portfolio-container');
        data.forEach((item, index) => {
          const portfolioItem = document.createElement('div');
          portfolioItem.classList.add('col-lg-4', 'col-md-6', 'portfolio-item');
          portfolioItem.setAttribute('data-aos', 'fade-up');
          portfolioItem.setAttribute('data-aos-delay', (index * 100).toString());
  
          if (item.type === "image") {
            const imgElement = document.createElement('img');
            imgElement.src = item.image;
            imgElement.alt = "ابو حسين لجميع انواع الدهانات والديكورات";
            imgElement.classList.add('img-fluid');
            imgElement.setAttribute('data-bs-toggle', 'modal');
            imgElement.setAttribute('data-bs-target', '#portfolioModal');
            imgElement.setAttribute('data-image', item.image);
            imgElement.setAttribute('loading', 'lazy'); // Lazy load
  
            portfolioItem.appendChild(imgElement);
          } else if (item.type === "video") {
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-thumbnail');
            const videoElement = document.createElement('video');
            videoElement.setAttribute('controls', '');
            videoElement.setAttribute('width', '100%');
            videoElement.setAttribute('height', '250px');
            videoElement.setAttribute('data-bs-toggle', 'modal');
            videoElement.setAttribute('data-bs-target', '#portfolioModal');
            videoElement.setAttribute('data-video', item.video);
  
            const source = document.createElement('source');
            source.setAttribute('src', item.video);
            source.setAttribute('type', 'video/mp4');
            videoElement.appendChild(source);
  
            videoContainer.appendChild(videoElement);
            portfolioItem.appendChild(videoContainer);
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
    const videoElement = $('#videoFrame')[0];
    const videoSource = videoElement.querySelector('source');
    
    // تحديث مصدر الفيديو
    videoSource.setAttribute('src', videoSrc);
    videoElement.load();  // إعادة تحميل الفيديو
    videoElement.play();  // تشغيل الفيديو
    $('#modalImage').hide(); // إخفاء الصورة
    $('#modalVideo').show(); // عرض الفيديو
  });
  
  // عند إغلاق المودال، إيقاف الفيديو
  $('#portfolioModal').on('hidden.bs.modal', function () {
    const videoElement = $('#videoFrame')[0];
    videoElement.pause(); // إيقاف الفيديو عند غلق المودال
    videoElement.currentTime = 0; // إعادة الفيديو للبداية
  });
  
  // تحميل المشاريع عند تحميل الصفحة
  window.onload = function() {
    loadAllProjects();
    AOS.init();
  };
  