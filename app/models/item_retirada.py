from ..extensions import db

class ItemRetirada(db.Model):
    __tablename__ = 'item_retirada'

    id_retirada = db.Column(db.Integer, db.ForeignKey('retirada.id_retirada'), primary_key=True)
    id_material = db.Column(db.Integer, db.ForeignKey('material.id_material'), primary_key=True)
    quantidade = db.Column(db.Integer, nullable=False)

    retirada = db.relationship('Retirada', back_populates='itens')
    material = db.relationship('Material', back_populates='itens')

    def __repr__(self):
        return f'<ItemRetirada retirada={self.id_retirada} material={self.id_material} qtd={self.quantidade}>'