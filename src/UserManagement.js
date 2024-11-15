import React, { useState, useEffect } from 'react';
import './user.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8087/users');
    
            // Check if the response is OK (status 200)
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
    
            // Check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setUsers(data);  // Update state with fetched users
            } else {
                console.error('Unexpected response format:', response);
                setMessage('Failed to fetch users. Please check if the server is returning JSON.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('Error fetching users. Please check the server connection.');
        }
    };
    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (editId !== null) {
                await fetch(`http://localhost:8087/users/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });
                setMessage(`Updated user: ${newUser.name}`);
            } else {
                await fetch('http://localhost:8087/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });
                setMessage(`Added user: ${newUser.name}`);
            }
            setNewUser({ name: '', email: '', password: '' });
            setEditId(null);
            fetchUsers();
        } catch (error) {
            console.error('Error submitting user:', error);
        }
    };

    const handleEdit = (user) => {
        setNewUser({ name: user.name, email: user.email, password: '' });
        setEditId(user.id);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8087/users/${id}`, { method: 'DELETE' });
            setMessage('User deleted');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="user-management-container">
            <h2>User Management</h2>
            <div className="user-form">
                <h4>{editId ? 'Edit User' : 'Add New User'}</h4>
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>{editId ? 'Update User' : 'Add User'}</button>
            </div>

            {message && <div className="message"><p>{message}</p></div>}

            <div className="user-table-container">
                <h4>User List</h4>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="action-buttons">
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement;
