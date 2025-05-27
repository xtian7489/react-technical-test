import React from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminHome from './AdminHome'
import UserHome from './UserHome'

const Home = () => {
    const {user, isAdmin} = useAuth()
  if(isAdmin)return <AdminHome user={user}/>
  return <UserHome user={user}/>
}

export default Home