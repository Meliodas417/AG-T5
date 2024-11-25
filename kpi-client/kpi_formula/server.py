from flask import Flask, send_from_directory
import os
import webbrowser
from threading import Timer

app = Flask(__name__, static_folder='web/ui/build')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

def open_browser():
    webbrowser.open('http://localhost:3000')

def start_server(port=3000):
    Timer(1, open_browser).start()
    app.run(port=port)
