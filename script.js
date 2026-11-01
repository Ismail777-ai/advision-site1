const grid = document.getElementById("articleGrid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".category");
const emptyMessage = document.getElementById("emptyMessage");
let selectedCategory = "Barchasi";

function safeImage(article) {
  return article.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80";
}

function showArticles(list) {
  grid.innerHTML = "";
  emptyMessage.hidden = list.length !== 0;
  const count = document.getElementById("resultsLabel");
  if (count) count.textContent = `${list.length} ta maqola`;
  list.forEach((article, index) => {
    const card = document.createElement("article");
    card.className = "article-card";
    card.style.setProperty("--card-order", index);
    const media = document.createElement("a");
    media.className = "card-media";
    media.href = `article.html?id=${encodeURIComponent(article.id)}`;
    const img = document.createElement("img");
    img.src = safeImage(article);
    img.alt = article.title;
    img.loading = "lazy";
    img.onerror = () => { img.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"; };
    const badge = document.createElement("span");
    badge.className = "image-category";
    badge.textContent = article.category;
    media.append(img, badge);
    const body = document.createElement("div");
    body.className = "card-body";
    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.innerHTML = `<span>ADVISION TANLOVI</span><span>${Math.max(2, Math.ceil((article.content || "").split(/\s+/).length / 180))} daqiqa</span>`;
    const title = document.createElement("h3");
    title.textContent = article.title;
    const desc = document.createElement("p");
    desc.textContent = article.description;
    const link = document.createElement("a");
    link.className = "read-more";
    link.href = `article.html?id=${encodeURIComponent(article.id)}`;
    link.textContent = "Maqolani o‘qish";
    link.innerHTML += " <span>↗</span>";
    body.append(meta, title, desc, link);
    card.append(media, body);
    grid.appendChild(card);
  });
}

function filterArticles() {
  const query = search.value.toLocaleLowerCase("uz").trim();
  const filtered = getArticles().filter(article => {
    const matchesCategory = selectedCategory === "Barchasi" || article.category === selectedCategory;
    const text = `${article.title} ${article.description} ${article.content}`.toLocaleLowerCase("uz");
    return matchesCategory && text.includes(query);
  });
  showArticles(filtered);
}
search.addEventListener("input", filterArticles);
buttons.forEach(button => button.addEventListener("click", () => {
  buttons.forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  selectedCategory = button.dataset.category;
  filterArticles();
}));
const all = getArticles();
document.getElementById("heroArticleCount").textContent = `${all.length}+`;
document.getElementById("allCount").textContent = all.length;
showArticles(all);
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault(); search.focus();
  }
});
