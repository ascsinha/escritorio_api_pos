from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.material import Material

material_bp = Blueprint('material', __name__)

@material_bp.route('/criar_material', methods=['POST'])
def criar_material(funcionario_atual):
    dados = request.get_json()

    material = Material(
        nome=dados['nome'],
        descricao=dados.get('descricao'),
        estoque_minimo=dados.get('estoque_minimo', 0),
        estoque_atual=dados.get('estoque_atual', 0)
    )

    db.session.add(material)
    db.session.commit()

    return jsonify({'id_material': material.id_material}), 201


@material_bp.route('/listar_materiais', methods=['GET'])
def listar_materiais(funcionario_atual):
    materiais = Material.query.all()
    return jsonify()


@material_bp.route('/<int:id_material>/recuperar_material', methods=['GET'])
def recuperar_material(funcionario_atual, id_material):
    material = Material.query.get_or_404(id_material)
    return jsonify()


@material_bp.route('/<int:id_material>/atualizar_material', methods=['PUT'])
def atualizar_material(funcionario_atual, id_material):
    material = Material.query.get_or_404(id_material)
    dados = request.get_json()

    material.nome = dados.get('nome', material.nome)
    material.descricao = dados.get('descricao', material.descricao)
    material.estoque_minimo = dados.get('estoque_minimo', material.estoque_minimo)

    db.session.commit()
    return jsonify({'mensagem': 'Material atualizado com sucesso'})


@material_bp.route('/<int:id_material>/deletar_material', methods=['DELETE'])
def deletar_material(funcionario_atual, id_material):
    material = Material.query.get_or_404(id_material)
    db.session.delete(material)
    db.session.commit()
    return jsonify({'mensagem': 'Material removido com sucesso'})


@material_bp.route('/<int:id_material>/consultar_estoque', methods=['GET'])
def consultar_estoque(funcionario_atual, id_material):
    material = Material.query.get_or_404(id_material)
    return jsonify({
        'id_material': material.id_material,
        'nome': material.nome,
        'estoque_atual': material.estoque_atual,
        'estoque_minimo': material.estoque_minimo,
        'abaixo_do_minimo': material.estoque_atual < material.estoque_minimo
    })


@material_bp.route('/<int:id_material>/registrar_material', methods=['POST'])
def registrar_entrada(funcionario_atual, id_material):
    material = Material.query.get_or_404(id_material)
    dados = request.get_json()
    quantidade = dados.get('quantidade')

    if not quantidade or quantidade <= 0:
        return jsonify({'erro': 'Quantidade inválida'}), 400

    material.estoque_atual += quantidade
    db.session.commit()

    return jsonify({'mensagem': 'Entrada registrada com sucesso', 'estoque_atual': material.estoque_atual})