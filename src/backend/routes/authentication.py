from flask import Blueprint, jsonify, request, session
import datetime

authentication_bp = Blueprint("authentication", __name__, url_prefix="/api")

# FLASK_KEY = key 
# Helpers
def hash_password(password):
    pass

def check_password(password, hashed):
    pass

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