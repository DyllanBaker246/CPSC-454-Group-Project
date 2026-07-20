from flask import Blueprint, jsonify, request, session
from backend import get_db
import bcrypt

authentication_bp = Blueprint("authentication", __name__, url_prefix="/api")

# Helpers
def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode("utf-8"), hashed)

# DB FUNCTIONS
def db_create_user(email, password, public_key):
    conn = get_db()

    cursor = conn.execute(
        "INSERT INTO users (email, password, public_key) VALUES (?, ?, ?)",
        (email, password, public_key)
    )

    conn.commit()
    user_id = cursor.lastrowid
    conn.close()

    return {"user_id": user_id}

def db_get_user_by_email(email):
    conn = get_db()

    row = conn.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    conn.close()
    return row

def db_get_user_by_id(user_id):
    conn = get_db()

    row = conn.execute(
        "SELECT * FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    conn.close()
    return row

# REGISTER
@authentication_bp.route("/user/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")
    public_key = data.get("public_key")

    if not email or not password or not public_key:
        return jsonify({"error": "Missing fields"}), 400

    hashed_pass = hash_password(password)

    try:
        user = db_create_user(email, hashed_pass, public_key)
    except:
        return jsonify({"error": "Email already exists"}), 400

    session["user_id"] = user["user_id"]

    return jsonify({
        "message": "User created",
        "user_id": user["user_id"]
    }), 201

# LOGIN
@authentication_bp.route("/user/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")

    user = db_get_user_by_email(email)

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not check_password(password, user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    session["user_id"] = user["id"]
    session.permanent = True

    return jsonify({
        "message": "Logged in",
        "user_id": user["id"]
    }), 200

# GET CURRENT USER
@authentication_bp.route("/user/me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    user = db_get_user_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user_id": user["id"],
        "email": user["email"]
    }), 200

# LOGOUT
@authentication_bp.route("/user/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

# GET PUBLIC KEY
@authentication_bp.route("/user/<int:user_id>/public-key", methods=["GET"])
def get_public_key(user_id):
    user = db_get_user_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "public_key": user["public_key"]
    }), 200