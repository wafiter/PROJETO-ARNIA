//Inserir usuario
let nomeDoUsuarioLogado = localStorage.getItem("nomeDoUsuario");
let emailDoUsuarioLogado = localStorage.getItem("emailDoUsuario");

const dadosUsuario = () => {
  let nomeDeUsuario = document.querySelector(".nomeUser");
  let emaildeUsuario = document.querySelector(".emailUser");
  nomeDeUsuario.innerHTML = nomeDoUsuarioLogado;
  emaildeUsuario.innerHTML = emailDoUsuarioLogado;
};
dadosUsuario();

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

//- buscar mentores na API e exibir tabela de mentores

let mentores;
const PaginaDeMentores = async (pesquisar = null) => {
  if (pesquisar) {
    await buscarMentores(pesquisar);
    fazerTabelaMentores(mentores);
  } else {
    await buscarMentores();
    fazerTabelaMentores(mentores);
  }
};

const buscarMentores = async (param = null) => {
  let pesquisar = "";
  if (param) {
    pesquisar = `?q=${param}`;
  }
  try {
    const mentoresApi = await fetch(
      `http://localhost:3000/mentores${pesquisar}`
    );
    mentores = await mentoresApi.json();
    return mentores;
  } catch (error) {
    console.log(error);
  }
};
const fazerTabelaMentores = (mentores) => {
  let tabela = document.getElementById("tabelaMentores");
  tabela.innerHTML = "";
  mentores.forEach((element) => {
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
  await buscarMentorEditar(id);
  formDeEditarMtr(mentorEditavel);
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
let mentorEditavel;
const buscarMentorEditar = async (id) => {
  const resposta = await fetch(`http://localhost:3000/mentores/${id}`);
  mentorEditavel = await resposta.json();
  return mentorEditavel;
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
  console.log(mentorEditavel);
  document.getElementById("nome").value = mentorEditavel.nome;
  document.getElementById("email").value = mentorEditavel.email;
};

//      MENTORIAS

let mentoriasApi;

const paginaMentorias = async (pesquisar = null) => {
  if (pesquisar) {
    await buscarMentoriasApi(pesquisar);
    fazerTabelaMentorias(mentoriasApi);
  } else {
    await buscarMentoriasApi();
    fazerTabelaMentorias(mentoriasApi);
  }
};
//- busca mentorias na API

const buscarMentoriasApi = async (param = null) => {
  let pesquisar = "";
  if (param) {
    pesquisar = `?q=${param}`;
  }
  try {
    const mentoriasSTR = await fetch(
      `http://localhost:3000/mentorias${pesquisar}`
    );
    mentoriasApi = await mentoriasSTR.json();
  } catch (error) {
    console.log(error);
  }
};

//- Fazer tabela de mentorias

const fazerTabelaMentorias = (mentoriasApi) => {
  let tabelaMentorias = document.getElementById("tabelaMentorias");
  tabelaMentorias.innerHTML = "";
  mentoriasApi.forEach((element) => {
    console.log(element);
    tabelaMentorias.innerHTML =
      tabelaMentorias.innerHTML +
      `
      <tr>
      <td>${element.titulo}</td>
      <td>${element.mentor.nome}</td>
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
const construirSelectMentores = async () => {
  await buscarMentores();
  fazerSelect(mentores);
};

const selectMentores = document.getElementById("selectMentores");

const fazerSelect = async (mentores) => {
  selectMentores.innerHTML = `<option disabled selected value="null">Nenhum Mentor selecionado</option>`;
  mentores.forEach((element) => {
    selectMentores.innerHTML =
      selectMentores.innerHTML +
      `<option value="${element.id}">${element.nome}</option>`;
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
    const buscaMentor = formNovaMentoria.elements["selectMentores"].value;
    let status = formNovaMentoria.elements["switchNovaMentoria"].checked;
    const mentor = await buscarMentorEditar(buscaMentor);
    console.log(mentor);
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
let mentoriaEditavel;

const editarMentoria = (id) => {
  window.location = `editarMentoria.html?id=${id}`;
};
const PagianaEditarMentoria = async () => {
  construirSelectMentores();
  getIdUrl();
  await mentoriaEditApi(id);
  formDeEditarMtria(mentoriaEditavel);
};

const mentoriaEditApi = async (id) => {
  const resposta = await fetch(`http://localhost:3000/mentorias/${id}`);
  mentoriaEditavel = await resposta.json();
  return mentoriaEditavel;
};

//-submit do formulario de editar

const formEditarMentoria = document.getElementById("formEditarMentoria");
if (formEditarMentoria != null) {
  formEditarMentoria.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const tituloMentoria = formEditarMentoria.elements["tituloMentoria"].value;
    const buscaMentor = formEditarMentoria.elements["selectMentores"].value;
    let status = formEditarMentoria.elements["switchNovaMentoria"].checked;
    const mentor = await buscarMentorEditar(buscaMentor);
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
  console.log(mentoriaEditavel);
  document.getElementById("tituloMentoria").value = mentoriaEditavel.titulo;
  document.getElementById("selectMentores").value = mentoriaEditavel.mentor.id;
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

let turmas;
const paginaTurmas = async (pesquisar = null) => {
  if (pesquisar) {
    await buscarTurmas(pesquisar);
    fazerTabelaTurmas(turmas);
  } else {
    await buscarTurmas();
    fazerTabelaTurmas(turmas);
  }
};

const fazerTabelaTurmas = (turmas) => {
  const tabelaTurmas = document.getElementById("tabelaTurmas");
  tabelaTurmas.innerHTML = "";
  turmas.forEach((element) => {
    let dataFormatada = formatarDataParaBrasileiro(element.dataDeInicio);
    tabelaTurmas.innerHTML =
      tabelaTurmas.innerHTML +
      ` 
    <tr>
    <td>${element.turma}</td>
    <td >${element.mentor.nome}</td>
    <td >${element.mentoria.titulo}</td>
    <td >${dataFormatada}</td>
    <td >${element.diaDaSemana}</td>
    <td >${element.horaDoInicio}</td>
    <td class="encontros">${element.encontros}</td>
    <td>
      <button onclick="editarTurma(${element.id})" class="material-icons iconsCaneta"> create </button>
      <button class="material-icons iconsLixeira" onclick="deletarTurma(${element.id})"> delete </button>
    </td>
  </tr>    
    `;
  });
};
const buscarTurmas = async (param = null) => {
  let pesquisar = "";
  if (param) {
    pesquisar = `?q=${param}`;
  }
  try {
    const turmasApi = await fetch(`http://localhost:3000/turmas${pesquisar}`);
    turmas = await turmasApi.json();
  } catch (error) {
    window.alert("Não Foi possivel carregar as Turmas");
    console.log(error);
  }
};

//pagina de nova turma
//-select de mentorias
const construirSelectMentorias = async () => {
  await buscarMentoriasApi();
  fazerSelectMentorias(mentoriasApi);
};

const fazerSelectMentorias = (mentoriasApi) => {
  const selectMentorias = document.getElementById("selectMentorias");
  selectMentorias.innerHTML = `<option value="" selected disabled>Selecione a Mentoria</option>`;
  mentoriasApi.forEach((element) => {
    selectMentorias.innerHTML =
      selectMentorias.innerHTML +
      `<option value="${element.id}">${element.titulo}</option>`;
  });
};
//- Nova turma, formulario  e mandar pra API

const formNovaTurma = document.getElementById("formNovaTurma");

if (formNovaTurma != null) {
  formNovaTurma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const buscaMentoria = formNovaTurma.elements["selectMentorias"].value;
    const buscaMentor = formNovaTurma.elements["selectMentores"].value;
    const dataDeInicio = formNovaTurma.elements["dataInicio"].value;
    const diaDaSemana = formNovaTurma.elements["diasDaSemana"].value;
    const horaDoInicio = formNovaTurma.elements["horaDeInicio"].value;
    const horaDoFim = formNovaTurma.elements["horaDeFim"].value;
    const turma = formNovaTurma.elements["turma"].value;
    const link = formNovaTurma.elements["linkDaAula"].value;
    const qtEncontros = formNovaTurma.elements["qtEncontros"].value;
    console.log(buscaMentor);
    console.log(buscaMentoria);
    const mentor = await buscarMentorEditar(buscaMentor);
    const mentoria = await mentoriaEditApi(buscaMentoria);
    console.log(mentor);
    console.log(mentoria);
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
    };
    salvarTurma(novaTurma);
  });
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
};
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
};

//- Editar Turma

//- carregar pagina e formulario de editar
const editarTurma = (id) => {
  window.location = `editarTurma.html?id=${id}`;
};
const carregarEditarTurma = () => {
  construirSelectMentores();
  construirSelectMentorias();
  getIdUrl();
  BuscaTurmaEditavel(id);
};

const BuscaTurmaEditavel = async (id) => {
  const resposta = await fetch(`http://localhost:3000/turmas/${id}`);
  const turmaEditavel = await resposta.json();

  formDeEditarTurma(turmaEditavel);
  console.log(turmaEditavel);
};

const formDeEditarTurma = async (turmaEditavel) => {
  console.log(turmaEditavel.dataDeInicio);

  document.getElementById("selectMentorias").value = turmaEditavel.mentoria.id;
  document.getElementById("selectMentores").value = turmaEditavel.mentor.id;
  document.getElementById("dataInicio").value = turmaEditavel.dataDeInicio;
  document.getElementById("diasDaSemana").value = turmaEditavel.diaDaSemana;
  document.getElementById("horaDeInicio").value = turmaEditavel.horaDoInicio;
  document.getElementById("horaDeFim").value = turmaEditavel.horaDoFim;
  document.getElementById("turma").value = turmaEditavel.turma;
  document.getElementById("linkDaAula").value = turmaEditavel.link;
  document.getElementById("qtEncontros").value = turmaEditavel.encontros;
};
//- submit do formulario de editar

const formEditarTurma = document.getElementById("formEditarTurma");

if (formEditarTurma != null) {
  formEditarTurma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const buscaMentoria = formEditarTurma.elements["selectMentorias"].value;
    const buscaMentor = formEditarTurma.elements["selectMentores"].value;
    const dataDeInicio = formEditarTurma.elements["dataInicio"].value;
    const diaDaSemana = formEditarTurma.elements["diasDaSemana"].value;
    const horaDoInicio = formEditarTurma.elements["horaDeInicio"].value;
    const horaDoFim = formEditarTurma.elements["horaDeFim"].value;
    const turma = formEditarTurma.elements["turma"].value;
    const link = formEditarTurma.elements["linkDaAula"].value;
    const qtEncontros = formEditarTurma.elements["qtEncontros"].value;
    const mentor = await buscarMentorEditar(buscaMentor);
    const mentoria = await mentoriaEditApi(buscaMentoria);

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
    };
    console.log(id);
    salvarTurmaEditada(TurmaEditada);
  });
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

//- alunos

//- novo aluno

//- fazer select
const construirSelectTurmas = async () => {
  await buscarTurmas();
  fazerSelectTurmas(turmas);
};
const fazerSelectTurmas = (turmas) => {
  const selectTurmas = document.getElementById("selectTurmas");
  selectTurmas.innerHTML = `<option value="" selected disabled>Selecione a Turma</option>`;
  turmas.forEach((element) => {
    selectTurmas.innerHTML =
      selectTurmas.innerHTML +
      `<option value="${element.id}">${element.turma}</option>`;
  });
};
//- submit formulario novo aluno e mandar pra API

const mandarAlunoApi = async (aluno) => {
  try {
    await fetch("http://localhost:3000/alunos", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aluno),
    });
    window.alert("Aluno salvo");
  } catch (error) {
    window.alert("Erro ao cadastra o ALUNO");
  }
};

const formNovoAluno = document.getElementById("formNovoAluno");

if (formNovoAluno != null) {
  formNovoAluno.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = formNovoAluno.elements["nomeDoAluno"].value;
    const email = formNovoAluno.elements["emailDoAluno"].value;
    const turma = formNovoAluno.elements["selectTurmas"].value;

    const aluno = {
      nome: nome,
      email: email,
      turma: turma,
    };
    mandarAlunoApi(aluno);
  });
}
//- pagina de alunos
let alunosApi;

const paginaAlunos = async (pesquisar = null) => {
  if (pesquisar) {
    await buscarAlunosApi(pesquisar);
    fazerTabelaAlunos(alunosApi);
  } else {
    await buscarAlunosApi();
    fazerTabelaAlunos(alunosApi);
  }
};

const buscarAlunosApi = async (param = null) => {
  let pesquisar = "";
  if (param) {
    pesquisar = `?q=${param}`;
  }
  try {
    const alunos = await fetch(`http://localhost:3000/alunos${pesquisar}`);
    alunosApi = await alunos.json();
    return alunosApi;
  } catch (error) {
    console.log(error);
  }
};

const fazerTabelaAlunos = (alunosApi) => {
  const tabelaAlunos = document.getElementById("tabelaAlunos");
  tabelaAlunos.innerHTML = "";
  alunosApi.forEach((element) => {
    tabelaAlunos.innerHTML =
      tabelaAlunos.innerHTML +
      `
    <tr>
                        <td>${element.nome}</td>
                        <td>${element.email}</td>
                        <td>
                          <button onclick="editarAluno(${element.id})" class="material-icons iconsCaneta"> create </button>
                          <button class="material-icons iconsLixeira" onclick="deletarAluno(${element.id})"> delete </button>
                        </td>
                      </tr>
    `;
  });
};
//-deletar alunos

const deletarAluno = async (id) => {
  try {
    await fetch(`http://localhost:3000/alunos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    paginaAlunos();
  } catch (error) {
    window.alert("FALHA AO DELETAR");
  }
};

//- Editar alunos
const editarAluno = (id) => {
  window.location = `editarAluno.html?id=${id}`;
};
const paginaEditarAluno = () => {
  construirSelectTurmas();
  getIdUrl();
  alunoEditApi(id);
};

const alunoEditApi = async (id) => {
  const resposta = await fetch(`http://localhost:3000/alunos/${id}`);
  const alunoEditavel = await resposta.json();

  carregarFormEdtAluno(alunoEditavel);
};

const carregarFormEdtAluno = async (alunoEditavel) => {
  document.getElementById("nome").value = alunoEditavel.nome;
  document.getElementById("email").value = alunoEditavel.email;
  document.getElementById("selectTurmas").value = alunoEditavel.turma;
};

const formEditarAluno = document.getElementById("formEditarAluno");

if (formEditarAluno != null) {
  formEditarAluno.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = formEditarAluno.elements["nome"].value;
    const email = formEditarAluno.elements["email"].value;
    const buscaturma = formEditarAluno.elements["selectTurmas"].value;
    const turma = await BuscaTurmaEditavel(buscaturma);
    console.log("atumar");
    console.log(turma);
    const aluno = {
      nome: nome,
      email: email,
      turma: turma,
    };
    salvarAlunoEditado(aluno);
  });
}
const salvarAlunoEditado = async (aluno) => {
  await fetch(`http://localhost:3000/alunos/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aluno),
  });
  window.location = "alunos.html";
};

//- Barras de pesquisar
//-Mentores
const pesquisarMentores = document.getElementById("pesquisarMentores");
if (pesquisarMentores != null) {
  pesquisarMentores.addEventListener("keyup", (e) => {
    const text = pesquisarMentores.value;
    if (text === "") {
      PaginaDeMentores();
    } else if (e.key === "Enter") {
      PaginaDeMentores(text);
    }
  });
}

//-Mentorias
const pesquisarMentoria = document.getElementById("pesquisarMentoria");
if (pesquisarMentoria != null) {
  pesquisarMentoria.addEventListener("keyup", (e) => {
    const text = pesquisarMentoria.value;
    if (text === "") {
      paginaMentorias();
    } else if (e.key === "Enter") {
      paginaMentorias(text);
    }
  });
}

//- Turmas
const pesquisarTurmas = document.getElementById("pesquisarTurmas");
if (pesquisarTurmas != null) {
  pesquisarTurmas.addEventListener("keyup", (e) => {
    const text = pesquisarTurmas.value;
    if (text === "") {
      paginaTurmas();
    } else if (e.key === "Enter") {
      paginaTurmas(text);
    }
  });
}

//- Alunos
const pesquisarAlunos = document.getElementById("pesquisarAlunos");
if (pesquisarAlunos != null) {
  pesquisarAlunos.addEventListener("keyup", (e) => {
    const text = pesquisarAlunos.value;
    if (text === "") {
      paginaAlunos();
    } else if (e.key === "Enter") {
      paginaAlunos(text);
    }
  });
}
