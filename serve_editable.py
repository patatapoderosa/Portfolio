#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8001), SimpleHTTPRequestHandler)
    print("Serving editable site on http://127.0.0.1:8001/editable-site/index.html")
    try:
      server.serve_forever()
    except KeyboardInterrupt:
      pass
    finally:
      server.server_close()


if __name__ == "__main__":
    main()
