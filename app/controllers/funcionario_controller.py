from app.extensions import db
from app.models.funcionario import Funcionario


def criar_funcionario(dados):
    funcionario = Funcionario(
        matricula=dados['matricula'],
        nome=dados['nome'],
        email=dados.get('email'),
        setor=dados.get('setor')
    )

    db.session.add(funcionario)
    db.session.commit()

    return {'id_funcionario': funcionario.id_funcionario}, 201


def listar_funcionarios():
    funcionarios = Funcionario.query.all()
    response = [{
        'id_funcionario': f.id_funcionario,
        'matricula': f.matricula,
        'nome': f.nome,
        'email': f.email,
        'setor': f.setor
    } for f in funcionarios]
    return response, 200


def recuperar_funcionario(id_funcionario):
    funcionario = Funcionario.query.get_or_404(id_funcionario)
    response = {
        'id_funcionario': funcionario.id_funcionario,
        'matricula': funcionario.matricula,
        'nome': funcionario.nome,
        'email': funcionario.email,
        'setor': funcionario.setor
    }
    return response, 200


def atualizar_funcionario(id_funcionario, dados):
    funcionario = Funcionario.query.get_or_404(id_funcionario)

    funcionario.nome = dados.get('nome', funcionario.nome)
    funcionario.email = dados.get('email', funcionario.email)
    funcionario.setor = dados.get('setor', funcionario.setor)

    db.session.commit()
    return {'mensagem': 'Funcionário atualizado com sucesso'}, 200


def deletar_funcionario(id_funcionario):
    funcionario = Funcionario.query.get_or_404(id_funcionario)
    db.session.delete(funcionario)
    db.session.commit()
    return {'mensagem': 'Funcionário removido com sucesso'}, 200