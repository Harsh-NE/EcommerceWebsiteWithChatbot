from transformers import pipeline
import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Load zero-shot classifier (or fine-tuned intent classifier)
MODEL_DIR = "chat_api/distilbert-intent"
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline


tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

intent_classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)
INTENT_LABELS = [
    "filter products", "greeting", "goodbye", "help", "show all products"
]

def extract_filters(prompt: str) -> dict:
    prompt = prompt.lower()

    # Extract price_max (e.g., "under 500")
    price_max = None
    under_match = re.search(r'under\s*(\d+)', prompt)
    if under_match:
        price_max = int(under_match.group(1))

    # Extract price_min (e.g., "above 100", "over 300")
    price_min = None
    above_match = re.search(r'(above|over)\s*(\d+)', prompt)
    if above_match:
        price_min = int(above_match.group(2))

    # Known categories
    known_categories = [
        "men's clothing", "jewelery", "electronics", "women's clothing"
    ]
    category = ""
    description_keywords = [] 

    for cat in known_categories:
        if cat in prompt:
            category = cat

            break

    return {
        "category": category,
        "description_keywords": description_keywords,
        "price_min": price_min,
        "price_max": price_max,
    }


def classify_intent(prompt):
    result = intent_classifier(prompt)
    label = result[0]['label']
    score = result[0]['score']
    return label if score > 0.1 else "unknown"

# This can be expanded into a class or stored in session
chat_memory = {}

def update_context(user_id, message, intent):
    if user_id not in chat_memory:
        chat_memory[user_id] = []
    chat_memory[user_id].append({"message": message, "intent": intent})
    return chat_memory[user_id]

class GenerateResponseAPIView(APIView):
    def post(self, request):
        prompt = request.data.get('prompt', '')
        user_id = request.data.get('user_id', 'default_user')  # for context tracking

        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        intent = classify_intent(prompt)
        memory = update_context(user_id, prompt, intent)

        if intent == "filter products":
            filters = extract_filters(prompt)
            return Response({
                "response": f"Filtering products based on: {prompt}",
                "filter": filters,
                "memory": memory
            })
        elif intent == "show all products":
            return Response({
                "response": "Showing all products.",
                "filter": {}
            })
        elif intent == "greeting":
            return Response({"response": "Hi there! How can I assist you today?"})
        elif intent == "help":
            return Response({"response": "You can ask me to show men's clothing under a price, or show all products."})
        else:
            return Response({"response": "I'm not sure I understand. Can you rephrase?"})
