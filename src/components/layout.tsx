import { PropsWithChildren } from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      <Footer/>
    </>
  )
}
