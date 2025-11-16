import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import {Routes,Route} from "react-router-dom"
import Header from './components/Header';
import Users from './components/Users';
import AddUsers from './components/AddUsers';
import UserDetails from "./components/UserDetails";
import UpdateUserDetails from "./components/UpdateUserDetails";
import Mentors from "./components/Mentors";
import AddMentor from "./components/AddMentor";
import Question from "./components/Question";
import AddQuestion from "./components/AddQuestion";
import Jobs from "./components/Jobs";
import AddJob from "./components/AddJob";
import DeleteJob from "./components/DeleteJob";
import NotFound from "./components/NotFound";
import Announcements from "./components/Announcements";
import AddAnnouncements from "./components/AddAnnouncements";
import DeleteAnnouncement from "./components/DeleteAnnouncements";
function App() {
  return (
   <>
   <Header/>
   <main className="app-content">
    <Routes>
      <Route path="/users" element={<Users/>}/>
      <Route path="/add-users" element={<AddUsers/>}/>
      <Route path="/user-details" element={<UserDetails/>}/>
      <Route path="/update-user-details" element={<UpdateUserDetails/>}/>
      <Route path="/mentors" element={<Mentors/>}/>
      <Route path="/add-mentor" element={<AddMentor/>}/>
      <Route path="/questions" element={<Question/>}/>
      <Route path="/add-question" element={<AddQuestion/>}/>
      <Route path="/jobs" element={<Jobs/>}/>
      <Route path="/add-job" element={<AddJob/>}/>
      <Route path="/delete-job" element={<DeleteJob/>}/>
      <Route path="/announcements" element={<Announcements/>}/>
      <Route path="/add-announcements" element={<AddAnnouncements/>}/>
      <Route path="/delete-announcements" element={<DeleteAnnouncement/>}/>
      
      <Route path="*" element={<NotFound/>}/>
    </Routes>
    </main>
    </>  
  );
}

export default App;
