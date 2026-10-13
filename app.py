import os
import io
import re
import uuid
import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np
import shap

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Wedge
from fpdf import FPDF
from fpdf.enums import XPos, YPos

app = FastAPI(title="CardioAI: Heart Disease Risk Predictor API")

# --- CORS Middleware ---
allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
)
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
if not allowed_origins or "*" in allowed_origins:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model & Explainer Initialization ---
MODEL_PATH = "heart_disease_model.pkl"
FEATURE_COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

FEATURE_METADATA = {
    "age": {"label": "Age", "unit": "years", "range": "18 - 100"},
    "sex": {"label": "Sex", "unit": "", "range": "0 (Female) or 1 (Male)"},
    "cp": {"label": "Chest Pain Type", "unit": "", "range": "0 - 3"},
    "trestbps": {"label": "Resting Blood Pressure", "unit": "mmHg", "range": "80 - 220 mmHg"},
    "chol": {"label": "Serum Cholesterol", "unit": "mg/dl", "range": "100 - 600 mg/dl"},
    "fbs": {"label": "Fasting Blood Sugar > 120", "unit": "", "range": "0 (No) or 1 (Yes)"},
    "restecg": {"label": "Resting ECG", "unit": "", "range": "0 - 2"},
    "thalach": {"label": "Max Heart Rate", "unit": "bpm", "range": "60 - 220 bpm"},
    "exang": {"label": "Exercise-Induced Angina", "unit": "", "range": "0 (No) or 1 (Yes)"},
    "oldpeak": {"label": "ST Depression (Oldpeak)", "unit": "", "range": "0.0 - 7.0"},
    "slope": {"label": "ST Slope", "unit": "", "range": "0 - 2"},
    "ca": {"label": "Major Vessels (Fluoroscopy)", "unit": "", "range": "0 - 4"},
    "thal": {"label": "Thalassemia", "unit": "", "range": "0 - 3"}
}

FIELD_RANGE_MESSAGES = {
    "patient_name": "patient_name must be between 2 and 60 characters",
    "age": "age must be between 18 and 100 years",
    "sex": "sex must be 0 (Female) or 1 (Male)",
    "cp": "cp (chest pain type) must be between 0 and 3",
    "trestbps": "trestbps (resting blood pressure) must be between 80 and 220 mmHg",
    "chol": "chol (serum cholesterol) must be between 100 and 600 mg/dl",
    "fbs": "fbs (fasting blood sugar) must be 0 (No) or 1 (Yes)",
    "restecg": "restecg (resting ECG) must be between 0 and 2",
    "thalach": "thalach (maximum heart rate) must be between 60 and 220 bpm",
    "exang": "exang (exercise angina) must be 0 (No) or 1 (Yes)",
    "oldpeak": "oldpeak (ST depression) must be between 0.0 and 7.0",
    "slope": "slope of peak ST segment must be between 0 and 2",
    "ca": "ca (number of major vessels) must be between 0 and 4",
    "thal": "thal (thalassemia) must be between 0 and 3"
}

try:
    model = joblib.load(MODEL_PATH)
    explainer = shap.TreeExplainer(model)
except Exception as e:
    print(f"Warning: Could not load model or explainer: {e}")
    model = None
    explainer = None


# --- Custom 422 Validation Error Handler ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_messages = []
    for error in exc.errors():
        loc = error.get("loc", [])
        field_name = loc[-1] if loc else "field"
        if field_name in FIELD_RANGE_MESSAGES:
            error_messages.append(FIELD_RANGE_MESSAGES[field_name])
        else:
            error_messages.append(f"{field_name}: {error.get('msg', 'invalid value')}")
    combined_detail = "; ".join(error_messages)
    return JSONResponse(
        status_code=422,
        content={"detail": combined_detail, "errors": exc.errors()}
    )


# --- Schemas ---
class PatientData(BaseModel):
    patient_name: Optional[str] = Field(default="Patient", min_length=2, max_length=60)
    age: float = Field(..., ge=18, le=100)
    sex: float = Field(..., ge=0, le=1)
    cp: float = Field(..., ge=0, le=3)
    trestbps: float = Field(..., ge=80, le=220)
    chol: float = Field(..., ge=100, le=600)
    fbs: float = Field(..., ge=0, le=1)
    restecg: float = Field(..., ge=0, le=2)
    thalach: float = Field(..., ge=60, le=220)
    exang: float = Field(..., ge=0, le=1)
    oldpeak: float = Field(..., ge=0.0, le=7.0)
    slope: float = Field(..., ge=0, le=2)
    ca: float = Field(..., ge=0, le=4)
    thal: float = Field(..., ge=0, le=3)


class FeatureContribution(BaseModel):
    feature: str
    label: str
    value: float
    impact: float


class ReportData(BaseModel):
    patient_name: Optional[str] = "Patient"
    patient: PatientData
    probability: float
    risk_level: str
    contributions: Optional[List[FeatureContribution]] = None


# --- Helper Functions ---
def sanitize_text(text: str) -> str:
    """Sanitize strings for fpdf2 to prevent character encode crashes."""
    if not text:
        return ""
    replacements = {
        "—": "-", "–": "-", "“": '"', "”": '"', "‘": "'", "’": "'",
        "•": "*", "≥": ">=", "≤": "<=", "°": " deg", "±": "+/-",
        "…": "...", "→": "->", "←": "<-"
    }
    for orig, repl in replacements.items():
        text = text.replace(orig, repl)
    # Encode to latin-1 with replacement fallback
    return text.encode("latin-1", "replace").decode("latin-1")


def get_human_readable_labels(patient: PatientData):
    """Convert raw medical codes to clinical text descriptions."""
    sex_text = "Male" if patient.sex == 1 else "Female"
    
    cp_map = {
        0: "Typical Angina (0)",
        1: "Atypical Angina (1)",
        2: "Non-anginal Pain (2)",
        3: "Asymptomatic (3)"
    }
    cp_text = cp_map.get(int(patient.cp), f"Type {int(patient.cp)}")
    
    fbs_text = "Elevated (> 120 mg/dl)" if patient.fbs == 1 else "Normal (<= 120 mg/dl)"
    
    restecg_map = {
        0: "Normal (0)",
        1: "ST-T Wave Abnormality (1)",
        2: "Left Ventricular Hypertrophy (2)"
    }
    restecg_text = restecg_map.get(int(patient.restecg), f"State {int(patient.restecg)}")
    
    exang_text = "Yes (Induced)" if patient.exang == 1 else "No (None)"
    
    slope_map = {
        0: "Upsloping (0)",
        1: "Flat (1)",
        2: "Downsloping (2)"
    }
    slope_text = slope_map.get(int(patient.slope), f"Slope {int(patient.slope)}")
    
    ca_text = f"{int(patient.ca)} major vessel(s)"
    
    thal_map = {
        0: "Normal / Null (0)",
        1: "Fixed Defect (1)",
        2: "Normal Blood Flow (2)",
        3: "Reversible Defect (3)"
    }
    thal_text = thal_map.get(int(patient.thal), f"State {int(patient.thal)}")
    
    return [
        ("Age", f"{int(patient.age)} years"),
        ("Sex", sex_text),
        ("Chest Pain Type", cp_text),
        ("Resting Blood Pressure", f"{int(patient.trestbps)} mmHg"),
        ("Serum Cholesterol", f"{int(patient.chol)} mg/dl"),
        ("Fasting Blood Sugar", fbs_text),
        ("Resting ECG", restecg_text),
        ("Max Heart Rate Achieved", f"{int(patient.thalach)} bpm"),
        ("Exercise Induced Angina", exang_text),
        ("ST Depression (Oldpeak)", f"{patient.oldpeak:.1f}"),
        ("Peak ST Slope", slope_text),
        ("Major Vessels (Fluoroscopy)", ca_text),
        ("Thalassemia Scan", thal_text),
    ]


def generate_gauge_chart(probability: float) -> io.BytesIO:
    """Generate high-DPI semicircular gauge meter image."""
    fig, ax = plt.subplots(figsize=(4.2, 2.6), subplot_kw={"aspect": "equal"})
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FFFFFF")

    # Semicircular zones from 180 to 0 degrees:
    # Low risk (0.0 to 0.3): 180 to 126 deg
    # Moderate risk (0.3 to 0.7): 126 to 54 deg
    # High risk (0.7 to 1.0): 54 to 0 deg
    w_low = Wedge((0, 0), 1.0, 126, 180, width=0.38, facecolor="#059669", edgecolor="white", linewidth=1.5)
    w_mod = Wedge((0, 0), 1.0, 54, 126, width=0.38, facecolor="#D97706", edgecolor="white", linewidth=1.5)
    w_high = Wedge((0, 0), 1.0, 0, 54, width=0.38, facecolor="#BC0202", edgecolor="white", linewidth=1.5)
    
    ax.add_patch(w_low)
    ax.add_patch(w_mod)
    ax.add_patch(w_high)

    # Angle for needle (180 deg at 0 prob, 0 deg at 1.0 prob)
    p_clamped = max(0.0, min(1.0, probability))
    angle_deg = 180.0 - (p_clamped * 180.0)
    angle_rad = np.radians(angle_deg)
    
    # Needle line
    needle_len = 0.82
    nx = needle_len * np.cos(angle_rad)
    ny = needle_len * np.sin(angle_rad)
    ax.plot([0, nx], [0, ny], color="#830000", lw=3.5, solid_capstyle="round", zorder=5)
    
    # Pivot circle
    pivot = plt.Circle((0, 0), 0.12, facecolor="#830000", edgecolor="white", linewidth=2, zorder=6)
    ax.add_patch(pivot)

    # Center text
    pct_text = f"{p_clamped * 100:.1f}%"
    ax.text(0, -0.06, pct_text, ha="center", va="center", fontsize=15, fontweight="bold", color="#830000")
    
    # Zone Labels
    ax.text(-0.85, 0.25, "LOW", ha="center", va="center", fontsize=8, fontweight="bold", color="#059669")
    ax.text(0, 0.88, "MODERATE", ha="center", va="center", fontsize=8, fontweight="bold", color="#D97706")
    ax.text(0.85, 0.25, "HIGH", ha="center", va="center", fontsize=8, fontweight="bold", color="#BC0202")

    ax.set_xlim(-1.15, 1.15)
    ax.set_ylim(-0.25, 1.15)
    ax.axis("off")

    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=200, bbox_inches="tight", facecolor=fig.get_facecolor(), transparent=False)
    plt.close(fig)
    buf.seek(0)
    return buf


def generate_contributions_chart(contributions: List[FeatureContribution]) -> io.BytesIO:
    """Generate high-DPI horizontal bar chart for feature contributions."""
    fig, ax = plt.subplots(figsize=(5.5, 3.2))
    fig.patch.set_facecolor("#FFFFFF")
    ax.set_facecolor("#FAFAFA")

    # Take top 8 or all contributions (reverse order for top-to-bottom bar chart)
    items = list(reversed(contributions[:8]))
    labels = [item.label for item in items]
    impacts = [item.impact for item in items]
    
    # Color: red (#BC0202) for positive, teal (#0D9488) for negative
    colors = ["#BC0202" if imp >= 0 else "#0D9488" for imp in impacts]

    y_pos = np.arange(len(labels))
    bars = ax.barh(y_pos, impacts, color=colors, height=0.6, edgecolor="none", zorder=3)
    
    ax.axvline(0, color="#830000", lw=1.2, linestyle="--", alpha=0.7, zorder=4)
    ax.set_yticks(y_pos)
    ax.set_yticklabels(labels, fontsize=8.5, fontweight="semibold", color="#2D0A0A")
    ax.tick_params(axis="x", labelsize=8, colors="#4B5563")
    
    ax.grid(axis="x", linestyle=":", alpha=0.5, color="#D1D5DB", zorder=0)
    ax.set_xlabel("SHAP Contribution to Heart Disease Risk", fontsize=8, color="#4B5563")
    
    # Custom legend
    from matplotlib.lines import Line2D
    legend_elements = [
        Line2D([0], [0], color="#BC0202", lw=6, label="Increases Risk"),
        Line2D([0], [0], color="#0D9488", lw=6, label="Reduces Risk")
    ]
    ax.legend(handles=legend_elements, loc="lower right", fontsize=7.5, frameon=True, facecolor="white", edgecolor="#E5E7EB")

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#E5E7EB")
    ax.spines["bottom"].set_color("#E5E7EB")

    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=200, bbox_inches="tight", facecolor=fig.get_facecolor(), transparent=False)
    plt.close(fig)
    buf.seek(0)
    return buf


def generate_personalized_recommendations(patient: PatientData, risk_level: str) -> List[str]:
    """Generate medical recommendations grounded in the patient's individual markers."""
    recs = []
    
    # Risk-level baseline advice
    if risk_level == "High":
        recs.append("CRITICAL: Consult a cardiologist promptly for diagnostic coronary evaluation and stress testing.")
    elif risk_level == "Moderate":
        recs.append("PRIORITY: Schedule a comprehensive cardiovascular screening with your primary care provider.")
    else:
        recs.append("MAINTAIN: Continue routine preventative cardiovascular health checkups annually.")

    # Marker-specific clinical insights
    if patient.chol >= 240:
        recs.append(f"High Cholesterol Alert ({int(patient.chol)} mg/dl): Exceeds recommended 200 mg/dl threshold. Evaluate lipid profile and adopt a low saturated fat, Mediterranean diet.")
    elif patient.chol >= 200:
        recs.append(f"Borderline Cholesterol ({int(patient.chol)} mg/dl): Incorporate soluble fiber and Omega-3 fatty acids to manage cholesterol levels.")

    if patient.trestbps >= 140:
        recs.append(f"Hypertension Flag ({int(patient.trestbps)} mmHg): Resting systolic pressure indicates Stage 2 hypertension. Daily blood pressure logging and sodium reduction (< 2,000 mg/day) strongly advised.")
    elif patient.trestbps >= 130:
        recs.append(f"Pre-hypertensive State ({int(patient.trestbps)} mmHg): Monitor resting blood pressure twice weekly.")

    if patient.exang == 1:
        recs.append("Exercise Angina Detected: Patient reports exercise-induced chest pain. Avoid unmonitored strenuous aerobic exertion until cardiology clearance.")

    if patient.oldpeak >= 2.0:
        recs.append(f"Marked ST Depression ({patient.oldpeak:.1f}): Electrocardiographic ST depression during stress suggests significant myocardial ischemia.")
    
    if patient.thalach <= 100 and patient.age <= 60:
        recs.append(f"Sub-optimal Peak Heart Rate ({int(patient.thalach)} bpm): Max rate under expected chronotropic response. Discuss exercise capacity with a physician.")

    if patient.fbs == 1:
        recs.append("Elevated Fasting Glucose (> 120 mg/dl): Potential glycemic dysregulation. Check HbA1c to screen for insulin resistance, which accelerates arterial plaque.")

    if patient.ca > 0:
        recs.append(f"Coronary Calcification Marker: {int(patient.ca)} major vessel(s) detected with fluoroscopy calcification, an established marker for coronary artery disease.")

    # Always ensure at least 3-4 recommendations
    if len(recs) < 3:
        recs.append("Exercise Guideline: Maintain at least 150 minutes of moderate aerobic activity weekly.")
        recs.append("Lifestyle Hygiene: Ensure 7-8 hours of quality sleep, active stress reduction, and smoke-free habits.")

    return recs


# --- Endpoints ---
@app.post("/predict")
def predict(data: PatientData):
    if model is None or explainer is None:
        raise HTTPException(
            status_code=500,
            detail="Model or SHAP explainer is not initialized. Please ensure heart_disease_model.pkl is present."
        )

    # Build input DataFrame adhering to the strict 13 features
    feature_dict = {
        "age": data.age,
        "sex": data.sex,
        "cp": data.cp,
        "trestbps": data.trestbps,
        "chol": data.chol,
        "fbs": data.fbs,
        "restecg": data.restecg,
        "thalach": data.thalach,
        "exang": data.exang,
        "oldpeak": data.oldpeak,
        "slope": data.slope,
        "ca": data.ca,
        "thal": data.thal
    }
    input_df = pd.DataFrame([feature_dict])

    try:
        # Prediction
        proba = model.predict_proba(input_df)[0]
        risk_score = float(proba[1])  # Class 1: disease present

        if risk_score > 0.7:
            risk_level = "High"
        elif risk_score < 0.3:
            risk_level = "Low"
        else:
            risk_level = "Moderate"

        # SHAP calculation
        raw_shap = explainer.shap_values(input_df)
        if isinstance(raw_shap, list):
            sample_shap = raw_shap[1][0]
        elif hasattr(raw_shap, "ndim") and raw_shap.ndim == 3:
            sample_shap = raw_shap[0, :, 1]
        elif hasattr(raw_shap, "ndim") and raw_shap.ndim == 2:
            sample_shap = raw_shap[0]
        else:
            sample_shap = raw_shap[0]

        contributions = []
        for idx, col in enumerate(FEATURE_COLUMNS):
            val = float(feature_dict[col])
            impact = float(sample_shap[idx])
            contributions.append({
                "feature": col,
                "label": FEATURE_METADATA[col]["label"],
                "value": val,
                "impact": round(impact, 4)
            })

        # Sort all 13 features by absolute impact descending
        contributions.sort(key=lambda x: abs(x["impact"]), reverse=True)

        return {
            "probability": round(risk_score, 4),
            "risk_level": risk_level,
            "contributions": contributions
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/generate-report")
def generate_report(data: ReportData):
    try:
        # Resolve patient name and contributions
        patient_name = data.patient_name or data.patient.patient_name or "Patient"
        patient = data.patient
        probability = data.probability
        risk_level = data.risk_level

        # If contributions were not provided by frontend, calculate them now
        contributions = data.contributions
        if not contributions and explainer is not None and model is not None:
            f_dict = {col: getattr(patient, col) for col in FEATURE_COLUMNS}
            idf = pd.DataFrame([f_dict])
            raw_shap = explainer.shap_values(idf)
            if isinstance(raw_shap, list):
                s_shap = raw_shap[1][0]
            elif hasattr(raw_shap, "ndim") and raw_shap.ndim == 3:
                s_shap = raw_shap[0, :, 1]
            else:
                s_shap = raw_shap[0]
            
            contributions = []
            for idx, col in enumerate(FEATURE_COLUMNS):
                contributions.append(FeatureContribution(
                    feature=col,
                    label=FEATURE_METADATA[col]["label"],
                    value=float(f_dict[col]),
                    impact=round(float(s_shap[idx]), 4)
                ))
            contributions.sort(key=lambda x: abs(x.impact), reverse=True)

        # Generate plots
        gauge_buf = generate_gauge_chart(probability)
        chart_buf = generate_contributions_chart(contributions or [])

        # PDF Setup
        pdf = FPDF(orientation="P", unit="mm", format="A4")
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        
        # Color definitions: Maroon #830000 (131, 0, 0), Crimson #BC0202 (188, 2, 2)
        MAROON = (131, 0, 0)
        CRIMSON = (188, 2, 2)
        SLATE_900 = (30, 41, 59)
        SLATE_600 = (71, 85, 105)
        SLATE_100 = (241, 245, 249)

        report_id = f"CAI-{datetime.datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        report_date = datetime.datetime.now().strftime("%B %d, %Y - %H:%M UTC")

        # 1. Header
        pdf.set_fill_color(131, 0, 0)
        pdf.rect(0, 0, 210, 8, "F")  # Top accent bar

        pdf.set_y(12)
        pdf.set_font("Helvetica", "B", 22)
        pdf.set_text_color(*MAROON)
        pdf.cell(100, 10, "CardioAI Diagnostics", new_x=XPos.RIGHT, new_y=YPos.TOP)

        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*SLATE_600)
        pdf.cell(90, 5, sanitize_text(f"Report ID: {report_id}"), align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(190, 5, sanitize_text(f"Date: {report_date}"), align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        pdf.set_font("Helvetica", "I", 11)
        pdf.set_text_color(*CRIMSON)
        pdf.cell(0, 7, "Clinical Cardiovascular Risk Assessment", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(3)

        # 2. Patient Demographics & Feature Table
        pdf.set_fill_color(*SLATE_100)
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(*MAROON)
        pdf.cell(0, 8, sanitize_text(f" Patient Name: {patient_name}"), fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(2)

        # Two-column table of 13 features with human-readable labels
        table_rows = get_human_readable_labels(patient)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*SLATE_900)
        
        col_w = 95
        # Print 2 per row
        for i in range(0, len(table_rows), 2):
            label1, val1 = table_rows[i]
            t1 = f"{label1}: {val1}"
            pdf.cell(col_w, 6, sanitize_text(f"  * {t1}"), border="B", new_x=XPos.RIGHT, new_y=YPos.TOP)
            
            if i + 1 < len(table_rows):
                label2, val2 = table_rows[i+1]
                t2 = f"{label2}: {val2}"
                pdf.cell(col_w, 6, sanitize_text(f"  * {t2}"), border="B", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            else:
                pdf.ln(6)

        pdf.ln(5)

        # 3. Graphs Section (Gauge & Contributions)
        y_graphs = pdf.get_y()
        # Gauge on left (width ~85mm)
        pdf.image(gauge_buf, x=10, y=y_graphs, w=85)
        # Contributions chart on right (width ~105mm)
        pdf.image(chart_buf, x=98, y=y_graphs, w=102)
        pdf.set_y(y_graphs + 55)

        # 4. Risk Analysis Summary Block
        if risk_level == "High":
            status_color = (188, 2, 2)
        elif risk_level == "Moderate":
            status_color = (217, 119, 6)
        else:
            status_color = (5, 150, 105)

        pdf.set_fill_color(*SLATE_100)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(*MAROON)
        pdf.cell(0, 8, " AI RISK ASSESSMENT SUMMARY", fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(2)

        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(*status_color)
        pdf.cell(0, 7, sanitize_text(f"Classification: {risk_level.upper()} RISK  (Probability: {probability * 100:.1f}%)"), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(2)

        # 5. Personalized Recommendations
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(*MAROON)
        pdf.cell(0, 6, "Personalized Clinical Recommendations:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(1)

        recommendations = generate_personalized_recommendations(patient, risk_level)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*SLATE_900)
        for rec in recommendations:
            pdf.multi_cell(0, 5, sanitize_text(f"- {rec}"))
            pdf.ln(1)

        # 6. Disclaimer & Footer
        pdf.set_y(-22)
        pdf.set_font("Helvetica", "I", 7.5)
        pdf.set_text_color(*SLATE_600)
        pdf.multi_cell(
            0, 3.8,
            sanitize_text(
                "DISCLAIMER: CardioAI is an educational screening and risk estimation tool, not a certified clinical diagnosis. "
                "Decisions regarding patient therapy or lifestyle changes must be confirmed by a licensed medical practitioner. "
                f"Page {pdf.page_no()}"
            ),
            align="C"
        )

        pdf_bytes = bytes(pdf.output())
        
        # Clean safe filename
        safe_name = re.sub(r"[^a-zA-Z0-9_\-]", "", patient_name.replace(" ", "_")) or "Patient"
        filename = f"CardioAI_Report_{safe_name}_{risk_level}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        print(f"Error generating PDF: {e}")
        raise HTTPException(status_code=500, detail=f"PDF Generation failed: {str(e)}")


# --- Serve static files from React dist folder (if exists) ---
FRONTEND_DIST = os.path.join("frontend", "dist")

if os.path.isdir(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        if not full_path.startswith("predict") and not full_path.startswith("generate-report"):
            path = os.path.join(FRONTEND_DIST, full_path)
            if os.path.isfile(path) and full_path != "":
                return FileResponse(path)
            return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {
            "message": "CardioAI API is running. Build frontend with 'npm run build' inside frontend directory to serve UI statically."
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
