from ..extensions import db

class Funcionario(db.Model):
    __tablename__ = 'funcionario'

    id_funcionario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    matricula = db.Column(db.String(20), nullable=False, unique=True)
    nome = db.Column(db.String(120), nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    setor = db.Column(db.String(80), nullable=True)

    retiradas = db.relationship(
        'Retirada',
        back_populates='funcionario',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<Funcionario {self.matricula} - {self.nome}>'
