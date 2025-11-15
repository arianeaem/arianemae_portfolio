// Global projects data map
// Each project has: businessName, businessCategory, projectCategory, description, image
window.PROJECTS = {
  "lustre-and-glow": {
    "businessName": "Lustre & Glow",
    "businessCategory": "Hair & Laser Salon",
    "projectCategory": "Branding & Web Design",
    "description": "A self-initiated redesign for Lustre & Glow, a luxury Toronto salon. The goal was to transform a dense, outdated site into a clean, editorial experience that highlights premium services, improves readability, and drives bookings through a refined, user-first design.",
  // project card thumbnail (single JPG used on the index)
  "image": "/images/lustre-and-glow.jpg",
  "thumb1x": "/images/lustre-and-glow.jpg",
    // gallery: multiple project images, each with density-based 1x/2x files
    "gallery": [
  { "1x": "/images/lustre-and-glow-1-1x.webp", "2x": "/images/lustre-and-glow-1-2x.webp" },
  { "1x": "/images/lustre-and-glow-2-1x.webp", "2x": "/images/lustre-and-glow-2-2x.webp" }
    ],
    // backwards-compatible hero fields (first gallery item)
  "hero1x": "/images/lustre-and-glow-1-1x.webp",
  "hero2x": "/images/lustre-and-glow-1-2x.webp"
  },
  "makeup-by-jane": {
    "businessName": "Makeup by Jane",
    "businessCategory": "Beauty and Makeup",
    "projectCategory": "Branding & Web Design",
    "description": "Makeup by Jane is an award-winning Melbourne bridal makeup artist known for her calm presence and timeless artistry. I redesigned her website to better reflect her premium reputation, highlight her portfolio, and create a seamless experience that turns visitors into bridal enquiries.",
  "image": "/images/makeup-by-jane.png",
  "thumb1x": "/images/makeup-by-jane.png",
    // gallery: two project images, each with density-based 1x/2x files
    "gallery": [
  { "1x": "/images/makeup-by-jane-1-1x.webp", "2x": "/images/makeup-by-jane-1-2x.webp" },
  { "1x": "/images/makeup-by-jane-2-1x.webp", "2x": "/images/makeup-by-jane-2-2x.webp" }
    ],
    // set hero to the first gallery item for compatibility
  "hero1x": "/images/makeup-by-jane-1-1x.webp",
  "hero2x": "/images/makeup-by-jane-1-2x.webp"
  }
  ,"marra-patel": {
    "businessName": "Marra Patel",
    "businessCategory": "Business Coaching / Consulting",
    "projectCategory": "Branding & Web Design",
    "description": "A full website transformation for Marra Patel, a mentor helping service-based founders move from hustle to sustainable growth. The goal was to create a digital home that reflects her grounded expertise and holistic SuccessFOR™ approach — clear pathways, elevated design, and messaging that communicates calm leadership and genuine transformation. ",
  "image": "/images/marra-patel.jpg",
  "thumb1x": "/images/marra-patel.jpg",
    // gallery: two project images, each with density-based 1x/2x files
    "gallery": [
  { "1x": "/images/marra-patel-1-1x.webp", "2x": "/images/marra-patel-1-2x.webp" },
  { "1x": "/images/marra-patel-2-1x.webp", "2x": "/images/marra-patel-2-2x.webp" }
    ],
    // set hero to the first gallery item for compatibility
  "hero1x": "/images/marra-patel-1-1x.webp",
  "hero2x": "/images/marra-patel-1-2x.webp"
  }
};
