from flask import Blueprint, jsonify, request
from app.controllers.material_controller import (
    criar_material,
    listar_materiais,
    recuperar_material,
    atualizar_material,
    deletar_material,
    consultar_estoque,
    registrar_entrada
)

material_bp = Blueprint("material", __name__)


@material_bp.route("/", methods=["POST"])
def post_material():
    data = request.get_json()
    response, status = criar_material(data)
    return jsonify(response), status


@material_bp.route("/", methods=["GET"])
def get_materiais():
    response, status = listar_materiais()
    return jsonify(response), status


@material_bp.route("/<int:id_material>", methods=["GET"])
def get_material(id_material):
    response, status = recuperar_material(id_material)
    return jsonify(response), status


@material_bp.route("/<int:id_material>", methods=["PATCH"])
def patch_material(id_material):
    data = request.get_json()
    response, status = atualizar_material(id_material, data)
    return jsonify(response), status


@material_bp.route("/<int:id_material>", methods=["DELETE"])
def delete_material(id_material):
    response, status = deletar_material(id_material)
    return jsonify(response), status


@material_bp.route("/<int:id_material>/estoque", methods=["GET"])
def get_estoque(id_material):
    response, status = consultar_estoque(id_material)
    return jsonify(response), status


@material_bp.route("/<int:id_material>/entrada", methods=["POST"])
def post_entrada_material(id_material):
    data = request.get_json()
    response, status = registrar_entrada(id_material, data)
    return jsonify(response), status