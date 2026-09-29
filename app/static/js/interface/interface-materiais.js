import { escapeHtml } from "../utils.js";
import { Material } from "../material.js";
import { materiais, salvarMateriais } from "../dados/materiais.js";
import { retiradas } from "../dados/retiradas.js";

const corpoTabela = document.querySelector("#tabela-materiais tbody");
const contadorTexto = document.querySelector("#contador-materiais");

const formulario = document.querySelector("#form-material");
const tituloFormulario = document.querySelector("#titulo-formulario-material");
const campoId = document.querySelector("#material-id");
const campoCodigo = document.querySelector("#codigo");
const campoNome = document.querySelector("#nome");
const campoQuantidade = document.querySelector("#quantidade");
const campoBloqueado = document.querySelector("#material-bloqueado");
const botaoSalvar = document.querySelector("#botao-salvar-material");
const botaoLimpar = document.querySelector("#botao-limpar-material");

const modalVisualizar = document.querySelector("#modal-visualizar-material");
const detalheConteudo = document.querySelector("#detalhe-material-conteudo");
const botaoFecharDetalhe = document.querySelector("#fechar-detalhe-material");

const campoBusca = document.querySelector("#busca-material");
const botoesFiltro = document.querySelectorAll("#filtros-material .filter-btn");

let filtroAtual = "todos";
let buscaAtual = "";
let idEmEdicao = null;

function materiaisFiltrados() {
    return materiais.filter(material => {
        const combinaBusca =
            material.nome.toLowerCase().includes(buscaAtual) ||
            material.codigo.toLowerCase().includes(buscaAtual);

        const combinaFiltro =
            filtroAtual === "todos" ||
            (filtroAtual === "liberados" && !material.bloqueado) ||
            (filtroAtual === "bloqueados" && material.bloqueado);

        return combinaBusca && combinaFiltro;
    });
}

function renderizarLista() {
    corpoTabela.innerHTML = "";

    const lista = materiaisFiltrados();

    if (lista.length === 0) {
        const linhaVazia = document.createElement("tr");
        linhaVazia.innerHTML =
            `<td colspan="5" style="text-align:center; color:#94a3b8; padding:24px;">Nenhum material encontrado.</td>`;
        corpoTabela.append(linhaVazia);
    } else {
        for (const material of lista) {
            corpoTabela.append(material.render());
        }
    }

    if (contadorTexto) {
        contadorTexto.textContent = `${materiais.length} materiais cadastrados`;
    }
}

function limparFormulario() {
    idEmEdicao = null;
    formulario.reset();
    campoId.value = "";

    if (tituloFormulario) tituloFormulario.textContent = "Cadastrar Material";
    if (botaoSalvar) botaoSalvar.textContent = "Cadastrar";
}

function preencherFormularioParaEdicao(material) {
    idEmEdicao = material.id;
    campoId.value = material.id;
    campoCodigo.value = material.codigo;
    campoNome.value = material.nome;
    campoQuantidade.value = material.quantidade;

    if (campoBloqueado) campoBloqueado.checked = material.bloqueado;
    if (tituloFormulario) tituloFormulario.textContent = "Editar Material";
    if (botaoSalvar) botaoSalvar.textContent = "Salvar alterações";

    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function criarMaterial(dados) {
    const material = new Material(
        dados.codigo,
        dados.nome,
        dados.quantidade,
        dados.bloqueado
    );

    materiais.push(material);
    salvarMateriais();
}

function alterarMaterial(id, dados) {
    const material = materiais.find(m => m.id == id);
    if (!material) return;

    material.codigo = dados.codigo;
    material.nome = dados.nome;
    material.quantidade = dados.quantidade;
    material.bloqueado = dados.bloqueado;
    salvarMateriais();
}

function excluirMaterial(id) {
    const indice = materiais.findIndex(m => m.id == id);
    if (indice === -1) return;

    // regra de integridade: não excluir se houver retiradas associadas
    const emUso = retiradas.some(r => r.material.id == id);
    if (emUso) {
        alert("Não é possível excluir este material: existem retiradas associadas.");
        return;
    }

    const material = materiais[indice];
    const confirmar = confirm(`Deseja realmente excluir o material "${material.nome}"?`);
    if (!confirmar) return;

    materiais.splice(indice, 1);
    salvarMateriais();

    if (idEmEdicao == id) limparFormulario();

    renderizarLista();
}

function visualizarMaterial(id) {
    const material = materiais.find(m => m.id == id);
    if (!material || !modalVisualizar) return;

    detalheConteudo.innerHTML = `
        <dl class="detalhe-lista">
            <dt>Código</dt><dd>${escapeHtml(material.codigo)}</dd>
            <dt>Nome</dt><dd>${escapeHtml(material.nome)}</dd>
            <dt>Quantidade disponível</dt><dd>${escapeHtml(material.quantidade)}</dd>
            <dt>Status</dt><dd>${escapeHtml(material.statusTexto)}</dd>
        </dl>
    `;

    if (typeof modalVisualizar.showModal === "function") {
        modalVisualizar.showModal();
    } else {
        modalVisualizar.setAttribute("open", "");
    }
}

corpoTabela.addEventListener("click", evento => {
    const badge = evento.target.closest(".status-badge");
    if (badge) {
        const idBadge = badge.closest("tr")?.dataset.id;
        const item = materiais.find(x => x.id == idBadge);
        if (item) {
            item.bloqueado = !item.bloqueado;
            salvarMateriais();
            if (idEmEdicao == idBadge && campoBloqueado) campoBloqueado.checked = item.bloqueado;
            renderizarLista();
        }
        return;
    }

    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const linha = botao.closest("tr");
    const id = linha?.dataset.id;
    if (!id) return;

    const acao = botao.dataset.acao;

    if (acao === "editar") {
        const material = materiais.find(m => m.id == id);
        if (material) preencherFormularioParaEdicao(material);
    }

    if (acao === "excluir") {
        excluirMaterial(id);
    }

    if (acao === "visualizar") {
        visualizarMaterial(id);
    }
});

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const dados = {
        codigo: campoCodigo.value.trim(),
        nome: campoNome.value.trim(),
        quantidade: campoQuantidade.value,
        bloqueado: campoBloqueado ? campoBloqueado.checked : false
    };

    if (!dados.codigo || !dados.nome) return;

    const duplicado = materiais.some(
        x => x.codigo.toLowerCase() === dados.codigo.toLowerCase() && x.id != idEmEdicao
    );
    if (duplicado) {
        alert("Já existe um registro com esse código.");
        return;
    }

    if (idEmEdicao) {
        alterarMaterial(idEmEdicao, dados);
    } else {
        criarMaterial(dados);
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

export function iniciarMateriais() {
    renderizarLista();
}