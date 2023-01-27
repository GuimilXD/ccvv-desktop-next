import Link from "next/link"
import Image from "next/image"

const LOGO_SIZE = 25;

export default function Navbar() {
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" href="/">
                    <Image width={LOGO_SIZE} height={LOGO_SIZE} src="/logo_projeto.jpg" alt="logo projeto"/>
                </Link>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    <Link href="/" className="navbar-item">Home</Link>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <Link href="/people" className="navbar-link">Pessoas</Link>

                        <div className="navbar-dropdown">
                            <Link href="/people" className="navbar-item">Mostrar Todas</Link>

                            <Link href="/people/new" className="navbar-item">Criar Nova</Link>
                        </div>
                    </div>

                    <div className="navbar-item has-dropdown is-hoverable">
                            <Link href="/modalities" className="navbar-link">Modalidades</Link>

                        <div className="navbar-dropdown">
                            <Link href="/modalities" className="navbar-item">Mostrar Todas</Link>

                            <Link href="/modalities/new" className="navbar-item">Criar Nova</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
