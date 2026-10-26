import { Link } from 'react-router-dom';
export default function NotFound(){return <main className="empty-state not-found"><span className="eyebrow">404 · WRONG TABLE</span><h1>This page isn't on the menu.</h1><p>Let's get you back to something delicious.</p><Link className="btn btn-dark" to="/">Back to discover</Link></main>}
