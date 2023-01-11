const message = document.querySelector("[name=message]");
const fileInput = document.querySelector("[name=file]");
const content = document.querySelector(".content");
const form = document.querySelector("#form");

// form.addEventListener("submit", upload;

// async function upload(event) {
//   event.preventDefault();
//   const url = "/api/upload";
//   const formData = new FormData();
//   //   formData.append("file", file.files[0]);
//   console.log(file.files[0]);
//   console.log(file.files);
//   const body = { message: message.value, file: file.files[0] };
//   console.log(body);
//   const fetchInfor = await fetch(url, {
//     method: "POST",
//     // headers: { "content-type": "application/x-www-form-urlencoded" },
//     body: JSON.stringify(body),
//   });
//   const Data = await fetchInfor.json();
//   console.log(Data);
//   if (Data.ok) {
//     const section = document.createElement("div");
//     const msg = document.createElement("div");
//     const hr = document.createElement("hr");
//     msg.innerText = message.value;
//     section.appendChild(msg);
//     section.appendChild(hr);
//     content.appendChild(section);
//     message.value = "";
//     message.focus();
//   } else {
//     const error = document.createElement("div");
//     error.innerText = Data.error;
//     buttonSection.appendChild(error);
//   }
// }

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
