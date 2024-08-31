import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Loader from "./Loader"
import ModifyModal from "./ModifyModal"

const HomeData = () => {
  const { data, loading } = useSelector((state) => state?.homes)
  const [showModal, setShowModal] = useState(false)
  const [selectHome, setSelectHome] = useState(null)

  console.log(loading)

  useEffect(() => {
    const disableScroll = (e) => {
      e.preventDefault()
    }
    if (showModal) {
      window.addEventListener("scroll", disableScroll, { passive: false })
      window.addEventListener("wheel", disableScroll, { passive: false })
      window.addEventListener("touchmove", disableScroll, { passive: false })
    } else {
      window.removeEventListener("scroll", disableScroll, { passive: false })
      window.removeEventListener("wheel", disableScroll, { passive: false })
      window.removeEventListener("touchmove", disableScroll, { passive: false })
    }
    return () => {
      window.removeEventListener("scroll", disableScroll, { passive: false })
      window.removeEventListener("wheel", disableScroll, { passive: false })
      window.removeEventListener("touchmove", disableScroll, { passive: false })
    }
  }, [showModal])

  return (
    <div className="min-h-screen justify-center items-center flex px-5 py-28">
      {!loading ? (
        data && data?.data?.length > 0 ? (
          <div className="flex flex-wrap gap-10 items-center justify-center content-center">
            {data?.data?.map((dd) => (
              <div
                className="shadow-xl min-w-[300px] max-w-[500px] p-5 rounded-lg"
                key={dd?.home_id}
              >
                <p className="font-bold mb-2 text-xl">{dd?.street_address}</p>
                <p>List Price: ${dd?.list_price}</p>
                <p>State: {dd?.state}</p>
                <p>Zip: {dd?.zip}</p>
                <p>Sqft: {dd?.sqft}</p>
                <p>Beds: {dd?.beds}</p>
                <p>Baths: {dd?.baths}</p>
                <button
                  onClick={() => {
                    setSelectHome(dd)
                    setShowModal(true)
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 cursor-pointer"
                >
                  Edit Users
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Nothing to Show</p>
        )
      ) : (
        <Loader />
      )}
      {showModal && (
        <ModifyModal home={selectHome} setShowModal={setShowModal} />
      )}
    </div>
  )
}

export default HomeData
