from flask import Blueprint, render_template

home_bp = Blueprint("home", __name__)

@home_bp.route("/", methods=["GET"])
def dashboard():
    return render_template("index.html")


@home_bp.route("/funcionarios", methods=["GET"])
def funcionarios():
    return render_template("funcionarios.html")


@home_bp.route("/materiais", methods=["GET"])
def materiais():
    return render_template("materiais.html")