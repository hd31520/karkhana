export default function AttendanceTracker({ todayAttendance, onClockIn, onClockOut }) {
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

      {/* Today's Summary */}
      {todayAttendance && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Today's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Clock In</p>
              <p className="font-medium">
                {new Date(todayAttendance.clockIn).toLocaleTimeString()}
              </p>
            </div>
            {todayAttendance.clockOut && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Clock Out</p>
                  <p className="font-medium">
                    {new Date(todayAttendance.clockOut).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hours Worked</p>
                  <p className="font-medium">{todayAttendance.hoursWorked}h</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                todayAttendance.status === 'present' 
                  ? 'bg-green-100 text-green-800'
                  : todayAttendance.status === 'late'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {todayAttendance.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}