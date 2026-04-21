from flask import Flask, request, jsonify
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

# Dummy user database
users = {
    "riya": "password123"
}

# Token required decorator (Zero Trust idea)
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Invalid token'}), 401

        return f(*args, **kwargs)

    return decorated

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    auth = request.json

    if users.get(auth['username']) == auth['password']:
        token = jwt.encode({
            'user': auth['username'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({'token': token})

    return jsonify({'message': 'Invalid credentials'}), 401


# Protected endpoint (Zero Trust: always verify)
@app.route('/secure-data', methods=['GET'])
@token_required
def secure_data():
    return jsonify({'data': 'This is protected data in hybrid cloud'})


if __name__ == '__main__':
    app.run(debug=True)