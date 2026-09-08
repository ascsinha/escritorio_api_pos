from datetime import datetime
from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.retirada import Retirada
from app.models.material import Material
from app.models.item_retirada import ItemRetirada

retirada_bp = Blueprint('retirada', __name__)

@retirada_bp.route('/registrar_saida', methods=['POST'])
def registrar_saida(funcionario_atual):
    dados = request.get_json()

    retirada = Retirada(data_retirada=datetime.utcnow(), funcionario=funcionario_atual)
    db.session.add(retirada)
    db.session.flush()

    for item in dados.get('itens', []):
        material = Material.query.get_or_404(item['id_material'])
        quantidade = item['quantidade']

        if material.estoque_atual < quantidade:
            db.session.rollback()
            return jsonify({'erro': f'Estoque insuficiente para o material "{material.nome}"'}), 400

        material.estoque_atual -= quantidade

        db.session.add(ItemRetirada(
            id_retirada=retirada.id_retirada,
            id_material=material.id_material,
            quantidade=quantidade
        ))

    db.session.commit()
    return jsonify({'id_retirada': retirada.id_retirada}), 201


@retirada_bp.route('consultar_movimentacoes', methods=['GET'])
def consultar_movimentacoes(funcionario_atual):
    query = Retirada.query

    data_inicio = request.args.get('data_inicio')
    data_fim = request.args.get('data_fim')

    if data_inicio:
        query = query.filter(Retirada.data_retirada >= data_inicio)
    if data_fim:
        query = query.filter(Retirada.data_retirada <= data_fim)

    retiradas = query.order_by(Retirada.data_retirada.desc()).all()
    return jsonify()


@retirada_bp.route('/<int:id_retirada>/recuperar_retirada', methods=['GET'])
def recuperar_retirada(funcionario_atual, id_retirada):
    retirada = Retirada.query.get_or_404(id_retirada)
    return jsonify()


@retirada_bp.route('/gerar_relatorio', methods=['GET'])
def gerar_relatorio(funcionario_atual):
    data_inicio = request.args.get('data_inicio')
    data_fim = request.args.get('data_fim')

    query = ItemRetirada.query.join(Retirada)

    if data_inicio:
        query = query.filter(Retirada.data_retirada >= data_inicio)
    if data_fim:
        query = query.filter(Retirada.data_retirada <= data_fim)

    itens = query.all()

    resumo = {}
    for item in itens:
        chave = item.material.nome
        resumo[chave] = resumo.get(chave, 0) + item.quantidade

    return jsonify({'periodo': {'inicio': data_inicio, 'fim': data_fim}, 'quantidade_por_material': resumo})