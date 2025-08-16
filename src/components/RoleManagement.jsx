import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm } from 'react-hook-form'

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const permissions = [
    { id: 'read_messages', name: 'Read Messages', description: 'Can view all messages' },
    { id: 'send_messages', name: 'Send Messages', description: 'Can send messages' },
    { id: 'delete_messages', name: 'Delete Messages', description: 'Can delete any message' },
    { id: 'manage_users', name: 'Manage Users', description: 'Can add, edit, delete users' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Can manage role permissions' },
    { id: 'view_analytics', name: 'View Analytics', description: 'Can access analytics dashboard' },
    { id: 'system_admin', name: 'System Admin', description: 'Full system access' }
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
   const roles =[
     { id: 1, name: 'Admin', permissions: ['manage_users', 'manage_roles'] },
     { id: 2, name: 'Moderator', permissions: ['manage_users'] },
     { id: 3, name: 'User', permissions: [] }
   ];
   setRoles(roles);
  };

  const onSubmit = async (data) => {
    try {
      const url = editingRole 
        ? `${process.env.REACT_APP_API_URL}/admin/roles/${editingRole.id}`
        : `${process.env.REACT_APP_API_URL}/admin/roles`;
      
      const method = editingRole ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchRoles();
        setShowAddModal(false);
        setEditingRole(null);
        reset();
      }
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    reset({
      ...role,
      permissions: role.permissions || []
    });
    setShowAddModal(true);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/roles/${roleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          fetchRoles();
        }
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
        <button
          onClick={() => {
            setEditingRole(null);
            reset();
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center space-x-2"
        >
          <FontAwesomeIcon icon="plus" className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <FontAwesomeIcon icon="edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <FontAwesomeIcon icon="times" className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{role.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions?.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {permissions.find(p => p.id === permission)?.name || permission}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Users: {role.userCount || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  {...register("name", { required: "Role name is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start">
                      <input
                        type="checkbox"
                        {...register("permissions")}
                        value={permission.id}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-900">
                          {permission.name}
                        </label>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRole(null);
                    reset();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingRole ? 'Update' : 'Add Role')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleManagement