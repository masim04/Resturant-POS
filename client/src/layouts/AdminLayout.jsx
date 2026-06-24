import { NavLink } from "react-router-dom";
import cafe from "../assets/cafe.jpg";
function AdminLayout({ children }) {
  const rail =
    "flex h-11 w-11 items-center justify-center rounded-xl text-pos-muted transition-colors hover:bg-pos-bg hover:text-pos-text";
  const railActive = "bg-pos-peach text-pos-orange shadow-sm";

  return (
    <div className="flex min-h-screen bg-pos-bg font-sans text-pos-text antialiased">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-18 flex-col items-center border-r border-pos-border bg-white py-5">
        <NavLink
          to="/admin"
          end
          title="Home"
          className="mb-5 flex h-10 w-10 items-center justify-center  text-sm font-bold text-white shadow-sm transition-colors hover:bg-pos-orange-hover"
        >
          <img src={cafe} alt="Cafe" />
        </NavLink>
        <nav className="flex flex-col items-center gap-2">
          <NavLink
            to="/admin"
            end
            title="Dashboard"
            className={({ isActive }) =>
              `${rail} ${isActive ? railActive : ""}`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/admin/pos-system"
            title="POS"
            className={({ isActive }) =>
              `${rail} ${isActive ? railActive : ""}`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/admin/edit-menu"
            title="Menu"
            className={({ isActive }) =>
              `${rail} ${isActive ? railActive : ""}`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/admin/payments-orders"
            title="Payments & orders"
            className={({ isActive }) =>
              `${rail} ${isActive ? railActive : ""}`
            }
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </NavLink>
          <NavLink
            to="/admin/change-password"
            title="Change Password"
            className={({ isActive }) =>
              `${rail} ${isActive ? railActive : ""}`
            }
          >
           <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4" />
</svg>
          </NavLink>
        </nav>
        <div className="mt-auto flex flex-col items-center pb-2">
          <button
            type="button"
            title="Log out"
            onClick={() => {
              sessionStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-pos-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </aside>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden pl-18">
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
