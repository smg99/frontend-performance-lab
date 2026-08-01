function App() {
  useEffect(() => {
    const handle = () => console.log('resizing');
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return <div>App</div>;
}