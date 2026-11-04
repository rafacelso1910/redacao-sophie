import os
import json

_themes_file = os.path.join(os.path.dirname(__file__), 'themes.json')
with open(_themes_file, 'r', encoding='utf-8') as f:
    THEMES = json.load(f)
