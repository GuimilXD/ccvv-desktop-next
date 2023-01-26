import Router from 'next/router'
import { useEffect } from 'react'

// TODO: add proper home page
export default function Home() {
  useEffect(() => {
    Router.push('/people')
  }, [])

  return (
    <>
    </>
  )
}
