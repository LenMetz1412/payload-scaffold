"use client";

import { type ReactNode, useCallback } from "react";

import { SearchBar } from "@/components/search";
import { useNavbarContext } from "@/contexts/NavbarContext/context";
import type { NavItemEntry } from "@/contexts/NavbarContext/items";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/sha/accordion";
import { SheetContent, SheetHeader, SheetTitle } from "@/sha/sheet";

import { LocaleSwitch } from "../../locale-switch";
import { NavItemLink } from "../shared/link";
import { useIsCurrentNavItem } from "../shared/use-is-current";

export const NavbarMenuMobile = ({ footer }: { footer: ReactNode }) => {
  const { closeMobileMenu } = useNavbarContext();

  const handleFooterClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("a")) closeMobileMenu();
    },
    [closeMobileMenu],
  );

  return (
    <>
      <SheetHeader />
      <SheetContent
        className="h-full min-w-full overflow-y-auto"
        side="top"
        aria-describedby="menu-contents"
      >
        <SheetTitle />
        <Menu />
        <div onClick={handleFooterClick}>{footer}</div>
      </SheetContent>
    </>
  );
};

const Menu = () => {
  const { locale, items, closeMobileMenu } = useNavbarContext();
  return (
    <>
      <SearchBar
        locale={locale}
        variant="inline"
        isMobile
        onAfterSelect={closeMobileMenu}
      />
      <div className="my-8 flex w-fit min-w-60 flex-col gap-2">
        {items
          .slice(1)
          .map((item) =>
            item.subItems && item.subItems.length > 0 ? (
              <NavMenuItem key={item.id} item={item} />
            ) : (
              <NavItem key={item.id} item={item} />
            ),
          )}
        <LocaleSwitch currentLocale={locale} asMobileNavBarItem />
      </div>
    </>
  );
};

const NavMenuItem = ({ item }: { item: NavItemEntry }) => {
  const isCurrent = useIsCurrentNavItem(item);

  return (
    <Accordion type="single" collapsible className="mb-0">
      <AccordionItem value={item.title} className="w-[300px] border-b-0">
        <AccordionTrigger isCurrent={isCurrent}>{item.title}</AccordionTrigger>
        <AccordionContent className="ml-4 mt-2 flex flex-col gap-0.5">
          {item.subItems?.map((subItem) => (
            <NavItem key={subItem.id} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const NavItem = ({ item }: { item: NavItemEntry }) => {
  const { closeMobileMenu } = useNavbarContext();
  return <NavItemLink item={item} onClick={closeMobileMenu} />;
};
