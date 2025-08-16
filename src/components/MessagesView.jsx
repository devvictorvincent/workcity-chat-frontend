import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const MessagesView = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, filterType, searchTerm]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        filter: filterType,
        search: searchTerm,
        limit: 20
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/messages?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Mock data for demo
      setMessages([
        {
          id: 1,
          content: "Hey team! How's everyone doing today?",
          sender: { name: 'John Doe', email: 'john@example.com', avatar: '/default-user.jpg' },
          recipient: { name: 'Team Alpha', type: 'group' },
          timestamp: '2024-01-15T10:30:00Z',
          status: 'delivered',
          flagged: false
        },
        {
          id: 2,
          content: "Can someone help me with the project setup?",
          sender: { name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/default-user.jpg' },
          recipient: { name: 'Development Team', type: 'group' },
          timestamp: '2024-01-15T10:25:00Z',
          status: 'read',
          flagged: false
        },
        {
          id: 3,
          content: "This is an inappropriate message that should be flagged",
          sender: { name: 'Bad User', email: 'bad@example.com', avatar: '/default-user.jpg' },
          recipient: { name: 'Mike Chen', type: 'direct' },
          timestamp: '2024-01-15T10:20:00Z',
          status: 'flagged',
          flagged: true
        },
        {
          id: 4,
          content: "Great work on the presentation yesterday!",
          sender: { name: 'Emma Davis', email: 'emma@example.com', avatar: '/default-user.jpg' },
          recipient: { name: 'Alex Johnson', type: 'direct' },
          timestamp: '2024-01-15T09:45:00Z',
          status: 'delivered',
          flagged: false
        },
        {
          id: 5,
          content: "Meeting scheduled for 3 PM in conference room A",
          sender: { name: 'Admin', email: 'admin@example.com', avatar: '/default-user.jpg' },
          recipient: { name: 'All Users', type: 'broadcast' },
          timestamp: '2024-01-15T09:00:00Z',
          status: 'delivered',
          flagged: false
        }
      ]);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/messages/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          fetchMessages();
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleFlagMessage = async (messageId, flagged) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/messages/${messageId}/flag`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flagged })
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error flagging message:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedMessages.length} messages?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/messages/bulk-delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ messageIds: selectedMessages })
        });

        if (response.ok) {
          setSelectedMessages([]);
          fetchMessages();
        }
      } catch (error) {
        console.error('Error bulk deleting messages:', error);
      }
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(msg => msg.id));
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'flagged') return matchesSearch && message.flagged;
    if (filterType === 'direct') return matchesSearch && message.recipient.type === 'direct';
    if (filterType === 'group') return matchesSearch && message.recipient.type === 'group';
    
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      delivered: 'bg-green-100 text-green-800',
      read: 'bg-blue-100 text-blue-800',
      flagged: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Message Management</h2>
        <div className="flex items-center space-x-3">
          {selectedMessages.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
            >
              <FontAwesomeIcon icon="trash" className="w-4 h-4" />
              <span>Delete Selected ({selectedMessages.length})</span>
            </button>
          )}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center space-x-2">
            <FontAwesomeIcon icon="download" className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FontAwesomeIcon icon="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search messages, users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Messages</option>
          <option value="direct">Direct Messages</option>
          <option value="group">Group Messages</option>
          <option value="flagged">Flagged Messages</option>
        </select>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedMessages.length === messages.length && messages.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className={`hover:bg-gray-50 ${message.flagged ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate">{message.content}</p>
                      {message.flagged && (
                        <div className="flex items-center mt-1">
                          <FontAwesomeIcon icon="flag" className="w-3 h-3 text-red-500 mr-1" />
                          <span className="text-xs text-red-600">Flagged</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={message.sender.avatar}
                        alt={message.sender.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{message.sender.name}</div>
                        <div className="text-sm text-gray-500">{message.sender.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{message.recipient.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{message.recipient.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(message.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFlagMessage(message.id, !message.flagged)}
                        className={`p-1 ${message.flagged ? 'text-red-600 hover:text-red-900' : 'text-gray-400 hover:text-yellow-600'}`}
                        title={message.flagged ? 'Unflag message' : 'Flag message'}
                      >
                        <FontAwesomeIcon icon="flag" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete message"
                      >
                        <FontAwesomeIcon icon="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesView