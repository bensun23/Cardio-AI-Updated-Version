import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

SAMPLE_HEALTHY = {
    "patient_name": "Jane Doe",
    "age": 25.0,
    "sex": 0.0,
    "cp": 0.0,
    "trestbps": 110.0,
    "chol": 160.0,
    "fbs": 0.0,
    "restecg": 0.0,
    "thalach": 180.0,
    "exang": 0.0,
    "oldpeak": 0.0,
    "slope": 2.0,
    "ca": 0.0,
    "thal": 2.0
}

SAMPLE_HIGHRISK = {
    "patient_name": "John Smith",
    "age": 68.0,
    "sex": 1.0,
    "cp": 3.0,
    "trestbps": 175.0,
    "chol": 340.0,
    "fbs": 1.0,
    "restecg": 2.0,
    "thalach": 95.0,
    "exang": 1.0,
    "oldpeak": 3.8,
    "slope": 1.0,
    "ca": 3.0,
    "thal": 3.0
}


def test_validation_error_on_out_of_range_field():
    # Cholesterol outside 100-600
    invalid_data = dict(SAMPLE_HEALTHY)
    invalid_data["chol"] = 750.0  # > 600

    response = client.post("/predict", json=invalid_data)
    assert response.status_code == 422
    body = response.json()
    assert "detail" in body
    assert "chol (serum cholesterol) must be between 100 and 600 mg/dl" in body["detail"]


def test_validation_error_on_age_and_bp():
    invalid_data = dict(SAMPLE_HEALTHY)
    invalid_data["age"] = 15.0  # < 18
    invalid_data["trestbps"] = 250.0  # > 220

    response = client.post("/predict", json=invalid_data)
    assert response.status_code == 422
    body = response.json()
    assert "age must be between 18 and 100 years" in body["detail"]
    assert "trestbps (resting blood pressure) must be between 80 and 220 mmHg" in body["detail"]


def test_valid_prediction():
    response = client.post("/predict", json=SAMPLE_HEALTHY)
    assert response.status_code == 200
    data = response.json()
    assert "probability" in data
    assert "risk_level" in data
    assert data["risk_level"] in ["Low", "Moderate", "High"]
    assert 0.0 <= data["probability"] <= 1.0


def test_contributions_field():
    response = client.post("/predict", json=SAMPLE_HEALTHY)
    assert response.status_code == 200
    data = response.json()
    assert "contributions" in data
    contributions = data["contributions"]
    assert len(contributions) == 13

    # Check structure
    for item in contributions:
        assert "feature" in item
        assert "label" in item
        assert "value" in item
        assert "impact" in item
        assert isinstance(item["impact"], float)

    # Check that they are sorted by absolute impact descending
    abs_impacts = [abs(c["impact"]) for c in contributions]
    assert abs_impacts == sorted(abs_impacts, reverse=True)


def test_two_different_patients_produce_different_contributions():
    res_h = client.post("/predict", json=SAMPLE_HEALTHY).json()
    res_r = client.post("/predict", json=SAMPLE_HIGHRISK).json()

    assert res_h["risk_level"] != res_r["risk_level"] or res_h["probability"] != res_r["probability"]
    # Verify the feature impacts differ
    h_top = res_h["contributions"][0]
    r_top = res_r["contributions"][0]
    # Check that contributions are not identical
    assert res_h["contributions"] != res_r["contributions"]


def test_generate_report_valid_pdf():
    # First get prediction
    pred_res = client.post("/predict", json=SAMPLE_HEALTHY)
    pred_data = pred_res.json()

    report_payload = {
        "patient_name": "Jane Doe",
        "patient": SAMPLE_HEALTHY,
        "probability": pred_data["probability"],
        "risk_level": pred_data["risk_level"],
        "contributions": pred_data["contributions"]
    }

    response = client.post("/generate-report", json=report_payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "CardioAI_Report_Jane_Doe" in response.headers["content-disposition"]
    # PDF binary starts with %PDF-
    assert response.content.startswith(b"%PDF-")
    assert len(response.content) > 1000
