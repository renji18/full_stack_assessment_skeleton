import axios from "axios";

export async function getAllUsers() {
  const res = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/user/find-all`
  )
  return res
}

export async function getHomesByUser(userId, page = 1) {
  const res = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/home/find-by-user?userId=${userId}&page=${page}`)

  return res
}

export async function getUsersForHome(homeId) {
  const res = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/user/find-by-home?homeId=${homeId}`)

  return res
}

export async function updateUsers(body) {
  const res = await axios.put(
    `${process.env.REACT_APP_SERVER_URL}/home/update-users`, body)

  return res
}