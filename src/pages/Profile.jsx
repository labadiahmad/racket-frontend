import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Nav,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";


const API_BASE = import.meta.env.VITE_API_URL;
const API = `${API_BASE}/api`;


function getSavedUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function authHeaders(extra = {}) {
  const u = getSavedUser();
  return {
    "Content-Type": "application/json",
    "x-user-id": String(u?.user_id || ""),
    "x-role": String(u?.role || "user"),
    ...extra,
  };
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

async function apiSend(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

function fileUrl(p) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `${API_BASE}${p}`;
}

function fmtDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString();
}

export default function Profile({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [draft, setDraft] = useState(user);

  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const [resErr, setResErr] = useState("");

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const [openEditRes, setOpenEditRes] = useState(false);
  const [resDraft, setResDraft] = useState(null);

  const navigate = useNavigate();


function handleDeleteUI() {
  if (!resDraft?.reservation_id) return;

  const ok = window.confirm(
    `Delete reservation #${resDraft.reservation_id}?\n\n(UI only الآن - لن يحذف من قاعدة البيانات)`
  );
  if (!ok) return;

  setReservations((prev) =>
    (prev || []).filter((x) => x.reservation_id !== resDraft.reservation_id)
  );

  closeReschedule();
}


  useEffect(() => {
    setDraft(user);
  }, [user]);

 
  useEffect(() => {
    let alive = true;

    async function loadAll() {
      const saved = getSavedUser();
      if (!saved?.user_id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr("");

      try {
        const me = await apiGet("/users/me"); 
        if (!alive) return;

        const freshUser = me.user || me;

        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);
        setDraft(freshUser);

try {
  setResLoading(true);
  setResErr("");

  const rr = await apiGet("/reservations");
  if (!alive) return;

  const list = Array.isArray(rr)
    ? rr
    : Array.isArray(rr.reservations)
    ? rr.reservations
    : [];

  setReservations(list);
  console.log("RES LIST:", list);
} catch (e) {
  if (!alive) return;
  setResErr(e.message || "Failed to load reservations");
  setReservations([]);
} finally {
  if (!alive) return;
  setResLoading(false);
}
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load profile");
      } finally {
        if (!alive) return;
        setLoading(false);
        setResLoading(false);
      }
    }

    loadAll();
    return () => {
      alive = false;
    };
  }, []);


const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("owner");
  localStorage.removeItem("reservationDraft");

  if (typeof setUser === "function") setUser(null);

  navigate("/", { replace: true });
   window.location.reload();
};
  async function deleteReservation(reservationId) {
  if (!reservationId) return;

  const ok = window.confirm(`Delete reservation #${reservationId}?`);
  if (!ok) return;

  try {
    await apiSend(`/reservations/${reservationId}`, { method: "DELETE" });

    setReservations((prev) =>
      (prev || []).filter((x) => x.reservation_id !== reservationId)
    );

    closeReschedule();
  } catch (e) {
    alert(e.message || "Failed to delete reservation");
  }
}
  
  const saveProfile = async () => {
    const full_name = (draft?.full_name || "").trim();
    const email = (draft?.email || "").trim();
    const phone = (draft?.phone || "").trim();

    if (!full_name || !email || !phone) return;

    try {
      const updated = await apiSend("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          full_name,
          email,
          phone,
          profile_image: draft?.profile_image || null,
        }),
      });

      const u = updated.user || updated;
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      setDraft(u);
      setEditing(false);
    } catch (e) {
      alert(e.message || "Failed to save profile");
    }
  };

  const cancelEdit = () => {
    setDraft(user);
    setEditing(false);
  };


  function getList() {
    let arr = (reservations || []).slice();

    arr.sort((a, b) => {
      const aa = a.created_at || a.date_iso || "";
      const bb = b.created_at || b.date_iso || "";
      return String(bb).localeCompare(String(aa));
    });

    const s = q.trim().toLowerCase();
    if (s) {
      arr = arr.filter((x) => {
        const t = `${x.reservation_id} ${x.club_id} ${x.court_id} ${x.date_iso} ${x.status}`.toLowerCase();
        return t.includes(s);
      });
    }

    if (filter !== "All") arr = arr.filter((x) => x.status === filter);

    return arr;
  }

  const list = getList();


function openReschedule(r) {
  setResDraft({
    reservation_id: r.reservation_id,
  });
  setOpenEditRes(true);
}

  function closeReschedule() {
    setOpenEditRes(false);
    setResDraft(null);
  }


  if (loading) return <div style={{ padding: 120 }}>Loading...</div>;
  if (err) return <div style={{ padding: 120 }}>{err}</div>;
  if (!user) return <div style={{ padding: 120 }}>No user session.</div>;

  const initials = String(user.full_name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();

  const totalActive = (reservations || []).filter((x) => x.status !== "Cancelled").length;
  const totalCancelled = (reservations || []).filter((x) => x.status === "Cancelled").length;

  return (
    <div className="pf-page">
      <Container className="pf-shell">
        {/* HERO */}
        <Card className="pf-hero mb-3">
          <Card.Body className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="pf-avatar">
                {user.profile_image ? (
                  <img className="pf-avatarImg" src={fileUrl(user.profile_image)} alt="Profile" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div>
                <div className="pf-name">{user.full_name}</div>
                <div className="pf-sub">{user.email}</div>

                <div className="d-flex flex-wrap gap-2 mt-2">
                  <Badge bg="primary">Active: {totalActive}</Badge>
                  <Badge bg="danger">Cancelled: {totalCancelled}</Badge>
                </div>
              </div>
            </div>

            {activeTab === "profile" && (
              <>
                {!editing ? (
                  <Button variant="primary" onClick={() => setEditing(true)}>
                    Edit profile
                  </Button>
                ) : (
                  <div className="d-flex gap-2">
                    <Button variant="success" onClick={saveProfile}>
                      Save
                    </Button>
                    <Button variant="outline-secondary" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>

        {/* TABS */}
        <Card className="pf-tabs mb-3">
          <Card.Body className="p-2">
            <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav.Item><Nav.Link eventKey="profile">Profile</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="security">Security</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="reservations">Reservations</Nav.Link></Nav.Item>
            </Nav>
          </Card.Body>
        </Card>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <Row className="g-3">
            <Col lg={7}>
              <Card className="pf-card">
                <Card.Body>
                  <Card.Title className="pf-cardTitle">Personal info</Card.Title>

                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="pf-muted">Full name</Form.Label>
                        <Form.Control
                          value={editing ? (draft?.full_name || "") : (user.full_name || "")}
                          disabled={!editing}
                          onChange={(e) => setDraft((p) => ({ ...p, full_name: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="pf-muted">Email</Form.Label>
                        <Form.Control
                          value={editing ? (draft?.email || "") : (user.email || "")}
                          disabled={!editing}
                          onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="pf-muted">Phone</Form.Label>
                        <Form.Control
                          value={editing ? (draft?.phone || "") : (user.phone || "")}
                          disabled={!editing}
                          onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="pf-card">
                <Card.Body>
                  <Card.Title className="pf-cardTitle">Quick stats</Card.Title>

                  <Row className="g-2">
                    <Col sm={4} xs={12}>
                      <Card className="pf-stat">
                        <Card.Body>
                          <div className="pf-statNum">{totalActive}</div>
                          <div className="pf-statLabel">Active</div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col sm={4} xs={12}>
                      <Card className="pf-stat">
                        <Card.Body>
                          <div className="pf-statNum">{(reservations || []).length}</div>
                          <div className="pf-statLabel">Total</div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col sm={4} xs={12}>
                      <Card className="pf-stat">
                        <Card.Body>
                          <div className="pf-statNum">{totalCancelled}</div>
                          <div className="pf-statLabel">Cancelled</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === "reservations" && (
          <Card className="pf-card">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <div className="pf-cardTitle">Your reservations</div>
                  <div className="pf-muted">Loaded from backend: GET /api/reservations</div>
                  {resErr && <div style={{ color: "crimson" }}>{resErr}</div>}
                </div>

                <div className="d-flex flex-wrap gap-2 align-items-center" style={{ minWidth: 280 }}>
                  <InputGroup style={{ minWidth: 240 }}>
                    <InputGroup.Text>🔎</InputGroup.Text>
                    <Form.Control value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." />
                  </InputGroup>

                  <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 160 }}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </div>
              </div>

              {resLoading ? (
                <div style={{ padding: 20 }}>Loading reservations...</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {list.map((r) => (
                    <Card key={r.reservation_id} className="pf-bookCard">
                      <div className="pf-bookRight" style={{ width: "100%" }}>
                        <div className="pf-bookHeader">
                          <div className="pf-bookTitles">
                            <div className="pf-bookClubName">Reservation #{r.reservation_id}</div>
                            <div className="pf-bookCourtName">
                              Club: {r.club_id} • Court: {r.court_id} • Slot: {r.slot_id}
                            </div>
                          </div>

                          <div className="pf-bookActions">
                            <Button size="sm" variant="outline-danger" onClick={() => openReschedule(r)}>
  Delete
</Button>
                          </div>
                        </div>

                        <div className="pf-bookMetaNew">
                          <div className="pf-chip">
                            <span className="pf-chipLabel">Date</span>
                            <span className="pf-chipValue">{fmtDate(r.date_iso)}</span>
                          </div>

                          <div className="pf-chip">
                            <span className="pf-chipLabel">Status</span>
                            <span className="pf-chipValue">{r.status || "Active"}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {list.length === 0 && (
                    <div className="text-center py-4">
                      <div className="fw-bold">No reservations found</div>
                      <div className="pf-muted">Try changing search or filter.</div>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <Row className="g-3">
            <Col lg={7}>
              <Card className="pf-card">
                <Card.Body>
                  <Card.Title className="pf-cardTitle">Security</Card.Title>
                  <div className="pf-muted mb-3">Logout only.</div>

                  <div className="d-flex gap-2 mt-4">
                    <Button variant="outline-secondary" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="pf-card">
                <Card.Body>
                  <Card.Title className="pf-cardTitle">Account info</Card.Title>

                  <div className="pf-muted">Email</div>
                  <div className="fw-bold">{user.email}</div>

                  <hr className="my-3" />

                  <div className="pf-muted">Phone</div>
                  <div className="fw-bold">{user.phone}</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
<Modal show={openEditRes && !!resDraft} onHide={closeReschedule} centered>
  <Modal.Header closeButton className="pf-modalHeader">
    <Modal.Title className="pf-modalTitle">Delete reservation</Modal.Title>
  </Modal.Header>

  <Modal.Body className="pf-modalBody">
    {resDraft && (
      <>
        <div className="pf-modalSub">
          You are about to delete reservation <strong>#{resDraft.reservation_id}</strong>.
        </div>

        <div className="pf-warnBox">
          This action will remove it from the database and it cannot be undone.
        </div>

        <div className="pf-modalActions">
          <Button
            variant="danger"
            onClick={() => deleteReservation(resDraft.reservation_id)}
          >
            Delete
          </Button>

          <Button variant="outline-secondary" onClick={closeReschedule}>
            Cancel
          </Button>
        </div>
      </>
    )}
  </Modal.Body>
</Modal>
      </Container>
    </div>
  );
}