import unittest

from token_classifier import TokenKind, display_token


class DisplayTokenTests(unittest.TestCase):
    def test_returns_each_declared_token(self) -> None:
        self.assertEqual(display_token(TokenKind.WORD), "word")
        self.assertEqual(display_token(TokenKind.NUMBER), "number")
        self.assertEqual(display_token(TokenKind.SYMBOL), "symbol")

    def test_returns_nonblank_custom_label(self) -> None:
        self.assertEqual(display_token(TokenKind.WORD, "heading"), "heading")

    def test_rejects_blank_custom_label(self) -> None:
        with self.assertRaisesRegex(ValueError, "must not be blank"):
            display_token(TokenKind.WORD, "   ")

    def test_rejects_unsupported_runtime_value(self) -> None:
        with self.assertRaisesRegex(ValueError, "unsupported token kind"):
            display_token(object())  # type: ignore[arg-type]


if __name__ == "__main__":
    unittest.main()
