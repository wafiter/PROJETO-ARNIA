//Inserir usuario

//navagar nos HTML
const mudarPag = (param) => {
  window.location = param;
};

//       Mostra menu selecionado

const onloadMenu = () => {
  let currentPage = document.body.className;
  let menuButtons = document.getElementsByClassName("iMenu");

  console.log(menuButtons);

  for (let i = 0; i < menuButtons.length; i++) {
    let button = menuButtons[i];

    if (button.getAttribute("onclick").includes(currentPage)) {
      button.classList.add("botao-selecionado");
      break;
    }
  }
};

onloadMenu();


//                             Mentores

//- abrir pag novo mentor

const abriNovoMentor = () => {
  const pagNovoMentor = document.getElementById("conteudoMentores");
  pagNovoMentor.innerHTML = " ";
  pagNovoMentor.innerHTML = `
  <div>
  <h3 class="titleConteudo">
  <button onclick="mudarPag('mentores.html')" class="voltar">
  <span class="material-icons arrow">arrow_back</span></button>Novo mentor </h3>
  </div>
  <div class="superiorNm">
 <p>Dados</p>
</div>
<form class="formMentor" id="formNovoMentor">
 <section>
   <label for="nome">Nome</label>
   <input type="text" name="nome" id="nomeDoMentor" class="nomeDoMentor" />
 </section>
 <section>
   <label for="email">E-mail</label>
   <input type="email" name="email" id="emailDoMentor" class="emailDoMentor"/>
 </section>
 <section>
   <button type="submit" id="btnNovoMentor" class="btnNovoMentor">Salvar</button>
 </section>
</form>`;

  const formNovoMentor = document.getElementById("formNovoMentor");
  
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

  //- criar novo mentor na API

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
};
//- buscar mentores na API e exibir tabela de mentores

const buscarMentores = async () => {
  try {
    const mentoreApi = await fetch("http://localhost:3000/mentores");
    const mentores = await mentoreApi.json();
    console.log(mentores)
    fazerTabelaMentores(mentores);
  } catch (error) {
    window.alert("não foi possivel carregar a pagina");
  }
};
const fazerTabelaMentores = (mentores) => {
  let tabela = document.getElementById("tabelaMentores");
  
  tabela.innerHTML = `<tr>
  <th class="nome">Nome</th>
  <th class="email">E-mail</th>
  <th class="acoes">Ações</th>
</tr>`
  mentores.forEach((element) => {
    tabela.innerHTML =
      tabela.innerHTML +
      `
     <tr>
    <td>${element.nome}</td>
    <td>${element.email}</td>
    <td>
      <button onclick="editarMentor(${element.id})" class="material-icons iconsCaneta"> create </button>
      <button class="material-icons iconsLixeira" onclick="deletarMentor(${element.id})"> delete </button>
    </td>
  </tr>`;
  });
};

//- deletar Mentor

const deletarMentor = async (id) => {
  try { 
    console.log('deletou')
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
  window.location = `editarMentor.html?id=${id}`;
};
let id = null;

const getIdUrl = () => {
  const paramsString = window.location.search;
  const params = new URLSearchParams(paramsString);
  id = params.get("id");
};

//enviar mentor editado na API

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
  const resposta = await fetch(`http://localhost:3000/mentores/${id}`);
  console.log("indo na api");
  const mentorEditavel = await resposta.json();

  formDeEditarMtr(mentorEditavel);
};

//carregar e submit o formulario do editar mentor

const formEditarMt = document.getElementById("formEditarMentor");
if (formEditarMt != null) {
  formEditarMt.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    console.log(formEditarMt);
    let nome = formEditarMt.elements["nome"].value;
    let email = formEditarMt.elements["email"].value;

    const MentorEditado = {
      nome: nome,
      email: email,
    };
    salvarMentorEditado(MentorEditado);
  });
}
const formDeEditarMtr = async (mentorEditavel) => {
  document.getElementById("nome").value = mentorEditavel.nome;
  document.getElementById("email").value = mentorEditavel.email;
};

const carregarEditarMentor = async () => {
  getIdUrl();

  buscarMentorEditar(id);
};

//      MENTORIAS

//- criar nova mentorias



//- Buscar as mentorias e inserir na tabela
