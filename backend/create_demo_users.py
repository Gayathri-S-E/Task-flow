from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.model import User, Task, TaskStatus, TaskPriority
from app.core.security import hash_password
from datetime import datetime, timedelta

def seed_demo_data():
    db = SessionLocal()
    try:
        # Check if users already exist
        demo_user = db.query(User).filter(User.username == "demo_user").first()
        demo_assignee = db.query(User).filter(User.username == "demo_assignee").first()

        if not demo_user:
            demo_user = User(
                username="demo_user",
                email="demo@example.com",
                hashed_password=hash_password("Password123"),
                full_name="Demo User",
                role="manager",
            )
            db.add(demo_user)
            print("Seeded demo_user as manager")
        else:
            demo_user.role = "manager"
            demo_user.full_name = "Demo User"
            demo_user.hashed_password = hash_password("Password123")
            print("Updated demo_user to manager and reset password")

        if not demo_assignee:
            demo_assignee = User(
                username="demo_assignee",
                email="assignee@example.com",
                hashed_password=hash_password("Password123"),
                full_name="Demo Assignee",
                role="employee",
            )
            db.add(demo_assignee)
            print("Seeded demo_assignee as employee")
        else:
            demo_assignee.role = "employee"
            demo_assignee.full_name = "Demo Assignee"
            demo_assignee.hashed_password = hash_password("Password123")
            print("Updated demo_assignee to employee and reset password")

        db.commit()
        db.refresh(demo_user)
        db.refresh(demo_assignee)

        # Check if tasks already exist
        task_count = db.query(Task).count()
        if task_count == 0:
            task1 = Task(
                title="Design System Architecture",
                description="Review design details, security protocols, and configure the CORS middleware.",
                status=TaskStatus.completed,
                priority=TaskPriority.high,
                due_date=datetime.now() + timedelta(days=2),
                creator_id=demo_user.id,
                assignee_id=demo_user.id
            )
            task2 = Task(
                title="Build Frontend UI Dashboard",
                description="Develop components, configure routing guards, and add tailwind color palettes.",
                status=TaskStatus.in_progress,
                priority=TaskPriority.medium,
                due_date=datetime.now() + timedelta(days=5),
                creator_id=demo_user.id,
                assignee_id=demo_assignee.id
            )
            task3 = Task(
                title="Write API Integrations Tests",
                description="Construct automated mock suite to verify all auth paths and router endpoints.",
                status=TaskStatus.pending,
                priority=TaskPriority.low,
                due_date=datetime.now() + timedelta(days=10),
                creator_id=demo_user.id,
                assignee_id=None
            )
            db.add_all([task1, task2, task3])
            print("Seeded 3 sample tasks")
            db.commit()
        
        print("Demo seeding complete!")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
