 "This project is a fork of [Kethan Reddy Yanamala's original work](https://github.com/kethanreddyyanamala/DEEP-LEARNING-MODELS-FOR-ENHANCED-THYROID-DISEASE-DETECTION )." This ensures proper attribution.
 
 # Thyroid Nodule Detection & Symptom Checker

This repository contains a comprehensive system for thyroid nodule detection and symptom analysis, developed as a two-part project:

1. **Medical Imaging Pipeline (AI/ML)**: An automated two-step verification pipeline for detecting and classifying thyroid nodules from ultrasound images.
2. **Thyroid Symptom Checker (Web App)**: An interactive tool to assess the severity of thyroid-related symptoms and provide tailored recommendations.

---

## 1. Thyroid Nodule Detection & Classification

The machine learning component leverages the **TN5000 dataset**, consisting of 5,000 thyroid ultrasound images (3,572 malignant, 1,428 benign). 

### Key Features
* **Two-Step Pipeline**: 
  1. **YOLOv8** is utilized for highly accurate nodule detection and bounding box extraction.
  2. **XGBoost** serves as a secondary classification model (Benign vs. Malignant) to verify and correct YOLOv8's initial predictions.
* **Data Handling**: Custom parser for PASCAL VOC XML annotations to extract image features and bounding boxes.
* **Evaluation**: Detailed performance metrics (Accuracy, Precision, Recall, F1-Score) demonstrating how the YOLO+XGBoost two-step approach outperforms YOLO alone in handling class imbalances (Malignant >> Benign).
* **Interactive Visualization**: Side-by-side comparisons of raw AI detections versus final XGBoost-verified classifications.

### Technical Stack
* `ultralytics` (YOLOv8)
* `xgboost` & `scikit-learn`
* `opencv-python`, `numpy`, `pandas`
* `matplotlib`, `seaborn`

*Note: The TN5000 dataset and model weights (`.pt` files) are excluded from this repository due to size constraints. The Jupyter Notebook (`thyroid_nodule_detection.ipynb`) contains the complete pipeline logic.*

---

## 2. Thyroid Symptom Checker (Web Application)

A patient-facing web application that classifies thyroid condition severity based on self-reported symptoms. 

### Key Features
* **Symptom Scoring System**: Analyzes 11 common thyroid symptoms (e.g., fatigue, weight changes, goiter, heart rate abnormalities) using a weighted algorithm.
* **Severity Classification**: Categorizes user conditions into **Mild, Moderate, or Severe** factoring in symptom duration and specific food cravings (e.g., iodine-rich foods, sugars).
* **Actionable Recommendations**: Generates personalized insights including:
  * Tailored diet plans (Breakfast, Lunch, Dinner, Snacks)
  * Exercise suggestions (with micro-animations/images)
  * Specific medical precautions based on the calculated severity.
* **Ultrasound Simulation UI**: A conceptual interface demonstrating how patients might upload their ultrasound images for initial AI screening.

### Technical Stack
* Pure **HTML5**, Vanilla **CSS3**, and Vanilla **JavaScript**.
* No external frameworks required.
* Fully responsive design with modern glassmorphic elements and clear visual hierarchy.

### How to Run Locally
1. Navigate to the `symptom_checker` directory.
2. Start a local Python HTTP server:
   ```bash
   python -m http.server 8080
   ```
3. Open a web browser and visit: `http://localhost:8080/login.html`
4. Enter any patient name and password to access the portal.

---

## Disclaimer
*The Symptom Checker and AI detections provided in this project are for educational and structural demonstration purposes only. They are not a substitute for professional medical diagnosis, advice, or treatment.*
