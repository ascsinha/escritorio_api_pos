from marshmallow import fields, validate
from app.extensions import ma
from app.models.retirada import Retirada
from schemas.item_retirada_schema import ItemRetiradaSchema
from schemas.funcionario_schema import FuncionarioSchema

class RetiradaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Retirada
        
    id_retirada = fields.Int(dump_only=True)
    data_retirada = fields.DateTime(dump_only=True)
    id_funcionario = fields.Int(required=True)
    itens = fields.List(fields.Nested(ItemRetiradaSchema), required=True, validate=validate.Length(min=1))
    funcionario = fields.Nested(FuncionarioSchema, only=('id_funcionario', 'nome', 'matricula'), dump_only=True)