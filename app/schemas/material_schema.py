from marshmallow import fields, validate
from app.extensions import ma
from app.models.material import Material

class MaterialSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Material
        
    id_material = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=1, max=120))
    descricao = fields.Str(allow_none=True, validate=validate.Length(max=255))
    estoque_minimo = fields.Int(load_default=0, validate=validate.Range(min=0))
    estoque_atual = fields.Int(load_default=0, validate=validate.Range(min=0))