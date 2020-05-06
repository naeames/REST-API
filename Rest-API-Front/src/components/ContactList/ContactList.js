import React, { useState, useEffect ,Fragment } from "react";
import axios from "axios";

import Contact from "../Contact/Contact";
import "./ContactList.css"



const ContactList = () => {
  const [userDatabase, setUserDatabase] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const response = await axios.get("http://localhost:4000/");
      setUserDatabase(response.data);
    }
    getUsers();
  });

  return (
    <Fragment>
      <div className="contact-list">
        {userDatabase.map((user) => (
          <div key={user._id}>
            <Contact user={user} />
          </div>
        ))}
      
      </div>
    </Fragment>
  );
};

export default ContactList;
