from datetime import datetime, timezone
from ..extensions import db

class Retirada(db.Model):
    __tablename__ = 'retirada'

    id_retirada = db.Column(db.Integer, primary_key=True, autoincrement=True)
    data_retirada = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    id_funcionario = db.Column(db.Integer, db.ForeignKey('funcionario.id_funcionario'), nullable=False)
    funcionario = db.relationship('Funcionario', back_populates='retiradas')
    itens = db.relationship('ItemRetirada', back_populates='retirada', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Retirada {self.id_retirada} - {self.data_retirada}>'