import react from "react";
import { useState } from react;

/**
 * 1. se connecter
 * -- login + conservation du token dans le front
 * pour chaque appel sur les routes protégées, on envoie le token
 * 2. se déconnecter
 * -- 
 * 3. récupérer des données protégées(getMovies)
 * 4. vérifier que les données soient protégées
 */


export default function Home() {
  const [movies, setMovies] = useState([]);

  const getMovies = () => {
    const token = sessionStorage.getItem("token");
    fetch('http://localhost:5000/movies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(movies => {
      console.log(movies);
      setMovies(movies);
    })
    .catch(err => console.error(err));
  };

  const login = () => {
    fetch('http://localhost:5000/login', {
      method: "POST",
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email":"mchateau@gmail.com",
        "password": "test"
      }),
    }).then((res) => res.json())
      .then(data => {
        const token = data.token;
        sessionStorage.setItem('token', token);
      })
      .catch((err) => console.log("LOG IN LOGIN", err))
  }

  const logout = () => {
    const token = sessionStorage.getItem("token");
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log("DATA IN LOGOUT", data);
      sessionStorage.removeItem('token');
    })
    .catch(err => console.error("ERROR LOGOUT", err));
  }

  return (
<div>
  <button onClick={()=>login()}>Login</button>
  <button onClick={()=>logout()}>Logout</button>
  <button onClick={()=>getMovies()}>getMovies</button>
  <h1>Movies</h1>
  {movies.length > 0 && movies.map ((movie, idx) => {
    <div key={idx}>
      {movie.name}
    </div>
  })
  }
</div>
  );
}
