from tools.Index import Index, ProvidersType
from tools.Downloader import Downloader
from styledPrinting import Style
from pyvirtualdisplay import Display
from constants import PREFIX
from typing import Literal, Dict, Tuple
from tools.Apk import Apk
from tools.Github import Github
from tools.VirusTotal import VirusTotal
from tools.Logger import Logger

APPS_PATH = r"/home/anfreire/Documents/Projects/UpdateMeApps/"


ProvidesFunType = Dict[str, callable]

vt = VirusTotal()
logger = Logger()


class AppBase:
    def __init__(self, app_title: str, providers: ProvidesFunType):
        self.app_title = app_title
        self.providers = providers

    def make_file_name(self, provider_title: str) -> str:
        title = self.app_title.replace(" ", "_").lower()
        provider = provider_title.replace(" ", "_").lower()
        return f"{title}_{provider}.apk".replace("(", "").replace(")", "")

    def get_link(
        self, providerTitle: str, fun: callable, display=True
    ) -> str | tuple | None:
        link = None
        tries = 0
        while tries < 2:
            if display:
                _display = Display(visible=0, size=(800, 600))
                _display.start()
            try:
                link = fun()
            except Exception as e:
                logger.add_exception(e)
                pass
            if display:
                _display.stop()
            if link:
                break
            tries += 1
            display = False
        if link is None:
            print(
                f"{PREFIX.FAIL} {Style.bold(self.app_title)} [ {Style.bold(providerTitle)} ] scraping failed"
            )
        return link

    def download(
        self, link: str, provider_title: str, origin: str = None
    ) -> Tuple[bool, str]:
        path = APPS_PATH + self.make_file_name(provider_title)
        res = Downloader.download_requests(link, path)
        if not res:
            res = Downloader.download_curl(link, path, origin)
        return (res, path)

    def download_manual(self, link: str, provider_title: str) -> None:
        path = APPS_PATH + self.make_file_name(provider_title)
        res = Downloader.download_chrome(link, path)
        return (res, path)

    def process(self, provider_title: str, link: str, path: str, index: Index) -> bool:
        apk = Apk(path)
        old_provider = index.get_provider(self.app_title, provider_title)
        vt.add(self.app_title, provider_title, path, apk.sha256)
        download = Github.push_release(path)
        if old_provider["sha256"] != apk.sha256:
            index.update_provider(
                self.app_title, provider_title, apk.version, link, download, apk.sha256
            )
            if old_provider["version"] < apk.version:
                print(
                    f"{PREFIX.OK} {Style.bold(self.app_title)} - {Style.bold(provider_title)} updated from {old_provider['version']} to {apk.version}"
                )
            else:
                print(
                    f"{PREFIX.OK} {Style.bold(self.app_title)} - {Style.bold(provider_title)} got bug fix"
                )
            return True
        else:
            print(
                f"{PREFIX.INFO} {Style.bold(self.app_title)} - {Style.bold(provider_title)} already up to date"
            )
            return False

    def _update(self, provider_title, fun, index):
        link = None
        origin = None
        res = self.get_link(provider_title, fun)
        if isinstance(res, tuple):
            link = res[0]
            origin = res[1]
        else:
            link = res
        result = False
        if link:
            path = self.download(link, provider_title, origin)
            try:
                if path[0]:
                    result = self.process(provider_title, link, path[1], index)
            except:
                path = self.download_manual(link, provider_title)
                if path[0]:
                    result = self.process(provider_title, link, path[1], index)
        return (path[1], result)

    def update(self, index: Index) -> None:
        if (
            "packageName" in index.oldIndex[self.app_title].keys()
            and index.oldIndex[self.app_title]["packageName"]
        ):
            _display = Display(visible=0, size=(800, 600))
            _display.start()
        for provider_title, fun in self.providers.items():
            try:
                path, result = self._update(provider_title, fun, index)
                index.write()
            except Exception as e:
                logger.add_exception(e)
                print(
                    f"{PREFIX.FAIL} {Style.bold(self.app_title)} [ {Style.bold(provider_title)} ] update failed\n{str(e)}\n"
                )

    def add(self, index: Index) -> None:
        for provider_title, fun in self.providers.items():
            link = None
            origin = None
            res = self.get_link(provider_title, fun)
            if isinstance(res, tuple):
                link = res[0]
                origin = res[1]
            else:
                link = res
            if link:
                path = self.download(link, provider_title, origin)
            if path[0]:
                path = path[1]
                apk = Apk(path)
                vt.add(self.app_title, provider_title, path, apk.sha256)
                source = input(
                    f"Enter source for {self.app_title} - {provider_title}: "
                )
                version = apk.version
                link = link
                packageName = apk.packageName
                download = Github.push_release(path)
                provider: ProvidersType = {
                    "packageName": packageName,
                    "source": source,
                    "version": version,
                    "link": link,
                    "download": download,
                    "sha256": apk.sha256,
                    "safe": True,
                }
                index.add_provider(self.app_title, provider_title, provider)
                index.write()
                print(
                    f"{PREFIX.OK} {Style.bold(self.app_title)} - {Style.bold(provider_title)} added"
                )

    def update_downloaded(self, provider_title, fun, index, add=False):
        path = fun()
        apk = Apk(path)
        if add:
            vt.add(self.app_title, provider_title, path, apk.sha256)
            source = input(f"Enter source for {self.app_title} - {provider_title}: ")
            version = apk.version
            link = "?"
            packageName = apk.packageName
            download = Github.push_release(path)
            provider: ProvidersType = {
                "packageName": packageName,
                "source": source,
                "version": version,
                "link": link,
                "download": download,
                "sha256": apk.sha256,
                "safe": True,
            }
            index.add_provider(self.app_title, provider_title, provider)
        else:
            result = self.process(provider_title, "?", path, index)
