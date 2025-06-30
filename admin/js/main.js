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
