from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')

mail = Mail(app)

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        # Create email message
        msg = Message(
            subject=f"Portfolio Contact: {subject}",
            sender=app.config['MAIL_USERNAME'],
            recipients=[app.config['MAIL_USERNAME']]  # Send to yourself
        )
        msg.body = f"""
        New message from your portfolio website:
        
        From: {name}
        Email: {email}
        Subject: {subject}
        
        Message:
        {message}
        """

        # Send email
        mail.send(msg)

        return jsonify({
            "status": "success",
            "message": "Your message has been sent successfully!"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Failed to send message. Please try again later."
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 