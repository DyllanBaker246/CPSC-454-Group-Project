from flask import Flask, request, jsonify
import sqlite3
import os
import sys

# Allow running this module as a script. Ensure the package root (`src`) is on sys.path
# so absolute imports like `from backend.routes...` work when __package__ is None.
if __package__ is None:
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.routes.authentication import authentication_bp

app = Flask(__name__)

DATABASE = os.path.join(os.path.dirname(__file__), "database.db")


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL
        )
    """)

    conn.execute("""
        INSERT OR IGNORE INTO users (id, username, email)
        VALUES (?, ?, ?)
    """, (1, "admin", "admin@example.com"))

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return "Flask backend is running!"


@app.route("/add-user", methods=["POST"])
def add_user():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")

    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400

    conn = get_db()

    conn.execute(
        "INSERT INTO users (username, email) VALUES (?, ?)",
        (username, email)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "User added successfully!"})


@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db()
    rows = conn.execute("SELECT * FROM users").fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])


if __name__ == "__main__":
    init_db()

    # Register auth routes
    app.register_blueprint(authentication_bp)

    print(app.url_map)
    app.run(debug=True)