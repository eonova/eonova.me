import type { TOC } from '@ileostar/mdx'
import TableOfContents from './table-of-contents'

interface MenuAsideProps {
  toc: TOC[]
}

const MenuAside: React.FC<MenuAsideProps> = ({ toc }) => {
  return (
    <aside className="lg:min-w-[270px] lg:max-w-[270px]">
      <div className="sticky top-36">
        {toc.length > 0 ? <TableOfContents toc={toc} /> : null}
      </div>
    </aside>
  )
}

export default MenuAside
