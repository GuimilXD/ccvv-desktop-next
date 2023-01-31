import { PropsWithChildren } from "react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import BackButton from "./back_button"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <BackButton />
      <main>{children}</main>
      <Footer />
    </>
  )
}
