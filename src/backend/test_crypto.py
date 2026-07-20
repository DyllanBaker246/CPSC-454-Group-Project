"""Quick test script for crypto utilities.

Run from repository root with:
python src/backend/test_crypto.py
"""
import os
import sys

# Ensure `src` is on sys.path so we can import the backend package
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from backend import crypto


def main():
    print("Generating RSA keypair...")
    priv_pem, pub_pem = crypto.generate_rsa_keypair()
    print("Public key (first line):", pub_pem.decode().splitlines()[0])

    print("Generating symmetric key (Fernet)...")
    sym = crypto.generate_symmetric_key()
    print("Symmetric key:", sym.decode())

    data = b"The quick brown fox"
    token = crypto.encrypt_symmetric(sym, data)
    out = crypto.decrypt_symmetric(sym, token)
    assert out == data, "Symmetric encrypt/decrypt failed"
    print("Symmetric encrypt/decrypt OK")

    enc_sym = crypto.encrypt_with_public_key(pub_pem, sym)
    dec_sym = crypto.decrypt_with_private_key(priv_pem, enc_sym)
    assert dec_sym == sym, "Asymmetric encrypt/decrypt failed"
    print("Asymmetric encrypt/decrypt OK")


if __name__ == "__main__":
    main()
