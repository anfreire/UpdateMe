from constants import COLORS, GLOBAL, MACROS, PREFIX
from structs import APKInfo
from typing import List
from index import IndexManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium import webdriver
import undetected_chromedriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from pyaxmlparser import APK
from bs4.element import PageElement
from bs4.element import ResultSet
from urllib.request import urlopen
from bs4 import BeautifulSoup
import os
import time
import urllib
import requests
import re


class PrintManager:
    @staticmethod
    def cursor_start() -> None:
        print("\033[1G", end="")

    @staticmethod
    def cursor_up() -> None:
        print("\x1b[1A", end="")

    @staticmethod
    def clear_line(msg: str) -> None:
        PrintManager.cursor_start()
        for _ in range(len(msg)):
            print(f" ", end="")
        PrintManager.cursor_start()


class AppBase:
    def __init__(self, macro: str, url: str):
        if macro not in MACROS.get_col():
            raise Exception(
                f"[ {COLORS.RED}FAIL {COLORS.RESET}] Invalid macro {COLORS.WHITE}{macro}{COLORS.RESET}"
            )
        self.macro = macro
        self.index = IndexManager.get_index(macro)
        apkInfo = self.get_apk(url)
        self.update_index(apkInfo)

    def download(self, url: str) -> None:
        r = requests.get(url, stream=True)
        total_size = int(r.headers.get("content-length", 0))
        dl = 0
        chunk_size = 1024
        msg = (
            f"{PREFIX.INFO} Downloading {COLORS.WHITE}{self.index.title}{COLORS.RESET}"
        )
        progress = ""
        try:
            with open(GLOBAL.CURR_APP, "wb") as apk:
                for data in r.iter_content(chunk_size=chunk_size):
                    dl += len(data)
                    apk.write(data)
                    done = int(50 * dl / total_size)
                    progress = f"\r[{'=' * done}{' ' * (50 - done)}] {dl / 1000000:.2f}/{total_size / 1000000:.2f}MB"
                    print(
                        progress,
                        end="",
                    )
        except Exception:
            os.system(
                f"curl '{url}' \
  -H 'authority: download.aeromods.app' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'cookie: cf_chl_3=7ac235fffb66a2c; cf_clearance=A.6P1Oe0V4d4LGkYZMVd3rExtqzGd1XJ7P354Djw1y4-1710069706-1.0.1.1-mkECk39EbGDpM79pzbNofp3Dxy5xqU12iU1NoeXNZrrKDPohz_60kARAmGbgAuVpYdl.ohPxyJBNmneqF66wpw' \
  -H 'sec-ch-ua: \"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"' \
  -H 'sec-ch-ua-arch: \"x86\"' \
  -H 'sec-ch-ua-bitness: \"64\"' \
  -H 'sec-ch-ua-full-version: \"122.0.6261.111\"' \
  -H 'sec-ch-ua-full-version-list: \"Chromium\";v=\"122.0.6261.111\", \"Not(A:Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"122.0.6261.111\"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-model: \"\"' \
  -H 'sec-ch-ua-platform: \"Linux\"' \
  -H 'sec-ch-ua-platform-version: \"6.7.7\"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: cross-site' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' \
  --output {GLOBAL.CURR_APP}"
            )
            PrintManager.clear_line(progress)
            PrintManager.cursor_up()
            PrintManager.clear_line(progress)
            PrintManager.cursor_up()
        PrintManager.clear_line(progress)
        PrintManager.cursor_up()
        PrintManager.clear_line(msg)

    def get_apk(self, url: str) -> APKInfo:
        self.download(url)
        try:
            apk = APK(GLOBAL.CURR_APP)
        except:
            res = input(
                "Failed to parse the apk. Do you want to insert manually? [Y/n]"
            )
            if res.lower() == "y":
                os.system(f"xdg-open {url}")
                os.remove(GLOBAL.CURR_APP)
                print(
                    f"Waiting for the user to download the apk.\nSave the apk in the {COLORS.WHITE}{GLOBAL.CURR_APP}{COLORS.RESET} path"
                )
                while not os.path.exists(GLOBAL.CURR_APP):
                    time.sleep(1)
                    apk = APK(GLOBAL.CURR_APP)
                else:
                    raise Exception(
                        f"[ {COLORS.RED}FAIL {COLORS.RESET}] Failed to parse the apk. {COLORS.WHITE}{url}{COLORS.RESET}"
                    )
        os.remove(GLOBAL.CURR_APP)
        if apk.package != self.index.packageName:
            raise Exception(
                f"[ {COLORS.RED}FAIL {COLORS.RESET}] Package name mismatch. Expected {COLORS.WHITE}{self.index.packageName}{COLORS.RESET} but got {COLORS.WHITE}{apk.package}{COLORS.RESET}"
            )
        return APKInfo(apk.version_name, url)

    def update_index(self, new: APKInfo):
        if (self.index.version == new.version) and (self.index.link == new.link):
            print(
                f"{PREFIX.OK} There is no update for {COLORS.WHITE}{self.index.title}{COLORS.RESET}"
            )
            return
        old_version = self.index.version
        self.index.version = new.version
        self.index.link = new.link
        IndexManager.update_index(self.macro, self.index)
        print(
            f"{PREFIX.OK} Updated {COLORS.WHITE}{self.index.title}{COLORS.RESET} from {COLORS.WHITE}{old_version}{COLORS.RESET} to {COLORS.WHITE}{new.version}{COLORS.RESET}"
        )


class WebScrapper:
    def __init__(self):
        self.driver = self.getDriver(True)
        if not self.driver:
            raise Exception(f"[ {COLORS.RED}FAIL {COLORS.RESET}] Failed to get driver")

    def getDriver(self, uc: bool = False) -> webdriver.Chrome:
        """Gets a Chrome driver

        Args:
            uc (bool, optional): Whether to use undetected_chromedriver. Defaults to False.

        Returns:
            webdriver.Chrome: The Chrome driver
        """
        if uc:
            options = undetected_chromedriver.ChromeOptions()
        else:
            options = Options()
        options.headless = False
        # options.add_argument("load-extension=" + self.extension)
        options.add_argument("user-data-dir=/home/anfreire/.config/chromium")
        options.add_argument("profile-directory=Profile 1")
        options.add_argument("--no-sandbox")
        options.binary_location = "/usr/bin/chromium-browser"
        if uc:
            driver = undetected_chromedriver.Chrome(options=options)
        else:
            driver = webdriver.Chrome(options=options)
        return driver

    def open_link(self, link: str) -> None:
        self.driver.get(link)

    def __del__(self):
        if self.driver:
            self.driver.quit()

    def get_tags(self, tag: str) -> List[WebElement]:
        return self.driver.find_elements(By.XPATH, f"//{tag}")


class GithubScrapping:
    def __init__(self, user: str, repo: str):
        self.user = user
        self.repo = repo

    def get_urllib_tags(self, url: str, tag: str) -> ResultSet[PageElement]:
        page = urlopen(url)
        soup = BeautifulSoup(page, "html.parser")
        return soup.find_all(tag)

    @property
    def prefix(self):
        return f"https://github.com/{self.user}/{self.repo}"

    def getVersions(self) -> list:
        divs = self.get_urllib_tags(f"{self.prefix}/releases", "div")
        versions = list()
        for div in divs:
            if div.find("svg", attrs={"aria-label": "Tag"}) and div.find("span"):
                try:
                    text = div.find("span").text
                    text = re.sub(r"\s+", "", text)
                    if (
                        text == self.user
                        or text == self.repo
                        or text is None
                        or len(text) == 0
                        or text in versions
                    ):
                        continue
                    versions.append(text)
                except:
                    continue
        return versions

    def link(self, version: str, include: List[str] = [], exclude: List[str] = []):
        lis = self.get_urllib_tags(
            f"{self.prefix}/releases/expanded_assets/{version}", "li"
        )
        links = []
        for li in lis:
            div = li.find("div")
            if div and div.find("svg") and div.find("a"):
                href = div.find("a").get("href")
                if (
                    href
                    and len(href) != 0
                    and all(term in href for term in include)
                    and all(term not in href for term in exclude)
                ):
                    link = (
                        href
                        if href.startswith("https://")
                        else "https://github.com/" + href
                    )
                    if link not in links:
                        links.append(link)
        return links


class AeroScrapping:
    def __init__(self) -> None:
        self.driver = WebScrapper()

    def open_link(self, link: str) -> None:
        self.driver.open_link(link)

    def searchLinkByText(self, text: str) -> str:
        link = None
        _as = self.driver.get_tags("a")
        for a in _as:
            if a.get_attribute("href") and text.lower() in a.text.lower():
                link = a.get_attribute("href")
                break
        if link:
            return link
        raise Exception(
            f"[ {COLORS.RED}FAIL {COLORS.RESET}] Link not found. Trying to search link with text {COLORS.WHITE}{text}{COLORS.RESET}"
        )

    def findLinkByText(self, text: str) -> str:
        link = None
        _as = self.driver.get_tags("a")
        for a in _as:
            if a.get_attribute("href") and a.text == text:
                link = a.get_attribute("href")
                break
        if link:
            return link
        raise Exception(
            f"[ {COLORS.RED}FAIL {COLORS.RESET}] Link not found. Trying to find link with text {COLORS.WHITE}{text}{COLORS.RESET}"
        )

    def click_span(self, class_attr: str) -> None:
        span = self.driver.get_tags("span")
        clicked = False
        for s in span:
            if s.get_attribute("class") == class_attr:
                clicked = True
                s.click()
                break
        if not clicked:
            raise Exception(
                f"[ {COLORS.RED}FAIL {COLORS.RESET}] Span not found. Trying to find span with class {COLORS.WHITE}{class_attr}{COLORS.RESET}"
            )

    def find_link_that_ends_width(self, endswith: str) -> str:
        link = None
        _as = self.driver.get_tags("a")
        for a in _as:
            if a.get_attribute("href") and a.get_attribute("href").endswith(endswith):
                link = a.get_attribute("href")
                break
        if link:
            return link
        raise Exception(
            f"[ {COLORS.RED}FAIL {COLORS.RESET}] Link not found. Trying to find link that ends with {COLORS.WHITE}{endswith}{COLORS.RESET}"
        )
