(function recolorBrandAssets() {
  const target = { r: 233, g: 0, b: 53 }; // #e90035
  const assets = document.querySelectorAll('.brand-logo, .site-nav-icon');

  const isRedPixel = (r, g, b, a) => {
    if (a < 20) return false;
    return r > 120 && r - g > 45 && r - b > 20;
  };

  const recolor = (img) => {
    if (!img.complete || img.naturalWidth === 0 || img.dataset.recolored === 'true') {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = frame.data;

    for (let i = 0; i < px.length; i += 4) {
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const a = px[i + 3];

      if (isRedPixel(r, g, b, a)) {
        px[i] = target.r;
        px[i + 1] = target.g;
        px[i + 2] = target.b;
      }
    }

    ctx.putImageData(frame, 0, 0);
    img.src = canvas.toDataURL('image/png');
    img.dataset.recolored = 'true';
  };

  assets.forEach((img) => {
    if (img.complete) {
      recolor(img);
    }
    img.addEventListener('load', () => recolor(img));
  });
})();
