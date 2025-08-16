import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const {user, setUser} = useAuth();
  const menuTabs = [
                { id: 'personal', name: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
                { id: 'security', name: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
              ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
    watch
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const defaultOptions = {
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        };
        console.log('Fetching user profile with options:', defaultOptions);
        console.log("api url", process.env.REACT_APP_API_URL);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, defaultOptions);

        if (response.ok) {
          console.log('Profile fetched successfully', response);
          const data = await response.json();
          console.log('User profile data:', data);
          setUser(data);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchUserProfile();
  },[]);

  const onSubmit = async (data) => {
    try {
      console.log('Profile update:', data);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Profile updated successfully:', updatedData);
        
        setUser(updatedData);
        localStorage.setItem('user', JSON.stringify(updatedData));
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      console.log('Password change:', data);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      if (response.ok) {
        console.log('Password changed successfully');
        resetPasswordForm();
        setShowPasswordForm(false);
         
        alert('Password changed successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to change password:', errorData);
         
        alert('Failed to change password. Please check your current password.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('An error occurred while changing password.');
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    resetPasswordForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end -mt-16 mb-4">
              <div className="relative">
                <img
                  src={user?.profilePhoto ? `${process.env.REACT_APP_API_URL}/${user.profilePhoto}` : "/default-user.jpg"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                
                <button className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-50">{user?.name}</h1>
                    <p className="text-gray-600">{user?.bio}</p>
                    <div className="flex items-center mt-2">
                      {user?.active ? <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div> : <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>}
                      <span className="text-sm text-gray-600">{user?.active ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'personal' && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      {...register("phone")}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...register("bio")}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition duration-200"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'email_notifications', label: 'Email Notifications', description: 'Receive email notifications for new messages' },
                    { id: 'push_notifications', label: 'Push Notifications', description: 'Receive push notifications on your device' },
                    { id: 'sound_notifications', label: 'Sound Notifications', description: 'Play sound when receiving messages' },
                    { id: 'desktop_notifications', label: 'Desktop Notifications', description: 'Show desktop notifications' }
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name={setting.id} id={setting.id} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor={setting.id} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Change Password</h4>
                        <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                      </div>
                      <button 
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>

                    {showPasswordForm && (
                      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            {...registerPassword("currentPassword", { 
                              required: "Current password is required" 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your current password"
                          />
                          {passwordErrors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            {...registerPassword("newPassword", { 
                              required: "New password is required",
                              minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your new password"
                          />
                          {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            {...registerPassword("confirmPassword", { 
                              required: "Please confirm your password",
                              validate: value => value === newPassword || "Passwords do not match"
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your new password"
                          />
                          {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                          )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={handleCancelPasswordChange}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isPasswordSubmitting}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition duration-200"
                          >
                            {isPasswordSubmitting ? 'Changing...' : 'Change Password'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile