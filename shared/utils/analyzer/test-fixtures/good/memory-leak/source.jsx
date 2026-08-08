function App() {
  useEffect(() => {
    const handle = () => doSomething('resizing')
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return <div>App</div>
}
