import { Retirada } from "../classes/retirada.js";
import { retiradas, salvarRetiradas } from "../dados/retiradas.js";
import { funcionarios } from "../dados/funcionarios.js";
import { materiais, salvarMateriais } from "../dados/materiais.js";

const corpoTabela = document.querySelector("#tabela-retiradas tbody");
const contadorTexto = document.querySelector("#contador-retiradas");
const formulario = document.querySelector("#form-retirada");
const campoFuncionario = document.querySelector("#retirada-funcionario");
const campoMaterial = document.querySelector("#retirada-material");
const campoQuantidade = document.querySelector("#retirada-quantidade");
const botaoLimpar = document.querySelector("#botao-limpar-retirada");

function preencherSelect(select, itens, rotuloInicial, rotulo) {
    select.innerHTML = "";
    const inicial = new Option(rotuloInicial, "", true, true);
    inicial.disabled = true;
    select.append(inicial);

    for (const item of itens) {
        select.append(new Option(rotulo(item), item.id));
    }
}

function carregarSelects() {
    // só aparecem funcionários e materiais liberados
    preencherSelect(
        campoFuncionario,
        funcionarios.filter(f => !f.bloqueado),
        "Selecione um funcionário",
        f => `${f.matricula} - ${f.nome}`
    );
    preencherSelect(
        campoMaterial,
        materiais.filter(m => !m.bloqueado && m.quantidade > 0),
        "Selecione um material",
        m => `${m.codigo} - ${m.nome} (disp.: ${m.quantidade})`
    );
}

function renderizarLista() {
    corpoTabela.innerHTML = "";

    if (retiradas.length === 0) {
        corpoTabela.innerHTML =
            `<tr class="empty-row"><td colspan="5">Nenhuma retirada registrada.</td></tr>`;
    } else {
        for (const r of [...retiradas].reverse()) {
            corpoTabela.append(r.render());
        }
    }

    contadorTexto.textContent = `${retiradas.length} retiradas registradas`;
}

function atualizarTela() {
    carregarSelects();
    renderizarLista();
}

function criarRetirada(funcionario, material, quantidade) {
    const retirada = new Retirada(funcionario, material, quantidade);

    material.quantidade = material.quantidade - quantidade; // baixa no estoque
    retiradas.push(retirada);

    salvarMateriais();
    salvarRetiradas();
}

function excluirRetirada(id) {
    const indice = retiradas.findIndex(r => r.id == id);
    if (indice === -1) return;

    const retirada = retiradas[indice];
    if (!confirm("Excluir esta retirada? A quantidade voltará ao estoque.")) return;

    retirada.material.quantidade += retirada.quantidade; // devolve ao estoque
    retiradas.splice(indice, 1);

    salvarMateriais();
    salvarRetiradas();
    atualizarTela();
}

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const funcionario = funcionarios.find(f => f.id == campoFuncionario.value);
    const material = materiais.find(m => m.id == campoMaterial.value);
    const quantidade = Number(campoQuantidade.value);

    if (!funcionario || !material) {
        alert("Selecione um funcionário e um material.");
        return;
    }
    if (funcionario.bloqueado || material.bloqueado) {
        alert("Funcionário ou material bloqueado.");
        return;
    }
    if (quantidade < 1 || quantidade > material.quantidade) {
        alert(`Quantidade inválida. Disponível: ${material.quantidade}.`);
        return;
    }

    criarRetirada(funcionario, material, quantidade);
    formulario.reset();
    atualizarTela();
});

corpoTabela.addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao='excluir']");
    if (!botao) return;
    excluirRetirada(botao.closest("tr").dataset.id);
});

botaoLimpar?.addEventListener("click", () => formulario.reset());

export function iniciarRetiradas() {
    atualizarTela();
}