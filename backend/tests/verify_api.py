import sys
import os
# Add current directory to path to resolve imports correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.seed import seed_db

client = TestClient(app)

def run_tests():
    print("--- STARTING API VERIFICATION ---")
    
    # 1. Reset database with seed data
    print("\n[Test 1] Resetting database...")
    seed_db()
    
    # 2. Check Health
    print("\n[Test 2] Verifying health check...")
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    print("PASS: Health check is OK")

    # 3. Read Forms
    print("\n[Test 3] Verifying read forms...")
    response = client.get("/api/forms")
    assert response.status_code == 200
    forms = response.json()
    assert len(forms) >= 2
    # Product Feedback should be published, SDE application should be draft
    f1 = next(f for f in forms if f["title"] == "Product Feedback Survey")
    f2 = next(f for f in forms if f["title"] == "SDE Fullstack Application")
    assert f1["status"] == "published"
    assert f2["status"] == "draft"
    print(f"PASS: Found forms: '{f1['title']}' ({f1['status']}) and '{f2['title']}' ({f2['status']})")

    # 4. Create Form
    print("\n[Test 4] Verifying create form...")
    response = client.post("/api/forms", json={"title": "Test Form", "description": "Temp description"})
    assert response.status_code == 201
    new_form = response.json()
    assert new_form["title"] == "Test Form"
    assert new_form["status"] == "draft"
    print("PASS: Form created successfully")

    # 5. Read Form details (with questions)
    print("\n[Test 5] Verifying read form details...")
    response = client.get(f"/api/forms/{f1['id']}")
    assert response.status_code == 200
    f1_detail = response.json()
    assert len(f1_detail["questions"]) == 4
    # Check that they are ordered by position
    positions = [q["position"] for q in f1_detail["questions"]]
    assert positions == sorted(positions)
    print(f"PASS: Form '{f1_detail['title']}' contains {len(f1_detail['questions'])} questions in correct sequence.")

    # 6. Update Form
    print("\n[Test 6] Verifying update form...")
    response = client.put(f"/api/forms/{new_form['id']}", json={"title": "Updated Test Form"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Test Form"
    print("PASS: Form title updated successfully")

    # 7. Duplicate Form
    print("\n[Test 7] Verifying duplicate form...")
    response = client.post(f"/api/forms/{f1['id']}/duplicate")
    assert response.status_code == 201
    dup_form = response.json()
    assert dup_form["title"] == "Copy of Product Feedback Survey"
    assert dup_form["status"] == "draft"
    
    # Verify duplicated questions
    response = client.get(f"/api/forms/{dup_form['id']}")
    dup_details = response.json()
    assert len(dup_details["questions"]) == 4
    print("PASS: Form and all questions successfully duplicated")

    # 8. Publish / Unpublish Form
    print("\n[Test 8] Verifying publish/unpublish workflow...")
    # Publish
    response = client.post(f"/api/forms/{new_form['id']}/publish")
    assert response.status_code == 200
    assert response.json()["status"] == "published"
    assert response.json()["published_at"] is not None
    # Unpublish
    response = client.post(f"/api/forms/{new_form['id']}/unpublish")
    assert response.status_code == 200
    assert response.json()["status"] == "draft"
    assert response.json()["published_at"] is None
    print("PASS: Publish and unpublish states toggled successfully")

    # 9. Create/Update/Delete Questions
    print("\n[Test 9] Verifying question CRUD operations...")
    # Create question
    response = client.post(
        f"/api/forms/{new_form['id']}/questions", 
        json={"type": "short_text", "title": "What is your feedback?", "required": True}
    )
    assert response.status_code == 201
    new_q = response.json()
    assert new_q["title"] == "What is your feedback?"
    
    # Update question
    response = client.put(f"/api/questions/{new_q['id']}", json={"title": "Write down your review:"})
    assert response.status_code == 200
    assert response.json()["title"] == "Write down your review:"
    
    # Delete question
    response = client.delete(f"/api/questions/{new_q['id']}")
    assert response.status_code == 204
    
    # Check it is deleted
    response = client.get(f"/api/forms/{new_form['id']}")
    assert len(response.json()["questions"]) == 0
    print("PASS: Question creation, update, and deletion successful")

    # 10. Reorder Questions
    print("\n[Test 10] Verifying question reordering...")
    # Let's get Form 1 questions
    response = client.get(f"/api/forms/{f1['id']}/questions")
    f1_qs = response.json()
    q_id_1 = f1_qs[0]["id"]
    q_id_2 = f1_qs[1]["id"]
    
    # Swap position 1 and 2
    reorder_payload = [
        {"id": q_id_1, "position": 2},
        {"id": q_id_2, "position": 1}
    ]
    response = client.put(f"/api/forms/{f1['id']}/questions/reorder", json=reorder_payload)
    assert response.status_code == 200
    reordered_qs = response.json()
    # Find positions
    pos_map = {q["id"]: q["position"] for q in reordered_qs}
    assert pos_map[q_id_1] == 2
    assert pos_map[q_id_2] == 1
    print("PASS: Reordering positions updated correctly")

    # 11. Public submissions validation
    print("\n[Test 11] Verifying response submission validation rules...")
    
    # Form 1 questions lookup from detail API
    response = client.get(f"/api/forms/{f1['id']}")
    f1_detail = response.json()
    email_q = next(q for q in f1_detail["questions"] if q["type"] == "email")
    name_q = next(q for q in f1_detail["questions"] if q["type"] == "short_text")
    rating_q = next(q for q in f1_detail["questions"] if q["type"] == "rating")
    
    # Form 2 questions lookup
    response = client.get(f"/api/forms/{f2['id']}")
    f2_detail = response.json()
    num_q_f2 = next(q for q in f2_detail["questions"] if q["type"] == "number")
    
    # A. Should fail on unpublished form (Form 2)
    payload_f2 = {
        "answers": [
            {"question_id": num_q_f2["id"], "value": "5"}
        ]
    }
    response = client.post(f"/api/public/forms/{f2['id']}/responses", json=payload_f2)
    assert response.status_code == 400
    assert "Submissions are not allowed on unpublished forms" in response.json()["detail"]
    print("PASS: Rejected submission on draft/unpublished form")
    
    # B. Should fail on missing required question
    payload_missing_req = {
        "answers": [
            {"question_id": email_q["id"], "value": "test@domain.com"}
            # name_q is required but omitted
        ]
    }
    response = client.post(f"/api/public/forms/{f1['id']}/responses", json=payload_missing_req)
    assert response.status_code == 400
    assert "is required but was not answered" in response.json()["detail"]
    print("PASS: Rejected submission missing required field")
    
    # C. Should fail on invalid email format
    payload_bad_email = {
        "answers": [
            {"question_id": email_q["id"], "value": "invalid_email_no_at_sign"},
            {"question_id": name_q["id"], "value": "Alice"}
        ]
    }
    response = client.post(f"/api/public/forms/{f1['id']}/responses", json=payload_bad_email)
    assert response.status_code == 400
    assert "is not a valid email address" in response.json()["detail"]
    print("PASS: Rejected submission with invalid email format")

    # D. Should succeed with valid values
    payload_valid = {
        "answers": [
            {"question_id": email_q["id"], "value": "new_user@domain.com"},
            {"question_id": name_q["id"], "value": "New Tester"},
            {"question_id": rating_q["id"], "value": "4"}
        ]
    }
    response = client.post(f"/api/public/forms/{f1['id']}/responses", json=payload_valid)
    assert response.status_code == 201
    resp_data = response.json()
    assert resp_data["form_id"] == f1["id"]
    assert len(resp_data["answers"]) == 3
    print("PASS: Valid response submitted successfully and saved transactionally")

    # 12. Read Responses
    print("\n[Test 12] Verifying response queries...")
    response = client.get(f"/api/forms/{f1['id']}/responses")
    assert response.status_code == 200
    f1_responses = response.json()
    # 3 seeded responses + 1 we just added = 4 total responses
    assert len(f1_responses) == 4
    
    # Read single response details
    response = client.get(f"/api/responses/{resp_data['id']}")
    assert response.status_code == 200
    single_res = response.json()
    assert len(single_res["answers"]) == 3
    print(f"PASS: Form responses read matches expected count. Single response details verified.")

    # 13. Delete Form
    print("\n[Test 13] Verifying cascade delete form...")
    response = client.delete(f"/api/forms/{f1['id']}")
    assert response.status_code == 204
    # Reading it should return 404
    response = client.get(f"/api/forms/{f1['id']}")
    assert response.status_code == 404
    print("PASS: Cascade deletion of form completed successfully")

    print("\n--- ALL TESTS COMPLETED SUCCESSFULLY! ---")

if __name__ == "__main__":
    run_tests()
