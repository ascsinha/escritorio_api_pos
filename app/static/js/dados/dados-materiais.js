import { Material } from "../material.js";

const chave = "materiais";

const iniciais = [
    ["ESC-001", "Papel Sulfite A4", 85, false],
    ["ESC-002", "Caneta Esferográfica", 38, false],
    ["ESC-003", "Lápis Preto nº 2", 0, true],
    ["ESC-004", "Borracha Branca", 64, false],
    ["ESC-005", "Grampeador", 12, false],
    ["ESC-006", "Grampo 26/6", 7, false],
    ["ESC-007", "Pasta Suspensa", 34, true],
    ["ESC-008", "Fita Adesiva", 29, false],
    ["ESC-009", "Post-it 76x76mm", 11, false],
    ["ESC-010", "Marcador de Texto", 42, false],
    ["ESC-011", "Clips 4/0 Galvanizado", 23, false],
    ["ESC-012", "Envelope A4 Branco", 0, true]
].map(([codigo, nome, quantidade, bloqueado], i) =>
    ({ id: i + 1, codigo, nome, quantidade, bloqueado }));

function carregarMateriais() {
    const texto = localStorage.getItem(chave);
    const dados = texto ? JSON.parse(texto) : iniciais;

    return dados.map(d =>
        new Material(d.codigo, d.nome, d.quantidade, d.bloqueado, d.id));
}

export const materiais = carregarMateriais();

export function salvarMateriais() {
    const dados = materiais.map(m => ({
        id: m.id,
        codigo: m.codigo,
        nome: m.nome,
        quantidade: m.quantidade,
        bloqueado: m.bloqueado
    }));
    localStorage.setItem(chave, JSON.stringify(dados));
}

// primeira execução: grava os dados iniciais
if (!localStorage.getItem(chave)) salvarMateriais();