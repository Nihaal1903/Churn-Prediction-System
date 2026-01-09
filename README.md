# Churn-Prediction-System
📊 Customer Churn Prediction Dashboard

A full-stack machine learning web application that predicts customer churn using a trained classification model and provides real-time analytics, historical trends, and batch predictions via CSV upload through an interactive dashboard.

🚀 Overview

Customer churn is one of the biggest challenges for subscription-based businesses.
This application helps organizations identify customers at risk of leaving by:

Predicting churn probability for individual customers

Tracking historical churn trends

Visualizing risk distribution across customers

Performing batch churn analysis using CSV uploads

The system combines Machine Learning, FastAPI, React, and data visualization to deliver an end-to-end analytics solution.

🧠 Key Features
🔹 Single Customer Prediction

Input customer attributes via an intuitive form

Predicts churn probability in real time

Classifies customers as High Risk or Low Risk

🔹 Batch Prediction (CSV Upload)

Upload a CSV file containing multiple customer records

Automatically validates schema and encodes features

Generates churn predictions for all rows

Displays aggregate insights:

Total customers processed

Average churn probability

High-risk vs low-risk counts

🔹 Interactive Analytics Dashboard

Prediction History (Line Chart)
Tracks churn probability trends over time

Risk Distribution (Pie Chart)
Visualizes proportion of high-risk and low-risk customers

Animated KPI Cards
Highlight key metrics with smooth transitions

🔹 Persistent Storage

All predictions are stored in a database

Enables historical trend analysis and visual reporting

🏗️ Tech Stack
Frontend

React (Vite)

Recharts (data visualization)

Axios

Modern CSS (animations & responsive design)

Backend

FastAPI

Scikit-learn (ML inference)

SQLAlchemy

SQLite (easily extensible to PostgreSQL)

Pandas (CSV processing)

Machine Learning

Pre-trained churn prediction model

Label encoders for categorical features

Probability-based churn classification
