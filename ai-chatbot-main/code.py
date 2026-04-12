import nltk
import random
import string
from nltk.corpus import wordnet
from nltk.chat.util import Chat, reflections

# Download required packages
nltk.download('punkt')
nltk.download('wordnet')

# Sample conversation pairs (can be extended)
pairs = [
    [
        r"hi|hello|hey",
        ["Hello!", "Hi there!", "Hey! How can I help you?"]
    ],
    [
        r"what is your name ?",
        ["I'm a chatbot created by Aaryan.", "You can call me AI Bot."]
    ],
    [
        r"how are you ?",
        ["I'm doing good, how about you?", "I'm great!"]
    ],
    [
        r"sorry (.*)",
        ["No problem", "Don't worry about it"]
    ],
    [
        r"quit|bye",
        ["Bye! Take care.", "Goodbye!"]
    ],
]

# Create chatbot instance
chatbot = Chat(pairs, reflections)

def get_response(user_input):
    return chatbot.respond(user_input.lower())
