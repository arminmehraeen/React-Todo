/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "taskflow.todos.v2";
const THEME_KEY = "taskflow.theme.v1";
const filters = [
  { id: "all", label: "All tasks", icon: "▦" },
  { id: "today", label: "Today", icon: "◷" },
  { id: "overdue", label: "Overdue", icon: "!" },
  { id: "active", label: "In progress", icon: "◌" },
  { id: "completed", label: "Completed", icon: "✓" },
];
const priorities = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function todayISO() {
  const date = new Date();
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}
function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
}
function normalizeTask(task) {
  if (!task || typeof task !== "object" || typeof task.title !== "string" || !task.title.trim()) return null;
  return {
    id: String(task.id || createId()),
    title: task.title.trim().slice(0, 160),
    description: typeof task.description === "string" ? task.description.slice(0, 500) : "",
    completed: Boolean(task.completed),
    priority: ["low", "medium", "high"].includes(task.priority) ? task.priority : "medium",
    dueDate: typeof task.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ? task.dueDate : "",
    createdAt: Number(task.createdAt) || Date.now(),
    updatedAt: Number(task.updatedAt) || Number(task.createdAt) || Date.now(),
  };
}
function readTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("taskflow.todos.v1");
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeTask).filter(Boolean) : [];
  } catch {
    return [];
  }
}
function readTheme() {
  try { return localStorage.getItem(THEME_KEY) || "light"; } catch { return "light"; }
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
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5M12 3v12" /></>,
    sort: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
    undo: <><path d="M3 7v6h6" /><path d="M5.5 17a8 8 0 1 0 .2-10.2L3 13" /></>,
    dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };
  return <svg {...common}>{paths[name] || paths.check}</svg>;
}
function formatDate(value) {
  if (!value) return "No due date";
  const date = new Date(value + "T12:00:00");
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined }).format(date);
}
function TaskRow({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: task.title, description: task.description || "", priority: task.priority || "medium", dueDate: task.dueDate || "" });
  useEffect(() => {
    if (!editing) setDraft({ title: task.title, description: task.description || "", priority: task.priority || "medium", dueDate: task.dueDate || "" });
  }, [task, editing]);
  const save = (event) => {
    event.preventDefault();
    const clean = draft.title.trim();
    if (!clean) return;
    onEdit(task.id, { ...draft, title: clean });
    setEditing(false);
  };
  const overdue = task.dueDate && task.dueDate < todayISO() && !task.completed;
  if (editing) {
    return <form className="task-row task-edit-form" onSubmit={save}>
      <div className="task-edit-fields">
        <label className="sr-only" htmlFor={"edit-title-" + task.id}>Task title</label>
        <input id={"edit-title-" + task.id} className="field-input" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} maxLength={160} required autoFocus />
        <label className="sr-only" htmlFor={"edit-description-" + task.id}>Description</label>
        <textarea id={"edit-description-" + task.id} className="field-input field-textarea" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Description (optional)" maxLength={500} rows={2} />
        <div className="field-row">
          <div className="field-group"><label className="field-label" htmlFor={"edit-priority-" + task.id}>Priority</label><select id={"edit-priority-" + task.id} className="field-input" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })}>{priorities.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          <div className="field-group"><label className="field-label" htmlFor={"edit-date-" + task.id}>Due date</label><input id={"edit-date-" + task.id} className="field-input" type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} /></div>
        </div>
        <div className="composer-actions"><button type="button" className="secondary-button" onClick={() => setEditing(false)}>Cancel</button><button className="primary-button" type="submit">Save changes</button></div>
      </div>
    </form>;
  }
  return <article className={"task-row" + (task.completed ? " task-row--done" : "")}>
    <button className={"task-check" + (task.completed ? " task-check--checked" : "")} onClick={() => onToggle(task.id)} aria-label={task.completed ? "Mark as active" : "Mark as completed"}>{task.completed && <Icon name="check" size={15} />}</button>
    <div className="task-copy">
      <button className="task-title" onClick={() => setEditing(true)} title="Click to edit task">{task.title}</button>
      {task.description && <p>{task.description}</p>}
      <div className="task-meta">
        <span className={"priority priority--" + task.priority}><span />{task.priority} priority</span>
        <span className={"due-date" + (overdue ? " due-date--late" : "")}><Icon name="calendar" size={13} />{overdue ? "Overdue · " : ""}{formatDate(task.dueDate)}</span>
      </div>
    </div>
    <div className="task-row-actions">
      <button className="icon-button task-edit-button" onClick={() => setEditing(true)} aria-label={"Edit " + task.title} title="Edit task"><Icon name="dots" size={17} /></button>
      <button className="icon-button task-delete" onClick={() => onDelete(task.id)} aria-label={"Delete " + task.title} title="Delete task"><Icon name="trash" size={17} /></button>
    </div>
  </article>;
}
export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due");
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState(todayISO());
  const [notice, setNotice] = useState("");
  const [undoTask, setUndoTask] = useState(null);
  const [theme, setTheme] = useState(readTheme);
  const importRef = useRef(null);
  const noticeTimer = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch { setNotice("Browser storage is unavailable. Your changes may not persist."); }
  }, [tasks]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* private browsing can block storage */ }
  }, [theme]);
  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);
  const announce = (message, undo = null) => {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    setUndoTask(undo);
    noticeTimer.current = window.setTimeout(() => { setNotice(""); setUndoTask(null); }, 4000);
  };

  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;
  const todayCount = tasks.filter((task) => task.dueDate === todayISO() && !task.completed).length;
  const overdueCount = tasks.filter((task) => task.dueDate && task.dueDate < todayISO() && !task.completed).length;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesFilter = filter === "all" ||
        (filter === "today" && task.dueDate === todayISO() && !task.completed) ||
        (filter === "overdue" && task.dueDate && task.dueDate < todayISO() && !task.completed) ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);
      const matchesSearch = (task.title + " " + (task.description || "")).toLowerCase().includes(search.toLowerCase().trim());
      return matchesFilter && matchesSearch && (priorityFilter === "all" || task.priority === priorityFilter);
    });
    const priorityRank = { high: 0, medium: 1, low: 2 };
    return filtered.sort((a, b) => {
      if (sortBy === "priority") return priorityRank[a.priority] - priorityRank[b.priority] || (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      if (sortBy === "oldest") return a.createdAt - b.createdAt;
      return (a.dueDate || "9999").localeCompare(b.dueDate || "9999") || priorityRank[a.priority] - priorityRank[b.priority] || b.createdAt - a.createdAt;
    });
  }, [tasks, filter, search, priorityFilter, sortBy]);

  const addTask = (event) => {
    event.preventDefault();
    const clean = title.trim();
    if (!clean) return;
    const now = Date.now();
    setTasks((current) => [{ id: createId(), title: clean, description: description.trim(), completed: false, priority, dueDate, createdAt: now, updatedAt: now }, ...current]);
    setTitle(""); setDescription(""); setPriority("medium"); setDueDate(todayISO()); setShowComposer(false);
    announce("Task added successfully.");
  };
  const toggleTask = (id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed, updatedAt: Date.now() } : task));
  const editTask = (id, changes) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...changes, updatedAt: Date.now() } : task));
    announce("Task updated.");
  };
  const deleteTask = (id) => {
    const removed = tasks.find((task) => task.id === id);
    if (!removed) return;
    setTasks((current) => current.filter((task) => task.id !== id));
    announce("Task deleted.", removed);
  };
  const undoDelete = () => {
    if (!undoTask) return;
    setTasks((current) => [undoTask, ...current]);
    window.clearTimeout(noticeTimer.current);
    setNotice("Task restored.");
    setUndoTask(null);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 2500);
  };
  const clearCompleted = () => {
    const count = completed;
    if (!count || !window.confirm("Delete all " + count + " completed tasks? This cannot be undone.")) return;
    setTasks((current) => current.filter((task) => !task.completed));
    announce(count + " completed tasks cleared.");
  };
  const exportTasks = () => {
    const blob = new Blob([JSON.stringify({ app: "Taskflow", version: 1, exportedAt: new Date().toISOString(), tasks }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "taskflow-backup-" + todayISO() + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    announce("Backup exported.");
  };
  const importTasks = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("The file must be smaller than 5 MB.");
      const parsed = JSON.parse(await file.text());
      const source = Array.isArray(parsed) ? parsed : parsed.tasks;
      if (!Array.isArray(source)) throw new Error("This file does not contain a Taskflow task list.");
      const imported = source.map(normalizeTask).filter(Boolean);
      if (!imported.length && source.length) throw new Error("No valid tasks were found in this backup.");
      if (!window.confirm("Import " + imported.length + " tasks? Your current task list will be replaced.")) return;
      setTasks(imported);
      setFilter("all"); setSearch(""); setPriorityFilter("all");
      announce(imported.length + " tasks imported.");
    } catch (error) {
      announce(error instanceof Error ? error.message : "Could not import this file.");
    }
  };
  const greeting = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="Taskflow home"><span className="brand-mark"><Icon name="check" size={22} /></span><span>taskflow<span className="brand-dot">.</span></span></a>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="nav-list" aria-label="Task filters">
        {filters.map((item) => <button key={item.id} className={"nav-item" + (filter === item.id ? " nav-item--active" : "")} onClick={() => setFilter(item.id)}><span className="nav-icon">{item.icon}</span><span>{item.label}</span><span className="nav-count">{item.id === "all" ? tasks.length : item.id === "today" ? todayCount : item.id === "overdue" ? overdueCount : item.id === "active" ? active : completed}</span></button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="focus-card"><span className="focus-icon"><Icon name="sun" size={19} /></span><strong>Make room for focus.</strong><p>Small steps add up to big things.</p><div className="progress-track"><span style={{ width: progress + "%" }} /></div><div className="progress-caption"><span>All-time progress</span><strong>{progress}%</strong></div></div>
        <div className="profile"><div className="avatar">Y</div><div><strong>My workspace</strong><span>Personal plan</span></div><button className="icon-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle color theme" title="Toggle color theme"><Icon name={theme === "light" ? "moon" : "sun"} /></button></div>
      </div>
    </aside>
    <section className="main-panel" id="top">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> My tasks</div><div className="topbar-right"><span className="date-label"><Icon name="calendar" size={15} />{greeting}</span><button className="icon-button theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"} title={theme === "light" ? "Dark mode" : "Light mode"}><Icon name={theme === "light" ? "moon" : "sun"} /></button><div className="avatar avatar--small">Y</div></div></header>
      <div className="content-wrap">
        <section className="welcome-row"><div><p className="eyebrow">YOUR PERSONAL SPACE</p><h1>Get things done<span className="heading-period">.</span></h1><p className="welcome-subtitle">A little progress each day adds up to big results.</p></div><button className="primary-button" onClick={() => setShowComposer((value) => !value)}><Icon name={showComposer ? "close" : "plus"} size={18} />{showComposer ? "Close" : "New task"}</button></section>
        <section className="stats-grid" aria-label="Task summary">
          <div className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon stat-icon--purple">▦</span></div><strong>{tasks.length}</strong><span className="stat-foot">Across your workspace</span></div>
          <div className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon stat-icon--blue">◷</span></div><strong>{active}</strong><span className="stat-foot">{overdueCount ? overdueCount + " overdue" : "One step at a time"}</span></div>
          <div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon stat-icon--green">✓</span></div><strong>{completed}</strong><span className="stat-foot">{progress}% of all tasks</span></div>
        </section>
        {showComposer && <form className="composer" onSubmit={addTask}>
          <div className="composer-heading"><div><h2>Create a task</h2><p>Capture it now, take care of it later.</p></div><button type="button" className="icon-button" onClick={() => setShowComposer(false)} aria-label="Close form"><Icon name="close" /></button></div>
          <label className="field-label" htmlFor="task-title">Task name</label><input id="task-title" className="field-input" autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Prepare the product launch" maxLength={160} required />
          <label className="field-label" htmlFor="task-description">Description <span>Optional</span></label><textarea id="task-description" className="field-input field-textarea" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context..." rows={2} maxLength={500} />
          <div className="field-row"><div className="field-group"><label className="field-label" htmlFor="task-priority">Priority</label><select id="task-priority" className="field-input" value={priority} onChange={(event) => setPriority(event.target.value)}>{priorities.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div><div className="field-group"><label className="field-label" htmlFor="task-date">Due date</label><input id="task-date" className="field-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div></div>
          <div className="composer-actions"><button type="button" className="secondary-button" onClick={() => setShowComposer(false)}>Cancel</button><button className="primary-button" type="submit"><Icon name="plus" size={16} />Add task</button></div>
        </form>}
        <section className="tasks-section">
          <div className="tasks-heading"><div><h2>{filters.find((item) => item.id === filter)?.label}</h2><p>{visibleTasks.length} {visibleTasks.length === 1 ? "task" : "tasks"} to focus on</p></div><div className="task-tools"><label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><Icon name="close" size={14} /></button>}</label><label className="select-tool"><span>Priority</span><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option value="all">All</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label className="select-tool sort-tool"><Icon name="sort" size={15} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort tasks"><option value="due">Due date</option><option value="priority">Priority</option><option value="newest">Newest</option><option value="oldest">Oldest</option></select></label></div></div>
          {notice && <div className="notice" role="status"><span>{notice}</span>{undoTask && <button type="button" className="undo-button" onClick={undoDelete}><Icon name="undo" size={14} />Undo</button>}</div>}
          {visibleTasks.length ? <div className="task-list">{visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />)}</div> : <div className="empty-state"><div className="empty-icon"><Icon name="check" size={24} /></div><h3>{search || priorityFilter !== "all" ? "No matching tasks" : filter === "completed" ? "Nothing completed yet" : filter === "overdue" ? "You're right on track" : "You're all caught up"}</h3><p>{search || priorityFilter !== "all" ? "Try changing your search or filters." : filter === "overdue" ? "You have no overdue tasks. Keep it up!" : "Add a task to get started and make today count."}</p>{!search && priorityFilter === "all" && filter !== "completed" && filter !== "overdue" && <button className="secondary-button" onClick={() => setShowComposer(true)}><Icon name="plus" size={16} />Create a task</button>}</div>}
          {completed > 0 && <div className="list-footer"><span>{completed} completed {completed === 1 ? "task" : "tasks"}</span><button className="clear-button" onClick={clearCompleted}>Clear completed</button></div>}
        </section>
        <footer className="footer-note"><span>Made for a more intentional day.</span><span className="footer-actions"><button className="footer-action" onClick={exportTasks}><Icon name="download" size={14} />Export backup</button><button className="footer-action" onClick={() => importRef.current?.click()}><Icon name="upload" size={14} />Import backup</button><span><span className="footer-status" />Saved on this device</span></span></footer>
        <input ref={importRef} className="sr-only" type="file" accept="application/json,.json" onChange={importTasks} aria-label="Import task backup" />
      </div>
    </section>
  </main>;
}
