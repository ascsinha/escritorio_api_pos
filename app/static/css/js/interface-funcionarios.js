import { Funcionario } from "./funcionarios.js";
import { funcionarios } from "./dados-funcionarios.js";

const corpoTabela = document.querySelector("#tabela-funcionarios tbody");
const contadorTexto = document.querySelector("#contador-funcionarios");

const formulario = document.querySelector("#form-funcionario");
const tituloFormulario = document.querySelector("#titulo-formulario-funcionario");
const campoId = document.querySelector("#funcionario-id");
const campoMatricula = document.querySelector("#matricula");
const campoNome = document.querySelector("#nome");
const campoBloqueado = document.querySelector("#funcionario-bloqueado");
const botaoSalvar = document.querySelector("#botao-salvar-funcionario");
const botaoLimpar = document.querySelector("#botao-limpar-funcionario");

const modalVisualizar = document.querySelector("#modal-visualizar-funcionario");
const detalheConteudo = document.querySelector("#detalhe-funcionario-conteudo");
const botaoFecharDetalhe = document.querySelector("#fechar-detalhe-funcionario");

const campoBusca = document.querySelector("#busca-funcionario");
const botoesFiltro = document.querySelectorAll("#filtros-funcionario .filter-btn");

let filtroAtual = "todos";
let buscaAtual = "";
let idEmEdicao = null;

function funcionariosFiltrados() {
    return funcionarios.filter(funcionario => {
        const combinaBusca =
            funcionario.nome.toLowerCase().includes(buscaAtual) ||
            funcionario.matricula.toLowerCase().includes(buscaAtual);

        const combinaFiltro =
            filtroAtual === "todos" ||
            (filtroAtual === "ativos" && !funcionario.bloqueado) ||
            (filtroAtual === "bloqueados" && funcionario.bloqueado);

        return combinaBusca && combinaFiltro;
    });
}

function renderizarLista() {
    corpoTabela.innerHTML = "";

    const lista = funcionariosFiltrados();

    if (lista.length === 0) {
        const linhaVazia = document.createElement("tr");
        linhaVazia.innerHTML =
            `<td colspan="4" style="text-align:center; color:#94a3b8; padding:24px;">Nenhum funcionário encontrado.</td>`;
        corpoTabela.append(linhaVazia);
    } else {
        for (const funcionario of lista) {
            corpoTabela.append(funcionario.render());
        }
    }

    if (contadorTexto) {
        contadorTexto.textContent = `${funcionarios.length} funcionários cadastrados`;
    }
}

function limparFormulario() {
    idEmEdicao = null;
    formulario.reset();
    campoId.value = "";

    if (tituloFormulario) tituloFormulario.textContent = "Cadastrar Funcionário";
    if (botaoSalvar) botaoSalvar.textContent = "Cadastrar";
}

function preencherFormularioParaEdicao(funcionario) {
    idEmEdicao = funcionario.id;
    campoId.value = funcionario.id;
    campoMatricula.value = funcionario.matricula;
    campoNome.value = funcionario.nome;

    if (campoBloqueado) campoBloqueado.checked = funcionario.bloqueado;
    if (tituloFormulario) tituloFormulario.textContent = "Editar Funcionário";
    if (botaoSalvar) botaoSalvar.textContent = "Salvar alterações";

    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function criarFuncionario(dados) {
    const funcionario = new Funcionario(
        dados.matricula,
        dados.nome,
        dados.bloqueado
    );

    funcionarios.push(funcionario);
}

function alterarFuncionario(id, dados) {
    const funcionario = funcionarios.find(f => f.id == id);
    if (!funcionario) return;

    funcionario.matricula = dados.matricula;
    funcionario.nome = dados.nome;
    funcionario.bloqueado = dados.bloqueado;
}

function excluirFuncionario(id) {
    const indice = funcionarios.findIndex(f => f.id == id);
    if (indice === -1) return;

    const funcionario = funcionarios[indice];
    const confirmar = confirm(`Deseja realmente excluir o funcionário "${funcionario.nome}"?`);
    if (!confirmar) return;

    funcionarios.splice(indice, 1);

    if (idEmEdicao == id) limparFormulario();

    renderizarLista();
}

function visualizarFuncionario(id) {
    const funcionario = funcionarios.find(f => f.id == id);
    if (!funcionario || !modalVisualizar) return;

    detalheConteudo.innerHTML = `
        <dl class="detalhe-lista">
            <dt>Matrícula</dt><dd>${funcionario.matricula}</dd>
            <dt>Nome</dt><dd>${funcionario.nome}</dd>
            <dt>Status</dt><dd>${funcionario.statusTexto}</dd>
        </dl>
    `;

    if (typeof modalVisualizar.showModal === "function") {
        modalVisualizar.showModal();
    } else {
        modalVisualizar.setAttribute("open", "");
    }
}

corpoTabela.addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const linha = botao.closest("tr");
    const id = linha?.dataset.id;
    if (!id) return;

    const acao = botao.dataset.acao;

    if (acao === "editar") {
        const funcionario = funcionarios.find(f => f.id == id);
        if (funcionario) preencherFormularioParaEdicao(funcionario);
    }

    if (acao === "excluir") {
        excluirFuncionario(id);
    }

    if (acao === "visualizar") {
        visualizarFuncionario(id);
    }
});

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const dados = {
        matricula: campoMatricula.value.trim(),
        nome: campoNome.value.trim(),
        bloqueado: campoBloqueado ? campoBloqueado.checked : false
    };

    if (!dados.matricula || !dados.nome) return;

    if (idEmEdicao) {
        alterarFuncionario(idEmEdicao, dados);
    } else {
        criarFuncionario(dados);
    }

    limparFormulario();
    renderizarLista();
});

botaoLimpar?.addEventListener("click", () => {
    limparFormulario();
});

campoBusca?.addEventListener("input", evento => {
    buscaAtual = evento.target.value.trim().toLowerCase();
    renderizarLista();
});

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesFiltro.forEach(b => b.classList.remove("active"));
        botao.classList.add("active");
        filtroAtual = botao.dataset.filtro;
        renderizarLista();
    });
});

botaoFecharDetalhe?.addEventListener("click", () => {
    modalVisualizar.close();
});

export function iniciarFuncionarios() {
    renderizarLista();
}