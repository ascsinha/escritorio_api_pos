import { escapeHtml } from "../utils.js";

export class Retirada {
    static proximoId = 1;

    #id;
    #funcionario; // instância de Funcionario
    #material;    // instância de Material
    #quantidade;
    #data;

    constructor(funcionario, material, quantidade, data = new Date().toISOString(), id = null) {
        if (id === null) {
            this.#id = Retirada.proximoId++;
        } else {
            this.#id = id;
            Retirada.proximoId = Math.max(Retirada.proximoId, id + 1);
        }
        this.#funcionario = funcionario;
        this.#material = material;
        this.#quantidade = Number(quantidade);
        this.#data = data;
    }

    get id() { return this.#id; }
    get funcionario() { return this.#funcionario; }
    get material() { return this.#material; }
    get quantidade() { return this.#quantidade; }
    get data() { return this.#data; }
    get dataFormatada() { return new Date(this.#data).toLocaleString("pt-BR"); }

    render() {
        const linha = document.createElement("tr");
        linha.dataset.id = this.id;
        linha.innerHTML = `
            <td>${escapeHtml(this.dataFormatada)}</td>
            <td><span class="func-nome">${escapeHtml(this.funcionario.nome)}</span></td>
            <td><span class="mat-nome">${escapeHtml(this.material.nome)}</span></td>
            <td><span class="qtd-cell">${this.quantidade}</span></td>
            <td>
                <div class="actions">
                    <button class="action-btn delete" data-acao="excluir" title="Excluir (devolve ao estoque)" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>`;
        return linha;
    }
}