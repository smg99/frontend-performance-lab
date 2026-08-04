import { FixedSizeList } from 'react-window'
const List = ({ items }) => {
  const Row = ({ index, style }) => <HeavyCard style={style} data={items[index]} />
  return <FixedSizeList itemCount={items.length}>{Row}</FixedSizeList>
}
