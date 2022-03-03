// pages/profile.js
import { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import { AmplifyProvider, withAuthenticator,   } from '@aws-amplify/ui-react'
 
import '@aws-amplify/ui-react/styles.css'; // default theme
import styles from '../styles/Profile.module.css'
 


 

function Profile({signOut}) { // <-- !!!         Here
  const [user, setUser] = useState(null)
  useEffect(() => {
    // Access the user session on the client
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log("User: ", user)
        setUser(user)
      })
      .catch(err => setUser(null))
  }, [])
  return (
    <div className={styles.auth}><h1>flows</h1>
    <AmplifyProvider>
 
      { user &&  <div> 
          <h1>Welcome, {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
          </div> }
   </AmplifyProvider></div>
  )
}

export default withAuthenticator(Profile)