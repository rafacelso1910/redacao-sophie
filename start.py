import os
import sys
import re
import time
import subprocess
import threading
import webbrowser
import uvicorn

sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)
sys.stderr.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

LOCAL_PORT = 8000
CLOUDFLARED_BIN = os.path.join(os.path.dirname(__file__), "cloudflared.exe")
LINK_FILE = os.path.join(os.path.dirname(__file__), "LINK_PUBLICO_PARA_CELULAR.txt")

tunnel_process = None
public_url_event = threading.Event()
latest_public_url = None

def tunnel_worker():
    global tunnel_process, latest_public_url
    if not os.path.exists(CLOUDFLARED_BIN):
        print(f"Aviso: {CLOUDFLARED_BIN} não encontrado.")
        return

    log_path = os.path.join(os.path.dirname(__file__), "cloudflared.log")

    while True:
        try:
            tunnel_process = subprocess.Popen(
                [CLOUDFLARED_BIN, "tunnel", "--url", f"http://127.0.0.1:{LOCAL_PORT}"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )

            with open(log_path, "a", encoding="utf-8", errors="replace") as log_f:
                for line in iter(tunnel_process.stdout.readline, ''):
                    if not line:
                        break
                    log_f.write(line)
                    log_f.flush()
                    match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
                    if match:
                        url = match.group(0)
                        latest_public_url = url
                        with open(LINK_FILE, "w", encoding="utf-8") as f:
                            f.write(f"LINK ONLINE PARA O CELULAR (SOPHIE):\n{url}\n\nAbra este link no celular pelo 4G/Wi-Fi para usar a plataforma de qualquer lugar!\n")
                        public_url_event.set()
                        print(f"\nTUNNEL CLOUDFLARE CONECTADO: {url}\n")
        except Exception as e:
            print(f"Aviso no tunnel: {e}")

        time.sleep(3)

def start_tunnel():
    t = threading.Thread(target=tunnel_worker, daemon=True)
    t.start()
    public_url_event.wait(timeout=20)
    return latest_public_url

def open_browser():
    time.sleep(1.5)
    webbrowser.open(f"http://localhost:{LOCAL_PORT}")

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("   PLATAFORMA DE REDAÇÃO ENEM • SOPHIE")
    print("=" * 70)
    print("\nIniciando servidor local e gerando link público seguro para celular...\n")

    public_url = start_tunnel()

    print("-" * 70)
    print("ACESSO LOCAL (Computador):")
    print(f"   -> http://localhost:{LOCAL_PORT}")
    print("\nACESSO ONLINE (Para o Celular - 4G ou Wi-Fi):")
    if public_url:
        print(f"   -> {public_url}")
        print(f"\n   (O link também foi salvo em: LINK_PUBLICO_PARA_CELULAR.txt)")
    else:
        print(f"   (Tunnel não disponível no momento. Use http://localhost:{LOCAL_PORT})")
    print("-" * 70 + "\n")

    threading.Thread(target=open_browser, daemon=True).start()

    try:
        uvicorn.run("app.main:app", host="0.0.0.0", port=LOCAL_PORT, reload=False)
    finally:
        if tunnel_process:
            tunnel_process.terminate()
