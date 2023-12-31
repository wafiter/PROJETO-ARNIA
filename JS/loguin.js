const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("senha");

// Função para aplicar a classe
const aplicarCorVerde = (event) => {
  const targetInput = event.target;
  if (targetInput.value.trim() != "") {
    targetInput.classList.add("inputVerde");
  } else {
    targetInput.classList.remove("inputVerde");
  }
};

emailInput.addEventListener("input", aplicarCorVerde);
passwordInput.addEventListener("input", aplicarCorVerde);

//- validar Loguin
let email;
let senha;
const formLog = document.getElementById("formLog");

formLog.addEventListener("submit", (e) => {
  e.preventDefault();

  email = formLog.elements["email"].value;
  senha = formLog.elements["senha"].value;
  buscarUsuario(email);
});

let buscarUsuario = async (dadoUser) => {
  let pesquisa = `?q=${dadoUser}`;

  try {
    let usuario = await fetch(`https://api-projeto-arnia.onrender.com/usuarios${pesquisa}`);
    usuario = await usuario.json();
    console.log(usuario);

    usuario.forEach((elem) => {
      if (elem.senha == senha && elem.email == email) {
        const nomeDoUsuario = elem.nomeDeUsuario;
        const emailDoUsuario = elem.email;
        localStorage.setItem("nomeDoUsuario", nomeDoUsuario);
        localStorage.setItem("emailDoUsuario", emailDoUsuario);
        console.log(nomeDoUsuario);
        window.location = `HTML/mentores.html`;
      } else {
        window.alert("Dados incorretos");
      }
    });
  } catch (error) {
    console.log(error);
    window.alert("Não foi possivel realizar o Login");
  }
};
