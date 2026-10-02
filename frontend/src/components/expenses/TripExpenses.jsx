import React from 'react';

export default function TripExpenses({ expenses = [] }) {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <div className="trip-expenses-view glass-panel">
      <div className="expenses-summary-card">
        <h3>💰 Trip Shared Expenses</h3>
        <p>Deterministic fair split among trip members</p>
        <div className="total-budget-badge">Total Logged: ${total.toFixed(2)}</div>
      </div>

      {expenses.length === 0 ? (
        <div className="p-6 text-center text-muted">No shared expenses logged yet for this trip.</div>
      ) : (
        <div className="expenses-table-wrap">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Paid By</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td><strong>{exp.title}</strong></td>
                  <td><span className="tag-chip">{exp.category || 'General'}</span></td>
                  <td>{exp.payer_username || 'Member'}</td>
                  <td className="expense-amt">${parseFloat(exp.amount).toFixed(2)}</td>
                  <td>{exp.date || 'Recent'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
