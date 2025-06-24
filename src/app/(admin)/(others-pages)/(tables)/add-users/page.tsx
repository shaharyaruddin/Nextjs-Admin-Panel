'use client'
import React, { useState } from 'react'

const Page = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
    plan_type: 'free',
    profile_picture: null as File | null,
    is_active: true,
    email_verified_at: '',
    oauth_provider: '',
    oauth_id: '',
    roles: [] as string[],
  })

  // Mock roles for selection (replace with API fetch in production)
  const availableRoles = ['Admin', 'Editor', 'Viewer']

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, profile_picture: file }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value)
    setFormData((prev) => ({ ...prev, roles: selectedOptions }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prepare form data for API submission
    const submissionData = new FormData()
    submissionData.append('email', formData.email)
    submissionData.append('password_hash', formData.password) // Hash password on server
    submissionData.append('username', formData.username)
    submissionData.append('full_name', formData.full_name)
    submissionData.append('plan_type', formData.plan_type)
    if (formData.profile_picture) {
      submissionData.append('profile_picture', formData.profile_picture)
    }
    submissionData.append('is_active', formData.is_active.toString())
    submissionData.append('email_verified_at', formData.email_verified_at || '')
    submissionData.append('oauth_provider', formData.oauth_provider || '')
    submissionData.append('oauth_id', formData.oauth_id || '')
    submissionData.append('roles', JSON.stringify(formData.roles))

    // Placeholder for API call
    try {
      console.log('Submitting:', Object.fromEntries(submissionData))
      // Example API call (uncomment and adjust for your backend)
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   body: submissionData,
      // })
      // const result = await response.json()
      // console.log('User created:', result)
      alert('User created successfully!')
      // Reset form
      setFormData({
        email: '',
        password: '',
        username: '',
        full_name: '',
        plan_type: 'free',
        profile_picture: null,
        is_active: true,
        email_verified_at: '',
        oauth_provider: '',
        oauth_id: '',
        roles: [],
      })
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user.')
    }
  }

  return (
    <div className="min-h-screen  dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Add New User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Plan Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan Type
            </label>
            <select
              name="plan_type"
              value={formData.plan_type}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Picture
            </label>
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Is Active
            </label>
          </div>

          {/* Email Verified At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Verified At
            </label>
            <input
              type="datetime-local"
              name="email_verified_at"
              value={formData.email_verified_at}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* OAuth Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OAuth Provider
            </label>
            <select
              name="oauth_provider"
              value={formData.oauth_provider}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              <option value="google">Google</option>
              <option value="github">GitHub</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          {/* OAuth ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              OAuth ID
            </label>
            <input
              type="text"
              name="name"
              value={formData.oauth_id}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Roles
            </label>
            <select
              name="roles"
              multiple
              value={formData.roles}
              onChange={handleRoleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Hold Ctrl (or Cmd) to select multiple roles
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={() =>
                setFormData({
                  email: '',
                  password: '',
                  username: '',
                  full_name: '',
                  plan_type: 'free',
                  profile_picture: null,
                  is_active: true,
                  email_verified_at: '',
                  oauth_provider: '',
                  oauth_id: '',
                  roles: [],
                })
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page