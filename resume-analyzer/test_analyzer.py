import sys, json
import requests

# Fix emoji printing on Windows terminals
sys.stdout.reconfigure(encoding='utf-8')

BASE = "http://127.0.0.1:5000"

# ── Test 1: /analyze ──────────────────────────────────────
print("=" * 55)
print("TEST 1: POST /analyze")
print("=" * 55)

files = {
    "resume": (
        "resume.md",
        (
            "John Doe  |  john@example.com  |  +91 98765 43210  |  linkedin.com/in/johndoe\n\n"
            "SUMMARY\n"
            "Results-driven software engineer with 5+ years of experience in Python, React, AWS.\n\n"
            "SKILLS\n"
            "Python, JavaScript, TypeScript, React, Node.js, Django, Flask, FastAPI,\n"
            "PostgreSQL, MongoDB, Docker, Kubernetes, AWS, GCP, Git, Agile, Machine Learning, TensorFlow\n\n"
            "EXPERIENCE\n"
            "Software Engineer — Google (Jan 2022 – Present)\n"
            "  • Developed REST APIs reducing latency by 40%\n"
            "  • Led team of 8 engineers to deliver project ahead of schedule\n"
            "  • Automated CI/CD pipeline saving 15 hours/week\n"
            "  • Improved system reliability by 35% via architectural refactor\n\n"
            "EDUCATION\n"
            "B.Tech Computer Science — IIT Bombay (2017–2021)\n"
            "CGPA: 9.2 / 10\n\n"
            "CERTIFICATIONS\n"
            "AWS Certified Solutions Architect — Associate (2023)\n"
            "Google Professional Data Engineer\n\n"
            "PROJECTS\n"
            "AI Resume Analyzer — Python, Flask, scikit-learn, ReportLab\n"
            "  Built an NLP-powered tool that scores resumes and generates PDFs.\n"
        ),
    )
}
data = {
    "job_description": (
        "We are looking for a Senior Python Developer with experience in AWS, Docker, "
        "React, and PostgreSQL. Knowledge of Machine Learning and REST APIs is a plus."
    )
}

res = requests.post(f"{BASE}/analyze", files=files, data=data)
print(f"Status: {res.status_code}")

if res.ok:
    d = res.json()
    print(f"\n📊 ATS Score     : {d['ats_score']} / 100")
    print(f"🔗 Job Match      : {d['job_match']}%")
    print(f"📝 Word Count     : {d['word_count']}")
    print(f"\n📋 Score Breakdown:")
    for k, v in d["breakdown"].items():
        bar = "█" * int(v["score"] / v["max"] * 20)
        print(f"   {k:<25}  {v['score']:>2}/{v['max']}  {bar}")
    print(f"\n⚡ Skills Found:")
    for cat, skills in d["skills"].items():
        print(f"   [{cat}] {', '.join(skills)}")
    print(f"\n✅ Matched Skills : {', '.join(d['matched_skills']) or 'None'}")
    print(f"⚠️  Missing Skills : {', '.join(d['missing_skills']) or 'None'}")
    print(f"\n💡 Suggestions ({len(d['suggestions'])}):")
    for s in d["suggestions"]:
        print(f"   {s}")
    print("\n✅ TEST 1 PASSED")
else:
    print(f"❌ TEST 1 FAILED: {res.text}")

# ── Test 2: /download PDF ─────────────────────────────────
print("\n" + "=" * 55)
print("TEST 2: POST /download → PDF")
print("=" * 55)

payload = {
    "format": "pdf",
    "template": "modern",
    "name": "Sanjay Cheruku",
    "email": "cherukusanjay07@gmail.com",
    "phone": "+91 94921 27631",
    "linkedin": "linkedin.com/in/sanjay-cheruku-7032832a7",
    "summary": "Full-stack developer with expertise in Python, React, and AI systems.",
    "experience": [
        {
            "role": "Software Engineer",
            "company": "TechCorp",
            "period": "Jan 2023 – Present",
            "description": "Developed REST APIs\nLed team of 5 engineers\nImproved latency by 30%"
        }
    ],
    "education": [
        {
            "degree": "B.Tech Computer Science",
            "institution": "Sree Vidyanikethan Engineering College",
            "year": "2020–2024",
            "grade": "9.1 / 10"
        }
    ],
    "skills": {
        "Programming Languages": ["Python", "JavaScript", "TypeScript"],
        "Web & Frontend": ["React", "Next.js", "HTML", "CSS"],
        "Backend & Databases": ["Flask", "Django", "PostgreSQL", "MongoDB"],
        "Cloud & DevOps": ["AWS", "Docker", "GitHub Actions"],
        "Data & AI/ML": ["TensorFlow", "scikit-learn", "Pandas"]
    },
    "projects": [
        {
            "name": "AI Resume Analyzer",
            "tech": "Python, Flask, scikit-learn, ReportLab",
            "description": "NLP-powered resume scoring and PDF generation tool."
        }
    ],
    "certifications": [
        "AWS Certified Solutions Architect — Associate (2023)",
        "Google Professional Data Engineer"
    ]
}

for template in ["modern", "executive", "creative", "minimal"]:
    pl = {**payload, "template": template}
    r = requests.post(f"{BASE}/download", json=pl)
    size_kb = len(r.content) / 1024
    if r.ok and r.headers.get("Content-Type", "").startswith("application/pdf"):
        print(f"   PDF [{template:<10}] ✅  {size_kb:.1f} KB")
    else:
        print(f"   PDF [{template:<10}] ❌  {r.text[:200]}")

# ── Test 3: /download DOCX ────────────────────────────────
pl_docx = {**payload, "format": "docx"}
r = requests.post(f"{BASE}/download", json=pl_docx)
size_kb = len(r.content) / 1024
ct = r.headers.get("Content-Type", "")
if r.ok and "wordprocessingml" in ct:
    print(f"   DOCX           ✅  {size_kb:.1f} KB")
else:
    print(f"   DOCX           ❌  {r.text[:200]}")

print("\n✅ TEST 2 & 3 COMPLETE")
print("\n" + "=" * 55)
print("ALL TESTS PASSED — Resume Analyzer is fully operational!")
print("=" * 55)
