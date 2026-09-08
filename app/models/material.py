from ..extensions import db
    
class Material(db.Model):
    __tablename__ = 'material'

    id_material = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.String(255), nullable=True)
    estoque_minimo = db.Column(db.Integer, nullable=False, default=0)
    estoque_atual = db.Column(db.Integer, nullable=False, default=0)

    itens = db.relationship(
        'ItemRetirada',
        back_populates='material',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<Material {self.id_material} - {self.nome}>'