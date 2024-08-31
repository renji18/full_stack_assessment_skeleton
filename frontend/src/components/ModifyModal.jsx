import { useEffect, useState } from "react"
import { getUsersForHome, updateUsers } from "../api/api"
import { useDispatch, useSelector } from "react-redux"
import { handleGetHomesForUsers } from "../redux/slice/home.slice"
import Loader from "./Loader"

const ModifyModal = ({ home, setShowModal }) => {
  const dispatch = useDispatch()
  const { data: allUsers } = useSelector((state) => state?.users)
  const { user_id: activeUser, page } = useSelector((state) => state?.homes)
  const [users, setUsers] = useState([])
  const [apiCall, setApiCall] = useState(false)

  const isUserSelected = (userId) => {
    return users.some((user) => user.user_id === userId)
  }

  const editUsers = (checked, user) => {
    if (!checked) {
      setUsers((prev) => prev?.filter((p) => p?.user_id !== user?.user_id))
    } else {
      setUsers((prev) => [...prev, user])
    }
  }

  const saveNewUsers = async () => {
    setApiCall(true)
    if (users?.length <= 0) return
    const user_ids = users?.map((u) => u?.user_id)

    if (user_ids?.find((uid) => uid === Number(activeUser))) {
      const res = await updateUsers({ home_id: home?.home_id, user_ids })
      if (res?.status === 200) setShowModal(false)
    } else {
      const res = await updateUsers({ home_id: home?.home_id, user_ids })
      if (res?.status === 200) {
        dispatch(handleGetHomesForUsers({ user_id: activeUser, page }))
      }
      setShowModal(false)
    }
    setApiCall(false)
  }

  useEffect(() => {
    const handleData = async () => {
      if (!home) return
      const res = await getUsersForHome(home?.home_id)
      if (res?.status === 200) {
        setUsers(res?.data?.users)
      }
    }
    handleData()
  }, [home])

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30 z-10">
      <div className="bg-white py-5 px-5 md:px-10 rounded-lg max-w-[320px] md:max-w-[600px]">
        <p className="font-bold mb-5 text-xl md:text-2xl">
          Modify Users for: {home?.street_address}
        </p>
        <div className="flex flex-col gap-2.5">
          {allUsers?.map((au) => (
            <div key={au?.user_id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isUserSelected(au?.user_id)}
                name={au?.user_id}
                id={au?.user_id}
                onChange={(e) => editUsers(e.target.checked, au)}
              />
              <label
                htmlFor={au?.user_id}
                className={`${isUserSelected(au.user_id) ? "font-bold" : ""}`}
              >
                {au.username}
              </label>
            </div>
          ))}
        </div>
        <div className="w-full mt-5 flex justify-end items-center gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2 text-lg bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2 text-lg ${
              users?.length > 0
                ? "bg-blue-500 text-white"
                : "bg-blue-300 text-black cursor-not-allowed"
            } rounded-lg`}
            onClick={saveNewUsers}
          >
            {apiCall ? <Loader /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModifyModal
