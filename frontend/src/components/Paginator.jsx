import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleGetHomesForUsers } from "../redux/slice/home.slice"

const Paginator = () => {
  const dispatch = useDispatch()
  const { totalPages, user_id } = useSelector((state) => state?.homes)
  const [currentPage, changePage] = useState(1)
  const [startIndex, setStartIndex] = useState(0)

  const handleNext = () => {
    const newPage = currentPage + 1
    if (newPage > totalPages) return

    if (newPage > startIndex + 5) {
      setStartIndex(startIndex + 1)
    }
    changePage(newPage)
  }

  const handlePrevious = () => {
    const newPage = currentPage - 1
    if (newPage < 1) return

    if (newPage < startIndex + 1) {
      setStartIndex(startIndex - 1)
    }
    changePage(newPage)
  }

  const visiblePages = () => {
    const endIndex = Math.min(startIndex + 5, totalPages)
    return Array.from(
      { length: endIndex - startIndex },
      (_, i) => startIndex + i + 1
    )
  }

  useEffect(() => {
    if (!totalPages) return
    dispatch(handleGetHomesForUsers({ user_id, page: currentPage }))
  }, [currentPage, dispatch, user_id, totalPages])

  useEffect(() => {
    if (!user_id) return
    changePage(1)
    setStartIndex(0)
  }, [user_id])

  return (
    <div className="fixed bottom-5 w-screen flex justify-center">
      {totalPages && (
        <div className="flex items-center gap-2 px-4 py-2 bg-pink-200 rounded-lg">
          <p
            className={`text-2xl ${
              currentPage === 1
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer"
            }`}
            onClick={handlePrevious}
          >
            {"<"}
          </p>
          <div className="flex gap-2">
            {visiblePages().map((page) => (
              <p
                onClick={() => changePage(page)}
                key={page}
                className={`${
                  currentPage === page ? "bg-rose-700 text-white" : ""
                } cursor-pointer flex items-center justify-center rounded-full w-9 h-9 font-medium text-lg`}
              >
                {page}
              </p>
            ))}
          </div>
          <p
            className={`text-2xl ${
              currentPage === totalPages
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer"
            }`}
            onClick={handleNext}
          >
            {">"}
          </p>
        </div>
      )}
    </div>
  )
}

export default Paginator
