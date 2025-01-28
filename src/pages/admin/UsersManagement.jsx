import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: '', branch_id: '' });

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error fetching users.', 'error');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branches`);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      showSnackbar('Error fetching branches.', 'error');
    }
  };

  const handleOpenDialog = (user = { username: '', email: '', password: '', role: '', branch_id: '' }) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentUser({ username: '', email: '', password: '', role: '', branch_id: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    try {
      if (currentUser.id) {
        await axios.put(`${API_BASE_URL}/users/${currentUser.id}`, currentUser);
        showSnackbar('User updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/users`, currentUser);
        showSnackbar('User added successfully.', 'success');
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar('Error saving user.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      showSnackbar('User deleted successfully.', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Error deleting user.', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const styles = {
    container: "min-h-screen bg-[#f0f8f4] p-8",
    innerContainer: "max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8",
    header: "flex justify-between items-center mb-8",
    title: "text-3xl font-bold text-[#007547]",
    addButton: "bg-[#007547] hover:bg-[#005a35] text-white px-4 py-2 rounded-md flex items-center",
    table: "w-full border-collapse rounded-lg overflow-hidden",
    tableHead: "bg-[#007547]",
    tableHeadCell: "px-6 py-4 text-left text-sm font-semibold text-white",
    tableRow: "hover:bg-[#e8f5e9] transition-colors even:bg-[#f0f8f4]",
    tableCell: "px-6 py-4 text-sm text-gray-700",
    actionButton: "inline-flex items-center px-3 py-1 rounded-md border mr-2",
    editButton: "border-[#007547] text-[#007547] hover:bg-[#007547] hover:text-white",
    deleteButton: "border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
    dialog: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
    dialogContent: "bg-white rounded-lg p-6 w-full max-w-md",
    dialogTitle: "text-xl font-bold text-[#007547] mb-4",
    formGroup: "mb-4",
    label: "block text-sm font-medium text-gray-700 mb-1",
    input: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#007547]",
    select: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#007547]",
    dialogActions: "flex justify-end space-x-2 mt-6",
    dialogButton: "px-4 py-2 rounded-md",
    cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    saveButton: "bg-[#007547] hover:bg-[#005a35] text-white",
    snackbar: "fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg",
    snackbarSuccess: "bg-green-100 border border-green-500 text-green-700",
    snackbarError: "bg-red-100 border border-red-500 text-red-700",
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>User Management</h1>
          <button className={styles.addButton} onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.tableHeadCell}>Username</th>
                <th className={styles.tableHeadCell}>Email</th>
                <th className={styles.tableHeadCell}>Role</th>
                <th className={styles.tableHeadCell}>Branch</th>
                <th className={styles.tableHeadCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{user.username}</td>
                  <td className={styles.tableCell}>{user.email}</td>
                  <td className={styles.tableCell}>{user.role}</td>
                  <td className={styles.tableCell}>{user.branch_name || 'N/A'}</td>
                  <td className={styles.tableCell}>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {open && (
          <div className={styles.dialog}>
            <div className={styles.dialogContent}>
              <h2 className={styles.dialogTitle}>
                {currentUser.id ? 'Edit User' : 'Add User'}
              </h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Username</label>
                <input
                  className={styles.input}
                  name="username"
                  value={currentUser.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  name="email"
                  type="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  name="password"
                  type="password"
                  value={currentUser.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Role</label>
                <select
                  className={styles.select}
                  name="role"
                  value={currentUser.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
              {currentUser.role === 'manager' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Branch</label>
                  <select
                    className={styles.select}
                    name="branch_id"
                    value={currentUser.branch_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className={styles.dialogActions}>
                <button
                  className={`${styles.dialogButton} ${styles.cancelButton}`}
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.dialogButton} ${styles.saveButton}`}
                  onClick={handleSaveUser}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {snackbar.open && (
          <div
            className={`${styles.snackbar} ${
              snackbar.severity === 'success' ? styles.snackbarSuccess : styles.snackbarError
            }`}
            onClick={handleCloseSnackbar}
          >
            {snackbar.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;