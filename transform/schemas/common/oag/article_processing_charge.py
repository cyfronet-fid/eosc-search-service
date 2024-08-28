from pydantic import BaseModel


class ArticleProcessingCharge(BaseModel):
    """
    Model representing an article processing charge.
    The money spent to make this book or article available in Open Access.

    Attributes:
        currency (str):
            The currency of article processing charge.
        amount (str):
            The amount of the article processing charge.
    """

    currency: str
    amount: str
