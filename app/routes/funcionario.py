from flask import Blueprint, jsonify, request
from app.controllers.funcionario_controller import (
    criar_funcionario,
    listar_funcionarios,
    recuperar_funcionario,
    atualizar_funcionario,
    deletar_funcionario
)

funcionario_bp = Blueprint("funcionario", __name__)


@funcionario_bp.route("/", methods=["POST"])
def post_funcionario():
    data = request.get_json()
    response, status = criar_funcionario(data)
    return jsonify(response), status


@funcionario_bp.route("/", methods=["GET"])
def get_funcionarios():
    response, status = listar_funcionarios()
    return jsonify(response), status


@funcionario_bp.route("/<int:id_funcionario>", methods=["GET"])
def get_funcionario(id_funcionario):
    response, status = recuperar_funcionario(id_funcionario)
    return jsonify(response), status


@funcionario_bp.route("/<int:id_funcionario>", methods=["PATCH"])
def patch_funcionario(id_funcionario):
    data = request.get_json()
    response, status = atualizar_funcionario(id_funcionario, data)
    return jsonify(response), status


@funcionario_bp.route("/<int:id_funcionario>", methods=["DELETE"])
def delete_funcionario(id_funcionario):
    response, status = deletar_funcionario(id_funcionario)
    return jsonify(response), status