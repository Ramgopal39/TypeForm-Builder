import datetime
from app.database import engine, Base, SessionLocal
from app.models import Form, Question, Response, ResponseAnswer

def seed_db():
    print("Resetting database and creating tables...")
    # Drop all tables and recreate them to ensure a clean start
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding forms...")
        
        # Form 1: Published Product Feedback Survey
        form1 = Form(
            title="Product Feedback Survey",
            description="Help us improve our service by providing your feedback.",
            status="published",
            published_at=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(form1)
        db.flush()  # Generate form1.id
        
        # Form 2: SDE Fullstack Application (Draft status)
        form2 = Form(
            title="SDE Fullstack Application",
            description="Join our team as a Fullstack Developer. Fill in your details below.",
            status="draft"
        )
        db.add(form2)
        db.flush()  # Generate form2.id

        print("Seeding questions for Form 1...")
        q1_f1 = Question(
            form_id=form1.id,
            type="email",
            title="What is your email address?",
            description="We will only use this to follow up on feedback.",
            required=True,
            position=1
        )
        q2_f1 = Question(
            form_id=form1.id,
            type="short_text",
            title="What is your name?",
            required=True,
            position=2
        )
        q3_f1 = Question(
            form_id=form1.id,
            type="multiple_choice",
            title="How did you hear about us?",
            required=False,
            position=3,
            settings={"options": ["Search Engine", "Social Media", "Friend", "Other"]}
        )
        q4_f1 = Question(
            form_id=form1.id,
            type="rating",
            title="Rate your experience from 1 to 5",
            required=False,
            position=4,
            settings={"max_stars": 5}
        )
        db.add_all([q1_f1, q2_f1, q3_f1, q4_f1])
        db.flush()

        print("Seeding questions for Form 2...")
        q1_f2 = Question(
            form_id=form2.id,
            type="long_text",
            title="Tell us about your experience with React/Next.js.",
            required=True,
            position=1
        )
        q2_f2 = Question(
            form_id=form2.id,
            type="number",
            title="How many years of Python experience do you have?",
            required=True,
            position=2
        )
        q3_f2 = Question(
            form_id=form2.id,
            type="yes_no",
            title="Are you willing to relocate?",
            required=False,
            position=3
        )
        db.add_all([q1_f2, q2_f2, q3_f2])
        db.flush()

        print("Seeding sample responses for Form 1...")
        
        # Response 1: Alice
        res1 = Response(form_id=form1.id)
        db.add(res1)
        db.flush()
        db.add_all([
            ResponseAnswer(response_id=res1.id, question_id=q1_f1.id, value="alice@example.com"),
            ResponseAnswer(response_id=res1.id, question_id=q2_f1.id, value="Alice"),
            ResponseAnswer(response_id=res1.id, question_id=q3_f1.id, value="Friend"),
            ResponseAnswer(response_id=res1.id, question_id=q4_f1.id, value="5"),
        ])

        # Response 2: Bob
        res2 = Response(form_id=form1.id)
        db.add(res2)
        db.flush()
        db.add_all([
            ResponseAnswer(response_id=res2.id, question_id=q1_f1.id, value="bob@example.com"),
            ResponseAnswer(response_id=res2.id, question_id=q2_f1.id, value="Bob"),
            ResponseAnswer(response_id=res2.id, question_id=q3_f1.id, value="Search Engine"),
            ResponseAnswer(response_id=res2.id, question_id=q4_f1.id, value="4"),
        ])

        # Response 3: Charlie
        res3 = Response(form_id=form1.id)
        db.add(res3)
        db.flush()
        db.add_all([
            ResponseAnswer(response_id=res3.id, question_id=q1_f1.id, value="charlie@example.com"),
            ResponseAnswer(response_id=res3.id, question_id=q2_f1.id, value="Charlie"),
            ResponseAnswer(response_id=res3.id, question_id=q3_f1.id, value="Other"),
            ResponseAnswer(response_id=res3.id, question_id=q4_f1.id, value="3"),
        ])

        db.commit()
        print("Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()
def seed_db():
    """Seed initial data into the database."""
    print("Database seeding utility initialized. No initial data seeded yet.")

if __name__ == "__main__":
    seed_db()
