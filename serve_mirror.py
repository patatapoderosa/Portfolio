#!/usr/bin/env python3
from __future__ import annotations

import argparse
import mimetypes
import posixpath
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qsl, unquote, urlsplit


class MirrorRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str | None = None, **kwargs):
        self.root = Path(directory or ".").resolve()
        super().__init__(*args, directory=str(self.root), **kwargs)

    def translate_path(self, path: str) -> str:
        parts = urlsplit(path)
        candidates = self._candidate_paths(parts.path, parts.query)

        for candidate in candidates:
            full_path = self.root / candidate
            if full_path.exists():
                return str(full_path)

        return str(self.root / self._normalize_path(parts.path))

    def guess_type(self, path: str) -> str:
        if path.endswith(".css") or ".css?" in path:
            return "text/css"
        if path.endswith(".js") or ".js?" in path:
            return "application/javascript"
        return mimetypes.guess_type(path)[0] or "application/octet-stream"

    def _candidate_paths(self, raw_path: str, raw_query: str) -> list[Path]:
        normalized = self._normalize_path(raw_path)
        candidates: list[Path] = []

        if raw_query:
            raw_target = Path(f"{normalized.as_posix()}?{raw_query}")
            candidates.append(raw_target)
            if normalized.suffix in {".css", ".js"}:
                candidates.append(Path(f"{normalized.as_posix()}?{raw_query}{normalized.suffix}"))

            decoded_query = unquote(raw_query)
            if decoded_query != raw_query:
                candidates.append(Path(f"{normalized.as_posix()}?{decoded_query}"))
                if normalized.suffix in {".css", ".js"}:
                    candidates.append(Path(f"{normalized.as_posix()}?{decoded_query}{normalized.suffix}"))

            query_pairs = parse_qsl(raw_query, keep_blank_values=True)
            if query_pairs:
                normalized_pairs = []
                for key, value in query_pairs:
                    if key == "url":
                        normalized_pairs.append((key, unquote(value)))
                    else:
                        normalized_pairs.append((key, value))
                rebuilt = "&".join(f"{key}={value}" for key, value in normalized_pairs)
                candidates.append(Path(f"{normalized.as_posix()}?{rebuilt}"))

        if raw_path.endswith("/"):
            candidates.append(normalized / "index.html")
        elif not normalized.suffix:
            candidates.append(Path(f"{normalized.as_posix()}.html"))
            candidates.append(normalized / "index.html")

        candidates.append(normalized)

        unique: list[Path] = []
        seen: set[str] = set()
        for candidate in candidates:
            key = candidate.as_posix()
            if key not in seen:
                seen.add(key)
                unique.append(candidate)
        return unique

    @staticmethod
    def _normalize_path(raw_path: str) -> Path:
        cleaned = posixpath.normpath(unquote(raw_path))
        if cleaned in ("", "."):
            cleaned = "/"
        cleaned = cleaned.lstrip("/")
        return Path(cleaned)


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve a mirrored website locally.")
    parser.add_argument(
        "--root",
        default="mirror/www.itsjay.us",
        help="Mirror root directory to serve",
    )
    parser.add_argument("--host", default="127.0.0.1", help="Bind host")
    parser.add_argument("--port", type=int, default=8000, help="Bind port")
    args = parser.parse_args()

    server = ThreadingHTTPServer(
        (args.host, args.port),
        lambda *handler_args, **handler_kwargs: MirrorRequestHandler(
            *handler_args, directory=args.root, **handler_kwargs
        ),
    )
    print(f"Serving {Path(args.root).resolve()} on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
