const params = new URLSearchParams(location.search);
const id = params.get("id");
const articles = getArticles();
const article = articles.find(item => String(item.id) === String(id));
const detail = document.getElementById("articleDetail");
const related = document.getElementById("relatedArticles");

function addRelated(item) {
  const card = document.createElement("article"); card.className = "article-card";
  const media = document.createElement("a"); media.className = "card-media"; media.href = `article.html?id=${encodeURIComponent(item.id)}`;
  const img = document.createElement("img"); img.src = item.imageUrl || ""; img.alt = item.title; img.loading = "lazy";
  media.appendChild(img);
  const body = document.createElement("div"); body.className = "card-body";
  const cat = document.createElement("div"); cat.className = "card-meta"; cat.textContent = item.category;
  const h = document.createElement("h3"); h.textContent = item.title;
  const p = document.createElement("p"); p.textContent = item.description;
  const a = document.createElement("a"); a.className = "read-more"; a.href = media.href; a.textContent = "Maqolani o‘qish ↗";
  body.append(cat,h,p,a); card.append(media,body); related.append(card);
}
if (article) {
  document.title = `${article.title} | AdVision`;
  const category = document.createElement("div"); category.className = "eyebrow"; category.innerHTML = `<span class="eyebrow-line"></span> ${article.category.toLocaleUpperCase("uz")}`;
  const title = document.createElement("h1"); title.textContent = article.title;
  const intro = document.createElement("p"); intro.className = "article-lead"; intro.textContent = article.description;
  const meta = document.createElement("div"); meta.className = "article-meta"; meta.textContent = `AdVision tahririyati  •  ${Math.max(2, Math.ceil((article.content || "").split(/\s+/).length / 180))} daqiqalik o‘qish`;
  const cover = document.createElement("img"); cover.className = "article-cover"; cover.src = article.imageUrl || ""; cover.alt = article.title;
  const prose = document.createElement("div"); prose.className = "article-prose";
  (article.content || "").split(/\n+/).filter(Boolean).forEach((paragraph, index) => {
    const p = document.createElement("p"); p.textContent = paragraph; prose.appendChild(p);
    if (index === 1 && (article.content || "").split(/\n+/).length > 4) {
      const h = document.createElement("h2"); h.textContent = "Bu mavzu nega muhim?"; prose.appendChild(h);
    }
  });
  const actions = document.createElement("div"); actions.className = "article-actions";
  const share = document.createElement("button"); share.className = "button-secondary"; share.textContent = "Havolani nusxalash ↗";
  share.addEventListener("click", async () => { try { await navigator.clipboard.writeText(location.href); share.textContent = "Nusxalandi ✓"; } catch { share.textContent = "Havolani manzil satridan nusxalang"; } });
  actions.appendChild(share);
  detail.replaceChildren(category,title,intro,meta,cover,prose,actions);
  articles.filter(item => String(item.id) !== String(article.id) && item.category === article.category).slice(0,3).forEach(addRelated);
  if (!related.children.length) articles.filter(item => String(item.id) !== String(article.id)).slice(0,3).forEach(addRelated);
} else {
  const h = document.createElement("h1"); h.textContent = "Maqola topilmadi";
  const p = document.createElement("p"); p.textContent = "Bu maqola o‘chirilgan yoki havola noto‘g‘ri.";
  const a = document.createElement("a"); a.className = "button-primary"; a.href = "index.html#articles"; a.textContent = "Bosh sahifaga qaytish";
  detail.replaceChildren(h,p,a);
}
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById("readingProgress").style.width = `${total > 0 ? window.scrollY / total * 100 : 0}%`;
});
