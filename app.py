from flask import Flask, request, jsonify, render_template
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)

# Enable Prometheus metrics
metrics = PrometheusMetrics(app)

# In-memory list of to-do items
items = [
    {
        "id": 1,
        "task": "Complete DevOps project",
        "completed": False
    },
    {
        "id": 2,
        "task": "Test Prometheus",
        "completed": False
    },
    {
        "id": 3,
        "task": "Create Grafana panel",
        "completed": False
    }
]

next_id = 4


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Get all tasks
@app.route("/items", methods=["GET"])
def get_items():
    return jsonify(items), 200


# Add a new task
@app.route("/items", methods=["POST"])
def add_item():
    global next_id

    data = request.get_json()

    if not data or "task" not in data:
        return jsonify({"error": "task is required"}), 400

    task = data["task"].strip()

    if not task:
        return jsonify({"error": "task cannot be empty"}), 400

    item = {
        "id": next_id,
        "task": task,
        "completed": False
    }

    items.append(item)
    next_id += 1

    return jsonify(item), 201


# Mark task as completed
@app.route("/items/<int:item_id>", methods=["PUT"])
def complete_item(item_id):

    for item in items:
        if item["id"] == item_id:

            item["completed"] = True

            return jsonify(item), 200

    return jsonify({"error": "item not found"}), 404


# Health check
@app.route("/health", methods=["GET"])
def health():
    return "OK", 200


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )