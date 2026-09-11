from flask import Flask, render_template, jsonify, request
import copy, random

app = Flask(__name__)

# TRAINING TOOL ONLY. No database and no file storage.
DEFAULT_SECTIONS = [
    ('final_diagnosis', 'Final Diagnosis', 'Acute febrile illness / provisional diagnosis'),
    ('condition_on_admission', 'Condition on Admission', 'Patient admitted in stable condition with presenting complaints.'),
    ('symptoms_complaints_during_treatment', 'Symptoms / Complaints during treatment', 'Fever, weakness, body ache and reduced appetite.'),
    ('general_systemic_examinations', 'General & Systemic Examinations', 'Patient conscious and oriented. Vitals stable. Chest clear. Cardiovascular system normal. Abdomen soft. CNS grossly intact.'),
    ('course_in_hospital', 'Course in the Hospital', 'Patient was evaluated clinically and investigated as required. Appropriate treatment was given. Patient improved during the hospital stay.'),
    ('condition_at_discharge', 'Condition at Discharge', 'Patient clinically improved and haemodynamically stable at the time of discharge.'),
    ('diet_plan', 'Diet Plan', 'Normal/light diet as tolerated. Adequate oral fluids. Avoid foods as advised by the treating doctor.'),
    ('followup', 'Followup', 'Follow up in OPD as advised or earlier in case of worsening symptoms.'),
    ('advice_on_discharge', 'Advice on Discharge', 'Take medicines as prescribed, maintain hydration and follow the advised treatment plan. Return immediately if significant worsening occurs.'),
    ('type_of_discharge', 'Type of Discharge', 'Discharged on medical advice'),
]

SAMPLE_PATIENTS = [
    {'patient_name':'Aarav Sharma','uhid':'UHID-1001','ipd_no':'IPD-5001','age':'42','gender':'Male','address':'Hansi, Haryana','consultant':'Dr. Rajesh Sharma','department':'General Medicine','ward':'General Ward','bed_no':'G-12','admission_date':'11-09-2026 09:30 AM','discharge_date':'14-09-2026 11:00 AM'},
    {'patient_name':'Neha Gupta','uhid':'UHID-1002','ipd_no':'IPD-5002','age':'31','gender':'Female','address':'Hisar, Haryana','consultant':'Dr. Pooja Malik','department':'Obstetrics & Gynaecology','ward':'Private','bed_no':'P-05','admission_date':'10-09-2026 08:15 AM','discharge_date':'12-09-2026 01:00 PM'},
    {'patient_name':'Rohit Singh','uhid':'UHID-1003','ipd_no':'IPD-5003','age':'58','gender':'Male','address':'Bhiwani, Haryana','consultant':'Dr. Amit Kumar','department':'General Surgery','ward':'Post-Operative Ward','bed_no':'PO-03','admission_date':'08-09-2026 06:20 PM','discharge_date':'12-09-2026 10:30 AM'},
]

STATE = {'patient': {}, 'sections': []}
COUNTER = 1000

def fresh_patient():
    global COUNTER
    COUNTER += 1
    p = copy.deepcopy(random.choice(SAMPLE_PATIENTS))
    p['uhid'] = f'UHID-{COUNTER}'
    p['ipd_no'] = f'IPD-{5000 + COUNTER - 1000}'
    return p

def fresh_sections():
    return [{'id': key, 'title': title, 'content': content} for key, title, content in DEFAULT_SECTIONS]

def ensure_state():
    if not STATE['patient']:
        STATE['patient'] = fresh_patient()
    if not STATE['sections']:
        STATE['sections'] = fresh_sections()

@app.route('/')
def index():
    ensure_state()
    return render_template('index.html')

@app.get('/api/state')
def get_state():
    ensure_state()
    return jsonify(copy.deepcopy(STATE))

@app.post('/api/state')
def save_state():
    data = request.get_json(silent=True) or {}
    patient = data.get('patient') or {}
    sections = data.get('sections') or []
    if not isinstance(patient, dict) or not isinstance(sections, list):
        return jsonify({'error':'Invalid data'}), 400
    cleaned = []
    for i, s in enumerate(sections):
        if not isinstance(s, dict):
            continue
        title = str(s.get('title','')).strip() or f'Section {i+1}'
        content = str(s.get('content',''))
        sid = str(s.get('id') or f'custom_{i+1}')
        cleaned.append({'id': sid, 'title': title, 'content': content})
    STATE['patient'] = {str(k): str(v) for k,v in patient.items()}
    STATE['sections'] = cleaned
    return jsonify({'ok': True, 'state': copy.deepcopy(STATE)})

@app.post('/api/random')
def random_summary():
    STATE['patient'] = fresh_patient()
    STATE['sections'] = fresh_sections()
    return jsonify(copy.deepcopy(STATE))

@app.post('/api/reset')
def reset_summary():
    STATE['patient'] = {}
    STATE['sections'] = fresh_sections()
    return jsonify(copy.deepcopy(STATE))

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)
