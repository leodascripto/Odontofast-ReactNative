import random
from flask import jsonify
from api import app

# Lista de 10 itens possíveis para o checklist
CHECKLIST_ITENS = [
    "Escovou os dentes",
    "Escove no mínimo 3 vezes ao dia",
    "Passou fio dental",
    "Usou enxaguante bucal",
    "Visitou o dentista nos últimos 6 meses",
    "Evitou doces em excesso",
    "Bebeu bastante água",
    "Usou creme dental com flúor",
    "Limpou a língua corretamente",
    "Evitou cigarro e bebidas alcoólicas"
]

@app.route('/checklist', methods=['GET'])
def get_checklist():
    # Escolhe 4 itens aleatórios da lista
    selected_items = random.sample(CHECKLIST_ITENS, 4)
    return jsonify(selected_items)
