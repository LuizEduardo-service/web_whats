import sys
import os
from cx_Freeze import setup,Executable


# O primeiro número indica que o sistema tem mudanças que o torna incompatível com versões anteriores;
# O segundo número indica que o sistema tem mudanças compatíveis com versões anteriores, dentro do primeiro número;
# O terceiro número indica que o sistema tem mudanças menores, como correções de bugs e funcionalidades que não prejudicam a compatibilidade com versões anteriores.
# Opcionalmente, define-se um quarto número, chamado de release. Indica o número atual do build daquele código, dentro de um escopo de modificações.

files = ['node_modules','chatbotPedidos.js', 'databricks.js', 'package-lock.json', 'package.json', 'nodejs']

# dir_image = os.path.join(os.getcwd(), 'src\\views\\image\\')
exe = Executable(script="arquivo.py")

setup(
    name="teste modelo",
    version= '1.0.0',
    description="Sistema responsavel por gerenciar as solicitações de montagem de moveis",
    author="Luiz Eduardo",
    options={'build_exe': {'include_files':files, 
                             'includes':[],
                             'packages': [],
                             }
                             },
    executables=[exe]
)