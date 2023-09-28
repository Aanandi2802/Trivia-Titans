
import React from 'react';
//importing looker studio chart
function UserManagementTable() {
  return (
    <div>  
      <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Looker Chart</h1>
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/5ef2e55b-03e2-49aa-a079-34dc0bfcb3d4/page/hIvYD"
        width="1000"
        height="600"
        frameBorder="0"
        title="Looker Chart"
      ></iframe>
    </div>
  );
}

export default UserManagementTable;

