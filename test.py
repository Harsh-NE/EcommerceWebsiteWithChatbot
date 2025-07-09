from transformers import pipeline

intent_pipeline = pipeline("text-classification", model="distilbert-intent", tokenizer="distilbert-intent")

result = intent_pipeline("Hello")
predicted_intent = result[0]['label']
print(predicted_intent)
