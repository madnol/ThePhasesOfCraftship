import logo from "../../../shared/assets/dddforumlogo.png";
import { Link } from "react-router-dom";
import { appSelectors, toClass } from "../../selectors";
import { NavLayoutVm } from "../application/viewModels/navLayoutVm";

interface LayoutComponentProps { 
  vm: NavLayoutVm, 
  signOut: () => void,
  children: React.ReactNode 
}

export const LayoutComponent = ({ vm, children, signOut }: LayoutComponentProps) => (
  <>
      <header
        id="header"
        className="flex align-center"
        style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}
      >
        <div id="app-logo">
          <img src={logo}></img>
        </div>
        <div id="title-container">
          <h1>Domain-Driven Designers</h1>
          <h3>Where awesome domain driven designers are made</h3>
          <Link to={"/submit"}>submit</Link>
        </div>
        {vm.pathname !== "/join" && (
          <div id="header-action-button">
            {vm?.isAuthenticated ? (
              <div
                className="username-logout-container"
                style={{
                  color: "white",
                  background: "black",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                {vm.username && (
                  <div className={toClass(appSelectors.header.selector)}>
                    {`${vm.username} / `}
                  </div>
                )}
                <u>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => signOut()}
                  >
                    Logout
                  </div>
                </u>
              </div>
            ) : (
              <Link to="/join">Join</Link>
            )}
          </div>
        )}
      </header>
      <div className="content-container">{children}</div>
  </>
)