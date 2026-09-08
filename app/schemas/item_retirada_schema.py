from marshmallow import fields, validate
from app.extensions import ma
from app.models.item_retirada import ItemRetirada
from schemas.material_schema import MaterialSchema

class ItemRetiradaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = ItemRetirada
        
    id_material = fields.Int(required=True)
    quantidade = fields.Int(required=True, validate=validate.Range(min=1))
    material = fields.Nested(MaterialSchema, only=('id_material', 'nome'), dump_only=True)