import React, { useState, useEffect } from 'react';
// import { Calendar } from 'primereact/calendar';
import './Dashboard.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [date, setDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('1');

  const navigate = useNavigate();
  

  useEffect(() => {
    axios
      .get('http://localhost:5000/appointments')
      .then((res) => {
        // Mettre à jour les rendez-vous
        setAppointments(res.data);
  
        // Transformer les rendez-vous en événements pour le calendrier
        const events = res.data.map((app) => ({
          title: 'Rendez-vous',
          date: moment(app.date).format('YYYY-MM-DD'),
          userId: app.userId,
          backgroundColor: app.userId === 1 ? 'green' : 'blue', 
          borderColor: app.userId === 1 ? 'green' : 'blue', 
          className: app.userId === 1 ? 'event-green' : 'event-blue',
        }));
  
        setEvents(events);
        console.dir('Apres récupération des rendez-vous :', events);
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des rendez-vous :', err);
      });

      axios.get('http://localhost:5000/users').then((res) => {
        console.dir('users :', res.data);
        const users = res.data;
        const options = users.map((user) => `<option value="${user.id}">${user.name}</option>`);
        document.getElementById('usrs').innerHTML = options.join('');

      });
  }, []);
  

  const isDateUnavailable = (date) => {
    return appointments.some((app) => new Date(app.date).toDateString([], {dateStyle: 'short'}) === date.toDateString([], {dateStyle: 'short'}));
  };

  const handleAppointment = async () => {
    if (!date) return alert('Choisissez une date');
    if (isDateUnavailable(date)) return alert('Cette date est déjà prise');
    const newAppointment = { date: date.toISOString() , userId: selectedUserId, className:selectedUserId === 1 ? 'event-green' : 'event-blue', backgroundColor:selectedUserId === 1 ? 'green' : 'blue', borderColor:selectedUserId === 1 ? 'green' : 'blue'};
    const res = await axios.post('http://localhost:5000/appointments', newAppointment);
    alert('Rendez-vous ajouté');
    setAppointments([...appointments, newAppointment]);
    setEvents((prev) => [...prev, { className: res.data.userId === 1 ? 'event-green' : 'event-blue',backgroundColor: res.data.userId === 1 ? 'green' : 'blue', borderColor: res.data.userId === 1 ? 'green' : 'blue', userId: res.data.userId,  title: 'Rendez-vous !!', date: moment(res.data.date).format('YYYY-MM-DD') }]);
    
  };

  const handleDelDate = (id) => {
    axios
      .delete(`http://localhost:5000/appointments/${id}`)
      .then(() => {
        setAppointments((prev) => prev.filter((app) => app.id !== id));
        setEvents((prev) => prev.filter((event) => event.date !== appointments.find((app) => app.id === id).date));
      })
      .catch((err) => {
        console.error('Erreur lors de la suppression :', err);
      });
  };
  
  const handleLogOut = (id) => {
    
    navigate('/');
  }

  return (
    <div>
        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-sm-4">
                            <h5>Ajouter un rendez-vous</h5>
                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} /> */}
                            <DatePicker  dateFormat="dd/MM/yyyy" selected={date} onChange={(date) => setDate(date)} />
                            <button onClick={handleAppointment}>Ajouter</button>
                        </div>
                        <div className="col-sm-4">
                            <h5>Choisir un utilisateur</h5>
                            <select name="usrs" id="usrs" onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId}>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <h2>Mes rendez-vous</h2>
                    <ol>
                        {appointments.map((app, index) => (
                        <li key={index}>{new Date(app.date).toLocaleString([], {dateStyle: 'short'})} {<button className='btn btn-danger' style={{ marginBottom:'8px'}} onClick={() => handleDelDate(app.id)} >X</button>}</li>
                        ))}
                    </ol>
                </div>
                <div className="col-md-1">
                    <h2>Déconnexion</h2>
                    {<button className='btn btn-primary' style={{ marginBottom:'8px'}} onClick={() => handleLogOut()} >X</button>}
                        
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h2>Mon calendrier</h2>
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                    />
                </div>            
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
