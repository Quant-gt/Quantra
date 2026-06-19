import unittest
import base64
import os
import sys

# Add current directory to path to allow importing local modules correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fyers_auth import encrypt_token, decrypt_token

class TestFyersAuthTokenEncryption(unittest.TestCase):

    def test_encrypt_decrypt_roundtrip(self):
        # Asserts encrypting and decrypting with the same key yields the original token
        original_token = "eyJfYWNjZXNzX3Rva2VuX3Rlc3QiOiJzdWNjZXNzIn0="
        key = "super_secret_app_secret_1234"
        
        encrypted = encrypt_token(original_token, key)
        self.assertNotEqual(original_token, encrypted)
        
        # Verify it's a valid base64 string
        try:
            base64.b64decode(encrypted.encode())
            is_valid_base64 = True
        except Exception:
            is_valid_base64 = False
        self.assertTrue(is_valid_base64)
        
        decrypted = decrypt_token(encrypted, key)
        self.assertEqual(original_token, decrypted)

    def test_encrypt_empty_key(self):
        # Asserts empty or missing key returns the plain unencrypted token
        original_token = "some_secret_access_token_value"
        
        self.assertEqual(encrypt_token(original_token, ""), original_token)
        self.assertEqual(encrypt_token(original_token, None), original_token)

    def test_decrypt_empty_key(self):
        # Asserts decrypting with empty or missing key returns the input string unedited
        token_input = "some_random_input_value"
        
        self.assertEqual(decrypt_token(token_input, ""), token_input)
        self.assertEqual(decrypt_token(token_input, None), token_input)

    def test_decrypt_wrong_key(self):
        # Asserts decrypting with a wrong key does not return the original token
        original_token = "my_private_token"
        correct_key = "correct_secret"
        wrong_key = "wrong_secret"
        
        encrypted = encrypt_token(original_token, correct_key)
        decrypted_with_wrong_key = decrypt_token(encrypted, wrong_key)
        
        self.assertNotEqual(original_token, decrypted_with_wrong_key)

    def test_decrypt_corrupted_base64(self):
        # Asserts decrypting invalid base64 string returns None gracefully
        invalid_b64 = "this_is_not_base64_formatted_!!!"
        key = "some_key"
        
        result = decrypt_token(invalid_b64, key)
        self.assertIsNone(result)

if __name__ == '__main__':
    unittest.main()
