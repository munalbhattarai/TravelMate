import React, { useState } from 'react';
import { tripApi } from '../../services/tripApi';

export default function TripExpenses({ tripId, expenses = [], members = [], onExpenseAdded }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [statementOpen, setStatementOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [selectedParticipants, setSelectedParticipants] = useState(
    members.map((m) => m.user_id || m.id)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Overall financial calculations
  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'other';
    acc[cat] = (acc[cat] || 0) + parseFloat(exp.amount || 0);
    return acc;
  }, {});

  // Calculate member balances (Paid vs Owed)
  const memberBalances = {};
  members.forEach((m) => {
    const username = m.user || m.username;
    if (username) {
      memberBalances[username] = { paid: 0, owed: 0, net: 0 };
    }
  });

  expenses.forEach((exp) => {
    const payer = exp.paid_by_username || 'Member';
    const amt = parseFloat(exp.amount || 0);

    if (!memberBalances[payer]) {
      memberBalances[payer] = { paid: 0, owed: 0, net: 0 };
    }
    memberBalances[payer].paid += amt;

    // Shares
    if (exp.shares && exp.shares.length > 0) {
      exp.shares.forEach((share) => {
        const debtor = share.username;
        const shareAmt = parseFloat(share.amount_owed || 0);
        if (!memberBalances[debtor]) {
          memberBalances[debtor] = { paid: 0, owed: 0, net: 0 };
        }
        memberBalances[debtor].owed += shareAmt;
      });
    } else {
      // Fallback equal split among members
      const count = members.length > 0 ? members.length : 1;
      const equalShare = amt / count;
      members.forEach((m) => {
        const u = m.user || m.username;
        if (memberBalances[u]) {
          memberBalances[u].owed += equalShare;
        }
      });
    }
  });

  // Calculate net balances
  Object.keys(memberBalances).forEach((u) => {
    memberBalances[u].net = memberBalances[u].paid - memberBalances[u].owed;
  });

  const handleOpenAddModal = () => {
    setSelectedParticipants(members.map((m) => m.user_id || m.id));
    setDescription('');
    setAmount('');
    setCategory('food');
    setError('');
    setModalOpen(true);
  };

  const toggleParticipant = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      setError('Please provide a valid description and amount.');
      return;
    }
    if (selectedParticipants.length === 0) {
      setError('Please select at least one member to split the cost with.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await tripApi.addExpense({
        trip: tripId,
        description: description.trim(),
        amount: parseFloat(amount).toFixed(2),
        category,
        participant_ids: selectedParticipants
      });
      setModalOpen(false);
      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      setError(err.message || 'Failed to record expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="trip-expenses-view">
      {/* Financial Summary Dashboard */}
      <div className="expenses-dashboard-grid">
        <div className="expense-stat-card total-card">
          <span className="stat-card-label">Total Expedition Spend</span>
          <h2 className="stat-card-value">NPR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <span className="stat-card-sub">Logged across {expenses.length} transactions</span>
        </div>

        <div className="expense-stat-card avg-card">
          <span className="stat-card-label">Per-Person Fair Share</span>
          <h2 className="stat-card-value">
            NPR {(members.length > 0 ? totalAmount / members.length : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <span className="stat-card-sub">Split evenly across {members.length} companions</span>
        </div>

        <div className="expense-stat-card actions-card">
          <span className="stat-card-label">Expedition Expense Actions</span>
          <div className="expense-cta-row">
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              + Log Expense
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setStatementOpen(true)}>
              📄 Settlement Statement
            </button>
          </div>
        </div>
      </div>

      {/* Category Breakdown Badges */}
      <div className="expense-category-breakdown">
        <div className="cat-pill">
          🏡 Hotel/Teahouse: <strong>NPR {(categoryTotals.hotel || 0).toLocaleString()}</strong>
        </div>
        <div className="cat-pill">
          🍲 Meals & Food: <strong>NPR {(categoryTotals.food || 0).toLocaleString()}</strong>
        </div>
        <div className="cat-pill">
          🚌 Transport/Jeep: <strong>NPR {(categoryTotals.transport || 0).toLocaleString()}</strong>
        </div>
        <div className="cat-pill">
          🎒 Gear & Permits: <strong>NPR {(categoryTotals.other || 0).toLocaleString()}</strong>
        </div>
      </div>

      {/* Settlement Balance Ledger */}
      <div className="settlement-ledger-card">
        <div className="ledger-header">
          <h3>⚖️ Companion Balance Ledger</h3>
          <span className="text-muted text-sm">Real-time fair split calculation</span>
        </div>

        <div className="ledger-grid">
          {Object.entries(memberBalances).map(([username, bal]) => (
            <div key={username} className="ledger-member-tile">
              <div className="ledger-member-top">
                <span className="ledger-avatar">{username.charAt(0).toUpperCase()}</span>
                <strong>{username}</strong>
              </div>
              <div className="ledger-details">
                <div className="ledger-row">
                  <span>Paid:</span>
                  <span>NPR {bal.paid.toLocaleString()}</span>
                </div>
                <div className="ledger-row">
                  <span>Share:</span>
                  <span>NPR {bal.owed.toLocaleString()}</span>
                </div>
                <div className="ledger-net-row">
                  <span>Net Balance:</span>
                  <strong className={bal.net >= 0 ? 'text-positive' : 'text-negative'}>
                    {bal.net >= 0 ? `+NPR ${bal.net.toLocaleString()}` : `-NPR ${Math.abs(bal.net).toLocaleString()}`}
                  </strong>
                </div>
              </div>
            </div>
          ))}
          {Object.keys(memberBalances).length === 0 && (
            <div className="p-4 text-center text-muted">No member transactions recorded.</div>
          )}
        </div>
      </div>

      {/* Itemized Expenses Table */}
      <div className="expenses-table-card">
        <div className="table-header-row">
          <h3>🧾 Itemized Expenses</h3>
          <span className="badge-count">{expenses.length} Records</span>
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <p>No shared expenses recorded yet.</p>
            <button className="btn btn-primary btn-sm mt-3" onClick={handleOpenAddModal}>
              Log the First Expense
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Paid By</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td><strong>{exp.description}</strong></td>
                    <td><span className="tag-chip">{exp.category}</span></td>
                    <td>{exp.paid_by_username || 'Member'}</td>
                    <td className="expense-amt">NPR {parseFloat(exp.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td>{exp.created_at ? new Date(exp.created_at).toLocaleDateString() : 'Recent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💰 Log Shared Expedition Expense</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateExpense} className="modal-body">
              {error && <div className="alert-banner-error mb-3">⚠️ {error}</div>}

              <div className="form-group mb-3">
                <label>Description / Expense Item</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Jeep Pokhara to Besisahar, Teahouse stay, ACAP permit"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2col mb-3">
                <div className="form-group">
                  <label>Amount (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="form-control"
                    placeholder="e.g. 4500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="food">🍲 Food & Dining</option>
                    <option value="hotel">🏡 Hotel / Teahouse</option>
                    <option value="transport">🚌 Transport & Jeep</option>
                    <option value="other">🎒 Gear & Permits</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Split Fairly Between:</label>
                <div className="participant-checkboxes">
                  {members.map((m) => {
                    const uId = m.user_id || m.id;
                    const uName = m.user || m.username;
                    return (
                      <label key={uId} className="participant-chip">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(uId)}
                          onChange={() => toggleParticipant(uId)}
                        />
                        <span>{uName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Recording...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Settlement Statement Modal */}
      {statementOpen && (
        <div className="modal-backdrop" onClick={() => setStatementOpen(false)}>
          <div className="modal-content modal-lg printable-statement" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>📜 TravelMate Nepal Expedition Settlement Statement</h3>
                <span className="text-muted text-sm">Official Cost Reconciliation & Settlement Summary</span>
              </div>
              <div className="header-actions-print">
                <button className="btn btn-primary btn-sm" onClick={handlePrintStatement}>
                  🖨️ Print / Save PDF
                </button>
                <button className="modal-close-btn" onClick={() => setStatementOpen(false)}>✕</button>
              </div>
            </div>

            <div className="statement-body p-4">
              <div className="statement-meta-grid">
                <div>
                  <strong>Total Group Spend:</strong> NPR {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div>
                  <strong>Expedition Companions:</strong> {members.length} members
                </div>
                <div>
                  <strong>Total Transactions:</strong> {expenses.length}
                </div>
                <div>
                  <strong>Reconciliation Date:</strong> {new Date().toLocaleDateString()}
                </div>
              </div>

              <h4 className="mt-4 mb-2">Final Settlement Breakdown:</h4>
              <table className="expenses-table statement-table">
                <thead>
                  <tr>
                    <th>Traveler</th>
                    <th>Total Paid</th>
                    <th>Fair Share</th>
                    <th>Net Balance</th>
                    <th>Settlement Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(memberBalances).map(([username, bal]) => (
                    <tr key={username}>
                      <td><strong>{username}</strong></td>
                      <td>NPR {bal.paid.toLocaleString()}</td>
                      <td>NPR {bal.owed.toLocaleString()}</td>
                      <td className={bal.net >= 0 ? 'text-positive' : 'text-negative'}>
                        {bal.net >= 0 ? `+NPR ${bal.net.toLocaleString()}` : `-NPR ${Math.abs(bal.net).toLocaleString()}`}
                      </td>
                      <td>
                        {bal.net >= 0 ? (
                          <span className="badge-settle-receive">Receives Settlement</span>
                        ) : (
                          <span className="badge-settle-pay">Owes Group Share</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4 className="mt-4 mb-2">Itemized Log:</h4>
              <table className="expenses-table statement-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Paid By</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>{exp.description}</td>
                      <td>{exp.category}</td>
                      <td>{exp.paid_by_username || 'Member'}</td>
                      <td>NPR {parseFloat(exp.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="statement-footer text-muted text-xs mt-4 text-center">
                Generated via TravelMate Nepal Collaborative Trip Workspace • All currency values in Nepalese Rupee (NPR)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
