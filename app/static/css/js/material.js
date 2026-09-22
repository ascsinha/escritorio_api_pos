export class Material {
    static proximoId = 1;

    #id;
    #codigo;
    #nome;
    #quantidade;
    #bloqueado;

    constructor(codigo, nome, quantidade = 0, bloqueado = false) {
        this.#id = Material.proximoId++;
        this.#codigo = codigo;
        this.#nome = nome;
        this.#quantidade = Number(quantidade);
        this.#bloqueado = Boolean(bloqueado);
    }

    get id() {
        return this.#id;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(valor) {
        this.#codigo = valor;
    }

    get nome() {
        return this.#nome;
    }

    set nome(valor) {
        this.#nome = valor;
    }

    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(valor) {
        this.#quantidade = Number(valor);
    }

    get bloqueado() {
        return this.#bloqueado;
    }

    set bloqueado(valor) {
        this.#bloqueado = Boolean(valor);
    }

    get statusTexto() {
        return this.#bloqueado ? "Bloqueado" : "Não bloqueado";
    }

    get statusClasse() {
        return this.#bloqueado ? "status-bloqueado" : "status-liberado";
    }

    get quantidadeClasse() {
        if (this.#quantidade === 0) return "qtd-zero";
        if (this.#quantidade <= 10) return "qtd-baixa";
        if (this.#quantidade <= 40) return "qtd-media";
        return "qtd-alta";
    }

    render() {
        const linha = document.createElement("tr");
        linha.dataset.id = this.id;

        linha.innerHTML = `
            <td><span class="codigo-cell">${this.codigo}</span></td>
            <td><span class="mat-nome">${this.nome}</span></td>
            <td><span class="qtd-cell ${this.quantidadeClasse}">${this.quantidade}</span></td>
            <td>
                <button class="status-badge ${this.statusClasse}" type="button">
                    <span class="status-dot"></span>${this.statusTexto}
                </button>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view" data-acao="visualizar" title="Visualizar" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <button class="action-btn edit" data-acao="editar" title="Editar" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="action-btn delete" data-acao="excluir" title="Excluir" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        `;

        return linha;
    }
}