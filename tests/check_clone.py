#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen


ROOT = Path("mirror/www.itsjay.us")
BASE_URL = "http://127.0.0.1:8000/"
PAGES = [
    "index.html",
    "work.html",
    "lab.html",
    "work/jazmin-wong.html",
    "work/trackstack.html",
]


class AssetParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.urls: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        relevant = {"src", "href", "poster"}
        for key, value in attrs:
            if key in relevant and value:
                self.urls.append(value)


def fetch_status(url: str) -> int:
    req = Request(url, method="HEAD", headers={"User-Agent": "codex-check"})
    try:
        with urlopen(req, timeout=10) as resp:
            return resp.status
    except HTTPError as exc:
        return exc.code
    except URLError:
        return 0


def main() -> int:
    failures: list[str] = []

    for page in PAGES:
        html_path = ROOT / page
        text = html_path.read_text(errors="ignore")

        if "/scripts/page-transition.js" not in text:
            failures.append(f"{page}: missing page transition script include")
        if "/styles/page-transition.css" not in text:
            failures.append(f"{page}: missing page transition stylesheet include")

        parser = AssetParser()
        parser.feed(text)

        checked = set()
        for raw_url in parser.urls:
            if raw_url.startswith(("mailto:", "tel:", "javascript:", "#")):
                continue
            if raw_url.startswith("https://www.hightouch.com") or "linkedin.com" in raw_url or "instagram.com" in raw_url or "github.com" in raw_url:
                continue

            url = raw_url.replace("&amp;", "&")
            absolute = urljoin(BASE_URL + page, url)

            if absolute in checked:
                continue
            checked.add(absolute)

            if absolute.startswith("https://www.itsjay.us/"):
                status = fetch_status(absolute)
                if status != 200:
                    failures.append(f"{page}: remote asset {absolute} returned {status}")
            elif absolute.startswith(BASE_URL):
                if re.search(r"\.(css|js|png|jpg|jpeg|svg|ico|mp4|mov|woff2|ttf)(?:$|[?])", absolute):
                    status = fetch_status(absolute)
                    if status != 200:
                        failures.append(f"{page}: local asset {absolute} returned {status}")

    if failures:
        print("\n".join(failures))
        return 1

    print("clone checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
