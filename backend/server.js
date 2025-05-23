const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Віддавати CSS
app.use(express.static(path.join(__dirname, "public")));

// Головний ендпоінт для завдання
app.get("/user", async (req, res) => {
  const login = req.query.login;
  if (!login) {
    return res.send(renderError("Вкажіть параметр ?login=..."));
  }
  if (login === "is-34fiot-23-167") {
    // Мої особисті дані
    return res.send(
      renderInfoCard({
        name: "Денис Майко",
        course: "2",
        group: "ІС-34",
        login: "is-34fiot-23-167",
      })
    );
  } else {
    // Дані з GitHub API
    try {
      const response = await fetch(`https://api.github.com/users/${login}`);
      if (!response.ok) {
        return res.send(renderError("Користувача не знайдено на GitHub!"));
      }
      const user = await response.json();
      res.send(renderUserCard(user));
    } catch (e) {
      res.send(renderError("Сталася помилка при зверненні до GitHub API."));
    }
  }
});

function renderInfoCard(student) {
  return `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Особисті дані</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="user-card">
        <h2>Особисті дані студента</h2>
        <ul>
            <li><b>ПІБ:</b> ${student.name}</li>
            <li><b>Курс:</b> ${student.course}</li>
            <li><b>Група:</b> ${student.group}</li>
            <li><b>Логін у Moodle:</b> ${student.login}</li>
        </ul>
    </div>
</body>
</html>
    `;
}

function renderUserCard(user) {
  return `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>GitHub User Info</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
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
</body>
</html>
    `;
}

function renderError(message) {
  return `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Помилка</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="error">${message}</div>
</body>
</html>
    `;
}

app.listen(PORT, () => {
  console.log(`Сервер працює: http://localhost:${PORT}/user?login=<логін>`);
});
