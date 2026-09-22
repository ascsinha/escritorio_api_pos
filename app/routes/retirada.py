from flask import Blueprint, jsonify, request
from app.controllers.retirada_controller import (
    registrar_saida,
    listar_movimentacoes,
    recuperar_retirada,
    gerar_relatorio
)

retirada_bp = Blueprint("retirada", __name__)


@retirada_bp.route("/", methods=["POST"])
def post_retirada():
    data = request.get_json()
    response, status = registrar_saida(data)
    return jsonify(response), status


@retirada_bp.route("/", methods=["GET"])
def get_movimentacoes():
    data_inicio = request.args.get("data_inicio")
    data_fim = request.args.get("data_fim")
    response, status = listar_movimentacoes(data_inicio, data_fim)
    return jsonify(response), status


@retirada_bp.route("/<int:id_retirada>", methods=["GET"])
def get_retirada(id_retirada):
    response, status = recuperar_retirada(id_retirada)
    return jsonify(response), status


@retirada_bp.route("/relatorio", methods=["GET"])
def get_relatorio():
    data_inicio = request.args.get("data_inicio")
    data_fim = request.args.get("data_fim")
    response, status = gerar_relatorio(data_inicio, data_fim)
    return jsonify(response), status