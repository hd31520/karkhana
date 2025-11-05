export default function AttendanceCalendar({ attendance, selectedDate, onDateChange, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Generate calendar days for the selected month
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayAttendance = attendance.find(a => {
      const attDate = new Date(a.date).toISOString().split('T')[0];
      return attDate === dateStr;
    });
    
    calendarDays.push({
      date,
      day,
      attendance: dayAttendance
    });
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

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(({ date, day, attendance }) => {
          const isToday = new Date().toDateString() === date.toDateString();
          const statusColor = attendance ? 
            (attendance.status === 'present' ? 'bg-green-100 text-green-800' :
             attendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
             'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-400';

          return (
            <div
              key={day}
              className={`text-center p-2 rounded-lg border text-sm ${statusColor} ${
                isToday ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="font-medium">{day}</div>
              {attendance && (
                <div className="text-xs mt-1">
                  {attendance.hoursWorked > 0 ? `${attendance.hoursWorked}h` : '—'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
          <span>No Record</span>
        </div>
      </div>
    </div>
  );
}