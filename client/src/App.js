// import './App.css';
import React from 'react';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import EmployeeForm from './compontents/employeeForm';
import EmployeeList from './compontents/employeeList';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<EmployeeList />} />
          <Route path="/employee_details" element={<EmployeeForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
