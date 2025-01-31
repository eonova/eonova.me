import type { TOC } from '@ileostar/mdx'
import TableOfContents from './table-of-contents'

interface MenuAsideProps {
  toc: TOC[]
}

const MenuAside: React.FC<MenuAsideProps> = ({ toc }) => {
  return (
    <aside className="sticky top-20 right-2 w-50 lg:w-48 xl:w-80">
      {toc.length > 0 ? <TableOfContents toc={toc} /> : null}
    </aside>
  )
}

export default MenuAside
