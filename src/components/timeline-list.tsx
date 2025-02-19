import { cn } from "~/lib/utils";

interface TimelineListProps {
  children: React.ReactNode,
  className?: string
}

const TimelineList: React.FC<TimelineListProps> = ({ children, className }) => {
  return (
    <><ul className={cn('shiro-timeline', className)}>{children}</ul>
    </>
  );
}

export default TimelineList;
