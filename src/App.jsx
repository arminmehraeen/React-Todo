import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "taskflow.todos.v1";
const filters = [
  { id: "all", label: "All tasks", icon: "▦" },
  { id: "today", label: "Today", icon: "◷" },
  { id: "active", label: "In progress", icon: "◌" },
  { id: "completed", label: "Completed", icon: "✓" },
];
const initialTasks = [
  { id: "sample-1", title: "Plan the week ahead", description: "Review priorities and set a clear direction.", completed: false, priority: "high", dueDate: todayISO(), createdAt: Date.now() - 3000 },
  { id: "sample-2", title: "Review project proposal", description: "Collect feedback and prepare the next iteration.", completed: false, priority: "medium", dueDate: todayISO(), createdAt: Date.now() - 2000 },
  { id: "sample-3", title: "Organize workspace", description: "Clean up notes and archive finished work.", completed: true, priority: "low", dueDate: "", createdAt: Date.now() - 1000 },
];
function todayISO() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function readTasks() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === null) return initialTasks;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    trash: <><path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };
  return <svg {...common}>{paths[name] || paths.check}</svg>;
}
function formatDate(value) {
  if (!value) return "No due date";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}
function TaskRow({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const save = () => {
    const clean = title.trim();
    if (clean) onEdit(task.id, clean);
    else setTitle(task.title);
    setEditing(false);
  };
  return (
    <article className={`task-row ${task.completed ? "task-row--done" : ""}`}>
      <button className={`task-check ${task.completed ? "task-check--checked" : ""}`} onClick={() => onToggle(task.id)} aria-label={task.completed ? "Mark as active" : "Mark as completed"}>
        {task.completed && <Icon name="check" size={15} />}
      </button>
      <div className="task-copy">
        {editing ? <form onSubmit={(event) => { event.preventDefault(); save(); }} className="inline-edit"><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => event.key === "Escape" && setEditing(false)} aria-label="Edit task title" /><button type="submit" className="text-action">Save</button></form> : <button className="task-title" onClick={() => { setTitle(task.title); setEditing(true); }}>{task.title}</button>}
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className={`priority priority--${task.priority}`}><span />{task.priority} priority</span>
          <span className={`due-date ${task.dueDate && task.dueDate < todayISO() && !task.completed ? "due-date--late" : ""}`}><Icon name="calendar" size={13} />{formatDate(task.dueDate)}</span>
        </div>
      </div>
      <button className="icon-button task-delete" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><Icon name="trash" size={17} /></button>
    </article>
  );
}
export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(todayISO());
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { setNotice("Your browser storage is unavailable. Changes may not persist."); }
  }, [tasks]);
  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;
  const todayCount = tasks.filter((task) => task.dueDate === todayISO() && !task.completed).length;
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "all" || (filter === "today" && task.dueDate === todayISO() && !task.completed) || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
    return matchesFilter && `${task.title} ${task.description || ""}`.toLowerCase().includes(search.toLowerCase().trim());
  }).sort((a, b) => Number(a.completed) - Number(b.completed) || (a.dueDate || "9999").localeCompare(b.dueDate || "9999") || b.createdAt - a.createdAt), [tasks, filter, search]);
  const addTask = (event) => {
    event.preventDefault();
    const clean = title.trim();
    if (!clean) return;
    setTasks((current) => [{ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, title: clean, description: description.trim(), completed: false, priority, dueDate, createdAt: Date.now() }, ...current]);
    setTitle(""); setDescription(""); setPriority("medium"); setDueDate(todayISO()); setShowComposer(false); setNotice("Task added successfully.");
    window.setTimeout(() => setNotice(""), 2500);
  };
  const toggleTask = (id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  const editTask = (id, nextTitle) => setTasks((current) => current.map((task) => task.id === id ? { ...task, title: nextTitle } : task));
  const deleteTask = (id) => setTasks((current) => current.filter((task) => task.id !== id));
  const clearCompleted = () => setTasks((current) => current.filter((task) => !task.completed));
  const greeting = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Taskflow home"><span className="brand-mark"><Icon name="check" size={22} /></span><span>taskflow<span className="brand-dot">.</span></span></a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Task filters">
          {filters.map((item) => <button key={item.id} className={`nav-item ${filter === item.id ? "nav-item--active" : ""}`} onClick={() => setFilter(item.id)}><span className="nav-icon">{item.icon}</span><span>{item.label}</span><span className="nav-count">{item.id === "all" ? tasks.length : item.id === "today" ? todayCount : item.id === "active" ? active : completed}</span></button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="focus-card"><span className="focus-icon"><Icon name="sun" size={19} /></span><strong>Make room for focus.</strong><p>Small steps add up to big things.</p><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="progress-caption"><span>Daily progress</span><strong>{progress}%</strong></div></div>
          <div className="profile"><div className="avatar">A</div><div><strong>My workspace</strong><span>Personal plan</span></div><button className="icon-button" aria-label="Workspace options"><Icon name="dots" /></button></div>
        </div>
      </aside>
      <section className="main-panel">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> My tasks</div><div className="topbar-right"><span className="date-label"><Icon name="calendar" size={15} />{greeting}</span><div className="avatar avatar--small">A</div></div></header>
        <div className="content-wrap">
          <section className="welcome-row"><div><p className="eyebrow">YOUR PERSONAL SPACE</p><h1>Get things done<span className="heading-period">.</span></h1><p className="welcome-subtitle">A little progress each day adds up to big results.</p></div><button className="primary-button" onClick={() => setShowComposer((value) => !value)}><Icon name={showComposer ? "close" : "plus"} size={18} />{showComposer ? "Close" : "New task"}</button></section>
          <section className="stats-grid" aria-label="Task summary">
            <div className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon stat-icon--purple">▦</span></div><strong>{tasks.length}</strong><span className="stat-foot">Across your workspace</span></div>
            <div className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon stat-icon--blue">◷</span></div><strong>{active}</strong><span className="stat-foot">One step at a time</span></div>
            <div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon stat-icon--green">✓</span></div><strong>{completed}</strong><span className="stat-foot">{progress}% of all tasks</span></div>
          </section>
          {showComposer && <form className="composer" onSubmit={addTask}>
            <div className="composer-heading"><div><h2>Create a task</h2><p>Capture it now, take care of it later.</p></div><button type="button" className="icon-button" onClick={() => setShowComposer(false)} aria-label="Close form"><Icon name="close" /></button></div>
            <label className="field-label" htmlFor="task-title">Task name</label><input id="task-title" className="field-input" autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Prepare the product launch" maxLength={160} required />
            <label className="field-label" htmlFor="task-description">Description <span>Optional</span></label><textarea id="task-description" className="field-input field-textarea" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context..." rows={2} maxLength={500} />
            <div className="field-row"><div className="field-group"><label className="field-label" htmlFor="task-priority">Priority</label><select id="task-priority" className="field-input" value={priority} onChange={(event) => setPriority(event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div><div className="field-group"><label className="field-label" htmlFor="task-date">Due date</label><input id="task-date" className="field-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div></div>
            <div className="composer-actions"><button type="button" className="secondary-button" onClick={() => setShowComposer(false)}>Cancel</button><button className="primary-button" type="submit"><Icon name="plus" size={16} />Add task</button></div>
          </form>}
          <section className="tasks-section">
            <div className="tasks-heading"><div><h2>{filters.find((item) => item.id === filter)?.label}</h2><p>{visibleTasks.length} {visibleTasks.length === 1 ? "task" : "tasks"} to focus on</p></div><div className="task-tools"><label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><Icon name="close" size={14} /></button>}</label>{completed > 0 && <button className="clear-button" onClick={clearCompleted}>Clear completed</button>}</div></div>
            {notice && <p className="notice" role="status">{notice}</p>}
            {visibleTasks.length ? <div className="task-list">{visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />)}</div> : <div className="empty-state"><div className="empty-icon"><Icon name="check" size={24} /></div><h3>{search ? "No matching tasks" : filter === "completed" ? "Nothing completed yet" : "You're all caught up"}</h3><p>{search ? "Try another search term." : "Add a task to get started and make today count."}</p>{!search && <button className="secondary-button" onClick={() => setShowComposer(true)}><Icon name="plus" size={16} />Create your first task</button>}</div>}
          </section>
          <footer className="footer-note"><span>Made for a more intentional day.</span><span><span className="footer-status" />Your tasks are saved on this device</span></footer>
        </div>
      </section>
    </main>
  );
}
