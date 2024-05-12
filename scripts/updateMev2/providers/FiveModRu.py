from scrappers.Selenium import Selenium, WebDriverWait, EC
from tools.Downloader import Downloader


class FiveModRu(Selenium):
    def __init__(self, user: str, app: str):
        self.link = f"https://5mod.ru/programmy/{user}/{app}.html"
        super().__init__()

    def get_apk(self, app_name: str, provider_name: str):
        title = app_name.replace(" ", "_").lower()
        provider = provider_name.replace(" ", "_").lower()
        filename = f"/home/anfreire/Documents/Projects/UpdateMeApps/{title}_{provider}.apk".replace(
            "(", ""
        ).replace(
            ")", ""
        )
        self.driver.get(self.link)
        el = self.driver.find_element("xpath", '//*[@id="load"]/div[2]/a[1]')
        self.driver.get(el.get_attribute("href"))
        wait = WebDriverWait(self.driver, 10)
        button = wait.until(
            EC.presence_of_element_located(("xpath", '//*[@id="form"]/div/a'))
        )
        fun = lambda: button.click()
        return Downloader.get_downloaded_file(filename, fun)
