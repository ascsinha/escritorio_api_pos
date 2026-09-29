import { Retirada } from "../classes/retirada.js";
import { funcionarios } from "./funcionarios.js";
import { materiais } from "./materiais.js";

const chave = "retiradas";

function carregarRetiradas() {
    const texto = localStorage.getItem(chave);
    if (!texto) return [];

    return JSON.parse(texto)
        .map(d => {
            const funcionario = funcionarios.find(f => f.id == d.funcionarioId);
            const material = materiais.find(m => m.id == d.materialId);
            if (!funcionario || !material) return null;

            return new Retirada(funcionario, material, d.quantidade, d.data, d.id);
        })
        .filter(r => r !== null);
}

export const retiradas = carregarRetiradas();

export function salvarRetiradas() {
    const dados = retiradas.map(r => ({
        id: r.id,
        funcionarioId: r.funcionario.id,
        materialId: r.material.id,
        quantidade: r.quantidade,
        data: r.data
    }));
    localStorage.setItem(chave, JSON.stringify(dados));
}