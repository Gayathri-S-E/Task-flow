import requests
import uuid
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_flow():
    print("--- Starting RBAC API Integration Tests ---")
    
    # Generate unique usernames/emails to avoid conflicts
    uid = str(uuid.uuid4())[:8]
    manager_username = f"manager_{uid}"
    employee_username = f"employee_{uid}"
    manager_email = f"manager_{uid}@example.com"
    employee_email = f"employee_{uid}@example.com"
    
    # 1. Register User 1 (Manager)
    print(f"Registering Manager user: {manager_username}...")
    r = requests.post(f"{BASE_URL}/auth/register", json={
        "username": manager_username,
        "email": manager_email,
        "password": "SecurePass123",
        "confirm_password": "SecurePass123",
        "full_name": "Manager Bob",
        "role": "manager"
    })
    assert r.status_code == 201, f"Failed manager registration: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    manager = response_json["data"]
    manager_id = manager["id"]
    assert manager["role"] == "manager"
    print("Manager registered successfully!")

    # 2. Register User 2 (Employee)
    print(f"Registering Employee user: {employee_username}...")
    r = requests.post(f"{BASE_URL}/auth/register", json={
        "username": employee_username,
        "email": employee_email,
        "password": "SecurePass123",
        "confirm_password": "SecurePass123",
        "full_name": "Employee Alice",
        "role": "employee"
    })
    assert r.status_code == 201, f"Failed employee registration: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    employee = response_json["data"]
    employee_id = employee["id"]
    assert employee["role"] == "employee"
    print("Employee registered successfully!")

    # 3. Login Manager (via email now)
    print("Logging in Manager...")
    r = requests.post(f"{BASE_URL}/auth/login", data={
        "username": manager_email,   # OAuth2 field name 'username' carries the email
        "password": "SecurePass123"
    })
    assert r.status_code == 200, f"Failed login: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    manager_token = response_json["data"]["access_token"]
    manager_headers = {"Authorization": f"Bearer {manager_token}"}
    print("Manager logged in successfully!")

    # 4. Login Employee (via email now)
    print("Logging in Employee...")
    r = requests.post(f"{BASE_URL}/auth/login", data={
        "username": employee_email,   # OAuth2 field name 'username' carries the email
        "password": "SecurePass123"
    })
    assert r.status_code == 200, f"Failed login: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    employee_token = response_json["data"]["access_token"]
    employee_headers = {"Authorization": f"Bearer {employee_token}"}
    print("Employee logged in successfully!")

    # 5. Employee tries to create a task (should fail 403)
    print("Testing Employee POST /tasks (should fail 403)...")
    r = requests.post(f"{BASE_URL}/tasks", json={
        "title": "Employee Task Attempt",
        "description": "Unauthorized task creation",
        "priority": "low"
    }, headers=employee_headers)
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"
    print("Employee task creation rejected successfully (403 returned)!")

    # 6. Manager creates a task (should succeed)
    print("Testing Manager POST /tasks (should succeed)...")
    task_payload = {
        "title": "Release App Update",
        "description": "Deploy codebase to production environment.",
        "priority": "high",
        "due_date": "2026-12-31T23:59:59Z",
        "assignee_id": None
    }
    r = requests.post(f"{BASE_URL}/tasks", json=task_payload, headers=manager_headers)
    assert r.status_code == 201, f"Failed task creation: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    task = response_json["data"]
    task_id = task["id"]
    assert task["title"] == "Release App Update"
    assert task["creator_id"] == manager_id
    print("Manager task created successfully!")

    # 7. Employee tries to assign task (should fail 403)
    print("Testing Employee PATCH /tasks/{id}/assign (should fail 403)...")
    r = requests.patch(f"{BASE_URL}/tasks/{task_id}/assign", json={
        "assignee_id": employee_id
    }, headers=employee_headers)
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"
    print("Employee assignment attempt rejected successfully (403 returned)!")

    # 8. Manager assigns task to Employee (should succeed)
    print("Testing Manager PATCH /tasks/{id}/assign (should succeed)...")
    r = requests.patch(f"{BASE_URL}/tasks/{task_id}/assign", json={
        "assignee_id": employee_id
    }, headers=manager_headers)
    assert r.status_code == 200, f"Failed assignment: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    task = response_json["data"]
    assert task["assignee_id"] == employee_id
    print("Task assigned to Employee successfully by Manager!")

    # 9. Employee lists tasks (should return list containing ONLY their assigned task)
    print("Testing Employee GET /tasks (should only return their assigned tasks)...")
    r = requests.get(f"{BASE_URL}/tasks", headers=employee_headers)
    assert r.status_code == 200
    response_json = r.json()
    assert response_json["success"] is True
    employee_tasks = response_json["data"]
    assert len(employee_tasks) == 1
    assert employee_tasks[0]["id"] == task_id
    print("Employee task list filtering verified successfully!")

    # 10. Employee updates task status (should succeed)
    print("Testing Employee PATCH /tasks/{id}/status (should succeed)...")
    r = requests.patch(f"{BASE_URL}/tasks/{task_id}/status", json={
        "status": "in_progress"
    }, headers=employee_headers)
    assert r.status_code == 200, f"Failed status update: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    assert response_json["data"]["status"] == "in_progress"
    print("Employee status update succeeded!")

    # 11. Employee tries to retrieve all users list (should fail 403)
    print("Testing Employee GET /users (should fail 403)...")
    r = requests.get(f"{BASE_URL}/users", headers=employee_headers)
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"
    print("Employee users list query rejected successfully (403 returned)!")

    # 12. Manager retrieves all users list (should succeed)
    print("Testing Manager GET /users (should succeed)...")
    r = requests.get(f"{BASE_URL}/users", headers=manager_headers)
    assert r.status_code == 200
    response_json = r.json()
    assert response_json["success"] is True
    assert len(response_json["data"]) >= 2
    print("Manager users list query succeeded!")

    # 13. Employee tries to retrieve dashboard summary metrics (should fail 403)
    print("Testing Employee GET /summary (should fail 403)...")
    r = requests.get(f"{BASE_URL}/summary", headers=employee_headers)
    assert r.status_code == 403, f"Expected 403, got {r.status_code}: {r.text}"
    print("Employee summary metrics query rejected successfully (403 returned)!")

    # 14. Manager retrieves dashboard summary metrics (should succeed)
    print("Testing Manager GET /summary (should succeed)...")
    r = requests.get(f"{BASE_URL}/summary", headers=manager_headers)
    assert r.status_code == 200
    response_json = r.json()
    assert response_json["success"] is True
    summary = response_json["data"]
    assert summary["total_tasks"] >= 1
    print("Manager summary metrics query succeeded!")

    # 15. Test GET /users/me returns profile with new fields
    print("Testing GET /users/me returns username and full_name...")
    r = requests.get(f"{BASE_URL}/users/me", headers=manager_headers)
    assert r.status_code == 200
    response_json = r.json()
    assert response_json["success"] is True
    me = response_json["data"]
    assert "username" in me
    assert "full_name" in me
    assert "email" in me
    assert "role" in me
    assert "created_at" in me
    print(f"Profile fields verified: username={me['username']}, role={me['role']}!")

    # 16. Test PUT /users/me updates profile (full_name)
    print("Testing PUT /users/me updates profile...")
    r = requests.put(f"{BASE_URL}/users/me", json={
        "full_name": "Manager Bob Updated"
    }, headers=manager_headers)
    assert r.status_code == 200, f"Failed profile update: {r.text}"
    response_json = r.json()
    assert response_json["success"] is True
    updated = response_json["data"]
    assert updated["full_name"] == "Manager Bob Updated"
    print("Profile update succeeded!")

    # 17. Manager deletes task (should succeed)
    print("Testing Manager DELETE /tasks/{id} (should succeed)...")
    r = requests.delete(f"{BASE_URL}/tasks/{task_id}", headers=manager_headers)
    assert r.status_code == 200
    response_json = r.json()
    assert response_json["success"] is True
    print("Task deleted successfully by Manager!")

    # 18. Verify task is deleted
    r = requests.get(f"{BASE_URL}/tasks/{task_id}", headers=manager_headers)
    assert r.status_code == 404
    print("Task deletion verified successfully!")

    print("\n--- ALL RBAC API TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    try:
        test_flow()
    except AssertionError as e:
        print(f"\nTEST FAILED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\nUNEXPECTED ERROR: {e}")
        sys.exit(1)
