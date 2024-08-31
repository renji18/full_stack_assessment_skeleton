import  { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleGetHomesForUsers } from "../redux/slice/home.slice"

const Navbar = () => {
  const dispatch = useDispatch()
  const { data } = useSelector((state) => state?.users)
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const getHomesForUser = async () => {
      if (!Number(user)) return
      dispatch(handleGetHomesForUsers({ user_id: user, page: 1 }))
    }
    getHomesForUser()
  }, [user, dispatch])

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-end items-center bg-pink-100 py-5 px-10 gap-3">
      <p>Select User:</p>
      <select
        name="user"
        id="user"
        onChange={(e) => setUser(e.target.value)}
        defaultValue={"none"}
        value={user}
        className="bg-transparent border-4 border-black/50 rounded-lg p-0.5 outline-none cursor-pointer"
      >
        <option value="none">None</option>
        {data?.map((d) => (
          <option key={d?.user_id} value={d?.user_id}>
            {d?.username}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Navbar
