from datetime import datetime
from app.extensions import db
from app.models.funcionario import Funcionario
from app.models.retirada import Retirada
from app.models.material import Material
from app.models.item_retirada import ItemRetirada


def registrar_saida(dados):
    id_funcionario = dados.get('id_funcionario')
    if not id_funcionario:
        return {'erro': 'id_funcionario é obrigatório'}, 400

    funcionario_atual = Funcionario.query.get(id_funcionario)
    if not funcionario_atual:
        return {'erro': 'Funcionário não encontrado'}, 404

    retirada = Retirada(data_retirada=datetime.utcnow(), funcionario=funcionario_atual)
    db.session.add(retirada)
    db.session.flush()

    for item in dados.get('itens', []):
        material = Material.query.get_or_404(item['id_material'])
        quantidade = item['quantidade']

        if material.estoque_atual < quantidade:
            db.session.rollback()
            return {'erro': f'Estoque insuficiente para o material "{material.nome}"'}, 400

        material.estoque_atual -= quantidade

        db.session.add(ItemRetirada(
            id_retirada=retirada.id_retirada,
            id_material=material.id_material,
            quantidade=quantidade
        ))

    db.session.commit()
    return {'id_retirada': retirada.id_retirada}, 201


def listar_movimentacoes(data_inicio, data_fim):
    query = Retirada.query

    if data_inicio:
        query = query.filter(Retirada.data_retirada >= data_inicio)
    if data_fim:
        query = query.filter(Retirada.data_retirada <= data_fim)

    retiradas = query.order_by(Retirada.data_retirada.desc()).all()

    response = [{
        'id_retirada': r.id_retirada,
        'data_retirada': r.data_retirada.isoformat(),
        'funcionario': r.funcionario.nome if r.funcionario else None,
        'itens': [{
            'id_material': item.id_material,
            'nome_material': item.material.nome,
            'quantidade': item.quantidade
        } for item in r.itens]
    } for r in retiradas]

    return response, 200


def recuperar_retirada(id_retirada):
    retirada = Retirada.query.get_or_404(id_retirada)
    response = {
        'id_retirada': retirada.id_retirada,
        'data_retirada': retirada.data_retirada.isoformat(),
        'funcionario': retirada.funcionario.nome if retirada.funcionario else None,
        'itens': [{
            'id_material': item.id_material,
            'nome_material': item.material.nome,
            'quantidade': item.quantidade
        } for item in retirada.itens]
    }
    return response, 200


def gerar_relatorio(data_inicio, data_fim):
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

    response = {'periodo': {'inicio': data_inicio, 'fim': data_fim}, 'quantidade_por_material': resumo}
    return response, 200