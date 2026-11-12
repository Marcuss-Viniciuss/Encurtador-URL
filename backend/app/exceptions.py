class UrlNotFoundError(Exception):
    def __init__(self, short_code: str):
        super().__init__(f"Link curto '{short_code}' não encontrado.")
        self.short_code = short_code


class ShortCodeGenerationError(Exception):
    pass
