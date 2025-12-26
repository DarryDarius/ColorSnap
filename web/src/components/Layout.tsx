import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

// The header is fixed-position, so we render a spacer to prevent content overlap.
const HEADER_SPACER_PX = 90;

export function Layout() {
  return (
    <>
      <Header />
      <div aria-hidden="true" style={{ height: HEADER_SPACER_PX }} />
      <Outlet />
      <Footer />
    </>
  );
}


