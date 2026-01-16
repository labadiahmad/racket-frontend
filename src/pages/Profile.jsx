import { useEffect, useMemo, useState } from "react";
import "./profile.css";
import { Container, Row, Col, Card, Button, Badge, Nav, Form, InputGroup, Modal } from "react-bootstrap";

const COURT_SLOTS = {
  court1: [
    { id: "s1", from: "18:00", to: "19:00", price: 25 },
    { id: "s2", from: "19:00", to: "20:00", price: 25 },
    { id: "s3", from: "20:00", to: "21:00", price: 25 },
  ],
  court2: [
    { id: "s1", from: "18:00", to: "19:00", price: 25 },
    { id: "s2", from: "19:00", to: "20:00", price: 25 },
  ],
  court3: [
    { id: "s1", from: "18:00", to: "19:00", price: 30 },
    { id: "s2", from: "19:00", to: "20:00", price: 30 },
  ],
};

export default function Profile({ user, setUser, reservations, setReservations }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);

  
  const [draft, setDraft] = useState(user);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const [openEditRes, setOpenEditRes] = useState(false);
  const [resDraft, setResDraft] = useState(null);

  useEffect(() => {
    setDraft(user);
  }, [user]);

  const initials = `${(user?.firstName || "U")[0]}${(user?.lastName || "S")[0]}`.toUpperCase();

  const totalActive = (reservations || []).filter((x) => x.status === "Active").length;
  const totalCancelled = (reservations || []).filter((x) => x.status === "Cancelled").length;

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const saveProfile = () => {
    if (!draft.firstName?.trim() || !draft.lastName?.trim()) return;
    if (!draft.email?.trim() || !draft.phone?.trim()) return;
    setUser(draft);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(user);
    setEditing(false);
  };

  const openReschedule = (res) => {
    const courtId = res.courtId || "";
    const slots = COURT_SLOTS[courtId] || [];

    const currentSlot =
      slots.find((s) => s.from === res?.slot?.from && s.to === res?.slot?.to) || slots[0];

    setResDraft({
      id: res.id,
      clubName: res.clubName,
      courtName: res.courtName,
      courtId,
      status: res.status,
      date: res?.dateISO ? res.dateISO.slice(0, 10) : "",

      slotId: currentSlot ? currentSlot.id : "",
      from: currentSlot ? currentSlot.from : (res?.slot?.from || ""),
      to: currentSlot ? currentSlot.to : (res?.slot?.to || ""),
      price: currentSlot ? currentSlot.price : (res?.slot?.price ?? 0),
    });

    setOpenEditRes(true);
  };

  const closeReschedule = () => {
    setOpenEditRes(false);
    setResDraft(null);
  };

  const updateReservation = () => {
    if (!resDraft) return;

    setReservations((prev) =>
      (prev || []).map((x) => {
        if (x.id !== resDraft.id) return x;

        const oldISO = x.dateISO || new Date().toISOString();
        const newISO = resDraft.date ? `${resDraft.date}T${oldISO.slice(11)}` : oldISO;

        return {
          ...x,
          dateISO: newISO,
          slot: {
            from: resDraft.from,
            to: resDraft.to,
            price: resDraft.price,
          },
        };
      })
    );

    closeReschedule();
  };

  const cancelReservation = (id) => {
    setReservations((prev) =>
      (prev || []).map((x) => (x.id === id ? { ...x, status: "Cancelled" } : x))
    );
  };

  const restoreReservation = (id) => {
    setReservations((prev) =>
      (prev || []).map((x) => (x.id === id ? { ...x, status: "Active" } : x))
    );
  };

  const list = useMemo(() => {
    let arr = (reservations || []).slice();

    arr.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));

    const s = q.trim().toLowerCase();
    if (s) {
      arr = arr.filter((x) => {
        const t = `${x.id} ${x.clubName} ${x.courtName} ${x.dateISO} ${x?.slot?.from}`.toLowerCase();
        return t.includes(s);
      });
    }

    if (filter !== "All") arr = arr.filter((x) => x.status === filter);

    return arr;
  }, [reservations, q, filter]);

  return (
  <div className="pf-page">
    <Container className="pf-shell">
      {/* HERO */}
      <Card className="pf-hero mb-3">
        <Card.Body className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="pf-avatar">
              {user.photo ? (
                <img className="pf-avatarImg" src={user.photo} alt="Profile" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div>
              <div className="pf-name">{user.firstName} {user.lastName}</div>
              <div className="pf-sub">{user.city} • {user.email}</div>

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
                  <Button variant="success" onClick={saveProfile}>Save</Button>
                  <Button variant="outline-secondary" onClick={cancelEdit}>Cancel</Button>
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
            <Nav.Item>
              <Nav.Link eventKey="profile">Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="security">Security</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reservations">Reservations</Nav.Link>
            </Nav.Item>
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

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="pf-photoPreview">
                    {draft.photo ? (
                      <img className="pf-avatarImg" src={draft.photo} alt="Preview" />
                    ) : (
                      <span className="pf-photoInitials">{initials}</span>
                    )}
                  </div>

                  {editing && (
                    <Form.Label className="pf-uploadBtn mb-0">
                      Upload photo
                      <Form.Control
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          setDraft((p) => ({ ...p, photo: url }));
                        }}
                      />
                    </Form.Label>
                  )}
                </div>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="pf-muted">First name</Form.Label>
                      <Form.Control
                        value={editing ? draft.firstName : user.firstName}
                        disabled={!editing}
                        onChange={(e) => setDraft((p) => ({ ...p, firstName: e.target.value }))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="pf-muted">Last name</Form.Label>
                      <Form.Control
                        value={editing ? draft.lastName : user.lastName}
                        disabled={!editing}
                        onChange={(e) => setDraft((p) => ({ ...p, lastName: e.target.value }))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="pf-muted">Email</Form.Label>
                      <Form.Control
                        value={editing ? draft.email : user.email}
                        disabled={!editing}
                        onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="pf-muted">Phone</Form.Label>
                      <Form.Control
                        value={editing ? draft.phone : user.phone}
                        disabled={!editing}
                        onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="pf-muted">City</Form.Label>
                      <Form.Control
                        value={editing ? draft.city : user.city}
                        disabled={!editing}
                        onChange={(e) => setDraft((p) => ({ ...p, city: e.target.value }))}
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

                <hr className="my-3" />

                <Card.Title className="pf-cardTitle">Recent activity</Card.Title>

                <div className="d-flex flex-column gap-2">
                  {(reservations || []).slice(0, 3).map((r) => (
                    <div key={r.id} className="pf-activityRow">
                      <span className={`pf-dot ${r.status === "Active" ? "ok" : "bad"}`} />
                      <div>
                        <div className="pf-activityMain">{r.clubName} • {r.courtName}</div>
                        <div className="pf-activitySub">
                          {formatDate(r.dateISO)} • {r?.slot?.from}-{r?.slot?.to} • {r.status}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(reservations || []).length === 0 && (
                    <div className="pf-muted">No reservations yet.</div>
                  )}
                </div>
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
                <div className="pf-muted">Edit date and pick a slot (time + price).</div>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center" style={{ minWidth: 280 }}>
                <InputGroup style={{ minWidth: 240 }}>
                  <InputGroup.Text>🔎</InputGroup.Text>
                  <Form.Control
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search reservations"
                  />
                </InputGroup>

                <Form.Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ width: 160 }}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              {list.map((r) => (
                <Card
  key={r.id}
  className={`pf-bookCard ${r.status === "Cancelled" ? "isCancelled" : ""}`}
>
  {/* left image */}
  <div className="pf-bookImg">
    <img src={r.courtImage || "/placeholder-court.jpg"} alt={r.courtName} />
    <span className={`pf-bookStatus ${r.status === "Active" ? "ok" : "bad"}`}>
      {r.status}
    </span>
  </div>

  {/* right content */}
  <div className="pf-bookRight">
    <div className="pf-bookHeader">
      <div className="pf-bookTitleWrap">
        <span className="pf-bookLogoSm">
          <img src={r.clubLogo || "/placeholder-logo.png"} alt={r.clubName} />
        </span>

        <div className="pf-bookTitles">
          <div className="pf-bookClubName">{r.clubName}</div>
          <div className="pf-bookCourtName">{r.courtName}</div>
        </div>
      </div>

      <div className="pf-bookHeaderRight">
        <div className="pf-bookId">{r.id}</div>

        <div className="pf-bookActions">
          {r.status === "Active" ? (
            <>
              <Button size="sm" variant="primary" onClick={() => openReschedule(r)}>
                Edit
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => cancelReservation(r.id)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline-secondary" onClick={() => restoreReservation(r.id)}>
              Restore
            </Button>
          )}
        </div>
      </div>
    </div>

    {/* meta */}
    <div className="pf-bookMetaNew">
      <div className="pf-chip">
        <span className="pf-chipLabel">Date</span>
        <span className="pf-chipValue">{formatDate(r.dateISO)}</span>
      </div>

      <div className="pf-chip">
        <span className="pf-chipLabel">Time</span>
        <span className="pf-chipValue">
          {r?.slot?.from} – {r?.slot?.to}
        </span>
      </div>

      <div className="pf-chip isPrice">
        <span className="pf-chipLabel">Total</span>
        <span className="pf-chipValue">{r?.slot?.price} JD</span>
      </div>
    </div>
  </div>
</Card>
              ))}

              {list.length === 0 && (
                <div className="text-center py-4">
                  <div className="fw-bold">No reservations found</div>
                  <div className="pf-muted">Try changing the search or filter.</div>
                </div>
              )}
            </div>
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
          <div className="pf-muted mb-3">
            Change your password (UI only for now).
          </div>

          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="pf-muted">Current password</Form.Label>
                <Form.Control type="password" placeholder="Enter current password" />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="pf-muted">New password</Form.Label>
                <Form.Control type="password" placeholder="New password" />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="pf-muted">Confirm new password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-4">
            <Button variant="primary">Update Password</Button>
            <Button variant="outline-secondary">Logout</Button>
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

          <hr className="my-3" />

          <div className="pf-muted">City</div>
          <div className="fw-bold">{user.city}</div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
)}
      {/* MODAL */}
      <Modal show={openEditRes && !!resDraft} onHide={closeReschedule} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit reservation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {resDraft && (
            <>
              <div className="pf-muted mb-2">
                {resDraft.clubName} • {resDraft.courtName} ({resDraft.id})
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={resDraft.date}
                      onChange={(e) => setResDraft((p) => ({ ...p, date: e.target.value }))}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Time Slot</Form.Label>

                    {!resDraft.courtId ? (
                      <div className="pf-warnBox">
                        Missing <b>courtId</b>. Add courtId to reservations to enable slot picking.
                      </div>
                    ) : (
                      <Form.Select
                        value={resDraft.slotId}
                        onChange={(e) => {
                          const newSlotId = e.target.value;
                          const slots = COURT_SLOTS[resDraft.courtId] || [];
                          const picked = slots.find((s) => s.id === newSlotId);

                          setResDraft((p) => ({
                            ...p,
                            slotId: newSlotId,
                            from: picked ? picked.from : "",
                            to: picked ? picked.to : "",
                            price: picked ? picked.price : p.price,
                          }));
                        }}
                      >
                        {(COURT_SLOTS[resDraft.courtId] || []).map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.from} - {s.to} ({s.price} JD)
                          </option>
                        ))}
                      </Form.Select>
                    )}

                    <div className="pf-muted mt-2">
                      Selected price: <b>{resDraft.price} JD</b>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" className="shadow-sm" onClick={updateReservation}>
  Save changes
</Button>
          <Button variant="outline-secondary" onClick={closeReschedule}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  </div>
);
}