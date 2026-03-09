(function () {
  const DOC_ID = "1iyi-ZwTunatIdoWHq4wtOsyqQAbkpkUH8QTpp-LTvbo";
  const DOC_TXT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`;

  const list = document.querySelector(".exhibitions-list");
  if (!list) return;

  function parseExhibitionLines(text) {
    const normalized = text.replace(/\uFEFF/g, "").replace(/\r/g, "");
    return normalized
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^\d{4}\b/.test(line));
  }

  function render(lines) {
    if (!lines.length) return;

    list.innerHTML = lines
      .map((line) => `<li class=\"exhibitions-item\">${line}</li>`)
      .join("");
  }

  fetch(DOC_TXT_URL, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`Doc fetch failed: ${response.status}`);
      return response.text();
    })
    .then((text) => {
      const lines = parseExhibitionLines(text);
      render(lines);
    })
    .catch((error) => {
      console.warn("Using fallback exhibitions list from HTML.", error);
    });
})();
