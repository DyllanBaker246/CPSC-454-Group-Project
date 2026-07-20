from flask import Flask
from routes.authentication import authentication_bp
from flask_cors import CORS
import sqlite3


app = Flask(__name__)
app.secret_key = "dev-secret-key"
CORS(app, supports_credentials=True)

DATABASE = "database.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password BLOB NOT NULL,
            public_key TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

app.register_blueprint(authentication_bp)

@app.route("/")
def home():
    return "Flask backend is running!"

if __name__ == "__main__":
    init_db()
    print(app.url_map)
    app.run(debug=True)