'use client';
import { useState, useEffect } from 'react';

export default function AttendancePage({ params }) {
  const [attendance, setAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo attendance data
    const demoAttendance = [
      {
        _id: 'att_1',
        userId: 'user_1',
        tenantId: 'tenant_1',
        date: new Date(),
        clockIn: new Date(new Date().setHours(9, 0, 0, 0)),
        clockOut: new Date(new Date().setHours(17, 0, 0, 0)),
        hoursWorked: 8,
        status: 'present'
      },
      {
        _id: 'att_2',
        userId: 'user_1',
        tenantId: 'tenant_1',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        clockIn: new Date(new Date().setHours(9, 15, 0, 0)),
        clockOut: new Date(new Date().setHours(17, 0, 0, 0)),
        hoursWorked: 7.75,
        status: 'late'
      }
    ];

    setAttendance(demoAttendance);
    setTodayAttendance(demoAttendance[0]); // Today's attendance
    setLoading(false);
  }, []);

  const handleClockIn = async () => {
    // Demo clock in
    const newAttendance = {
      _id: 'att_new',
      userId: 'user_1',
      tenantId: 'tenant_1',
      date: new Date(),
      clockIn: new Date(),
      status: 'present'
    };
    setTodayAttendance(newAttendance);
  };

  const handleClockOut = async () => {
    // Demo clock out
    if (todayAttendance) {
      const clockOutTime = new Date();
      const hoursWorked = (clockOutTime - new Date(todayAttendance.clockIn)) / (1000 * 60 * 60);
      
      const updatedAttendance = {
        ...todayAttendance,
        clockOut: clockOutTime,
        hoursWorked: parseFloat(hoursWorked.toFixed(2))
      };
      setTodayAttendance(updatedAttendance);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-2">Track and manage team attendance</p>
      </div>

      {/* Clock In/Out Section */}
      <AttendanceTracker
        todayAttendance={todayAttendance}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
      />

      {/* Attendance Calendar */}
      <div className="mt-8">
        <AttendanceCalendar
          attendance={attendance}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          loading={loading}
        />
      </div>
    </div>
  );
}

// Simple AttendanceTracker for this file
function AttendanceTracker({ todayAttendance, onClockIn, onClockOut }) {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Attendance</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Time */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Current Time</p>
          <p className="text-2xl font-bold text-gray-900">{currentTime}</p>
        </div>

        {/* Clock In/Out Status */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Today's Status</p>
          {todayAttendance ? (
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Clocked In
              </span>
              <p className="text-sm text-gray-600 mt-1">
                At: {new Date(todayAttendance.clockIn).toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Not Clocked In
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 mb-2">Actions</p>
          {!todayAttendance ? (
            <button
              onClick={onClockIn}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Clock In
            </button>
          ) : !todayAttendance.clockOut ? (
            <button
              onClick={onClockOut}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Clock Out
            </button>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Completed for Today
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple AttendanceCalendar for this file
function AttendanceCalendar({ attendance, selectedDate, onDateChange, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Attendance Calendar</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const prevMonth = new Date(selectedDate);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              onDateChange(prevMonth);
            }}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm font-medium">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => {
              const nextMonth = new Date(selectedDate);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              onDateChange(nextMonth);
            }}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="text-center text-gray-600">
        <p>Attendance calendar view would be displayed here.</p>
        <p className="text-sm mt-2">Found {attendance.length} attendance records for this period.</p>
      </div>
    </div>
  );
}