"""Gunicorn configuration for Render and other container/web-service hosts."""

import os

# Render provides PORT at runtime. Binding to 0.0.0.0 is required so the
# platform can detect and route traffic to the web service.
bind = f"0.0.0.0:{os.environ.get('PORT', '5000')}"
workers = int(os.environ.get("WEB_CONCURRENCY", "1"))
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = os.environ.get("GUNICORN_LOG_LEVEL", "info")

# Keep worker startup predictable on small instances.
preload_app = False
