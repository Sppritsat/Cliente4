'use client'

import { FormEvent, useMemo, useState } from 'react'

type Status = 'Pendiente' | 'Parcial' | 'Completo'
type Client = { id: string; name: string; initials: string; docs: string[]; received: number }

const initialClients: Client[] = [
  { id: 'CAL-1', name: 'Comercializadora Alfa', initials: 'CA', docs: ['Factura electrónica', 'Estado de cuenta'], received: 1 },
  { id: 'CAL-2', name: 'Servicios Rivera', initials: 'SR', docs: ['Nómina mensual', 'Pólizas contables', 'Declaración provisional'], received: 3 },
  { id: 'CAL-3', name: 'Grupo Horizonte', initials: 'GH', docs: ['Facturas de venta', 'Conciliación bancaria'], received: 0 },
  { id: 'CAL-4', name: 'Estudio Norte', initials: 'EN', docs: ['Comprobantes de gastos'], received: 1 },
]

function statusFor(client: Client): Status {
  if (client.received === client.docs.length) return 'Completo'
  if (client.received > 0) return 'Parcial'
  return 'Pendiente'
}

export default function Page() {
  const [clients, setClients] = useState(initialClients)
  const [selected, setSelected] = useState('Todos')
  const [clientName, setClientName] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [notice, setNotice] = useState('')

  const filteredClients = useMemo(() => selected === 'Todos' ? clients : clients.filter((client) => statusFor(client) === selected), [clients, selected])
  const allDocs = clients.reduce((total, client) => total + client.docs.length, 0)
  const receivedDocs = clients.reduce((total, client) => total + client.received, 0)
  const completeClients = clients.filter((client) => statusFor(client) === 'Completo').length

  function addDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!clientName.trim() || !documentName.trim()) return
    setClients((current) => current.map((client) => client.name === clientName ? { ...client, docs: [...client.docs, documentName.trim()] } : client))
    setNotice(`Documento agregado a ${clientName}.`)
    setDocumentName('')
  }

  function markNext(clientId: string) {
    setClients((current) => current.map((client) => client.id === clientId ? { ...client, received: Math.min(client.received + 1, client.docs.length) } : client))
    setNotice('Documento marcado como recibido.')
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-symbol">N</span><span>Núñez <small>& Asociados</small></span></div>
        <nav aria-label="Navegación principal">
          <p className="nav-label">GESTIÓN</p>
          <a className="nav-item active" href="#clientes"><span>▦</span> Seguimiento</a>
          <a className="nav-item" href="#agregar"><span>＋</span> Documentos</a>
          <a className="nav-item" href="#clientes"><span>◌</span> Clientes</a>
          <p className="nav-label nav-space">CUENTA</p>
          <a className="nav-item" href="#"><span>⚙</span> Configuración</a>
        </nav>
        <div className="sidebar-footer"><div className="avatar">LM</div><div><strong>Laura Martínez</strong><small>Contadora</small></div><span>···</span></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="breadcrumb">Espacio de trabajo <span>/</span> Seguimiento mensual</div><div className="top-actions"><button className="icon-button" aria-label="Notificaciones">♧</button><div className="date-chip">Septiembre 2026 <span>⌄</span></div></div></header>
        <div className="page-wrap">
          <div className="intro"><div><p className="eyebrow">PANEL DE CONTROL</p><h1>Seguimiento mensual</h1><p className="intro-copy">Revisa el avance de la documentación de tus clientes.</p></div><button className="primary-button" onClick={() => document.getElementById('agregar')?.scrollIntoView({ behavior: 'smooth' })}>＋ Agregar documento</button></div>

          <div className="metrics" aria-label="Resumen del mes">
            <article className="metric-card"><span className="metric-icon blue">◌</span><div><p>Documentos recibidos</p><strong>{receivedDocs}<small> / {allDocs}</small></strong><span className="metric-note positive">↑ 12% <em>vs. mes anterior</em></span></div></article>
            <article className="metric-card"><span className="metric-icon green">✓</span><div><p>Clientes al corriente</p><strong>{completeClients}<small> / {clients.length}</small></strong><span className="metric-note positive">↑ 1 <em>este mes</em></span></div></article>
            <article className="metric-card"><span className="metric-icon amber">!</span><div><p>Documentos pendientes</p><strong>{allDocs - receivedDocs}</strong><span className="metric-note neutral">Requieren seguimiento</span></div></article>
          </div>

          <section className="panel" id="clientes"><div className="panel-heading"><div><h2>Clientes y estatus</h2><p>{clients.length} clientes activos · Actualizado hace unos minutos</p></div><div className="filter-group">{['Todos', 'Pendiente', 'Parcial', 'Completo'].map((filter) => <button key={filter} className={selected === filter ? 'filter active-filter' : 'filter'} onClick={() => setSelected(filter)}>{filter}</button>)}</div></div><div className="table-wrap"><table><thead><tr><th>CLIENTE</th><th>DOCUMENTOS</th><th>PROGRESO</th><th>ESTATUS</th><th>ACCIÓN</th></tr></thead><tbody>{filteredClients.map((client) => { const status = statusFor(client); const percentage = Math.round((client.received / client.docs.length) * 100); return <tr key={client.id}><td><div className="client-cell"><span className="client-avatar">{client.initials}</span><div><strong>{client.name}</strong><small>{client.id}</small></div></div></td><td><span className="doc-count">{client.received} de {client.docs.length}</span><small className="doc-label"> documentos</small></td><td><div className="progress-row"><div className="progress"><span className={`progress-fill ${status.toLowerCase()}`} style={{ width: `${percentage}%` }} /></div><span>{percentage}%</span></div></td><td><span className={`status ${status.toLowerCase()}`}><i />{status}</span></td><td><button className="row-action" disabled={status === 'Completo'} onClick={() => markNext(client.id)}>{status === 'Completo' ? 'Al corriente' : 'Marcar recibido'} <span>→</span></button></td></tr> })}</tbody></table></div></section>

          <section className="lower-grid" id="agregar"><div className="panel add-panel"><div className="panel-heading"><div><h2>Agregar documento</h2><p>Solicita documentación adicional a un cliente.</p></div><span className="plus-badge">＋</span></div><form onSubmit={addDocument}><label htmlFor="client">Cliente</label><select id="client" value={clientName} onChange={(event) => setClientName(event.target.value)} required><option value="">Selecciona un cliente</option>{clients.map((client) => <option key={client.id}>{client.name}</option>)}</select><label htmlFor="document">Documento requerido</label><input id="document" value={documentName} onChange={(event) => setDocumentName(event.target.value)} placeholder="Ej. Estado de cuenta bancario" required /><button className="primary-button full" type="submit">Agregar documento <span>→</span></button>{notice && <p className="notice" role="status">{notice}</p>}</form></div><div className="panel activity-panel"><div className="panel-heading"><div><h2>Actividad reciente</h2><p>Últimos movimientos del equipo</p></div><button className="more-button">Ver todo</button></div><ul className="activity-list"><li><span className="activity-dot green-dot" /><div><strong>Servicios Rivera</strong><p>completó su documentación</p></div><time>Hace 18 min</time></li><li><span className="activity-dot blue-dot" /><div><strong>Laura Martínez</strong><p>agregó “Póliza de seguros”</p></div><time>Hace 1 h</time></li><li><span className="activity-dot amber-dot" /><div><strong>Comercializadora Alfa</strong><p>tiene documentos pendientes</p></div><time>Hace 3 h</time></li></ul></div></section>
        </div>
      </section>
    </main>
  )
}
