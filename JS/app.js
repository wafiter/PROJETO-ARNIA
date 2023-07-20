//Inserir usuario

//-formatar data    
function formatarDataParaBrasileiro(data) {
  const partesData = data.split("-");
  const dataFormatada = partesData.reverse().join("/");
  return dataFormatada;
}
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

let mentores;
const PaginaDeMentores = async () => {
  await buscarMentores();
  fazerTabelaMentores(mentores);
};

const buscarMentores = async (parametro = null) => {
  try {
    const mentoresApi = await fetch("http://localhost:3000/mentores");
    mentores = await mentoresApi.json();
    return mentores;
  } catch (error) {
    console.log(error);
  }
};
const fazerTabelaMentores = (mentores) => {
  let tabela = document.getElementById("tabelaMentores");

  mentores.forEach((element, index) => {
    tabela.innerHTML =
      tabela.innerHTML +
      `<tr>
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
    console.log("deletou");
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

const carregarEditarMentor = async () => {
  getIdUrl();
  buscarMentorEditar(id);
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
  const mentorEditavel = await resposta.json();

  formDeEditarMtr(mentorEditavel);
};

//carregar e submit o formulario do editar mentor

const formEditarMt = document.getElementById("formEditarMentor");
if (formEditarMt != null) {
  formEditarMt.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const nome = formEditarMt.elements["nome"].value;
    const email = formEditarMt.elements["email"].value;

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


//      MENTORIAS

let mentoriasApi;

const paginaMentorias = async () => {
  await buscarMentoriasApi();
  fazerTabelaMentorias(mentoriasApi);
};
//- busca mentorias na API

const buscarMentoriasApi = async (parametro = null) => {
  try {
    const mentoriasSTR = await fetch("http://localhost:3000/mentorias");
    mentoriasApi = await mentoriasSTR.json();
    
  } catch (error) {
    console.log(error);
  }
};

//- Fazer tabela de mentorias

const fazerTabelaMentorias = (mentoriasApi) => {
  let tabelaMentorias = document.getElementById("tabelaMentorias");
  mentoriasApi.forEach((element) => {
    tabelaMentorias.innerHTML =
      tabelaMentorias.innerHTML +
      `
      <tr>
      <td>${element.titulo}</td>
      <td>${element.mentor}</td>
      <td><div class="${element.status}">${element.status}</div></td>
      <td>
        <button onclick="editarMentoria(${element.id})" class="material-icons iconsCaneta"> create </button>
        <button class="material-icons iconsLixeira" onclick="deletarMentoria(${element.id})"> delete </button>
      </td>
      </tr>
      `;
  });
};

//-Buscar mentores e colocar no select
const construirselect = async () => {
  await buscarMentores();
  console.log(mentores);
  fazerSelect(mentores);
};

const selectMentores = document.getElementById("selectMentores");

const fazerSelect = async (mentores) => {
  selectMentores.innerHTML = `<option disabled selected value="null">Nenhum Mentor selecionado</option>`;
  mentores.forEach((element) => {
    selectMentores.innerHTML =
      selectMentores.innerHTML +
      `<option value="${element.nome}">${element.nome}</option>`;
  });
};

//- formulario de nova mentoria

const mandarMentoriaApi = async (mentoria) => {
  try {
    await fetch("http://localhost:3000/mentorias", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mentoria),
    });
    window.alert("Metoria salva");
  } catch (error) {
    window.alert("Erro ao cadastra a MENTORIA");
  }
};

const formNovaMentoria = document.getElementById("formNovaMentoria");

if (formNovaMentoria != null) {
  formNovaMentoria.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tituloMentoria = formNovaMentoria.elements["tituloMentoria"].value;
    const mentor = formNovaMentoria.elements["selectMentores"].value;
    let status = formNovaMentoria.elements["switchNovaMentoria"].checked;
    if (status == true) {
      status = "Ativo";
    } else {
      status = "Inativo";
    }
    const mentoria = {
      titulo: tituloMentoria,
      mentor: mentor,
      status: status,
    };
    mandarMentoriaApi(mentoria);
  });
}

//- Editar mentoria

const editarMentoria = (id) => {
  window.location = `editarMentoria.html?id=${id}`;
};
const PagianaEditarMentoria = () => {
  construirselect()
  getIdUrl();
  mentoriaEditApi(id);
};

const mentoriaEditApi = async (id) => {
  const resposta = await fetch(`http://localhost:3000/mentorias/${id}`);
  const mentoriaEditavel = await resposta.json();

  formDeEditarMtria(mentoriaEditavel);
};

//-submit do formulario de editar

const formEditarMentoria = document.getElementById("formEditarMentoria");
if (formEditarMentoria != null) {
  formEditarMentoria.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const tituloMentoria = formEditarMentoria.elements["tituloMentoria"].value;
    const mentor = formEditarMentoria.elements["selectMentores"].value;
    let status = formEditarMentoria.elements["switchNovaMentoria"].checked;
    if (status == true) {
      status = "Ativo";
    } else {
      status = "Inativo";
    }
    const mentoriaEditada = {
      titulo: tituloMentoria,
      mentor: mentor,
      status: status,
    };

    salvarMentoriaEditada(mentoriaEditada);
  });
}
//- salvar mentoria editada na API
const salvarMentoriaEditada = async (mentoriaEditada) => {
  await fetch(`http://localhost:3000/mentorias/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mentoriaEditada),
  });

  window.location = "mentorias.html";
};

//- jogar dados no formulario de editar mentoria

const formDeEditarMtria = async (mentoriaEditavel) => {
  document.getElementById("tituloMentoria").value = mentoriaEditavel.titulo;
  document.getElementById("selectMentores").value = mentoriaEditavel.mentor;
  if (mentoriaEditavel.status == "Ativo") {
    document.getElementById("switchNovaMentoria").checked = true;
  } else {
    document.getElementById("switchNovaMentoria").checked = false;
  }
};

//- Deletar Mentoria

const deletarMentoria = async (id) => {
  try {
    console.log("deletou");
    await fetch(`http://localhost:3000/mentorias/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    paginaMentorias();
  } catch (error) {
    window.alert("FALHA AO DELETAR");
  }
};
//-     Turmas

//-pagina de turma

let turmas
const paginaTurmas = async () =>{
  await buscarTurmas()
  fazerTabelaTurmas(turmas)
}

const fazerTabelaTurmas = (turmas) => {
  const tabelaTurmas = document.getElementById('tabelaTurmas')
  tabelaTurmas.innerHTML ="" 
    turmas.forEach((element)=>{
    let dataFormatada = formatarDataParaBrasileiro(element.dataDeInicio);
    tabelaTurmas.innerHTML= tabelaTurmas.innerHTML +     
    ` 
    <tr>
    <td>${element.turma}</td>
    <td >${element.mentor}</td>
    <td >${element.mentoria}</td>
    <td >${dataFormatada}</td>
    <td >${element.diaDaSemana}</td>
    <td >${element.horaDoInicio}</td>
    <td class="encontros">${element.encontros}</td>
    <td>
      <button onclick="editarTurma(${element.id})" class="material-icons iconsCaneta"> create </button>
      <button class="material-icons iconsLixeira" onclick="deletarTurma(${element.id})"> delete </button>
    </td>
  </tr>    
    `
  })
}
const buscarTurmas = async () =>{
  try {
    const turmasApi = await fetch("http://localhost:3000/turmas");
    turmas = await turmasApi.json();    
  } catch (error) {
    window.alert('Não Foi possivel carregar as Turmas')
    console.log(error);
  }
}

//pagina de nova turma

const pagNovaTurma = () =>{
  construirselect() 
  construirSelectMentorias()
}

const construirSelectMentorias = async () => {
  await buscarMentoriasApi();
  console.log(mentoriasApi);
  fazerSelectMentorias(mentoriasApi)
};

const fazerSelectMentorias = (mentoriasApi) => {
    const selectMentorias = document.getElementById("selectMentorias")
    selectMentorias.innerHTML = `<option value="" selected disabled>Selecione a Mentoria</option>`
    mentoriasApi.forEach((element) => {
      selectMentorias.innerHTML =
        selectMentorias.innerHTML +
        `<option value="${element.titulo}">${element.titulo}</option>`;
    })
}
//- Nova turma, formulario  e mandar pra API

const formNovaTurma = document.getElementById('formNovaTurma')

if(formNovaTurma != null){
  formNovaTurma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mentoria = formNovaTurma.elements['selectMentorias'].value
    const mentor = formNovaTurma.elements['selectMentores'].value
    const dataDeInicio = formNovaTurma.elements['dataInicio'].value
    const diaDaSemana = formNovaTurma.elements['diasDaSemana'].value
    const horaDoInicio = formNovaTurma.elements['horaDeInicio'].value
    const horaDoFim = formNovaTurma.elements['horaDeFim'].value
    const turma = formNovaTurma.elements['turma'].value
    const link = formNovaTurma.elements['linkDaAula'].value
    const qtEncontros = formNovaTurma.elements['qtEncontros'].value
    
        
    const novaTurma = {
      mentoria: mentoria,
      mentor: mentor,
      dataDeInicio: dataDeInicio,
      diaDaSemana: diaDaSemana,
      horaDoInicio: horaDoInicio,
      horaDoFim: horaDoFim,
      turma: turma,
      link: link,
      encontros: qtEncontros,      
    } 
    salvarTurma(novaTurma)
  })
}
const salvarTurma = async (novaTurma) => {
  try {
    await fetch("http://localhost:3000/turmas", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novaTurma),
    });
    window.alert("Nova turma criada");
  } catch (error) {
    window.alert("Erro ao cadastra a MENTORIA");
  }
}
//- Deletar turma
const deletarTurma = async (id) => {
  try {
    console.log("deletou");
    await fetch(`http://localhost:3000/turmas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    paginaTurmas();
  } catch (error) {
    window.alert("FALHA AO DELETAR");
  }
}


//- Editar Turma

//- carregar pagina e formulario de editar
const editarTurma = (id) =>{
  window.location = `editarTurma.html?id=${id}`;  
}
const carregarEditarTurma = ()=>{
  construirselect()
  construirSelectMentorias()
  getIdUrl();
  BuscaTurmaEditavel(id)
  }

  const BuscaTurmaEditavel = async (id) =>{
    const resposta = await fetch(`http://localhost:3000/turmas/${id}`);
    const turmaEditavel = await resposta.json();
  
    formDeEditarTurma(turmaEditavel);
    console.log(turmaEditavel)
  }

const formDeEditarTurma = async (turmaEditavel) => {
  console.log(turmaEditavel.dataDeInicio)

  document.getElementById('selectMentorias').value = turmaEditavel.mentoria
  document.getElementById('selectMentores').value = turmaEditavel.mentor
  document.getElementById('dataInicio').value = turmaEditavel.dataDeInicio
  document.getElementById('diasDaSemana').value = turmaEditavel.diaDaSemana
  document.getElementById('horaDeInicio').value = turmaEditavel.horaDoInicio
  document.getElementById('horaDeFim').value = turmaEditavel.horaDoFim
  document.getElementById('turma').value = turmaEditavel.turma
  document.getElementById('linkDaAula').value = turmaEditavel.link
  document.getElementById('qtEncontros').value = turmaEditavel.encontros    
}
//- submit do formulario de editar

const formEditarTurma  = document.getElementById('formEditarTurma')

if(formEditarTurma != null){
  formEditarTurma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mentoria = formEditarTurma.elements['selectMentorias'].value
    const mentor = formEditarTurma.elements['selectMentores'].value
    const dataDeInicio = formEditarTurma.elements['dataInicio'].value
    const diaDaSemana = formEditarTurma.elements['diasDaSemana'].value
    const horaDoInicio = formEditarTurma.elements['horaDeInicio'].value
    const horaDoFim = formEditarTurma.elements['horaDeFim'].value
    const turma = formEditarTurma.elements['turma'].value
    const link = formEditarTurma.elements['linkDaAula'].value
    const qtEncontros = formEditarTurma.elements['qtEncontros'].value
    
        
    const TurmaEditada = {
      mentoria: mentoria,
      mentor: mentor,
      dataDeInicio: dataDeInicio,
      diaDaSemana: diaDaSemana,
      horaDoInicio: horaDoInicio,
      horaDoFim: horaDoFim,
      turma: turma,
      link: link,
      encontros: qtEncontros,      
    } 
    console.log(id)
    salvarTurmaEditada(TurmaEditada)
  })
}
const salvarTurmaEditada = async (turmaEditada) => {
  await fetch(`http://localhost:3000/turmas/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(turmaEditada),
  });
  window.location = "turmas.html";
};
















