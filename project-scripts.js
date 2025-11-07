// Utility to read query params
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Try to extract a project id from a pretty path like /project/makeup-by-jane or /project/makeup-by-jane/
function getIdFromPath() {
  try {
    const parts = window.location.pathname.split('/').filter(Boolean);
    // look for 'project' segment followed by slug
    const idx = parts.indexOf('project');
    if (idx !== -1 && parts.length > idx + 1) return parts[idx + 1];
    // fallback: if the path itself looks like a slug (one segment)
    if (parts.length === 1) return parts[0];
  } catch (e) {
    return null;
  }
  return null;
}

// Populate project page when present
function populateProjectFromId() {
  let id = getQueryParam('id');
  if (!id) id = getIdFromPath();
  if (!id) return;
  const data = window.PROJECTS && window.PROJECTS[id];
  // If no such project, show a simple message
  if (!data) {
    const main = document.querySelector('main');
    if (main) main.innerHTML = '<p>Project not found.</p>';
    return;
  }

  const nameEl = document.getElementById('proj-business-name');
  const imgEl = document.getElementById('proj-image');
  const businessCatEl = document.getElementById('proj-business-category');
  const projectCatEl = document.getElementById('proj-project-category');
  const descEl = document.getElementById('proj-description');

  if (nameEl) nameEl.textContent = data.businessName || '';
  // keep the header (ariane-logo) as the site logo text; do not overwrite it
  if (imgEl) {
    // prefer gallery first (allows multiple project images like 1 / 2 each with 1x/2x)
    if (Array.isArray(data.gallery) && data.gallery.length > 0) {
      const first = data.gallery[0];
      if (first['1x'] || first['2x']) {
        imgEl.src = first['1x'] || first['2x'] || data.image || '';
        imgEl.srcset = [(first['1x'] ? first['1x'] + ' 1x' : null), (first['2x'] ? first['2x'] + ' 2x' : null)].filter(Boolean).join(', ');
        imgEl.alt = (data.businessName ? data.businessName + ' hero image' : 'Project image');
      }
    } else if (data.hero1x || data.hero2x) {
      // backwards-compatible: single hero 1x/2x
      imgEl.src = data.hero1x || data.hero2x || data.image || '';
      imgEl.srcset = [(data.hero1x ? data.hero1x + ' 1x' : null), (data.hero2x ? data.hero2x + ' 2x' : null)].filter(Boolean).join(', ');
      imgEl.alt = (data.businessName ? data.businessName + ' hero image' : 'Project image');
    } else {
      imgEl.src = data.image || '';
      imgEl.alt = (data.businessName ? data.businessName + ' project image' : 'Project image');
    }
  }
  if (businessCatEl) businessCatEl.textContent = data.businessCategory || '';
  if (projectCatEl) projectCatEl.textContent = data.projectCategory || '';
  if (descEl) descEl.textContent = data.description || '';

  // Render gallery thumbnails if available
  renderProjectGallery(data);
  // Update page-level SEO/meta tags for this project
  updateMetaForProject(data);
}

// Update document title, meta description, canonical and OG tags for SEO
function updateMetaForProject(data) {
  if (!data) return;
  // Title
  if (data.businessName) {
    document.title = data.businessName + ' — Project | Ariane Mae';
  }
  // Meta description
  const metaDesc = document.getElementById('meta-description');
  if (metaDesc) metaDesc.content = data.description || 'Project by Ariane Mae';
  // Open Graph
  const ogTitle = document.getElementById('og-title');
  const ogDesc = document.getElementById('og-description');
  const ogImage = document.getElementById('og-image');
  if (ogTitle) ogTitle.content = data.businessName || document.title;
  if (ogDesc) ogDesc.content = data.description || '';
  // pick best image for OG: prefer first gallery 2x, then 1x, then hero
  let ogImg = '';
  if (Array.isArray(data.gallery) && data.gallery.length) {
    const first = data.gallery[0];
    ogImg = first['2x'] || first['1x'] || data.hero2x || data.hero1x || data.image || '';
  } else {
    ogImg = data.hero2x || data.hero1x || data.image || '';
  }
  if (ogImage) ogImage.content = ogImg;

  // canonical: set/update if present
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    // prefer the current pretty URL (if present) — use window.location.href so canonical matches the visible URL
    canonical.href = window.location.href;
  }

}

// Render project gallery (thumbnails) and wire click -> set hero
function renderProjectGallery(data) {
  const galleryWrap = document.getElementById('proj-gallery');
  const heroImg = document.getElementById('proj-image');
  if (!galleryWrap) return;
  galleryWrap.innerHTML = '';
  if (!data || !Array.isArray(data.gallery) || data.gallery.length === 0) return;
  // hide the single hero image when displaying stacked gallery images
  if (heroImg) heroImg.style.display = 'none';

  // Render each gallery item as a full-width stacked image (no click behavior)
  data.gallery.forEach((item, idx) => {
    const gi = document.createElement('img');
    gi.className = 'proj-gallery-item';
    gi.loading = 'lazy';
    gi.alt = (data.businessName ? data.businessName + ' image ' + (idx + 1) : 'Project image');
    gi.src = item['1x'] || item['2x'] || data.image || '';
    gi.srcset = [(item['1x'] ? item['1x'] + ' 1x' : null), (item['2x'] ? item['2x'] + ' 2x' : null)].filter(Boolean).join(', ');
    galleryWrap.appendChild(gi);
  });
}

document.addEventListener('DOMContentLoaded', function(){
  populateIndexCards();
  populateProjectFromId();
  populateNextProject();
});

// Populate project cards on index pages using density-based srcset
function populateIndexCards() {
  if (!window.PROJECTS) return;
  document.querySelectorAll('.project-card').forEach(card => {
    const id = card.dataset.projectId;
    if (!id) return;
    const project = window.PROJECTS[id];
    if (!project) return;

    const img = card.querySelector('img.thumb');
    if (img) {
      if (project.thumb1x || project.thumb2x) {
        img.src = project.thumb1x || project.thumb2x || project.image || '';
        img.srcset = [(project.thumb1x ? project.thumb1x + ' 1x' : null), (project.thumb2x ? project.thumb2x + ' 2x' : null)].filter(Boolean).join(', ');
        img.alt = project.businessName || '';
      } else if (project.image) {
        img.src = project.image;
        img.alt = project.businessName || '';
      }
    }

  // ensure card link points to the pretty project page (/project/<slug>/)
  const a = card.querySelector('a');
  if (a) a.href = `/project/${encodeURIComponent(id)}/`;

    // set title if present
    const h3 = card.querySelector('h3');
    if (h3) h3.textContent = project.businessName || h3.textContent;
  });
}

// Compute and populate a "next project" teaser
function populateNextProject() {
  // determine current project id from query param or pretty path
  let id = getQueryParam('id');
  if (!id) id = getIdFromPath();
  if (!window.PROJECTS) return;
  const keys = Object.keys(window.PROJECTS);
  if (!keys.length) return;

  // find current index
  let idx = keys.indexOf(id);
  if (idx === -1) {
    // if current id not found, show first project as next
    idx = 0;
  }

  const nextIdx = (idx + 1) % keys.length;
  const nextId = keys[nextIdx];
  const nextData = window.PROJECTS[nextId];
  if (!nextData) return;

  const wrap = document.querySelector('.next-project');
  if (!wrap) return;
  const textEl = wrap.querySelector('.next-project-text');
  const imgEl = wrap.querySelector('.next-project-preview');

  // Set attributes and content
  wrap.dataset.nextId = nextId;
  if (textEl) textEl.textContent = nextData.businessName || 'Next Project';
  if (imgEl) {
    // prefer thumb 1x/2x for preview if available
    if (nextData.thumb1x || nextData.thumb2x) {
      imgEl.src = nextData.thumb1x || nextData.thumb2x || nextData.image || '';
      imgEl.srcset = [(nextData.thumb1x ? nextData.thumb1x + ' 1x' : null), (nextData.thumb2x ? nextData.thumb2x + ' 2x' : null)].filter(Boolean).join(', ');
      imgEl.alt = (nextData.businessName ? nextData.businessName + ' preview' : 'Next project preview');
    } else {
      imgEl.src = nextData.image || '';
      imgEl.alt = (nextData.businessName ? nextData.businessName + ' preview' : 'Next project preview');
    }
  }

  // navigate when clicking the teaser
  wrap.addEventListener('click', function(){
    const targetId = wrap.dataset.nextId;
    if (targetId) window.location.href = `/project/${encodeURIComponent(targetId)}/`;
  });

  // make the preview follow the mouse while hovered
  if (imgEl) {
    // ensure initial hidden state
    imgEl.style.opacity = '0';
    imgEl.style.left = '-9999px';
    imgEl.style.top = '-9999px';

    let raf = null;
    let lastPos = { x: 0, y: 0 };

    function updatePosition() {
      if (!imgEl) return;
      imgEl.style.left = lastPos.x + 'px';
      imgEl.style.top = lastPos.y + 'px';
      raf = null;
    }

    wrap.addEventListener('mouseenter', function(e){
      imgEl.style.opacity = '1';
    });

    wrap.addEventListener('mousemove', function(e){
      // offset so cursor doesn't sit directly on the image
      const offsetX = 18;
      const offsetY = 18;
      lastPos.x = e.clientX + offsetX;
      lastPos.y = e.clientY + offsetY;
      // throttle via requestAnimationFrame
      if (!raf) raf = window.requestAnimationFrame(updatePosition);
    });

    wrap.addEventListener('mouseleave', function(){
      imgEl.style.opacity = '0';
      // move off-screen to avoid accidental clicks on underlying elements
      imgEl.style.left = '-9999px';
      imgEl.style.top = '-9999px';
      if (raf) { window.cancelAnimationFrame(raf); raf = null; }
    });
  }
}
