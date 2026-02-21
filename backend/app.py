from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# ===============================
# CONFIGURATION BASE DE DONNÉES
# ===============================

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@db:5432/appdb"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ===============================
# MODÈLES
# ===============================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)

# ===============================
# ROUTES
# ===============================

@app.route('/')
def home():
    return jsonify({"message": "API Flask fonctionne !"})

# ---- INIT DATABASE ----
@app.route("/init-db")
def init_db():
    db.create_all()
    return jsonify({"message": "Tables créées !"})

# ---- GET USERS ----
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "name": u.name, "email": u.email}
        for u in users
    ])

# ---- POST USER ----
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()

    new_user = User(
        name=data['name'],
        email=data['email']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User ajouté avec succès"})

# ---- GET PRODUCTS ----
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([
        {"id": p.id, "name": p.name, "price": p.price}
        for p in products
    ])

# ---- POST PRODUCT ----
@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()

    new_product = Product(
        name=data['name'],
        price=data['price']
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Produit ajouté avec succès"})

# ===============================
# MAIN
# ===============================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
