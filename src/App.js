import React, { useState } from "react";
import Header from "./components/Header";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  // Handle Add New User

  // Handle Edit Existing User
  const handleEdit = (user) => {
    setEditingUser(user); // Set the selected user for editing
    setFormVisible(true); // Show the UserForm for editing
  };

  // Handle User Form Close
  const handleFormClose = () => {
    setFormVisible(false); // Close the UserForm
  };

  return (
    <div>
      <Header />
      <UserList onRefresh={setUsers} />

      {isFormVisible && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onRefresh={setUsers}
        />
      )}
    </div>
  );
};

export default App;
