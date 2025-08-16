import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Analytics from '../../components/Analytics';
import UserManagement from '../../components/UserManagement';
import RoleManagement from '../../components/RoleManagement';
import MessagesView from '../../components/MessagesView';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    totalRoles: 0
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuTabs = [
    { id: 'analytics', name: 'Analytics', icon: 'chart-bar' },
    { id: 'users', name: 'User Management', icon: 'users' },
    { id: 'roles', name: 'Role Management', icon: 'shield' },
    { id: 'messages', name: 'Messages', icon: 'envelope' }
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon="shield" className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, roles, and monitor system activity</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-200" 
              onClick={handleLogout}
            >
              <span className="text-sm font-medium text-blue-600">Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {menuTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'analytics' && <Analytics stats={stats} />}
            {activeTab === 'users' && <UserManagement/>}
            {activeTab === 'roles' && <RoleManagement />}
            {activeTab === 'messages' && <MessagesView />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard