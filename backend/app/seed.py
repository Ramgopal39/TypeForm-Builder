import datetime
from app.database import engine, Base, SessionLocal
from app.models import Form, Question, Response, ResponseAnswer, User
from app.routers.auth import hash_password, generate_salt

def seed_db():
    print("Initializing database seeding...")
    
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if default user exists
        default_user = db.query(User).filter(User.email == "john@example.com").first()
        if not default_user:
            print("Creating default user 'john@example.com' with password 'password123'...")
            salt = generate_salt()
            hashed_pwd = hash_password("password123", salt)
            default_user = User(
                email="john@example.com",
                hashed_password=hashed_pwd,
                salt=salt,
                name="John Doe"
            )
            db.add(default_user)
            db.flush()

        # Delete existing forms with the same titles to maintain idempotency
        target_titles = ["Customer Feedback", "Job Application", "Event Registration"]
        existing_forms = db.query(Form).filter(Form.title.in_(target_titles)).all()
        for f in existing_forms:
            print(f"Removing existing form '{f.title}' to ensure clean seed data...")
            db.delete(f)
        db.commit()

        print("Seeding new forms...")

        # Form 1: Customer Feedback (Published)
        form1 = Form(
            title="Customer Feedback",
            description="We value your opinion. Help us improve our product.",
            status="published",
            published_at=datetime.datetime.now(datetime.timezone.utc),
            user_id=default_user.id
        )
        db.add(form1)
        db.flush()

        # Form 2: Job Application (Published)
        form2 = Form(
            title="Job Application",
            description="Apply for our SDE role. Please fill out your details.",
            status="published",
            published_at=datetime.datetime.now(datetime.timezone.utc),
            user_id=default_user.id
        )
        db.add(form2)
        db.flush()

        # Form 3: Event Registration (Draft)
        form3 = Form(
            title="Event Registration",
            description="Register for our upcoming builder conference.",
            status="draft",
            user_id=default_user.id
        )
        db.add(form3)
        db.flush()

        # Seeding questions for Form 1: Customer Feedback
        print("Seeding questions for Customer Feedback...")
        q1_f1 = Question(
            form_id=form1.id,
            type="short_text",
            title="What is your name?",
            required=True,
            position=1
        )
        q2_f1 = Question(
            form_id=form1.id,
            type="rating",
            title="Rate your overall satisfaction",
            required=True,
            position=2,
            settings={"max_stars": 5}
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
            type="long_text",
            title="Tell us what we can improve",
            required=False,
            position=4
        )
        q5_f1 = Question(
            form_id=form1.id,
            type="yes_no",
            title="Would you recommend us to a colleague?",
            required=True,
            position=5
        )
        db.add_all([q1_f1, q2_f1, q3_f1, q4_f1, q5_f1])
        db.flush()

        # Seeding questions for Form 2: Job Application
        print("Seeding questions for Job Application...")
        q1_f2 = Question(
            form_id=form2.id,
            type="short_text",
            title="Full Name",
            required=True,
            position=1
        )
        q2_f2 = Question(
            form_id=form2.id,
            type="email",
            title="Email Address",
            required=True,
            position=2
        )
        q3_f2 = Question(
            form_id=form2.id,
            type="dropdown",
            title="Position Applied For",
            required=True,
            position=3,
            settings={"options": ["Frontend Engineer", "Backend Engineer", "Product Designer", "Product Manager"]}
        )
        q4_f2 = Question(
            form_id=form2.id,
            type="number",
            title="Years of software experience",
            required=True,
            position=4
        )
        q5_f2 = Question(
            form_id=form2.id,
            type="multiple_choice",
            title="Preferred work mode",
            required=False,
            position=5,
            settings={"options": ["Remote", "Hybrid", "On-site"]}
        )
        q6_f2 = Question(
            form_id=form2.id,
            type="long_text",
            title="Tell us why you want to join our team",
            required=False,
            position=6
        )
        db.add_all([q1_f2, q2_f2, q3_f2, q4_f2, q5_f2, q6_f2])
        db.flush()

        # Seeding questions for Form 3: Event Registration
        print("Seeding questions for Event Registration...")
        q1_f3 = Question(
            form_id=form3.id,
            type="short_text",
            title="Attendee Name",
            required=True,
            position=1
        )
        q2_f3 = Question(
            form_id=form3.id,
            type="email",
            title="Contact Email",
            required=True,
            position=2
        )
        q3_f3 = Question(
            form_id=form3.id,
            type="dropdown",
            title="T-shirt Size",
            required=False,
            position=3,
            settings={"options": ["S", "M", "L", "XL"]}
        )
        q4_f3 = Question(
            form_id=form3.id,
            type="rating",
            title="Interest level in networking events",
            required=False,
            position=4,
            settings={"max_stars": 5}
        )
        q5_f3 = Question(
            form_id=form3.id,
            type="yes_no",
            title="Do you require dietary accommodations?",
            required=True,
            position=5
        )
        db.add_all([q1_f3, q2_f3, q3_f3, q4_f3, q5_f3])
        db.flush()

        # Seeding sample responses for Customer Feedback
        print("Seeding responses for Customer Feedback...")
        
        # Response 1: Alice
        res1_f1 = Response(
            form_id=form1.id,
            submitted_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2)
        )
        db.add(res1_f1)
        db.flush()
        db.add_all([
            ResponseAnswer(response_id=res1_f1.id, question_id=q1_f1.id, value="Alice Jones"),
            ResponseAnswer(response_id=res1_f1.id, question_id=q2_f1.id, value="5"),
            ResponseAnswer(response_id=res1_f1.id, question_id=q3_f1.id, value="Friend"),
            ResponseAnswer(response_id=res1_f1.id, question_id=q4_f1.id, value="The auto-advance interactions feel super polished!"),
            ResponseAnswer(response_id=res1_f1.id, question_id=q5_f1.id, value="Yes"),
        ])

        # Response 2: Bob
        res2_f1 = Response(
            form_id=form1.id,
            submitted_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)
        )
        db.add(res2_f1)
        db.flush()
        db.add_all([
            ResponseAnswer(response_id=res2_f1.id, question_id=q1_f1.id, value="Bob Smith"),
            ResponseAnswer(response_id=res2_f1.id, question_id=q2_f1.id, value="4"),
            ResponseAnswer(response_id=res2_f1.id, question_id=q3_f1.id, value="Search Engine"),
            ResponseAnswer(response_id=res2_f1.id, question_id=q4_f1.id, value="Would love to see dark mode soon."),
            ResponseAnswer(response_id=res2_f1.id, question_id=q5_f1.id, value="Yes"),
        ])

        # Seeding sample responses for Job Application
        print("Seeding responses for Job Application...")

        # Response 1: Charlie
        res1_f2 = Response(
            form_id=form2.id,
            submitted_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=6)
        )
        db.add(res1_f2)
        db.flush()
        db.add_all([
            ResponseAnswer(response_id=res1_f2.id, question_id=q1_f2.id, value="Charlie Brown"),
            ResponseAnswer(response_id=res1_f2.id, question_id=q2_f2.id, value="charlie@example.com"),
            ResponseAnswer(response_id=res1_f2.id, question_id=q3_f2.id, value="Frontend Engineer"),
            ResponseAnswer(response_id=res1_f2.id, question_id=q4_f2.id, value="4"),
            ResponseAnswer(response_id=res1_f2.id, question_id=q5_f2.id, value="Remote"),
            ResponseAnswer(response_id=res1_f2.id, question_id=q6_f2.id, value="I excel at building smooth animations using Framer Motion!"),
        ])

        # Response 2: Diana
        res2_f2 = Response(
            form_id=form2.id,
            submitted_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=2)
        )
        db.add(res2_f2)
        db.flush()
        db.add_all([
            ResponseAnswer(response_id=res2_f2.id, question_id=q1_f2.id, value="Diana Prince"),
            ResponseAnswer(response_id=res2_f2.id, question_id=q2_f2.id, value="diana@example.com"),
            ResponseAnswer(response_id=res2_f2.id, question_id=q3_f2.id, value="Product Manager"),
            ResponseAnswer(response_id=res2_f2.id, question_id=q4_f2.id, value="6"),
            ResponseAnswer(response_id=res2_f2.id, question_id=q5_f2.id, value="Hybrid"),
            ResponseAnswer(response_id=res2_f2.id, question_id=q6_f2.id, value="Strong experience directing agile designer-developer iterations."),
        ])

        db.commit()
        print("Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during database seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
