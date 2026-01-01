import { Link, NavLink } from "react-router-dom";

function navLinkClassName({ isActive, isPending }: { isActive: boolean; isPending: boolean }) {
  if (isPending) return undefined;
  return isActive ? "active" : undefined;
}

export function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          ColorSnap
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={navLinkClassName} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/analysis" className="cta">
              AI Color Analysis
            </NavLink>
          </li>
          <li>
            <NavLink to="/consultation" className={navLinkClassName}>
              Expert Consultation
            </NavLink>
          </li>
          <li>
            <NavLink to="/shoppingcart" className={navLinkClassName}>
              Shopping Cart
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={navLinkClassName}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/faq" className={navLinkClassName}>
              FAQ
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
