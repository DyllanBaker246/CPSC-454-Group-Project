import sqlite3

DATABASE = "database.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _add_column_if_missing(conn, table, column, definition):
    existing = {row["name"] for row in conn.execute(f"PRAGMA table_info({table})")}

    if column not in existing:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def init_db():
    conn = get_db()

    # users
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL
        )
    """)

    # Columns added on top of the original table so existing rows survive.
    _add_column_if_missing(conn, "users", "password_hash", "TEXT")
    _add_column_if_missing(conn, "users", "public_key", "TEXT")
    _add_column_if_missing(conn, "users", "role", "TEXT NOT NULL DEFAULT 'user'")
    _add_column_if_missing(conn, "users", "status", "TEXT NOT NULL DEFAULT 'active'")

    # SQLite won't allow CURRENT_TIMESTAMP as a default in ALTER TABLE ADD COLUMN, so the column is added plain and backfilled for any pre-existing rows.
    _add_column_if_missing(conn, "users", "created_at", "TEXT")
    conn.execute("""
        UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL
    """)

    # files
    conn.execute("""
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER NOT NULL REFERENCES users(id),
            filename TEXT NOT NULL,
            storage_backend TEXT NOT NULL DEFAULT 'local',
            storage_path TEXT NOT NULL,
            encrypted_key TEXT,
            iv TEXT,
            content_type TEXT,
            size_bytes INTEGER,
            uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # file_shares - who besides the owner can access a file
    conn.execute("""
        CREATE TABLE IF NOT EXISTS file_shares (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_id INTEGER NOT NULL REFERENCES files(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            permission TEXT NOT NULL DEFAULT 'view',
            encrypted_key TEXT,
            iv TEXT,
            granted_by INTEGER NOT NULL REFERENCES users(id),
            granted_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(file_id, user_id)
        )
    """)

    # Added after file_shares already shipped, so backfill for anyone
    # whose local database.db was created before this column existed.
    _add_column_if_missing(conn, "file_shares", "encrypted_key", "TEXT")
    _add_column_if_missing(conn, "file_shares", "iv", "TEXT")

    # access_requests - a user with no permission asking the owner for access
    conn.execute("""
        CREATE TABLE IF NOT EXISTS access_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_id INTEGER NOT NULL REFERENCES files(id),
            requester_id INTEGER NOT NULL REFERENCES users(id),
            status TEXT NOT NULL DEFAULT 'pending',
            requested_at TEXT DEFAULT CURRENT_TIMESTAMP,
            resolved_at TEXT,
            resolved_by INTEGER REFERENCES users(id)
        )
    """)

    # audit_log - who accessed/changed what, and when
    conn.execute("""
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_id INTEGER REFERENCES files(id),
            user_id INTEGER REFERENCES users(id),
            action TEXT NOT NULL,
            detail TEXT,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_file_shares_file ON file_shares(file_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_file_shares_user ON file_shares(user_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_access_requests_file ON access_requests(file_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_audit_log_file ON audit_log(file_id)")

    # users.created_at was added via ALTER TABLE, which can't carry a
    # CURRENT_TIMESTAMP default, so new inserts are backfilled with a trigger.
    conn.execute("""
        CREATE TRIGGER IF NOT EXISTS trg_users_created_at
        AFTER INSERT ON users
        WHEN NEW.created_at IS NULL
        BEGIN
            UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
    """)

    conn.execute("""
        INSERT OR IGNORE INTO users (id, username, email)
        VALUES (?, ?, ?)
    """, (1, "admin", "admin@example.com"))

    conn.commit()
    conn.close()
