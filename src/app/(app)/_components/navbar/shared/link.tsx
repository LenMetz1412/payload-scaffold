import Link from "next/link";

import type { NavItemEntry } from "@/contexts/NavbarContext/items";
import { menuTriggerVariants } from "@/sha/variants";
import { cn } from "@/utils/cn";

import { useIsCurrentNavItem } from "./use-is-current";

export const NavItemLink = ({
  item,
  onClick,
}: {
  item: NavItemEntry;
  onClick?: () => void;
}) => {
  const isCurrent = useIsCurrentNavItem(item);

  return (
    <Link
      className={cn(
        menuTriggerVariants({ fullWidth: true, current: isCurrent, hover: 'underline' }),
      )}
      href={item.link}
      onClick={onClick}
    >
      {item.title}
    </Link>
  );
};
