import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Configuration
LOCAL_DATA = "heart.csv"
UCI_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
MODEL_NAME = "heart_disease_model.pkl"
COLUMNS = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
           'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']

def load_data():
    if os.path.exists(LOCAL_DATA):
        print(f"Loading local dataset from {LOCAL_DATA}...")
        try:
            # Check if file has header by looking at the first row
            first_row = pd.read_csv(LOCAL_DATA, nrows=0)
            if 'age' in first_row.columns:
                df = pd.read_csv(LOCAL_DATA)
            else:
                df = pd.read_csv(LOCAL_DATA, header=None, names=COLUMNS)
            return df
        except Exception as e:
            print(f"Error loading local file: {e}. Falling back to UCI URL.")
    
    print(f"Downloading dataset from UCI repository: {UCI_URL}")
    try:
        return pd.read_csv(UCI_URL, header=None, names=COLUMNS)
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        return None

df = load_data()

if df is not None:
    print("Preprocessing data...")
    # Handle missing values (UCI uses '?', standard csv might use NaN)
    df = df.replace('?', pd.NA)
    df = df.dropna()

    # Convert all columns to numeric, forcing errors to NaN then dropping them
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    df = df.dropna()

    # Binary target: UCI has 0-4, we want 0 (no disease) or 1 (disease present)
    df['target'] = df['target'].apply(lambda x: 0 if x == 0 else 1)

    X = df.drop("target", axis=1)
    y = df["target"]

    print(f"Training split (Total samples: {len(df)})...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    joblib.dump(model, MODEL_NAME)
    print(f"Model successfully trained and saved as '{MODEL_NAME}'!")
else:
    print("Error: Could not obtain dataset. Please ensure heart.csv is present or internet connection is available.")

