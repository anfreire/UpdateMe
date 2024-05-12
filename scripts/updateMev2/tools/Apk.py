from pyaxmlparser import APK
import hashlib


class Apk:
    def __init__(self, path):
        self.path = path
        self.apk = APK(path)
        with open(path, "rb") as file:
            self._sha256 = hashlib.sha256(file.read()).hexdigest()

    @property
    def version(self):
        return self.apk.version_name

    @property
    def packageName(self):
        return self.apk.package

    @property
    def sha256(self):
        return self._sha256

    @version.setter
    def version(self, value):
        raise AttributeError("Version is read-only")

    @packageName.setter
    def packageName(self, value):
        raise AttributeError("packageName is read-only")

    @sha256.setter
    def sha256(self, value):
        raise AttributeError("sha256 is read-only")
