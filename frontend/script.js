const form = document.getElementById("userForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const login = document.getElementById("githubLogin").value.trim();
  resultDiv.innerHTML = "Завантаження...";

  try {
    const res = await fetch(`https://api.github.com/users/${login}`);
    if (!res.ok) {
      resultDiv.innerHTML = `<div class="error">Користувача не знайдено!</div>`;
      return;
    }
    const user = await res.json();
    resultDiv.innerHTML = `
            <div class="user-card">
                <img src="${user.avatar_url}" alt="avatar">
                <h2>${user.name ? user.name : user.login}</h2>
                <p><b>Логін:</b> ${user.login}</p>
                <p><b>Публічні репозиторії:</b> ${user.public_repos}</p>
                <p><b>Фоловери:</b> ${user.followers}</p>
                <p><b>Місцезнаходження:</b> ${
                  user.location ? user.location : "Невідомо"
                }</p>
                <p><a href="${
                  user.html_url
                }" target="_blank">Відкрити профіль на GitHub</a></p>
            </div>
        `;
  } catch (e) {
    resultDiv.innerHTML = `<div class="error">Сталася помилка при завантаженні даних.</div>`;
  }
});
