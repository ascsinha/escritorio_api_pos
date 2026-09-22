from flask import Flask
from app.config import Config
from app.extensions import db, migrate, ma
from app.routes.home import home_bp
from .routes.funcionario import funcionario_bp
from .routes.retirada import retirada_bp
from .routes.material import material_bp
from .routes.item_retirada import itemretirada_bp

def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    from app.models.funcionario import Funcionario
    from app.models.retirada import Retirada
    from app.models.material import Material
    from app.models.item_retirada import ItemRetirada
    
    app.register_blueprint(home_bp)
    app.register_blueprint(funcionario_bp, url_prefix="/funcionario")
    app.register_blueprint(retirada_bp, url_prefix="/retirada")
    app.register_blueprint(itemretirada_bp, url_prefix="/itemretirada")
    app.register_blueprint(material_bp, url_prefix="/material")
    
    return app