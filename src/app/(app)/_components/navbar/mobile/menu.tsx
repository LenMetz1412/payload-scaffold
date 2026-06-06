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
        className="max-h-[calc(100vh-88px)] overflow-y-auto bg-black/50 backdrop-blur-md text-white"
        side="top"
        aria-describedby={undefined}
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
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchBar
            locale={locale}
            variant="inline"
            isMobile
            onAfterSelect={closeMobileMenu}
          />
        </div>
        <div className="shrink-0">
          <LocaleSwitch currentLocale={locale} />
        </div>
      </div>
      <div className="my-8 flex w-fit min-w-60 flex-col gap-2">
        {items
          .map((item) =>
            item.subItems && item.subItems.length > 0 ? (
              <NavMenuItem key={item.id} item={item} />
            ) : (
              <NavItem key={item.id} item={item} />
            ),
          )}
      </div>
    </>
  );
};

const NavMenuItem = ({ item }: { item: NavItemEntry }) => {
  const isCurrent = useIsCurrentNavItem(item);

  return (
    <Accordion type="single" collapsible className="mb-0">
      <AccordionItem value={item.title} className="w-75 border-b-0">
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
