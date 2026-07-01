# E-Commerce Fake Review Spotter

An AI-powered web application for detecting fake e-commerce reviews using both traditional machine learning models and a transformer-based NLP model.

The project provides two prediction modes: a fast machine learning mode for quick results, and a deeper DistilBERT-based insight mode that returns a confidence score and an explanation for the prediction.

**Live Demo:** https://x-frs.vercel.app/

---

## Overview

Fake reviews can mislead customers and affect trust in online shopping platforms. This project aims to detect whether an e-commerce review is authentic or computer-generated/fake, while also giving the user a clear explanation of the model’s decision.

The system was designed as a web-based AI tool where users can enter a review and receive:

- A prediction result
- A confidence score
- A short explanation
- A choice between fast and detailed analysis modes

---

## Features

- Fake review detection for e-commerce review text
- Fast mode using traditional machine learning models
- Insight mode using a DistilBERT transformer model
- Confidence score output
- Explainable prediction result
- Web interface for easy user interaction

---

## Model Approaches

### 1. Fast Mode — Traditional Machine Learning

The fast mode uses traditional machine learning models trained on processed review text features.

This mode is designed to provide quick predictions with lower computational cost.

**Approximate performance:** 88% accuracy

### 2. Insight Mode — DistilBERT Transformer

The insight mode uses a transformer-based NLP model for deeper text understanding.

This mode takes more processing time but provides stronger prediction performance and better explanation support.

**Approximate performance:** 95% accuracy

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- CSS

### Machine Learning / NLP
- Python
- Scikit-learn
- Pandas
- NumPy
- Jupyter Notebook
- DistilBERT
- Transformers

---

## Repository Structure

```text
ecommerce-fake-review-spotter/
├── frontend/                  # Web application source files
├── machine-learning/notebooks/ # Traditional ML notebook
├── transformers/              # DistilBERT transformer files and source code
├── data/                      # Dataset notes
├── .gitignore
└── README.md
