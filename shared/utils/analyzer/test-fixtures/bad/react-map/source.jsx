const List = ({ items }) => {
  return (
    <div>
      {items.map(item => (
        <HeavyCard key={item.id} data={item} />
      ))}
    </div>
  )
}
