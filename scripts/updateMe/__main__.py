from apps import *
from index import IndexManager, IndexInfo
from typing import Dict
import json


class MACROS:
    SPOTIFY = "SPOTIFY"
    HDO = "HDO"
    YOUTUBE = "YOUTUBE_YOUTUBE"
    YOUTUBE_MUSIC = "YOUTUBE_MUSIC"
    YOUTUBE_MICROG = "YOUTUBE_MICROG"
    INSTAGRAM = "INSTAGRAM"
    TWITTER = "TWITTER"
    WHATSAPP = "WHATSAPP"
    CAPCUT = "CAPCUT"
    PHOTO_EDITOR_PRO = "PHOTO_EDITOR_PRO"
    INSHOT = "INSHOT"
    PHOTOSHOP_EXPRESS = "PHOTOSHOP_EXPRESS"


TRANSLATIONS = {
    MACROS.SPOTIFY: {"key": "Spotify", "provider": "Spotify Geek"},
    MACROS.HDO: {"key": "HDO", "provider": "HDO"},
    MACROS.YOUTUBE: {"key": "YouTube", "provider": "ReVanced"},
    MACROS.YOUTUBE_MUSIC: {"key": "YouTube Music", "provider": "ReVanced"},
    MACROS.YOUTUBE_MICROG: {"key": "MicroG", "provider": "TeamVanced"},
    MACROS.INSTAGRAM: {"key": "Instagram", "provider": "AeroInsta"},
    MACROS.TWITTER: {"key": "Twitter", "provider": "AeroWitter"},
    MACROS.WHATSAPP: {"key": "WhatsApp", "provider": "FMWhatsApp"},
    MACROS.CAPCUT: {"key": "CapCut", "provider": "MODYOLO"},
    MACROS.PHOTO_EDITOR_PRO: {"key": "Photo Editor Pro", "provider": "MODYOLO"},
    MACROS.INSHOT: {"key": "InShot", "provider": "MODYOLO"},
    MACROS.PHOTOSHOP_EXPRESS: {"key": "Photoshop Express", "provider": "MODYOLO"},
}


def init() -> Dict[str, IndexInfo]:
    old_index = IndexManager.get_index()
    IndexManager.init_firebase()
    return old_index


def update_app(macro: str, index: IndexManager) -> None:
    translation = TRANSLATIONS[macro]
    new_index_path = r"/home/anfreire/Documents/Projects/updateMe/scripts/index2.json"
    with open(new_index_path, "r") as index_file:
        new_index = json.load(index_file)
        title = index.get_index(macro).title
        packageName = index.get_index(macro).packageName
        url = new_index[translation["key"]]["providers"][translation["provider"]][
            "source"
        ]
        version = new_index[translation["key"]]["providers"][translation["provider"]][
            "version"
        ]
        link = new_index[translation["key"]]["providers"][translation["provider"]][
            "download"
        ]
        index.update_index(macro, IndexInfo(title, packageName, url, version, link))


def main():
    old_index = init()
    for macro in TRANSLATIONS.keys():
        update_app(macro, IndexManager)
    IndexManager.push_git(old_index)
    IndexManager.push_firebase(old_index)
    IndexManager.send_notifications(old_index)
    IndexManager.get_reports()


if __name__ == "__main__":
    main()
