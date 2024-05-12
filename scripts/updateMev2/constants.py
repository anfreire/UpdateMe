from styledPrinting import *


class PREFIX:
    OK: str = f"[  {Style.bold(Color.green('OK'))}  ]"
    FAIL: str = f"[ {Style.bold(Color.red('FAIL'))} ]"
    INFO: str = f"[ {Style.bold(Color.blue('INFO'))} ]"
    WARN: str = f"[ {Style.bold(Color.yellow('WARN'))} ]"


ICON_LINK_GH_PAGES = (
    lambda fileName: f"https://anfreire.github.io/updateMe/scripts/icons/{fileName}.png"
)
ICON_LINK_RAW = (
    lambda fileName: f"https://raw.githubusercontent.com/anfreire/updateMe/gh-pages/scripts/icons/{fileName}.png"
)

APPS_PATH = r"/home/anfreire/Documents/Projects/UpdateMeApps/"


APPS = [
    "HDO",
    "Youtube",
    "Youtube Music",
    "MicroG",
    "Spotify",
    "Photo Editor Pro",
    "Photoshop Express",
    "Capcut",
    "Inshot",
    "Instagram",
    "Twitter",
    "Whatsapp",
]
