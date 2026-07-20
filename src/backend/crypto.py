from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.fernet import Fernet


def generate_rsa_keypair(key_size: int = 2048):
    """Generate an RSA keypair.

    Returns (private_pem_bytes, public_pem_bytes).
    """
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=key_size)

    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    return private_pem, public_pem


def load_public_key(pem_bytes: bytes):
    return serialization.load_pem_public_key(pem_bytes)


def load_private_key(pem_bytes: bytes, password: bytes | None = None):
    return serialization.load_pem_private_key(pem_bytes, password=password)


def encrypt_with_public_key(public_pem: bytes, data: bytes) -> bytes:
    pub = load_public_key(public_pem)
    return pub.encrypt(
        data,
        padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
    )


def decrypt_with_private_key(private_pem: bytes, ciphertext: bytes, password: bytes | None = None) -> bytes:
    priv = load_private_key(private_pem, password=password)
    return priv.decrypt(
        ciphertext,
        padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None),
    )


def generate_symmetric_key() -> bytes:
    """Return a URL-safe base64-encoded key suitable for Fernet."""
    return Fernet.generate_key()


def encrypt_symmetric(key: bytes, data: bytes) -> bytes:
    f = Fernet(key)
    return f.encrypt(data)


def decrypt_symmetric(key: bytes, token: bytes) -> bytes:
    f = Fernet(key)
    return f.decrypt(token)
