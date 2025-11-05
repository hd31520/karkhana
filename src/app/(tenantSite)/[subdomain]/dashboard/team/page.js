'use client';
import { useState, useEffect } from 'react';
import TeamTable from '@/components/dashboard/TeamTable';

export default function TeamPage({ params }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { subdomain } = params;

  useEffect(() => {
    fetchTeamMembers();
  }, [subdomain]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/tenant/users');
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      const response = await fetch('/api/tenant/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      const data = await response.json();

      if (data.success) {
        setTeamMembers(prev => [data.user, ...prev]);
        setShowAddForm(false);
        alert('Team member added successfully');
      } else {
        alert(data.error || 'Failed to add team member');
      }
    } catch (error) {
      console.error('Failed to add team member:', error);
      alert('Error adding team member');
    }
  };

  const handleUpdateMember = async (memberId, updates) => {
    try {
      const response = await fetch(`/api/tenant/users/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        setTeamMembers(prev => prev.map(member => 
          member._id === memberId ? data.user : member
        ));
        alert('Team member updated successfully');
      } else {
        alert(data.error || 'Failed to update team member');
      }
    } catch (error) {
      console.error('Failed to update team member:', error);
      alert('Error updating team member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tenant/users/${memberId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setTeamMembers(prev => prev.filter(member => member._id !== memberId));
        alert('Team member removed successfully');
      } else {
        alert(data.error || 'Failed to remove team member');
      }
    } catch (error) {
      console.error('Failed to remove team member:', error);
      alert('Error removing team member');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage your team members and their roles</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Team Member
        </button>
      </div>

      <TeamTable
        teamMembers={teamMembers}
        loading={loading}
        onUpdate={handleUpdateMember}
        onDelete={handleDeleteMember}
      />

      {/* Add Team Member Modal */}
      {showAddForm && (
        <AddTeamMemberForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddMember}
          existingManagers={teamMembers.filter(member => 
            ['boss', 'manager'].includes(member.role)
          )}
        />
      )}
    </div>
  );
}

function AddTeamMemberForm({ onClose, onSubmit, existingManagers }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    salary: '',
    position: '',
    phone: '',
    reportsTo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add Team Member</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter team member name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Sales Executive, Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Salary (BDT)
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter monthly salary"
            />
          </div>

          {formData.role === 'employee' && existingManagers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reports To
              </label>
              <select
                name="reportsTo"
                value={formData.reportsTo}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Manager</option>
                {existingManagers.map(manager => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name} ({manager.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}