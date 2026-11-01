const form = document.getElementById("articleForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("imageUrl");
const descriptionInput = document.getElementById("description");
const contentInput = document.getElementById("content");
const idInput = document.getElementById("articleId");
const list = document.getElementById("adminArticleList");
const message = document.getElementById("adminMessage");
const cancelButton = document.getElementById("cancelEdit");
let articles = getArticles();

function updateStats() {
  document.getElementById("totalArticles").textContent = articles.length;
  document.getElementById("technologyCount").textContent = articles.filter(a => a.category === "Texnologiya").length;
  document.getElementById("businessCount").textContent = articles.filter(a => a.category === "Biznes").length;
  document.getElementById("internetCount").textContent = articles.filter(a => a.category === "Internet").length;
}
function renderAdminArticles() {
  list.innerHTML = "";
  if (!articles.length) { list.textContent = "Hozircha maqola yo‘q."; updateStats(); return; }
  articles.forEach(article => {
    const row = document.createElement("div"); row.className = "admin-article";
    const thumb = document.createElement("img"); thumb.src = article.imageUrl || ""; thumb.alt = ""; thumb.onerror = () => thumb.style.display = "none";
    const info = document.createElement("div"); info.className = "admin-article-info";
    const category = document.createElement("span"); category.className = "admin-category"; category.textContent = article.category;
    const heading = document.createElement("h3"); heading.textContent = article.title;
    info.append(category, heading);
    const actions = document.createElement("div"); actions.className = "admin-actions";
    const edit = document.createElement("button"); edit.className = "edit-btn"; edit.textContent = "Tahrirlash"; edit.addEventListener("click", () => editArticle(article.id));
    const del = document.createElement("button"); del.className = "delete-btn"; del.textContent = "O‘chirish"; del.addEventListener("click", () => deleteArticle(article.id));
    actions.append(edit, del); row.append(thumb, info, actions); list.append(row);
  });
  updateStats();
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const articleData = {
    id: idInput.value ? Number(idInput.value) : Date.now(),
    title: titleInput.value.trim(),
    category: categoryInput.value,
    icon: "✦",
    imageUrl: imageInput.value.trim() || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    description: descriptionInput.value.trim(),
    content: contentInput.value.trim()
  };
  if (idInput.value) {
    articles = articles.map(a => String(a.id) === String(articleData.id) ? articleData : a);
    message.textContent = "Maqola muvaffaqiyatli yangilandi.";
  } else {
    articles.unshift(articleData);
    message.textContent = "Yangi maqola qo‘shildi.";
  }
  saveArticles(articles); form.reset(); idInput.value = ""; resetForm(); renderAdminArticles();
});
function editArticle(id) {
  const a = articles.find(item => String(item.id) === String(id)); if (!a) return;
  idInput.value = a.id; titleInput.value = a.title; categoryInput.value = a.category;
  imageInput.value = a.imageUrl || ""; descriptionInput.value = a.description; contentInput.value = a.content;
  document.getElementById("formTitle").textContent = "Maqolani tahrirlash";
  cancelButton.hidden = false; form.scrollIntoView({behavior:"smooth",block:"start"});
}
function resetForm() {
  document.getElementById("formTitle").textContent = "Maqola yaratish";
  cancelButton.hidden = true;
}
cancelButton.addEventListener("click", () => { form.reset(); idInput.value = ""; resetForm(); message.textContent = ""; });
function deleteArticle(id) {
  if (!confirm("Ushbu maqolani o‘chirishni xohlaysizmi?")) return;
  articles = articles.filter(a => String(a.id) !== String(id)); saveArticles(articles);
  message.textContent = "Maqola o‘chirildi."; renderAdminArticles();
}
renderAdminArticles();
