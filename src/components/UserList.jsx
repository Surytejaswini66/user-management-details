import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import UserForm from "./UserForm";
import "./UserList.css";

const UserList = ({ onRefresh }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false); // To toggle the form visibility
  const [selectedUser, setSelectedUser] = useState(null); // For edit functionality
  const [loading, setLoading] = useState(false); // For loader state
  const [showConfirm, setShowConfirm] = useState(false); // For showing confirmation modal
  const [userToDelete, setUserToDelete] = useState(null); // Store the user to delete

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      onRefresh(data); // Pass updated users list to parent
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = (id) => {
    setShowConfirm(true); // Show confirmation modal instead of the alert
    setUserToDelete(users.find((user) => user.id === id)); // Set user to delete
  };

  // Handle Add User
  const handleAddUser = () => {
    setShowForm(true);
    setSelectedUser(null); // Clear selected user for adding a new one
  };

  // Handle Edit User
  const handleEditUser = (user) => {
    setShowForm(true);
    setSelectedUser(user); // Set selected user for editing
  };

  // Close the User Form
  const handleFormClose = () => {
    setShowForm(false); // Close the form
  };

  // Refresh users list after add/edit
  const handleFormRefresh = (updatedUsers) => {
    setUsers(updatedUsers); // Update users list after add/edit
  };

  // Pagination: Get current users based on page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle Confirm Deletion
  const handleDeleteConfirmed = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id); // Perform the delete
        const updatedUsers = users.filter(
          (user) => user.id !== userToDelete.id
        );
        setUsers(updatedUsers); // Update the user list locally
        onRefresh(updatedUsers); // Pass the updated list to parent
      } catch (error) {
        setError(error.message); // Handle error during delete
      }
    }
    setShowConfirm(false); // Close the modal after confirming
  };

  // Handle Cancel Deletion
  const handleDeleteCancel = () => {
    setShowConfirm(false); // Close the modal without deleting
  };

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div>
      <button className="addUser" onClick={handleAddUser}>
        Add User
      </button>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading users...</p>}
      {!loading && users.length === 0 && <p>No users available.</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.id}
              className={selectedUser?.id === user.id ? "selected" : ""}
            >
              <td>{user.id}</td>
              <td>{user.name.split(" ")[0]}</td> {/* First Name */}
              <td>{user.name.split(" ")[1] || ""}</td> {/* Last Name */}
              <td>{user.email}</td>
              <td>{user.company.name}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Overlay for background blur */}
      {showForm && <div className="overlay"></div>}

      {showForm && (
        <UserForm
          user={selectedUser} // Pass selected user for editing
          onClose={handleFormClose}
          onRefresh={handleFormRefresh}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-content">
            <p>Are you sure you want to delete this user?</p>
            <button
              onClick={handleDeleteConfirmed}
              style={{ backgroundColor: "green", color: "white" }}
            >
              Confirm
            </button>
            <button
              onClick={handleDeleteCancel}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
