from enum import Enum


class TokenKind(Enum):
    WORD = "word"
    NUMBER = "number"
    SYMBOL = "symbol"


def display_token(kind: TokenKind, custom_label: str | None = None) -> str:
    """Return the display token for a known token kind."""
    if custom_label is not None and custom_label.strip() == "":
        raise ValueError("custom label must not be blank")
    if custom_label is not None:
        return custom_label
    value = ""
    if kind is TokenKind.WORD:
        value = "word"
    elif kind is TokenKind.NUMBER:
        value = "number"
    elif kind is TokenKind.SYMBOL:
        value = "symbol"
    else:
        raise ValueError("unsupported token kind")
    return value
