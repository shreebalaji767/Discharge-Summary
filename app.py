from os import environ

from flask import Flask, render_template

app = Flask(__name__)

# BLSSNVJ21 Discharge Summary
# Browser-only application: no database, no server-side patient storage,
# and no clinical-data API endpoints.


@app.after_request
def add_security_headers(response):
    response.headers["Cache-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "base-uri 'self'; "
        "form-action 'self'; "
        "frame-ancestors 'none'; "
        "object-src 'none'; "
        "script-src 'self'; "
        "style-src 'self'; "
        "img-src 'self' data:; "
        "font-src 'self'; "
        "manifest-src 'self'; "
        "worker-src 'self'; "
        "connect-src 'self';"
    )
    return response


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    host = environ.get("HOST", "127.0.0.1")
    port = int(environ.get("PORT", "5000"))
    app.run(host=host, port=port, debug=False)
