fetch("http://localhost:5000/api/admin/users")
  .then((res) => res.json())
  .then((data) => {
    const list = document.getElementById("userList");
    data.forEach((user) => {
      const div = document.createElement("div");
      div.textContent = `👤 ${user.username}`;
      list.appendChild(div);
    });
  });

// 로그인 처리
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token); // JWT 저장
        window.location.href = "admin.html"; // 로그인 성공 시 이동
      } else {
        document.getElementById("error").innerText =
          result.message || "로그인 실패";
      }
    } catch (err) {
      document.getElementById("error").innerText = "서버 오류";
    }
  });
}

// 더미데이터로 UI 테스트용 코드
if (window.location.pathname.includes("routes.html")) {
  const dummyRoutes = [
    { id: "1", name: "한강따라 걷기", creator: "user01" },
    { id: "2", name: "북악스카이웨이 코스", creator: "user02" },
  ];

  const list = document.getElementById("route-list");
  dummyRoutes.forEach((route) => {
    const el = document.createElement("div");
    el.className = "route-card";
    el.innerHTML = `
      <p><strong>${route.name}</strong> - ${route.creator}</p>
      <button onclick="approveRoute('${route.id}')">승인</button>
    `;
    list.appendChild(el);
  });

  // 승인 버튼 (실제 API는 나중에 연결)
  window.approveRoute = function (id) {
    alert(`경로 ${id} 승인 완료 (임시 기능)`);
  };
}

// users.html
if (window.location.pathname.includes("users.html")) {
  const dummyUsers = [
    { id: "u001", name: "홍길동", email: "gildong@example.com" },
    { id: "u002", name: "김철수", email: "chulsoo@example.com" },
  ];

  const list = document.getElementById("user-list");
  dummyUsers.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <p><strong>${user.name}</strong> (${user.id})</p>
      <p>${user.email}</p>
      <button onclick="alert('자세히 보기 (준비중)')">자세히</button>
    `;
    list.appendChild(card);
  });
}

// 공통 헤더/푸터 삽입
window.addEventListener("DOMContentLoaded", () => {
  const loadComponent = async (id, path) => {
    const target = document.getElementById(id);
    if (target) {
      const res = await fetch(path);
      const html = await res.text();
      target.innerHTML = html;
    }
  };

  loadComponent("header", "components/header.html");
  loadComponent("footer", "components/footer.html");
});
