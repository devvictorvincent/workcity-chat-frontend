import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Analytics = ({ stats }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    messageStats: [],
    userActivity: [],
    popularChannels: [],
    systemHealth: {
      uptime: '99.9%',
      responseTime: '120ms',
      errorRate: '0.1%'
    }
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demo
      setAnalyticsData({
        messageStats: [
          { date: '2024-01-01', messages: 45, users: 12 },
          { date: '2024-01-02', messages: 52, users: 15 },
          { date: '2024-01-03', messages: 38, users: 10 },
          { date: '2024-01-04', messages: 67, users: 18 },
          { date: '2024-01-05', messages: 71, users: 22 },
          { date: '2024-01-06', messages: 58, users: 16 },
          { date: '2024-01-07', messages: 63, users: 19 }
        ],
        userActivity: [
          { hour: '00:00', active: 5 },
          { hour: '06:00', active: 12 },
          { hour: '09:00', active: 45 },
          { hour: '12:00', active: 67 },
          { hour: '15:00', active: 52 },
          { hour: '18:00', active: 38 },
          { hour: '21:00', active: 28 }
        ],
        popularChannels: [
          { name: 'General', messages: 234, members: 45 },
          { name: 'Development', messages: 189, members: 23 },
          { name: 'Design Team', messages: 156, members: 12 },
          { name: 'Marketing', messages: 98, members: 18 }
        ],
        systemHealth: {
          uptime: '99.9%',
          responseTime: '120ms',
          errorRate: '0.1%'
        }
      });
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' }
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
      
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Messages</p>
              <p className="text-2xl font-bold">{stats.totalMessages}</p>
              <p className="text-blue-100 text-xs mt-1">+12% from last week</p>
            </div>
            <FontAwesomeIcon icon="envelope" className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Users</p>
              <p className="text-2xl font-bold">{stats.activeUsers}</p> 
            </div>
            <FontAwesomeIcon icon="users" className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Offline Users</p>
              <p className="text-2xl font-bold">{analyticsData.systemHealth.errorRate}</p>
              <p className="text-purple-100 text-xs mt-1"> </p>
            </div>
            <FontAwesomeIcon icon="clock" className="w-8 h-8 text-purple-200" />
          </div>
        </div>

 
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Activity Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Activity</h3>
          <div className="space-y-3">
            {analyticsData.messageStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(stat.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">{stat.messages} messages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">{stat.users} users</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity by Hour */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity by Hour</h3>
          <div className="space-y-3">
            {analyticsData.userActivity.map((activity, index) => (
              <div key={index} className="flex items-center">
                <span className="text-sm text-gray-600 w-16">{activity.hour}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(activity.active / 70) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {activity.active}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Channels</h3>
          <div className="space-y-4">
            {analyticsData.popularChannels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{channel.name}</p>
                    <p className="text-sm text-gray-500">{channel.members} members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{channel.messages}</p>
                  <p className="text-sm text-gray-500">messages</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
         
      </div>
    </div>
  )
}

export default Analytics