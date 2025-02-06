import subprocess
import os

NODE_PATH = os.path.join(os.path.dirname(__file__), "nodejs", "node.exe")  # Windows
JS_SCRIPT = os.path.join(os.path.dirname(__file__), "chatbotPedidos.js")

def executar_bot():
    try:
        subprocess.run([NODE_PATH , JS_SCRIPT], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar o bot: {e}")

executar_bot()