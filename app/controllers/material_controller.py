from app.extensions import db
from app.models.material import Material

def criar_material(dados):
    material = Material(
        nome=dados['nome'],
        descricao=dados.get('descricao'),
        estoque_minimo=dados.get('estoque_minimo', 0),
        estoque_atual=dados.get('estoque_atual', 0)
    )

    db.session.add(material)
    db.session.commit()

    return {'id_material': material.id_material}, 201


def listar_materiais():
    materiais = Material.query.all()
    response = [{
        'id_material': m.id_material,
        'nome': m.nome,
        'descricao': m.descricao,
        'estoque_atual': m.estoque_atual,
        'estoque_minimo': m.estoque_minimo
    } for m in materiais]
    return response, 200


def recuperar_material(id_material):
    material = Material.query.get_or_404(id_material)
    response = {
        'id_material': material.id_material,
        'nome': material.nome,
        'descricao': material.descricao,
        'estoque_atual': material.estoque_atual,
        'estoque_minimo': material.estoque_minimo
    }
    return response, 200


def atualizar_material(id_material, dados):
    material = Material.query.get_or_404(id_material)

    material.nome = dados.get('nome', material.nome)
    material.descricao = dados.get('descricao', material.descricao)
    material.estoque_minimo = dados.get('estoque_minimo', material.estoque_minimo)

    db.session.commit()
    return {'mensagem': 'Material atualizado com sucesso'}, 200


def deletar_material(id_material):
    material = Material.query.get_or_404(id_material)
    db.session.delete(material)
    db.session.commit()
    return {'mensagem': 'Material removido com sucesso'}, 200


def consultar_estoque(id_material):
    material = Material.query.get_or_404(id_material)
    response = {
        'id_material': material.id_material,
        'nome': material.nome,
        'estoque_atual': material.estoque_atual,
        'estoque_minimo': material.estoque_minimo,
        'abaixo_do_minimo': material.estoque_atual < material.estoque_minimo
    }
    return response, 200


def registrar_entrada(id_material, dados):
    material = Material.query.get_or_404(id_material)
    quantidade = dados.get('quantidade')

    if not quantidade or quantidade <= 0:
        return {'erro': 'Quantidade inválida'}, 400

    material.estoque_atual += quantidade
    db.session.commit()

    return {'mensagem': 'Entrada registrada com sucesso', 'estoque_atual': material.estoque_atual}, 200