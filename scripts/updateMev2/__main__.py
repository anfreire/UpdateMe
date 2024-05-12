from tools.Index import Index
from apps import (
    hdo,
    youtube,
    youtube_music,
    reddit,
    tiktok,
    twitch,
    microg,
    spotify,
    photo_editor_pro,
    photoshop_express,
    capcut,
    inshot,
    instagram,
    twitter,
    newpipe,
    seal,
    niagaralauncher,
    smartlauncher,
    revancedManager,
    ytdlnis,
    partypal,
    neverhaveiever,
)
import os
import sys
from tools.VirusTotal import VirusTotal
import argparse
import asyncio

APPS = {
    "HDO": hdo,
    "YouTube": youtube,
    "YouTube Music": youtube_music,
    "Reddit": reddit,
    "TikTok": tiktok,
    "Twitch": twitch,
    "MicroG": microg,
    "Spotify": spotify,
    "Photo Editor Pro": photo_editor_pro,
    "Photoshop Express": photoshop_express,
    "CapCut": capcut,
    "InShot": inshot,
    "Instagram": instagram,
    "Twitter": twitter,
    "NewPipe": newpipe,
    "Seal": seal,
    "Niagara Launcher": niagaralauncher,
    "Smart Launcher 6": smartlauncher,
    "ReVanced Manager": revancedManager,
    "YTDLnis": ytdlnis,
    "PartyPal": partypal,
    "Never Have I Ever": neverhaveiever
}


def update_all_apps(index: Index) -> None:
    for app in APPS.values():
        app(index)


def update_single_app(index: Index, *args: str) -> None:
    combined_args = " ".join(args)
    callables = [app for app in APPS.keys() if combined_args.lower() in app.lower()]
    if len(callables) == 0:
        print("No app found")
        sys.exit(1)
    else:
        APPS[callables[0]](index)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-a", "--app", nargs="+", help="App name")
    parser.add_argument("-g", "--github", help="Push to Github", action="store_true")
    parser.add_argument(
        "-v", "--virustotal", help="Update VirusTotal", action="store_true"
    )
    vt = VirusTotal()
    args = parser.parse_args()
    index = Index()
    if args.github:
        index.push()
        sys.exit(0)
    elif args.virustotal:
        vt.check_files(index)
        sys.exit(0)
    if args.app:
        for app_group in args.app:
            update_single_app(index, app_group)
    else:
        update_all_apps(index)
    index.write()
    index.push()
    vt.wait_queue()
    vt.update_index(index)
