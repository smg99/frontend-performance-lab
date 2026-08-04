export async function fetchData() {
  const users = await fetch('/api/users')
  const posts = await fetch('/api/posts')
  const comments = await fetch('/api/comments')
  return { users, posts, comments }
}
