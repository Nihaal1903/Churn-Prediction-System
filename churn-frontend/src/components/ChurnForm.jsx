import { useState } from "react";
import { api } from "../api";
import Toggle from "./Toggle";

const initialState = {
  gender: "Male",
  SeniorCitizen: "0",
  Partner: "Yes",
  Dependents: "No",
  tenure: "12",

  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "DSL",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "No",
  StreamingMovies: "No",

  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",

  MonthlyCharges: "70",
  TotalCharges: "840",
};

export default function ChurnForm({ onResult }) {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        SeniorCitizen: Number(formData.SeniorCitizen),
        tenure: Number(formData.tenure),
        MonthlyCharges: Number(formData.MonthlyCharges),
        TotalCharges: Number(formData.TotalCharges),
      };

      const res = await api.post("/predict", payload);
      onResult(res.data, payload);
    } catch {
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-panel" onSubmit={submitForm}>
      <h2>Customer Churn Prediction</h2>

      {/* 👤 PERSONAL */}
      <Section title="👤 Personal Information">
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={["Male", "Female"]}
        />

        <Toggle
          label="Senior Citizen"
          value={formData.SeniorCitizen === "1"}
          onChange={(v) =>
            setFormData({ ...formData, SeniorCitizen: v ? "1" : "0" })
          }
        />

        <Toggle
          label="Partner"
          value={formData.Partner === "Yes"}
          onChange={(v) =>
            setFormData({ ...formData, Partner: v ? "Yes" : "No" })
          }
        />

        <Toggle
          label="Dependents"
          value={formData.Dependents === "Yes"}
          onChange={(v) =>
            setFormData({ ...formData, Dependents: v ? "Yes" : "No" })
          }
        />
      </Section>

      {/* 📡 SERVICES */}
      <Section title="📡 Services">
        {[
          "OnlineSecurity",
          "OnlineBackup",
          "DeviceProtection",
          "TechSupport",
          "StreamingTV",
          "StreamingMovies",
        ].map((f) => (
          <Toggle
            key={f}
            label={f}
            value={formData[f] === "Yes"}
            onChange={(v) =>
              setFormData({ ...formData, [f]: v ? "Yes" : "No" })
            }
          />
        ))}

        <Select
          label="Internet Service"
          name="InternetService"
          value={formData.InternetService}
          onChange={handleChange}
          options={["DSL", "Fiber optic", "No"]}
        />
      </Section>

      {/* 💳 BILLING */}
      <Section title="💳 Billing">
        <Input
          label="Tenure (months)"
          name="tenure"
          value={formData.tenure}
          onChange={handleChange}
        />

        <Input
          label="Monthly Charges"
          name="MonthlyCharges"
          value={formData.MonthlyCharges}
          onChange={handleChange}
        />

        <Input
          label="Total Charges"
          name="TotalCharges"
          value={formData.TotalCharges}
          onChange={handleChange}
        />

        <Select
          label="Contract"
          name="Contract"
          value={formData.Contract}
          onChange={handleChange}
          options={["Month-to-month", "One year", "Two year"]}
        />

        <Select
          label="Payment Method"
          name="PaymentMethod"
          value={formData.PaymentMethod}
          onChange={handleChange}
          options={[
            "Electronic check",
            "Mailed check",
            "Bank transfer (automatic)",
            "Credit card (automatic)",
          ]}
        />
      </Section>

      <button type="submit">
        {loading ? "Predicting..." : "Predict Churn"}
      </button>
    </form>
  );
}

/* ---------- Helpers ---------- */

const Section = ({ title, children }) => (
  <div className="section">
    <h3>{title}</h3>
    <div className="grid">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="field">
    <label>{label}</label>
    <input type="number" {...props} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="field">
    <label>{label}</label>
    <select {...props}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);
