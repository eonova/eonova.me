import TableOfContents from './table-of-contents'
import type { TOC } from '@ileostar/mdx'

interface MenuAsideProps {
  toc: TOC[];
}

const MenuAside: React.FC<MenuAsideProps> = ({ toc }) => {
  return (
    <aside className="fixed left-2 top-40 w-50 lg:w-48 xl:w-80">
      <div className="sticky top-24">
        {toc.length > 0 ? <TableOfContents toc={toc} /> : null}
      </div>
    </aside>
  );
}

export default MenuAside;
