document.addEventListener("DOMContentLoaded", start);
let users = [];
function start() {
  get();
}

function closeform(id) {
  document.querySelectorAll(".liste").forEach(e => {
    if (e.dataset.listeid === id) {
      e.querySelector("#form").classList.add("gone");
      e.querySelector(".user").classList.remove("gone");
    }
  });
}

function get() {
  fetch("https://eksamen-f310.restdb.io/rest/brugere", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=uft-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(brugere => {
      users = brugere;
      brugere.forEach(addUserToTheDOM);
    });
}

function addUserToTheDOM(liste) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);

  copy.querySelector("article.liste").dataset.listeid = liste._id;

  copy.querySelector("h1").textContent = `CPR: ${liste.cpr}`;
  copy.querySelector("h2").textContent = `Fornavn: ${liste.name}`;
  copy.querySelector("h3").textContent = `Efternavn: ${liste.lastname}`;
  copy.querySelector("h4").textContent = `Brugernavn: ${liste.username}`;
  copy.querySelector("h5").textContent = `Email: ${liste.email}`;
  copy.querySelector("h6").textContent = `Mobil: ${liste.mobile}`;
  copy.querySelector("h7").textContent = `Adresse: ${liste.address}`;
  copy.querySelector("h8").textContent = `Køn: ${liste.gender}`;
  copy.querySelector("h9").textContent = `Indestående: ${liste.estimated}`;

  copy.querySelector("button.btnDelete").addEventListener("click", e => {
    const target = e.target.closest("article");
    target.classList.add("gone");
    deleteListe(liste._id);
  });

  copy.querySelector("button.btnEdit").addEventListener("click", e => {
    fetchAndPopulate(liste._id);
  });

  document.querySelector("#app").prepend(copy);
}

function fetchAndPopulate(id) {
  document.querySelectorAll(".liste").forEach(e => {
    if (e.dataset.listeid === id) {
      e.querySelector("#form").classList.remove("gone");
      e.querySelector(".user").classList.add("gone");

      fetch(`https://eksamen-f310.restdb.io/rest/brugere/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json; charset=uft-8",
          "x-apikey": "5de4cc954658275ac9dc2176",
          "cache-control": "no-cache"
        }
      })
        .then(a => a.json())
        .then(bruger => {
          e.querySelector("#editForm").elements.cpr.value = bruger.cpr;
          e.querySelector("#editForm").elements.name.value = bruger.name;
          e.querySelector("#editForm").elements.lastname.value = bruger.lastname;
          e.querySelector("#editForm").elements.username.value = bruger.username;
          e.querySelector("#editForm").elements.email.value = bruger.email;
          e.querySelector("#editForm").elements.mobile.value = bruger.mobile;
          e.querySelector("#editForm").elements.address.value = bruger.address;
          e.querySelector("#editForm").elements.gender.value = bruger.gender;
          e.querySelector("#editForm").elements.estimated.value = bruger.estimated;
          e.querySelector("#editForm").elements.id.value = bruger._id;
        });

      e.addEventListener("submit", evt => {
        evt.preventDefault();

        put(e, id);
      });
    }
  });
}

function put(e, id) {
  const data = {
    cpr: e.querySelector("#editForm").elements.cpr.value,
    name: e.querySelector("#editForm").elements.name.value,
    lastname: e.querySelector("#editForm").elements.lastname.value,
    username: e.querySelector("#editForm").elements.username.value,
    email: e.querySelector("#editForm").elements.email.value,
    mobile: e.querySelector("#editForm").elements.mobile.value,
    address: e.querySelector("#editForm").elements.address.value,
    gender: e.querySelector("#editForm").elements.gender.value,
    estimated: e.querySelector("#editForm").elements.estimated.value
  };

  closeform(id);

  fetch(`https://eksamen-f310.restdb.io/rest/brugere/${e.dataset.listeid}`, {
    method: "put",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(updatedListe => {
      const parentElement = document.querySelector(`.liste[data-listeid="${updatedListe._id}"]`);

      parentElement.querySelector("h1").textContent = `CPR: ${updatedListe.cpr}`;
      parentElement.querySelector("h2").textContent = `Fornavn: ${updatedListe.name}`;
      parentElement.querySelector("h3").textContent = `Efternavn: ${updatedListe.lastname}`;
      parentElement.querySelector("h4").textContent = `Brugernavn: ${updatedListe.username}`;
      parentElement.querySelector("h5").textContent = `Email: ${updatedListe.email}`;
      parentElement.querySelector("h6").textContent = `Mobil: ${updatedListe.mobile}`;
      parentElement.querySelector("h7").textContent = `Adresse: ${updatedListe.address}`;
      parentElement.querySelector("h8").textContent = `Køn: ${updatedListe.gender}`;
      parentElement.querySelector("h9").textContent = `Indestående: ${updatedListe.estimated}`;
    });
}

function deleteListe(id) {
  fetch("https://eksamen-f310.restdb.io/rest/brugere/" + id, {
    method: "delete",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-apikey": "5de4cc954658275ac9dc2176",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {});
}
