import { db } from '../../config/db.js';

export const getExecutiveDashboard = async (userId: string, role: string) => {
  const date = new Date().toISOString().split('T')[0];

  // 1. Today's Attendance
  const attRes = await db.query('SELECT COUNT(*) as count FROM attendance WHERE date = $1', [date]);
  const todaysAttendance = parseInt(attRes.rows[0].count);

  // 2. Active MRs
  const activeMrRes = await db.query('SELECT COUNT(*) as count FROM users WHERE role = $1 AND is_active = true', ['MR']);
  const activeMRs = parseInt(activeMrRes.rows[0].count);

  // 3. Pending MTP
  const mtpRes = await db.query("SELECT COUNT(*) as count FROM mtp WHERE status = 'PENDING'");
  const pendingMTP = parseInt(mtpRes.rows[0].count);

  // 4. Completed Calls & Pending Calls Today
  const callsRes = await db.query(`
    SELECT is_completed, COUNT(*) as count 
    FROM dcr_doctor_calls c
    JOIN dcr d ON c.dcr_id = d.id
    WHERE d.date = $1
    GROUP BY is_completed
  `, [date]);
  
  let completedCalls = 0;
  let pendingCalls = 0;
  callsRes.rows.forEach(r => {
    if (r.is_completed) completedCalls = parseInt(r.count);
    else pendingCalls = parseInt(r.count);
  });

  // 5. Expenses Summary (Total Pending Amount)
  const expRes = await db.query("SELECT SUM(total) as amount FROM expenses WHERE status = 'PENDING'");
  const pendingExpensesAmount = parseFloat(expRes.rows[0].amount || 0);

  // 6. Sales Summary Today
  const salesRes = await db.query("SELECT SUM(value) as amount FROM secondary_sales WHERE entry_date = $1", [date]);
  const todaySalesAmount = parseFloat(salesRes.rows[0].amount || 0);

  return {
    todaysAttendance,
    activeMRs,
    pendingMTP,
    calls: {
      completed: completedCalls,
      pending: pendingCalls
    },
    pendingExpensesAmount,
    todaySalesAmount
  };
};

export const getMrDashboard = async (userId: string) => {
  const date = new Date().toISOString().split('T')[0];
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // 1. Attendance Today
  const attRes = await db.query('SELECT status, check_in_time, check_out_time FROM attendance WHERE user_id = $1 AND date = $2', [userId, date]);
  const todayAttendance = attRes.rows[0] || { status: 'ABSENT', check_in_time: null, check_out_time: null };

  // 2. Doctor Calls Today
  const callsRes = await db.query(`
    SELECT is_completed, COUNT(*) as count
    FROM dcr_doctor_calls c
    JOIN dcr d ON c.dcr_id = d.id
    WHERE d.user_id = $1 AND d.date = $2
    GROUP BY is_completed
  `, [userId, date]);

  let completedCallsToday = 0;
  let pendingCallsToday = 0;
  callsRes.rows.forEach(r => {
    if (r.is_completed) completedCallsToday = parseInt(r.count);
    else pendingCallsToday = parseInt(r.count);
  });

  // 3. MTP Status
  const mtpRes = await db.query('SELECT status FROM mtp WHERE user_id = $1 AND month = $2 AND year = $3', [userId, month, year]);
  const mtpStatus = mtpRes.rows[0]?.status || 'NOT_SUBMITTED';

  // 4. Expenses Total Month
  const expRes = await db.query("SELECT SUM(total) as total FROM expenses WHERE user_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3", [userId, month, year]);
  const monthExpenseAmount = parseFloat(expRes.rows[0]?.total || 0);

  // 5. Sales Month
  const salesRes = await db.query("SELECT SUM(value) as total FROM secondary_sales WHERE user_id = $1 AND EXTRACT(MONTH FROM entry_date) = $2 AND EXTRACT(YEAR FROM entry_date) = $3", [userId, month, year]);
  const monthSalesAmount = parseFloat(salesRes.rows[0]?.total || 0);

  return {
    todayAttendance,
    calls: {
      completedToday: completedCallsToday,
      pendingToday: pendingCallsToday,
      targetToday: 12
    },
    mtpStatus,
    monthExpenseAmount,
    monthSalesAmount
  };
};

export const getManagerDashboard = async (managerId: string) => {
  const date = new Date().toISOString().split('T')[0];

  // 1. Total Team Size (MRs)
  const teamRes = await db.query("SELECT id, name, role FROM users WHERE role = 'MR' AND is_active = true");
  const teamMembers = teamRes.rows;
  const teamSize = teamMembers.length;

  // 2. Team Attendance Today
  const attRes = await db.query("SELECT COUNT(*) as count FROM attendance WHERE date = $1 AND status = 'PRESENT'", [date]);
  const presentCount = parseInt(attRes.rows[0]?.count || 0);

  // 3. Pending Approvals
  const pendingMtpRes = await db.query("SELECT COUNT(*) as count FROM mtp WHERE status = 'PENDING'");
  const pendingExpenseRes = await db.query("SELECT COUNT(*) as count FROM expenses WHERE status = 'PENDING'");
  const pendingLeaveRes = await db.query("SELECT COUNT(*) as count FROM leaves WHERE status = 'PENDING'");

  const pendingApprovals = {
    mtp: parseInt(pendingMtpRes.rows[0]?.count || 0),
    expense: parseInt(pendingExpenseRes.rows[0]?.count || 0),
    leave: parseInt(pendingLeaveRes.rows[0]?.count || 0)
  };

  // 4. Calls Today Team Summary
  const callsRes = await db.query(`
    SELECT COUNT(*) as count
    FROM dcr_doctor_calls c
    JOIN dcr d ON c.dcr_id = d.id
    WHERE d.date = $1 AND c.is_completed = true
  `, [date]);
  const completedCallsToday = parseInt(callsRes.rows[0]?.count || 0);

  // 5. Team Status Details
  const teamStatusList = await Promise.all(
    teamMembers.map(async (member) => {
      const memberAtt = await db.query('SELECT status FROM attendance WHERE user_id = $1 AND date = $2', [member.id, date]);
      const memberCalls = await db.query(`
        SELECT COUNT(*) as count FROM dcr_doctor_calls c JOIN dcr d ON c.dcr_id = d.id WHERE d.user_id = $1 AND d.date = $2 AND c.is_completed = true
      `, [member.id, date]);
      return {
        id: member.id,
        name: member.name,
        role: member.role,
        attendanceStatus: memberAtt.rows[0]?.status || 'ABSENT',
        callsCompletedToday: parseInt(memberCalls.rows[0]?.count || 0)
      };
    })
  );

  return {
    teamSize,
    presentCount,
    absentCount: teamSize - presentCount,
    completedCallsToday,
    pendingApprovals,
    teamStatus: teamStatusList
  };
};
