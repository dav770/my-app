import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
        try {
            const { data } = await axios.get(`http://localhost:5000/users?email=${email}&password=${password}`);
            console.log(data);
            if (data.length > 0) {
              const user = data[0];
              if (user.role === 'admin') navigate('/dashboard');
              else navigate('/user-dashboard');
            } else {
              alert('Email ou mot de passe incorrect');
            }
          } catch (err) {
            console.error(err);
          }
        };

    return (
        <div className="body_css">

            <div className="login-container">
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <input
                    type="email"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                    <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    );
};

export default Login;