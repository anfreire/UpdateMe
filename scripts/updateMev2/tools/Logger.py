import logging

LOG_PATH = "/home/anfreire/Documents/Projects/updateMe/scripts/script.logs"

class Logger:
    _instance = None

    def __init__(self) -> None:
        self.clean_logs()
        self.logger = logging.getLogger("updateMe")
        self.logger.setLevel(logging.DEBUG)
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler = logging.FileHandler(LOG_PATH)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)


    def __new__(cls) -> "Logger":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __del__(self) -> None:
        for handler in self.logger.handlers:
            handler.close()
            self.logger.removeHandler(handler)

    def clean_logs(self) -> None:
        open(LOG_PATH, "w").close()

    def add_exception(self, e: Exception) -> None:
        self.logger.error(e, exc_info=True)