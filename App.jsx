import React, { useState } from "react";

const defaultUsers = [
  {
    id: 1,
    nombre: "Administrador",
    usuario: "admin",
    password: "admin123",
    rol: "Administrador"
  }
];

const initialSales = [];

function App() {
  const [logged, setLogged] = useState(() => {
    return localStorage.getItem("vantix_logged") === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("vantix_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [section, setSection] = useState("dashboard");

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("vantix_users");

    if (saved) {
      return JSON.parse(saved);
    }

    localStorage.setItem(
      "vantix_users",
      JSON.stringify(defaultUsers)
    );

    return defaultUsers;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("vantix_sales");

    return saved ? JSON.parse(saved) : initialSales;
  });

  const [login, setLogin] = useState({
    usuario: "",
    password: ""
  });

  const [newUser, setNewUser] = useState({
    nombre: "",
    usuario: "",
    password: "",
    rol: "Agente"
  });

  const [sale, setSale] = useState({
    tipoCaso: "Venta",
    plan: "300 megas",
    puntaje: "",
    totalizacion: "SIN",
    vendedor: "",
    horario: "",
    formaPago: "Efectivo",

    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",

    telefono: "",
    alternativo: "",
    whatsapp: "",
    email: "",

    calle: "",
    numero: "",
    entreCalles: "",
    piso: "",
    departamento: "",
    localidad: "",
    provincia: "Mendoza",

    dniFrente: "",
    dniDorso: "",
    factura: "",

    facturaPortavilla: "",
    exceso: "",

    digitalBanca: false,
    seisDigitos: "",
    numeroBanco: "",
    cadenaCuenta: "",

    observaciones: ""
  });

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (e) => {
    e.preventDefault();

    const usuarioIngresado = login.usuario.trim();
    const passwordIngresada = login.password;

    const found = users.find(
      (u) =>
        u.usuario.toLowerCase() ===
          usuarioIngresado.toLowerCase() &&
        u.password === passwordIngresada
    );

    if (!found) {
      alert("Usuario o contraseña incorrectos.");
      return;
    }

    setCurrentUser(found);
    setLogged(true);

    localStorage.setItem("vantix_logged", "true");
    localStorage.setItem(
      "vantix_current_user",
      JSON.stringify(found)
    );

    setLogin({
      usuario: "",
      password: ""
    });
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    setLogged(false);
    setCurrentUser(null);

    localStorage.removeItem("vantix_logged");
    localStorage.removeItem("vantix_current_user");
  };

  // =========================
  // VENTAS
  // =========================

  const handleSaleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSale({
      ...sale,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // =========================
  // USUARIOS
  // =========================

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const createUser = (e) => {
    e.preventDefault();

    const nombre = newUser.nombre.trim();
    const usuario = newUser.usuario.trim();
    const password = newUser.password;

    if (!nombre || !usuario || !password) {
      alert("Completá todos los campos del usuario.");
      return;
    }

    const alreadyExists = users.some(
      (u) =>
        u.usuario.toLowerCase() ===
        usuario.toLowerCase()
    );

    if (alreadyExists) {
      alert("Ese nombre de usuario ya existe.");
      return;
    }

    const user = {
      id: Date.now(),
      nombre,
      usuario,
      password,
      rol: newUser.rol
    };

    const updatedUsers = [...users, user];

    setUsers(updatedUsers);

    localStorage.setItem(
      "vantix_users",
      JSON.stringify(updatedUsers)
    );

    setNewUser({
      nombre: "",
      usuario: "",
      password: "",
      rol: "Agente"
    });

    alert(
      `Usuario creado correctamente.\n\nUsuario: ${usuario}\nContraseña: ${password}`
    );
  };

  // =========================
  // GUARDAR VENTA
  // =========================

  const saveSale = (e) => {
    e.preventDefault();

    if (!sale.nombre || !sale.apellido || !sale.dni) {
      alert("Completá nombre, apellido y DNI.");
      return;
    }

    const newSale = {
      ...sale,
      id: Date.now(),
      fecha: new Date().toLocaleDateString("es-AR"),
      agente: currentUser?.nombre || ""
    };

    const updatedSales = [...sales, newSale];

    setSales(updatedSales);

    localStorage.setItem(
      "vantix_sales",
      JSON.stringify(updatedSales)
    );

    alert("Venta cargada correctamente.");

    setSection("sales");
  };

  // =========================
  // COPIAR CADENA
  // =========================

  const copyAccountChain = async () => {
    try {
      await navigator.clipboard.writeText(
        sale.cadenaCuenta || ""
      );

      alert("Cadena de cuenta copiada.");
    } catch (error) {
      alert("No se pudo copiar la cadena.");
    }
  };

  // =========================
  // LOGIN
  // =========================

  if (!logged) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="logo">V</div>

          <h1>VANTIX</h1>

          <p>CRM · Gestión de Ventas Fibra</p>

          <form onSubmit={handleLogin}>

            <label>Usuario</label>

            <input
              type="text"
              value={login.usuario}
              onChange={(e) =>
                setLogin({
                  ...login,
                  usuario: e.target.value
                })
              }
              placeholder="Ingresá tu usuario"
              autoComplete="username"
            />

            <label>Contraseña</label>

            <input
              type="password"
              value={login.password}
              onChange={(e) =>
                setLogin({
                  ...login,
                  password: e.target.value
                })
              }
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
            />

            <button type="submit">
              Ingresar
            </button>

          </form>

          <small>
            Acceso inicial: admin / admin123
          </small>

        </div>
      </div>
    );
  }

  // =========================
  // SISTEMA
  // =========================

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            V
          </div>

          <div>
            <strong>VANTIX</strong>
            <span>CRM Fibra</span>
          </div>

        </div>

        <nav>

          <button
            className={
              section === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setSection("dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className={
              section === "newSale"
                ? "active"
                : ""
            }
            onClick={() =>
              setSection("newSale")
            }
          >
            ➕ Nueva venta
          </button>

          <button
            className={
              section === "sales"
                ? "active"
                : ""
            }
            onClick={() =>
              setSection("sales")
            }
          >
            📋 Ventas
          </button>

          <button
            className={
              section === "clients"
                ? "active"
                : ""
            }
            onClick={() =>
              setSection("clients")
            }
          >
            👥 Clientes
          </button>

          <button
            className={
              section === "users"
                ? "active"
                : ""
            }
            onClick={() =>
              setSection("users")
            }
          >
            👤 Usuarios
          </button>

        </nav>

        <button
          className="logout"
          onClick={handleLogout}
        >
          🚪 Cerrar sesión
        </button>

      </aside>

      <main className="content">

        <header className="topbar">

          <div>

            <h2>
              {section === "dashboard" &&
                "Dashboard"}

              {section === "newSale" &&
                "Nueva venta"}

              {section === "sales" &&
                "Ventas"}

              {section === "clients" &&
                "Clientes"}

              {section === "users" &&
                "Usuarios"}
            </h2>

            <span>
              Gestión comercial VANTIX
            </span>

          </div>

          <div className="user-box">

            👤 {currentUser?.nombre}

          </div>

        </header>

        {/* ================= DASHBOARD ================= */}

        {section === "dashboard" && (

          <section>

            <div className="cards">

              <div className="card">
                <span>Ventas</span>
                <strong>
                  {sales.length}
                </strong>
              </div>

              <div className="card">
                <span>Usuarios</span>
                <strong>
                  {users.length}
                </strong>
              </div>

              <div className="card">
                <span>Clientes</span>
                <strong>
                  {sales.length}
                </strong>
              </div>

              <div className="card">
                <span>Estado</span>
                <strong>
                  Activo
                </strong>
              </div>

            </div>

            <div className="welcome">

              <h3>
                Bienvenida a VANTIX
              </h3>

              <p>
                Desde este sistema vas a poder
                gestionar usuarios, clientes y
                cargas de ventas de fibra óptica.
              </p>

              <p>
                Usuario conectado:
                <strong>
                  {" "}
                  {currentUser?.nombre}
                </strong>
              </p>

              <button
                onClick={() =>
                  setSection("newSale")
                }
              >
                Cargar nueva venta
              </button>

            </div>

          </section>

        )}

        {/* ================= NUEVA VENTA ================= */}

        {section === "newSale" && (

          <form
            className="form-card"
            onSubmit={saveSale}
          >

            <h3>
              Datos de la venta
            </h3>

            <div className="grid">

              <div>
                <label>
                  Tipo de caso
                </label>

                <select
                  name="tipoCaso"
                  value={sale.tipoCaso}
                  onChange={handleSaleChange}
                >
                  <option>Venta</option>
                  <option>Portavilla</option>
                  <option>Digitales</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label>
                  Plan
                </label>

                <select
                  name="plan"
                  value={sale.plan}
                  onChange={handleSaleChange}
                >
                  <option>300 megas</option>
                  <option>600 megas</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label>
                  Puntaje
                </label>

                <input
                  name="puntaje"
                  value={sale.puntaje}
                  onChange={handleSaleChange}
                  placeholder="Ej: 360"
                />
              </div>

              <div>
                <label>
                  Totalización
                </label>

                <select
                  name="totalizacion"
                  value={sale.totalizacion}
                  onChange={handleSaleChange}
                >
                  <option>SIN</option>
                  <option>CON</option>
                </select>
              </div>

              <div>
                <label>
                  Vendedor / Asesora
                </label>

                <input
                  name="vendedor"
                  value={sale.vendedor}
                  onChange={handleSaleChange}
                  placeholder="Nombre del vendedor"
                />
              </div>

              <div>
                <label>
                  Horario preferido
                </label>

                <input
                  name="horario"
                  value={sale.horario}
                  onChange={handleSaleChange}
                  placeholder="Ej: 12 a 20 hs"
                />
              </div>

              <div>
                <label>
                  Forma de pago
                </label>

                <select
                  name="formaPago"
                  value={sale.formaPago}
                  onChange={handleSaleChange}
                >
                  <option>
                    Efectivo
                  </option>

                  <option>
                    Débito
                  </option>

                  <option>
                    Otro
                  </option>
                </select>
              </div>

            </div>

            <h3>
              Datos del cliente
            </h3>

            <div className="grid">

              <div>
                <label>Nombre</label>

                <input
                  name="nombre"
                  value={sale.nombre}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>Apellido</label>

                <input
                  name="apellido"
                  value={sale.apellido}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>DNI</label>

                <input
                  name="dni"
                  value={sale.dni}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  Fecha de nacimiento
                </label>

                <input
                  type="date"
                  name="fechaNacimiento"
                  value={sale.fechaNacimiento}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  Teléfono
                </label>

                <input
                  name="telefono"
                  value={sale.telefono}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  Teléfono alternativo
                </label>

                <input
                  name="alternativo"
                  value={sale.alternativo}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  WhatsApp
                </label>

                <input
                  name="whatsapp"
                  value={sale.whatsapp}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={sale.email}
                  onChange={handleSaleChange}
                />
              </div>

            </div>

            <h3>
              Dirección
            </h3>

            <div className="grid">

              <div>
                <label>Calle</label>

                <input
                  name="calle"
                  value={sale.calle}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>Número</label>

                <input
                  name="numero"
                  value={sale.numero}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  Entre calles
                </label>

                <input
                  name="entreCalles"
                  value={sale.entreCalles}
                  onChange={handleSaleChange}
                  placeholder="Ej: San Martín y Belgrano"
                />
              </div>

              <div>
                <label>Piso</label>

                <input
                  name="piso"
                  value={sale.piso}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  Departamento
                </label>

                <input
                  name="departamento"
                  value={sale.departamento}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  Localidad
                </label>

                <input
                  name="localidad"
                  value={sale.localidad}
                  onChange={handleSaleChange}
                />
              </div>

              <div>
                <label>
                  Provincia
                </label>

                <input
                  name="provincia"
                  value={sale.provincia}
                  onChange={handleSaleChange}
                />
              </div>

            </div>

            <h3>
              Documentación
            </h3>

            <div className="grid">

              <div>
                <label>
                  DNI frente
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSale({
                      ...sale,
                      dniFrente:
                        e.target.files?.[0]?.name || ""
                    })
                  }
                />
              </div>

              <div>
                <label>
                  DNI dorso
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSale({
                      ...sale,
                      dniDorso:
                        e.target.files?.[0]?.name || ""
                    })
                  }
                />
              </div>

              <div>
                <label>
                  Factura
                </label>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    setSale({
                      ...sale,
                      factura:
                        e.target.files?.[0]?.name || ""
                    })
                  }
                />
              </div>

            </div>

            {sale.tipoCaso === "Portavilla" && (

              <>
                <h3>
                  Datos Portavilla
                </h3>

                <div className="grid">

                  <div>
                    <label>
                      Número de factura
                    </label>

                    <input
                      name="facturaPortavilla"
                      value={
                        sale.facturaPortavilla
                      }
                      onChange={
                        handleSaleChange
                      }
                    />
                  </div>

                  <div>
                    <label>
                      Exceso
                    </label>

                    <input
                      name="exceso"
                      value={sale.exceso}
                      onChange={
                        handleSaleChange
                      }
                    />
                  </div>

                </div>
              </>

            )}

            {sale.tipoCaso === "Digitales" && (

              <>
                <h3>
                  Digitales
                </h3>

                <div className="digital-box">

                  <label className="check">

                    <input
                      type="checkbox"
                      name="digitalBanca"
                      checked={
                        sale.digitalBanca
                      }
                      onChange={
                        handleSaleChange
                      }
                    />

                    Digital Banca

                  </label>

                  <div className="grid">

                    <div>

                      <label>
                        6 dígitos
                      </label>

                      <input
                        name="seisDigitos"
                        maxLength="6"
                        value={
                          sale.seisDigitos
                        }
                        onChange={
                          handleSaleChange
                        }
                        placeholder="000000"
                      />

                    </div>

                    <div>

                      <label>
                        Número del banco
                      </label>

                      <input
                        name="numeroBanco"
                        value={
                          sale.numeroBanco
                        }
                        onChange={
                          handleSaleChange
                        }
                      />

                    </div>

                    <div className="full">

                      <label>
                        Cadena de la cuenta
                      </label>

                      <div className="copy-row">

                        <input
                          name="cadenaCuenta"
                          value={
                            sale.cadenaCuenta
                          }
                          onChange={
                            handleSaleChange
                          }
                          placeholder="Cadena editable"
                        />

                        <button
                          type="button"
                          onClick={
                            copyAccountChain
                          }
                        >
                          Copiar
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              </>

            )}

            <h3>
              Observaciones
            </h3>

            <textarea
              name="observaciones"
              value={sale.observaciones}
              onChange={handleSaleChange}
              rows="5"
              placeholder="Observaciones de la venta..."
            />

            <button
              className="primary"
              type="submit"
            >
              Guardar venta
            </button>

          </form>

        )}

        {/* ================= VENTAS ================= */}

        {section === "sales" && (

          <section className="form-card">

            <h3>
              Ventas cargadas
            </h3>

            {sales.length === 0 ? (

              <div className="empty">
                Todavía no hay ventas cargadas.
              </div>

            ) : (

              <div className="table-container">

                <table>

                  <thead>

                    <tr>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>DNI</th>
                      <th>Plan</th>
                      <th>Tipo</th>
                      <th>Vendedor</th>
                      <th>Agente</th>
                    </tr>

                  </thead>

                  <tbody>

                    {sales.map((item) => (

                      <tr key={item.id}>

                        <td>
                          {item.fecha}
                        </td>

                        <td>
                          {item.nombre}{" "}
                          {item.apellido}
                        </td>

                        <td>
                          {item.dni}
                        </td>

                        <td>
                          {item.plan}
                        </td>

                        <td>
                          {item.tipoCaso}
                        </td>

                        <td>
                          {item.vendedor}
                        </td>

                        <td>
                          {item.agente}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

        {/* ================= CLIENTES ================= */}

        {section === "clients" && (

          <section className="form-card">

            <h3>
              Clientes
            </h3>

            {sales.length === 0 ? (

              <div className="empty">
                No hay clientes registrados.
              </div>

            ) : (

              <div className="client-list">

                {sales.map((item) => (

                  <div
                    className="client-item"
                    key={item.id}
                  >

                    <strong>
                      {item.nombre}{" "}
                      {item.apellido}
                    </strong>

                    <span>
                      DNI: {item.dni}
                    </span>

                    <span>
                      Teléfono: {item.telefono}
                    </span>

                    <span>
                      Localidad: {item.localidad}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}

        {/* ================= USUARIOS ================= */}

        {section === "users" && (

          <section className="form-card">

            <h3>
              Crear usuario
            </h3>

            <form onSubmit={createUser}>

              <div className="grid">

                <div>

                  <label>
                    Nombre completo
                  </label>

                  <input
                    name="nombre"
                    value={
                      newUser.nombre
                    }
                    onChange={
                      handleUserChange
                    }
                  />

                </div>

                <div>

                  <label>
                    Usuario
                  </label>

                  <input
                    name="usuario"
                    value={
                      newUser.usuario
                    }
                    onChange={
                      handleUserChange
                    }
                  />

                </div>

                <div>

                  <label>
                    Contraseña
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      newUser.password
                    }
                    onChange={
                      handleUserChange
                    }
                  />

                </div>

                <div>

                  <label>
                    Rol
                  </label>

                  <select
                    name="rol"
                    value={newUser.rol}
                    onChange={
                      handleUserChange
                    }
                  >

                    <option>
                      Agente
                    </option>

                    <option>
                      Supervisor
                    </option>

                    <option>
                      Administrador
                    </option>

                  </select>

                </div>

              </div>

              <button
                className="primary"
                type="submit"
              >
                Crear usuario
              </button>

            </form>

            <hr />

            <h3>
              Usuarios existentes
            </h3>

            <div className="user-list">

              {users.map((user) => (

                <div
                  className="user-item"
                  key={user.id}
                >

                  <strong>
                    {user.nombre}
                  </strong>

                  <span>
                    Usuario: {user.usuario}
                  </span>

                  <span>
                    Rol: {user.rol}
                  </span>

                </div>

              ))}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;
