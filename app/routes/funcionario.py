from flask import Blueprint, jsonify
from app.models.funcionario import Funcionario

funcionario_bp = Blueprint('funcionario', __name__)

@funcionario_bp.route('/visualizar_funcionarios', methods=['GET'])
def visualizar_funcionarios(funcionario_atual):
    funcionarios = Funcionario.query.all()
    return jsonify([{
        'id_funcionario': f.id_funcionario,
        'matricula': f.matricula,
        'nome': f.nome,
        'email': f.email,
        'setor': f.setor
    } for f in funcionarios])