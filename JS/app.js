//Inserir usuario

//          destacar menu

  





//navagar nos HTML

const mudarPag = (param) => {
  window.location = param
};

//                                 Mentores

const buscarMentores = async () => {
  try {
    const mentoreApi = await fetch("http://localhost:3000/mentores");
    const mentores = await mentoreApi.json();

    fazerTabelaMentores(mentores);
  } catch (error) {
    window.alert("não foi possivel carregar a pagina");
  }
};
const fazerTabelaMentores = (mentores) => {
  let tabela = document.getElementById("tabelaMentores");
  mentores.forEach((element) => {
    tabela.innerHTML =
      tabela.innerHTML +
      ` <tr>
    <td>${element.nome}</td>
    <td>${element.email}</td>
    <td>
      <button onclick="editarMentor(${element.id})" class="material-icons iconsCaneta"> create </button>
      <button class="material-icons iconsLixeira" onclick="deletarMentor(${element.id})"> delete </button>
    </td>
  </tr>`;
  });
};

//- criar novo mentor
const criarMentor = async (mentorAdd) => {
  try {
    await fetch("http://localhost:3000/mentores", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mentorAdd),
    });
    window.location = "mentores.html";
  } catch (error) {
    window.alert("falha ao salvar o mentor");
  }
};

const formNovoMentor = document.getElementById("formNovoMentor");
console.log(formNovoMentor);
if (formNovoMentor != null) {
  formNovoMentor.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeMentor = formNovoMentor.elements["nome"].value;
    const emailMentor = formNovoMentor.elements["email"].value;

    const mentorAdd = {
      nome: nomeMentor,
      email: emailMentor,
    };
    criarMentor(mentorAdd);
  });
}
//- deletar Mentor

const deletarMentor = async (id) => {
  try {
    await fetch(`http://localhost:3000/mentores/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    buscarMentores();
  } catch (error) {
    window.alert("FALHA AO DELETAR");
  }
};
//- Editar mentor

const editarMentor = (id) => {
  window.location = `editarMentor.html?id=${id}`
}
let id = null

const getIdUrl = () => {
  const paramsString = window.location.search;
  const params = new URLSearchParams(paramsString);
  id = params.get("id");
}
//envia e busca na api

const salvarMentorEditado = async (MentorEditado) => {
  await fetch(`http://localhost:3000/mentores/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(MentorEditado),
  });

  window.location = "mentores.html";
};

const buscarMentorEditar = async (id) => {
  const resposta = await fetch(`http://localhost:3000/mentores/${id}`); console.log("indo na api")
  const mentorEditavel = await resposta.json();
  
  formDeEditarMtr(mentorEditavel)
};
//carrega e submit o formulario
const formEditarMt = document.getElementById("formEditarMentor");

const formDeEditarMtr = async (mentorEditavel) => {

    document.getElementById("nome").value = mentorEditavel.nome;
    document.getElementById("email").value = mentorEditavel.email
    
};

formEditarMt.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  console.log(formEditarMt)
  let nome = formEditarMt.elements["nome"].value
  let email = formEditarMt.elements["email"].value

  const MentorEditado = {
    nome: nome,
    email: email,
  }
  salvarMentorEditado(MentorEditado)
  
})


const carregarEditarMentor = async () => {
  getIdUrl()
  
  buscarMentorEditar(id)
}

