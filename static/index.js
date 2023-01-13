const message = document.querySelector("[name=message]");
const fileInput = document.querySelector("[name=file]");
const content = document.querySelector(".content");
const form = document.querySelector("#form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("message", message.value);
  fetch("/api/upload", {
    method: "POST",
    hearders: { "Content-Type": "multipart/form-data" },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        getMessage();
      }
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

function getMessage() {
  const url = "/api/upload";
  const method = "GET";
  fetch(url, { method: method })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.ok);
      console.log(data.data.message);
      if (data.ok) {
        showPost(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function showPost(data) {
  const section = document.createElement("div");
  const msg = document.createElement("div");
  const img = document.createElement("img");
  const hr = document.createElement("hr");
  msg.innerText = data.data.message;
  img.src = data.data.url;
  img.className = "img";
  section.className = "section";
  section.appendChild(msg);
  section.appendChild(img);
  section.appendChild(hr);
  const sectionNode = document.querySelectorAll(".section")[0];
  content.insertBefore(section, sectionNode);
  message.value = "";
  fileInput.value = "";
  message.focus();
}
