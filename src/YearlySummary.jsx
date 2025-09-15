const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  
  function YearlySummary({ monthlyEntries }) {
    let totalIncome = 0;
    let totalExpense = 0;
  
    return (
      <div>
        <h2 style={{ textAlign: "center" }}>Yearly Summary</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>Month</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Income</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Expense</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Savings</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => {
              const monthData = monthlyEntries[m] || { income: [], expense: [] };
              const income = monthData.income.reduce((sum, e) => sum + e.amount, 0);
              const expense = monthData.expense.reduce((sum, e) => sum + e.amount, 0);
              const savings = income - expense;
              totalIncome += income;
              totalExpense += expense;
  
              return (
                <tr key={m}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{m}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>${income}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>${expense}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>${savings}</td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: "bold" }}>
              <td style={{ border: "1px solid black", padding: "8px" }}>Total</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>${totalIncome}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>${totalExpense}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>${totalIncome - totalExpense}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  
  export default YearlySummary;
  
  
