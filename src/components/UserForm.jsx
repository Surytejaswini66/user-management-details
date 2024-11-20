// UserForm.js
import React, { useState, useEffect } from "react";
import { addUser, updateUser } from "../services/api";
import "./UserForm.css";

const UserForm = ({ user, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: { name: "" },
  });

  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (user) {
      const [firstName, lastName] = user.name.split(" ");
      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email,
        company: { name: user.company.name },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "company.name") {
      setFormData({ ...formData, company: { name: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.company.name
    ) {
      setValidationError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }
    setValidationError("");
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: { name: formData.company.name },
      };

      let updatedUsers;
      if (user) {
        const updatedUser = await updateUser(user.id, userData);
        updatedUsers = (prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? updatedUser : u));
      } else {
        const newUser = await addUser(userData);
        updatedUsers = (prevUsers) => [...prevUsers, newUser];
      }
      onRefresh(updatedUsers);
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: { name: "" },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-overlay">
      <div className="user-form-container">
        <form onSubmit={handleSubmit} className="user-form">
          {error && <p className="error">{error}</p>}
          {validationError && <p className="error">{validationError}</p>}
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Department</label>
          <input
            type="text"
            name="company.name"
            placeholder="Department"
            value={formData.company.name}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit</button>
        </form>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserForm;
