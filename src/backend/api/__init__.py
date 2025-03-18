from flask import Flask
from flask_cors import CORS

# Inicializa o app Flask
app = Flask(__name__)

# Permite requisições de qualquer origem (útil para comunicação com React Native)
CORS(app)

# Importa as rotas do checklist
from api.checklist import get_checklist
