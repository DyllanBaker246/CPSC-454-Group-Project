from flask import Flask, request, jsonify

from database import get_db, init_db

app = Flask(__name__)


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

    print(app.url_map)
    app.run(debug=True)