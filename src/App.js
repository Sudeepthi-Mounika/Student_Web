import React, { useState, useEffect } from "react";
import "./App.css";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import VideoIntro from "./VideoIntro";



function App() {
  const [showVideo, setShowVideo] = useState(true);
  const [page, setPage] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null); // {id,name,email,password,role}

  // ------- USERS (stored in localStorage) -------
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [];
  });

  // ------- ACHIEVEMENTS -------
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem("achievements");
    return saved ? JSON.parse(saved) : [];
  });

  // ------- PAYMENTS (demo payment records) -------
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem("payments");
    return saved ? JSON.parse(saved) : [];
  });

  // ------- CHATS (messages) -------
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("messages");
    return saved ? JSON.parse(saved) : [];
  });

  // sync to localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2);

  // -------- AUTH: SIGNUP / LOGIN / LOGOUT --------
  const handleSignup = (newUser) => {
    const email = newUser.email.trim().toLowerCase();

    const exists = users.some(
      (u) => u.email.toLowerCase() === email
    );
    if (exists) {
      alert("This email is already registered. Please login instead.");
      return;
    }

    const userWithId = {
      id: generateId(),
      name: newUser.name.trim(),
      email,
      password: newUser.password,
      role: newUser.role, // "admin" or "student"
    };

    setUsers((prev) => [...prev, userWithId]);
    alert("Account created! You can login now.");
    setPage("login");
  };

  const handleLogin = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!found) {
      alert("Invalid email or password");
      return;
    }

    setCurrentUser(found);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("login");
  };

  // -------- ACHIEVEMENTS HANDLERS (ADMIN) --------
  const handleAddAchievement = (data) => {
    const id = generateId();
    setAchievements((prev) => [...prev, { id, ...data }]);
  };

  const handleUpdateAchievement = (updated) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const handleDeleteAchievement = (id) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  // -------- PAYMENTS HANDLER (DEMO) --------
  const handleStudentPayment = ({ studentName, studentEmail, amount, purpose }) => {
    const record = {
      id: generateId(),
      studentName,
      studentEmail: studentEmail.toLowerCase(),
      amount,
      purpose,
      status: "Success (Demo)",
      timestamp: new Date().toLocaleString(),
    };
    setPayments((prev) => [record, ...prev]);
    alert("Demo payment completed! (No real money processed)");
  };

  // -------- CHAT HANDLER --------
  const handleSendMessage = ({ from, to, text }) => {
    if (!text.trim()) return;
    const msg = {
      id: generateId(),
      from,
      to,
      text: text.trim(),
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, msg]);
  };
if (showVideo) {
  return <VideoIntro onFinish={() => setShowVideo(false)} />;
}
  return (
  <div className="app-root">
    <div className="background-layer" />

    {/* -------- LANDING PAGE -------- */}
    {page === "landing" && (
      <LandingPage
        goToLogin={() => setPage("login")}
        goToSignup={() => setPage("signup")}
      />
      
    )}

    {/* -------- LOGIN PAGE -------- */}
    {page === "login" && (
      <div className="auth-container">
        <div className="brand-side ultra-brand">
          <div className="logo-card">
            <img
              src="/Logo.png"
              alt="Student Web Portal"
              className="ultra-logo"
            />
          </div>

          <h1 className="ultra-title">
            Student Web Portal
          </h1>

          <p className="ultra-subtitle">
            Track. Manage. Showcase Achievements.
          </p>
        </div>

        <div className="form-side">
          <LoginPage
            onLogin={handleLogin}
            goToSignup={() => setPage("signup")}
          />
        </div>
      </div>
    )}

    {/* -------- SIGNUP PAGE -------- */}
    {page === "signup" && (
      <div className="auth-container">
        <div className="brand-side ultra-brand">
          <div className="logo-card">
            <img
              src="/Logo.png"
              alt="Student Web Portal"
              className="ultra-logo"
            />
          </div>

          <h1 className="ultra-title">
            Student Web Portal
          </h1>

          <p className="ultra-subtitle">
            Track. Manage. Showcase Achievements.
          </p>
        </div>

        <div className="form-side">
          <SignupPage
            onSignup={handleSignup}
            goToLogin={() => setPage("login")}
          />
        </div>
      </div>
    )}

    {/* -------- DASHBOARD -------- */}
    {page === "dashboard" && (
      <div className="dashboard-root">
        <Header />
        <TopBar currentUser={currentUser} onLogout={handleLogout} />

        {currentUser?.role === "admin" ? (
          <AdminDashboard
            achievements={achievements}
            users={users}
            payments={payments}
            messages={messages}
            currentUser={currentUser}
            onAdd={handleAddAchievement}
            onUpdate={handleUpdateAchievement}
            onDelete={handleDeleteAchievement}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <StudentDashboard
            achievements={achievements}
            currentUser={currentUser}
            users={users}
            payments={payments}
            messages={messages}
            onPay={handleStudentPayment}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>
    )}
  </div>
);
}
export default App;

/* ------------------ HEADER ------------------ */
function Header() {
  return (
    <header className="dash-header">
      <h2>Student Achievement Tracker</h2>
      <p>Manage and showcase accomplishments beyond academics.</p>
    </header>
  );
}

/* ------------------ TOP BAR ------------------ */
function TopBar({ currentUser, onLogout }) {
  if (!currentUser) return null;
  return (
    <div className="topbar">
      <div>
        <span>
          Logged in as <strong>{currentUser.name}</strong> (
          {currentUser.role})
        </span>
        <div style={{ fontSize: "0.8rem", color: "#cbd5f5" }}>
          {currentUser.email}
        </div>
      </div>
      <button className="btn small outline" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

/* ------------------ ADMIN DASHBOARD ------------------ */
function AdminDashboard({
  achievements,
  users,
  payments,
  messages,
  currentUser,
  onAdd,
  onUpdate,
  onDelete,
  onSendMessage,
}) {
  const [search, setSearch] = useState("");

  const filtered = achievements.filter((a) =>
    (a.studentName || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const studentUsers = users.filter((u) => u.role === "student");

  return (
    <div className="dashboard">
      <h3 className="section-title">Admin Panel</h3>

      <div className="grid-2">
        <AchievementForm onAdd={onAdd} users={users} />
        <AdminSummary achievements={achievements} payments={payments} />
      </div>

      {/* Achievements table */}
      <div className="card">
        <div className="table-header">
          <h4>All Achievements</h4>
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <AchievementTable
          achievements={filtered}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>

      {/* Payments overview */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h4>Recent Payments (Demo)</h4>
        {payments.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.studentName}</td>
                  <td>{p.studentEmail}</td>
                  <td>{p.purpose}</td>
                  <td>{p.amount}</td>
                  <td>{p.status}</td>
                  <td>{p.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Registered Students (students only, no admins) */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h4>Registered Students</h4>

        {studentUsers.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>College Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {studentUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Chat with students */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h4>Chat with Students</h4>
        <ChatPanel
          mode="admin"
          currentUser={currentUser}
          users={users}
          messages={messages}
          onSend={onSendMessage}
        />
      </div>
    </div>
  );
}

/* ------------------ STUDENT DASHBOARD ------------------ */
function StudentDashboard({
  achievements,
  currentUser,
  users,
  payments,
  messages,
  onPay,
  onSendMessage,
}) {
  const normalize = (s) => (s || "").trim().toLowerCase();

  const mine = achievements.filter(
    (a) => normalize(a.studentEmail) === normalize(currentUser.email)
  );

  const myPayments = payments.filter(
    (p) => normalize(p.studentEmail) === normalize(currentUser.email)
  );

  return (
    <div className="dashboard">
      <h3 className="section-title">My Dashboard</h3>

      <StudentSummary achievements={mine} payments={myPayments} />

      {/* Payment card */}
      <div className="card">
        <h4>Premium Features & Certificates (Demo Payment)</h4>
        <p>
          Pay once to unlock premium features such as downloadable certificates
          and priority verification. This is a demo payment – no real money is
          processed.
        </p>
        <button
          className="btn primary"
          onClick={() =>
            onPay({
              studentName: currentUser.name,
              studentEmail: currentUser.email,
              amount: "₹499",
              purpose: "Premium / Certificate Access",
            })
          }
        >
          Pay ₹499 (Demo)
        </button>

        {myPayments.length > 0 && (
          <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
            <strong>Last payment status:</strong>{" "}
            {myPayments[0].status} on {myPayments[0].timestamp}
          </div>
        )}
      </div>

      {/* My achievements */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h4>My Achievements</h4>
        {mine.length === 0 ? (
          <p>No achievements yet. Please contact admin.</p>
        ) : (
          <AchievementList achievements={mine} />
        )}
      </div>

      {/* Chat with admin */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h4>Chat with Admin</h4>
        <ChatPanel
          mode="student"
          currentUser={currentUser}
          users={users}
          messages={messages}
          onSend={onSendMessage}
        />
      </div>
    </div>
  );
  
}

/* ------------------ CHAT PANEL (ADMIN / STUDENT) ------------------ */
function ChatPanel({ mode, currentUser, users, messages, onSend }) {
  const [selectedEmail, setSelectedEmail] = useState("");
  const [text, setText] = useState("");

  const adminUsers = users.filter((u) => u.role === "admin");
  const studentUsers = users.filter((u) => u.role === "student");

  // default chat target
  useEffect(() => {
    if (mode === "admin" && !selectedEmail && studentUsers.length > 0) {
      setSelectedEmail(studentUsers[0].email);
    }
    if (mode === "student" && !selectedEmail && adminUsers.length > 0) {
      setSelectedEmail(adminUsers[0].email);
    }
  }, [mode, selectedEmail, adminUsers, studentUsers]);

  if (mode === "student" && adminUsers.length === 0) {
    return <p>No admin account available to chat with.</p>;
  }
  if (mode === "admin" && studentUsers.length === 0) {
    return <p>No students registered to chat with.</p>;
  }

  const targetEmail = selectedEmail;

  const conversation = messages.filter(
    (m) =>
      (m.from === currentUser.email && m.to === targetEmail) ||
      (m.from === targetEmail && m.to === currentUser.email)
  );

  const getName = (email) =>
    users.find((u) => u.email === email)?.name || email;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend({ from: currentUser.email, to: targetEmail, text });
    setText("");
  };

  return (
    <div className="chat-panel">
      {mode === "admin" && (
        <div className="form-group">
          <label>Select student</label>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
          >
            {studentUsers.map((s) => (
              <option key={s.id} value={s.email}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>
      )}
      {mode === "student" && (
        <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          Chatting with{" "}
          <strong>{getName(selectedEmail)} ({selectedEmail})</strong>
        </p>
      )}

      <div className="chat-box">
        {conversation.length === 0 ? (
          <p className="chat-empty">No messages yet. Start the conversation!</p>
        ) : (
          conversation.map((m) => (
            <div
              key={m.id}
              className={
                m.from === currentUser.email
                  ? "chat-msg chat-msg-me"
                  : "chat-msg chat-msg-them"
              }
            >
              <div className="chat-msg-text">{m.text}</div>
              <div className="chat-msg-meta">
                {getName(m.from)} • {m.time}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-row">
        <input
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn small primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

/* ------------------ ADD ACHIEVEMENT FORM (ADMIN) ------------------ */
function AchievementForm({ onAdd, users }) {
  const [formData, setFormData] = useState({
    studentEmail: "",
    activity: "",
    category: "Participation",
    level: "College",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.studentEmail ||
      !formData.activity ||
      !formData.date
    ) {
      alert("Please select student, activity and date.");
      return;
    }

    const student = users.find(
      (u) =>
        u.role === "student" &&
        u.email.toLowerCase() === formData.studentEmail.toLowerCase()
    );

    if (!student) {
      alert("Selected student not found.");
      return;
    }

    const payload = {
      studentName: student.name,
      studentEmail: student.email.toLowerCase(),
      activity: formData.activity,
      category: formData.category,
      level: formData.level,
      date: formData.date,
      description: formData.description,
    };

    onAdd(payload);

    setFormData({
      studentEmail: "",
      activity: "",
      category: "Participation",
      level: "College",
      date: "",
      description: "",
    });
  };

  const studentOptions = users.filter((u) => u.role === "student");

  return (
    <div className="card">
      <h4>Add Achievement</h4>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Select Student</label>
          <select
            name="studentEmail"
            value={formData.studentEmail}
            onChange={handleChange}
          >
            <option value="">-- Select student --</option>
            {studentOptions.map((s) => (
              <option key={s.id} value={s.email}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
          {studentOptions.length === 0 && (
            <div style={{ fontSize: "0.8rem", color: "#f97373" }}>
              No student accounts yet. Ask students to sign up first.
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Activity / Event</label>
          <input
            name="activity"
            placeholder="Enter activity name"
            value={formData.activity}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Participation</option>
              <option>Award</option>
              <option>Recognition</option>
            </select>
          </div>

          <div className="form-group">
            <label>Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option>College</option>
              <option>Intercollege</option>
              <option>State</option>
              <option>National</option>
              <option>International</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Write a short note"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button className="btn primary full">Save</button>
      </form>
    </div>
  );
}

/* ------------------ SUMMARY CARDS ------------------ */
function AdminSummary({ achievements, payments }) {
  const total = achievements.length;
  const awards = achievements.filter((a) => a.category === "Award").length;
  const recognition = achievements.filter(
    (a) => a.category === "Recognition"
  ).length;
  const participation = achievements.filter(
    (a) => a.category === "Participation"
  ).length;

  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => {
    // amount like "₹499" -> number 499 if possible
    const num = parseInt(
      String(p.amount).replace(/[^0-9]/g, ""),
      10
    );
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="card">
      <h4>Summary</h4>

      <div className="summary-grid">
        <SummaryCard label="Total Achievements" value={total} />
        <SummaryCard label="Awards" value={awards} />
        <SummaryCard label="Recognition" value={recognition} />
        <SummaryCard label="Participation" value={participation} />
        <SummaryCard label="Payments (Demo)" value={totalPayments} />
        <SummaryCard label="Amount (Approx)" value={`₹${totalAmount}`} />
      </div>
    </div>
  );
}

function StudentSummary({ achievements, payments }) {
  const total = achievements.length;
  const awards = achievements.filter((a) => a.category === "Award").length;
  const recognition = achievements.filter(
    (a) => a.category === "Recognition"
  ).length;
  const participation = achievements.filter(
    (a) => a.category === "Participation"
  ).length;

  return (
    <div className="card">
      <h4>My Summary</h4>

      <div className="summary-grid">
        <SummaryCard label="Total" value={total} />
        <SummaryCard label="Awards" value={awards} />
        <SummaryCard label="Recognition" value={recognition} />
        <SummaryCard label="Participation" value={participation} />
        <SummaryCard label="Payments" value={payments.length} />
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="summary-card">
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
    </div>
  );
}

/* ------------------ TABLE ------------------ */
function AchievementTable({ achievements, onUpdate, onDelete }) {
  const handleEdit = (achievement) => {
    const activity = prompt("New Activity", achievement.activity);
    if (activity === null) return;

    const description = prompt(
      "New Description",
      achievement.description || ""
    );
    if (description === null) return;

    onUpdate({ ...achievement, activity, description });
  };

  if (achievements.length === 0) {
    return <p>No records yet.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Student Email</th>
          <th>Activity</th>
          <th>Category</th>
          <th>Level</th>
          <th>Date</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {achievements.map((a) => (
          <tr key={a.id}>
            <td>{a.studentName}</td>
            <td>{a.studentEmail}</td>
            <td>{a.activity}</td>
            <td>{a.category}</td>
            <td>{a.level}</td>
            <td>{a.date}</td>
            <td>{a.description}</td>
            <td>
              <button className="btn small" onClick={() => handleEdit(a)}>
                Edit
              </button>
              <button
                className="btn small danger"
                onClick={() => onDelete(a.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ------------------ STUDENT LIST ------------------ */
function AchievementList({ achievements }) {
  return (
    <ul className="achievement-list">
      {achievements.map((a) => (
        <li key={a.id} className="achievement-item">
          <h5>{a.activity}</h5>
          <p>
            <strong>{a.category}</strong> | {a.level} | {a.date}
          </p>
          {a.description && <p>{a.description}</p>}
        </li>
      ))}
    </ul>
  );
}