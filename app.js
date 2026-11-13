const malay = {
  skip: "Langkau ke kandungan",
  mainNav: "Navigasi utama",
  changeLanguage: "Tukar bahasa",
  navServices: "Perkhidmatan",
  navGallery: "Galeri",
  navContact: "Hubungi",
  heroLabel: "Konsultasi kereta · KL, Selangor & jarak jauh",
  heroTitle: "Lebih mudah buat keputusan tentang kereta.",
  heroDescription: "Nak beli kereta baharu atau terpakai? Keliru apa yang perlu diservis atau ditukar? Kami bantu anda fahami pilihan sebelum berbelanja.",
  enquire: "Buat pertanyaan",
  seeServices: "Lihat perkhidmatan",
  servicesTitle: "Apa yang boleh kami bantu",
  servicesIntro: "Kami peminat automotif yang boleh bantu anda tanya soalan yang tepat dan fahami apa yang anda bayar.",
  buyTitle: "Beli kereta",
  buyText: "Bandingkan pilihan kereta baharu atau terpakai, ketahui apa yang patut ditanya kepada penjual dan apa yang perlu diperiksa sebelum membeli.",
  serviceTitle: "Servis kereta",
  serviceText: "Fahami jadual servis, kerja yang perlu dibuat pada lawatan seterusnya dan cadangan tambahan yang boleh anda tanya di bengkel.",
  repairTitle: "Pembaikan & alat ganti",
  repairText: "Bincangkan sebut harga bengkel dan ketahui apa yang perlu dijelaskan sebelum anda bersetuju dengan pembaikan atau penukaran alat ganti.",
  price: "Serendah RM50",
  priceNote: "Minta sebut harga mengikut keperluan anda. Tiada caj tersembunyi.",
  galleryTitle: "Lihat dengan lebih dekat",
  galleryNote: "Gambar automotif untuk tujuan ilustrasi.",
  photoCar: "Pandangan kereta",
  photoEngine: "Di bawah bonet",
  photoWheel: "Perincian roda & brek",
  contactTitle: "Apa yang anda nak tahu?",
  contactIntro: "Ceritakan kereta yang anda sedang pertimbangkan, cadangan bengkel atau perkara yang anda perlukan bantuan.",
  region: "Kuala Lumpur · Selangor · Konsultasi jarak jauh",
  phone: "Telefon",
  email: "E-mel",
  channelsStatus: "Maklumat hubungan akan tersedia tidak lama lagi.",
  formTitle: "Pratonton pertanyaan",
  formNote: "Cuba borang ini. Mesej anda kekal pada halaman ini.",
  name: "Nama",
  emailAddress: "Alamat e-mel",
  message: "Apa yang boleh kami bantu?",
  preview: "Lihat pratonton",
  to: "Kepada (alamat contoh)",
  backTop: "Kembali ke atas",
  closeGallery: "Tutup galeri",
  previous: "Gambar sebelumnya",
  next: "Gambar seterusnya"
};

const translations = {
  en: {
    title: "MOTOKAR | Car Consulting",
    description: document.querySelector('meta[name="description"]').content,
    formStatus: "Preview ready. Nothing was sent.",
    photoAlt: [
      "Dark sedan in a concrete parking garage",
      "Close-up of a car’s engine bay",
      "Close-up of an alloy wheel and brake assembly"
    ]
  },
  ms: {
    title: "MOTOKAR | Konsultasi Kereta",
    description: "Khidmat konsultasi mesra untuk pembelian, servis dan pembaikan kereta. Tersedia di Kuala Lumpur, Selangor dan secara jarak jauh. Konsultasi serendah RM50.",
    formStatus: "Pratonton sedia. Tiada mesej dihantar.",
    photoAlt: [
      "Kereta sedan gelap di tempat letak kereta berbumbung",
      "Pandangan dekat ruang enjin kereta",
      "Pandangan dekat rim aloi dan pemasangan brek"
    ]
  }
};

const languageKey = "motokar-language";
const languageDialog = document.querySelector("#language-dialog");
const languageToggle = document.querySelector("[data-open-language]");
const localizedText = Array.from(document.querySelectorAll("[data-text]"), element => [element, element.textContent]);
const localizedLabels = Array.from(document.querySelectorAll("[data-label]"), element => [element, element.getAttribute("aria-label")]);
const form = document.querySelector("#enquiry-form");
const formPreview = document.querySelector("#enquiry-preview");
const formStatus = document.querySelector("#form-status");
const previewFields = ["name", "email", "message"].map(key => ({
  input: document.querySelector("#customer-" + key),
  output: document.querySelector("#preview-" + key)
}));
const galleryCards = Array.from(document.querySelectorAll("[data-photo]"));
const galleryDialog = document.querySelector("#gallery-dialog");
const galleryImage = document.querySelector("#gallery-dialog-image");
const galleryCaption = document.querySelector("#gallery-dialog-caption");
let selectedLanguage = null;
let photoIndex = 0;

function readLanguage() {
  try {
    const stored = localStorage.getItem(languageKey);
    return stored === "en" || stored === "ms" ? stored : null;
  } catch {
    return null;
  }
}

function applyLanguage(language) {
  selectedLanguage = language;
  document.documentElement.lang = language;
  document.title = translations[language].title;
  document.querySelector('meta[name="description"]').content = translations[language].description;
  languageToggle.querySelector(".language-code").textContent = language.toUpperCase();
  for (const [element, english] of localizedText) {
    element.textContent = language === "ms" ? malay[element.dataset.text] : english;
  }
  for (const [element, english] of localizedLabels) {
    element.setAttribute("aria-label", language === "ms" ? malay[element.dataset.label] : english);
  }
  if (!formPreview.hidden) formStatus.textContent = translations[language].formStatus;
}

function showPhoto(index) {
  photoIndex = (index + galleryCards.length) % galleryCards.length;
  const card = galleryCards[photoIndex];
  galleryImage.src = card.querySelector("img").src;
  galleryImage.alt = translations[selectedLanguage ?? "en"].photoAlt[photoIndex];
  galleryCaption.textContent = card.querySelector("[data-text]").textContent;
}

languageToggle.addEventListener("click", () => languageDialog.showModal());

for (const button of languageDialog.querySelectorAll("[data-language]")) {
  button.addEventListener("click", () => {
    if (!selectedLanguage) document.documentElement.classList.remove("choosing-language");
    applyLanguage(button.dataset.language);
    try {
      localStorage.setItem(languageKey, selectedLanguage);
    } catch {
      // Keep the selected language in this page when storage is unavailable.
    }
    languageDialog.close();
    languageToggle.focus({ preventScroll: true });
  });
}

languageDialog.addEventListener("cancel", event => {
  if (!selectedLanguage) event.preventDefault();
});

for (const card of galleryCards) {
  card.addEventListener("click", () => {
    showPhoto(Number(card.dataset.photo));
    galleryDialog.showModal();
  });
}

galleryDialog.querySelector("[data-close-gallery]").addEventListener("click", () => galleryDialog.close());
for (const button of galleryDialog.querySelectorAll("[data-gallery-step]")) {
  button.addEventListener("click", () => showPhoto(photoIndex + Number(button.dataset.galleryStep)));
}
galleryDialog.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === "ArrowLeft" ? -1 : 1));
  }
});

form.addEventListener("submit", event => {
  event.preventDefault();
  for (const { input, output } of previewFields) output.textContent = input.value.trim();
  formPreview.hidden = false;
  formStatus.textContent = translations[selectedLanguage ?? "en"].formStatus;
});
form.addEventListener("input", () => {
  formPreview.hidden = true;
  formStatus.textContent = "";
});
document.querySelector("#preview-button").disabled = false;

const savedLanguage = readLanguage();
if (savedLanguage) {
  applyLanguage(savedLanguage);
} else {
  document.documentElement.classList.add("choosing-language");
  languageDialog.showModal();
}
