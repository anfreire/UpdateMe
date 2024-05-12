import vt
import json
import constants
import os
from copy import deepcopy
from constants import PREFIX, Style, APPS_PATH
from styledPrinting import Cursor
import pickle
import hashlib
from dataclasses import dataclass
from tools.Index import Index
from typing import List
import time


@dataclass
class Analysis:
    analysis: vt.Object
    appname: str
    provider: str
    sha256: str
    path: str
    infected: bool
    finished: bool


FINISHED_ANALYSES_PATH = (
    "/home/anfreire/Documents/Projects/updateMe/scripts/finished_analyses.pkl"
)


class VirusTotal:
    _instance = None

    def __init__(self) -> None:
        api_key = json.load(
            open("/home/anfreire/Documents/Projects/updateMe/scripts/virustotal.json")
        )["key"]
        self.client = vt.Client(api_key)
        self.queue: List[Analysis] = []
        self.requests_made = 0
        self.last_minute = None

    def __new__(cls) -> "VirusTotal":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __del__(self) -> None:
        self.client.close()

    def _add(self, path: str) -> vt.Object:
        with open(path, "rb") as file:
            return self.client.scan_file(file)

    def can_make_request(self) -> bool:
        if self.last_minute is None or time.time() - self.last_minute > 60:
            return True
        return self.requests_made < 4

    def register_request(self) -> None:
        if self.last_minute is None or time.time() - self.last_minute > 60:
            self.last_minute = time.time()
            self.requests_made = 1
        else:
            self.requests_made += 1

    def wait_requests_available(self) -> None:
        while not self.can_make_request():
            seconds_left = 60 - (time.time() - self.last_minute)
            print(
                f"{PREFIX.INFO} Waiting for virus total requests to be available: {seconds_left:.0f}s"
            )
            time.sleep(1)
            Cursor.moveUp()
            Cursor.moveLineStart()
            Cursor.clearLine()

    def add(self, appname: str, provider: str, path: str, sha256: str) -> None:
        self.wait_requests_available()
        self.register_request()
        analysis = self._add(path)
        self.queue.append(
            Analysis(analysis, appname, provider, sha256, path, False, False)
        )

    def update_analysis(self, data: Analysis) -> None:
        self.wait_requests_available()
        self.register_request()
        data.analysis = self.client.get_object("/analyses/{}", data.analysis.id)

    def is_finished(self, data: Analysis) -> bool:
        return data.analysis.status == "completed"

    def has_virus(self, data: Analysis) -> bool:
        return any(
            [data.analysis.stats["malicious"], data.analysis.stats["suspicious"]]
        )

    def wait_queue(self) -> None:
        done = []
        while len(done) != len(self.queue) and len(self.queue) > 0:
            for data in self.queue:
                if data in done:
                    continue
                self.update_analysis(data)
                if not self.is_finished(data):
                    continue
                done.append(data)
                data.finished = True
                if self.has_virus(data):
                    data.infected = True
                print(
                    f"{PREFIX.OK if not data.infected else PREFIX.WARN} Analysed {Style.bold(data.appname)} from {Style.bold(data.provider)}: {Style.bold('Infected' if data.infected else 'Clean')}"
                )

    def update_index(self, index: Index) -> None:
        for data in self.queue:
            index.update_app_safety(data.appname, data.provider, not data.infected)
        index.write()
        index.push("Updated VirusTotal results")

    def get_uploaded_file(self, sha256) -> vt.Object:
        self.wait_requests_available()
        self.register_request()
        return self.client.get_object(f"/files/{sha256}")

    def check_files(self, index: Index) -> None:
        for app in index.apps:
            app_data = index.oldIndex[app]
            for provider in index.get_app_providers(app):
                sha256 = app_data["providers"][provider]["sha256"]
                if sha256:
                    file = self.get_uploaded_file(sha256)
                    if any(
                        [
                            file.last_analysis_stats["malicious"],
                            file.last_analysis_stats["suspicious"],
                        ]
                    ):
                        index.update_app_safety(app, provider, False)
                        print(
                            f"{PREFIX.WARN} {Style.bold(app)} - {Style.bold(provider)} is infected"
                        )
                    else:
                        index.update_app_safety(app, provider, True)
                        print(
                            f"{PREFIX.OK} {Style.bold(app)} - {Style.bold(provider)} is clean"
                        )
        index.write()
