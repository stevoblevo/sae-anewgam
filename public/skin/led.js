(() => {
  const ways = [
    ["sae", "/", "sae", "the porch"],
    ["now", "/and-now/index.html", "now", "the light"],
    ["fall", "/everfallen/index.html", "fall", "the garden"],
    ["further", "/?to=further", "further", "the story"],
  ];
  const path = location.pathname;
  const here = path.includes("and-now")
    ? "now"
    : path.includes("everfallen")
      ? "fall"
      : path.includes("sae-night")
        ? ""
        : "";
  const nav = document.createElement("nav");
  nav.className = "led-rail";
  nav.setAttribute("aria-label", "ways");
  for (const [k, href, label, hint] of ways) {
    const a = document.createElement("a");
    a.href = href;
    a.dataset.k = k;
    a.setAttribute("aria-label", `${label}, ${hint}`);
    if (k === here) a.setAttribute("aria-current", "page");
    const i = document.createElement("i");
    const s = document.createElement("span");
    s.textContent = label;
    a.append(i, s);
    nav.append(a);
  }
  document.body.append(nav);
})();
