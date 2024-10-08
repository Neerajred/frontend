import React, { useState, useEffect } from 'react';
import useLogout from '../utilities/Logout';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users/pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      } else {
        console.error('Failed to fetch pending users');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const Logout = useLogout();

  const fetchActiveUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users/active', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActiveUsers(data);
      } else {
        console.error('Failed to fetch active users');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchActiveUsers();
  }, []);



  const handleApproval = async (id, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved }),
      });
      
      if (!response.ok) {
        console.error('Failed to approve the user');
      }
      setPendingUsers(pendingUsers.filter((user) => user._id !== id));
      fetchActiveUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const refreshPage = () => {
    fetchPendingUsers();
    fetchActiveUsers();
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/reject/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPendingUsers(pendingUsers.filter((user) => user._id !== id));
      } else {
        console.error('Failed to reject the user');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Admin Dashboard</h2>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-700">Pending Users</h3>
            <div className='flex gap-3'>
            <button
              type="button"
              onClick={refreshPage}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={Logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
            </div>
          </div>
          <ul className="bg-white shadow rounded-lg overflow-hidden">
            {pendingUsers.length === 0 ? (
              <li className="p-4 text-center text-gray-500">No pending users</li>
            ) : (
              pendingUsers.map((user) => (
                <li key={user._id} className="p-4 flex justify-between items-center border-b last:border-none">
                  <span className="text-gray-800">{user.username} - {user.email}</span>
                  <div>
                    <button
                      onClick={() => handleApproval(user._id, true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600 transition duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Active Users</h3>
          <ul className="bg-white shadow rounded-lg overflow-hidden">
            {activeUsers.length === 0 ? (
              <li className="p-4 text-center text-gray-500">No active users</li>
            ) : (
              activeUsers.map((user) => (
                <li key={user._id} className="p-4 flex justify-between items-center border-b last:border-none">
                  <span className="text-gray-800">{user.username} - {user.email}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>  );
};

export default AdminDashboard;
