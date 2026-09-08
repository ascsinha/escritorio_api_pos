from marshmallow import fields, validate
from app.extensions import ma
from app.models.funcionario import Funcionario

class FuncionarioSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Funcionario
        
    id_funcionario = fields.Int(dump_only=True)
    matricula = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    nome = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    senha = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))
    email = fields.Email(required=True)
    setor = fields.Str(allow_none=True, validate=validate.Length(max=80))