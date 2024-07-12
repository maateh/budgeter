import { useEffect } from "react"

// constants
import { BASE_PAGE_TITLE } from "@/constants"

const useTitle = (title: string, prevailOnUnmount: boolean = false) => {
  useEffect(() => {
    document.title = `${BASE_PAGE_TITLE} | ${title}`
  }, [title])

  useEffect(() => () => {
    if (!prevailOnUnmount) {
      document.title = BASE_PAGE_TITLE
    }
  }, [prevailOnUnmount])
}

export default useTitle
