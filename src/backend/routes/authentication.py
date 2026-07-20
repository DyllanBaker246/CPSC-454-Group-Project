from flask import Blueprint, jsonify, request, session
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from .. import crypto as crypto_module
from ..crypto import generate_rsa_keypair, generate_symmetric_key

authentication_bp = Blueprint("authentication", __name__, url_prefix="/api")

# FLASK_KEY = key 
# Helpers
def hash_password(password):
    if not password:
        return None
    return generate_password_hash(password)

def check_password(password, hashed):
    if not password or not hashed:
        return False
    return check_password_hash(hashed, password)

# Register User
@authentication_bp.route("/user/register", methods=["POST"])
def register():
    data = request.json

    # Collect user credentials
    email = data.get("email")
    password = data.get("password")
    public_key = data.get("public_key")
 
    if not email or not password or not public_key:
        return jsonify({"error": "Missing fields"}), 400
        
    hashed_pass = hash_password(password)

    """
    user = db_create_user(email, hashed_pass, public_key)

    session["user_id"] = user["user_id"]

    return jsonify({
        "message": "User created",
        "user_id": user["user_id"]
    }), 201
    """

# Login User
@authentication_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    """
    user = db_get_user_by_email(email)

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not check_password(password, user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    session["user_id"] = user["user_id"]
    session.permanent = True

    return jsonify({
        "message": "Logged in",
        "user_id": user["user_id"]
    }), 200
    """

# Get User
@authentication_bp.route("/auth/me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    """
    user = db_get_user_by_id(user_id)

    return jsonify({
        "user_id": user["user_id"],
        "email": user["email"]
    }), 200
    """

# Logout
@authentication_bp.route("/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

# GET Public Key
@authentication_bp.route("/users/<int:user_id>/public-key", methods=["GET"])
def get_public_key(user_id):
    """
    user = db_get_user_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "public_key": user["public_key"]
    }), 200
    """


# Development endpoints to generate keys. Do NOT expose these in production.
@authentication_bp.route("/keys/generate-rsa", methods=["GET"])
def keys_generate_rsa():
    key_size = int(request.args.get("key_size", 2048))
    private_pem, public_pem = generate_rsa_keypair(key_size=key_size)

    return jsonify({
        "private_key": private_pem.decode("utf-8"),
        "public_key": public_pem.decode("utf-8"),
    }), 200


@authentication_bp.route("/keys/generate-symmetric", methods=["GET"])
def keys_generate_symmetric():
    key = generate_symmetric_key()
    return jsonify({"symmetric_key": key.decode("utf-8")}), 200