import sys
import traceback
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from string import punctuation
from collections import Counter
from transformers import BartForConditionalGeneration, BartTokenizer

def ensure_nltk_data():
    try:
        nltk.data.find('tokenizers/punkt')
        nltk.data.find('corpora/stopwords')
    except LookupError:
        print("Downloading required NLTK data...", file=sys.stderr)
        nltk.download('punkt')
        nltk.download('stopwords')

def extractive_summarize(text, summary_length=5):
    sentences = sent_tokenize(text)
    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english') + list(punctuation))
    words = [word for word in words if word not in stop_words]
    word_frequencies = Counter(words)
    max_freq = max(word_frequencies.values())
    for word in word_frequencies:
        word_frequencies[word] /= max_freq
    sentence_scores = {}
    for sent in sentences:
        for word in word_tokenize(sent.lower()):
            if word in word_frequencies:
                sentence_scores[sent] = sentence_scores.get(sent, 0) + word_frequencies[word]
    summarized_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:summary_length]
    summary = " ".join(summarized_sentences)
    return summary

def abstractive_summarize(text, max_length=150, min_length=50):
    inputs = bart_tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = bart_model.generate(inputs, max_length=max_length, min_length=min_length, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

def summarize_text(text, summary_length=5, use_abstractive=True):
    extractive_summary = extractive_summarize(text, summary_length)
    if use_abstractive:
        final_summary = abstractive_summarize(extractive_summary)
    else:
        final_summary = extractive_summary
    return final_summary

if __name__ == "__main__":
    try:
        ensure_nltk_data()
        
        print("Loading BART model...", file=sys.stderr)
        bart_model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')
        bart_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
        print("BART model loaded successfully.", file=sys.stderr)

        if len(sys.argv) < 2:
            print("Please provide the text to summarize as a command line argument.", file=sys.stderr)
            sys.exit(1)
        
        text = sys.argv[1]
        '''print(f"Received text (first 100 chars): {text[:100]}...", file=sys.stderr)'''
        print("this is the summary")
        summary = summarize_text(text, use_abstractive=True)
        print(summary)
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        sys.exit(1)

