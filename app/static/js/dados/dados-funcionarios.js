import { Funcionario } from "../classes/funcionarios.js";

const chave = "funcionarios";

const iniciais = [
    ["FUNC-001", "Ana Silva", false],
    ["FUNC-002", "Carlos Mendes", false],
    ["FUNC-003", "Pedro Costa", true],
    ["FUNC-004", "Mariana Oliveira", false],
    ["FUNC-005", "João Santos", true],
    ["FUNC-006", "Beatriz Almeida", false],
    ["FUNC-007", "Rafael Lima", false],
    ["FUNC-008", "Fernanda Souza", false]
].map(([matricula, nome, bloqueado], i) =>
    ({ id: i + 1, matricula, nome, bloqueado }));

function carregarFuncionarios() {
    const texto = localStorage.getItem(chave);
    const dados = texto ? JSON.parse(texto) : iniciais;

    return dados.map(d =>
        new Funcionario(d.matricula, d.nome, d.bloqueado, d.id));
}

export const funcionarios = carregarFuncionarios();

export function salvarFuncionarios() {
    const dados = funcionarios.map(f => ({
        id: f.id,
        matricula: f.matricula,
        nome: f.nome,
        bloqueado: f.bloqueado
    }));
    localStorage.setItem(chave, JSON.stringify(dados));
}

if (!localStorage.getItem(chave)) salvarFuncionarios();