// import React from "react";

// const Popup = ({ date, users, onClick, onClose }) => {
//   return (
//     <div className="popup">
//       <div className="popup-inner">
//         <h2>Users on {date}</h2>
//         {users.map((user, i) => (
//           <div key={i}>
//             <p>Name: {user.displayName}</p>
//             <p>Email: {user.email}</p>
//           </div>
//         ))}
//         <button onClick={onClose}>OK</button>
//       </div>
//       <div className="popup-overlay" onClick={onClose}></div>
//     </div>
//   );
// };

// export default Popup;


import React from 'react';

const Popup = ({ onClose, users }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup">
        {users.map((user) => (
          <div className="user" key={user.email}>
            <p>{user.displayName}</p>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export { Popup };
//export default Popup;