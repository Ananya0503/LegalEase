class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        if (openButton) {
            openButton.addEventListener('click', () => this.toggleState(chatBox));
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        }

        const node = chatBox ? chatBox.querySelector('input') : null;
        if (node) {
            node.addEventListener('keyup', ({ key }) => {
                if (key === 'Enter') {
                    this.onSendButton(chatBox);
                }
            });
        }
    }

    toggleState(chatBox) {
        this.state = !this.state;

        // show or hide the box
        if (this.state) {
            chatBox.classList.add('chatbox--active');
        } else {
            chatBox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatBox) {
        const textField = chatBox.querySelector('input');
        const text1 = textField.value.trim();
        if (text1 === '') {
            return;
        }

        const msg1 = { name: 'User', message: text1 };
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            const msg2 = { name: 'NTPC Helpdesk', message: data.answer };
            this.messages.push(msg2);
            this.updateChatText(chatBox);
            textField.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            this.updateChatText(chatBox);
            textField.value = '';
            // Optional: Display an error message to the user
            const errorMsg = { name: 'NTPC Helpdesk', message: 'Unable to connect to server. Please try again later.' };
            this.messages.push(errorMsg);
        });
    }

    updateChatText(chatBox) {
        let html = '';
        this.messages.slice().reverse().forEach(function (item) {
            if (item.name === 'NTPC Helpdesk') {
                html += `<div class="messages__item messages__item--visitor">${item.message}</div>`;
            } else {
                html += `<div class="messages__item messages__item--operator">${item.message}</div>`;
            }
        });

        const chatMessage = chatBox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
