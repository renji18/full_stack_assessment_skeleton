import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { handleGetAllUsers } from "./redux/slice/user.slice"
import HomeData from "./components/HomeData"
import Paginator from "./components/Paginator"
import Navbar from "./components/Navbar"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(handleGetAllUsers())
  }, [dispatch])

  return (
    <div className="relative">
      <Navbar />
      <HomeData />
      <Paginator />
    </div>
  )
}

export default App
