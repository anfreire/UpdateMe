import os
import styledPrinting

APPS_PATH = r"/home/anfreire/Documents/Projects/UpdateMeApps/"


class Github:
    @classmethod
    def push_release(cls, path: str) -> str:
        filename = path.split("/")[-1]
        os.system(
            f"cd {APPS_PATH} && \
			gh release delete-asset apps {filename} -y > /dev/null 2>&1"
        )
        os.system(
            f"cd {APPS_PATH} && \
			gh release upload apps {filename} > /dev/null 2>&1"
        )
        return f"https://github.com/anfreire/UpdateMeApps/releases/download/apps/{filename}"
