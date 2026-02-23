const params = new URLSearchParams(window.location.search);
const seriesKey = params.get("series");

const titleEl = document.getElementById("seriesTitle");
const pricingEl = document.getElementById("seriesPricing");
const gridEl = document.getElementById("galleryGrid");

function renderSeriesPricing() {
  if (!pricingEl) {
    return;
  }

  const lines = Array.isArray(seriesPricing?.[seriesKey])
    ? seriesPricing[seriesKey]
    : ["Edition and pricing details available on request"];

  pricingEl.innerHTML = lines.map((line) => `<p>${line}</p>`).join("");
  pricingEl.classList.toggle("is-candy-goldsworthy", seriesKey === "candy-goldsworthy");
}

function classifyGalleryItems() {
  const items = document.querySelectorAll(".gallery-item");

  items.forEach((item) => {
    const image = item.querySelector("img");
    if (!image) {
      return;
    }

    const setOrientation = () => {
      item.classList.remove("is-portrait", "is-landscape");

      if (image.naturalHeight > image.naturalWidth) {
        item.classList.add("is-portrait");
      } else {
        item.classList.add("is-landscape");
      }
    };

    if (image.complete && image.naturalWidth > 0) {
      setOrientation();
    } else {
      image.addEventListener("load", setOrientation, { once: true });
    }
  });
}

const chosenSeries = portfolioSeries?.[seriesKey];

if (!chosenSeries) {
  titleEl.textContent = "Series Not Found";
  if (pricingEl) {
    pricingEl.innerHTML = "";
  }
  gridEl.innerHTML = '<p class="empty-note">This series does not exist yet.</p>';
} else {
  titleEl.textContent = chosenSeries.title;
  document.title = `${chosenSeries.title} | Henry Hargreaves`;

  renderSeriesPricing();

  const images = Array.isArray(chosenSeries.images) ? chosenSeries.images : [];
  gridEl.classList.toggle("is-no-seconds", seriesKey === "no-seconds");

  if (!images.length) {
    const placeholders = Array.from({ length: 8 }, (_, index) => index + 1);
    gridEl.innerHTML = placeholders
      .map(
        (item) => `
          <figure class="gallery-item" aria-label="Placeholder image ${item}">
            <figcaption class="placeholder-tag">${chosenSeries.title} · Image ${item}</figcaption>
          </figure>
        `
      )
      .join("");
  } else {
    gridEl.innerHTML = images
      .map((imagePath, index) => {
        const safePath = imagePath
          .split("/" )
          .map(encodeURIComponent)
          .join("/");
        const caption = imageCaptions?.[imagePath] || "";

        return `
          <figure class="gallery-item">
            <img src="${safePath}" alt="${chosenSeries.title} image ${index + 1}" loading="lazy" />
            ${caption ? `<figcaption class="image-caption">${caption}</figcaption>` : ""}
          </figure>
        `;
      })
      .join("");

    classifyGalleryItems();
  }
}
