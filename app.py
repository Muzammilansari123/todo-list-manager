from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory list of to-do items
items = []


@app.route("/items", methods=["GET"])
def get_items():
    return jsonify(items), 200


@app.route("/items", methods=["POST"])
def add_item():
    data = request.get_json()

    if not data or "task" not in data:
        return jsonify({"error": "task is required"}), 400

    item = {
        "task": data["task"]
    }

    items.append(item)

    return jsonify(item), 201


@app.route("/health", methods=["GET"])
def health():
    return "OK", 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)