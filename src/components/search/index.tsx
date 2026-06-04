"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSearchDocs } from "@/components/search/use-search";
import type { Locale } from "@/config/locales";
import { useDictionary } from "@/i18n/context";
import { cn } from "@/utils/cn";

import { SearchInput } from "./input";
import { buildSearchItemHref } from "./link";
import {
  SearchResultsList,
  type SearchResultsListOnSelectItem,
} from "./results-list";
import { useCollapsableSearch } from "./use-dropdown";

export const SearchBar = (
  props:
    | {
        locale: Locale;
        adminMode?: boolean;
        isMobile?: boolean;
        variant?: "inline";
        inputClassName?: string;
        onAfterSelect?: () => void;
      }
    | {
        locale: Locale;
        adminMode?: boolean;
        isMobile?: boolean;
        variant: "collapsible";
        position?: "below" | "left";
        inputClassName?: string;
        onAfterSelect?: () => void;
      },
) => {
  const { adminMode, locale, isMobile, inputClassName, onAfterSelect } = props;
  const variant = props.variant ?? "inline";

  const position =
    props.variant === "collapsible" && props.position
      ? props.position
      : "below";
  const isCollapsible = variant === "collapsible";
  const [searchTerm, setSearchTerm] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const t = useDictionary();

  const { searchResults, debouncedSearchTerm, isLoading } = useSearchDocs(
    searchTerm,
    {
      locale,
      draft: !!adminMode,
    },
  );

  const resetSearch = useCallback(() => setSearchTerm(""), []);

  const {
    searchCtnRef,
    searchInputRef,
    isSearchOpen,
    closeSearch,
    openSearch,
  } = useCollapsableSearch({
    resetSearch,
    isMobile,
  });

  const onSelectItem: SearchResultsListOnSelectItem = useCallback(
    (res) => {
      const href = buildSearchItemHref({ adminMode, locale, res });

      if (adminMode) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
        closeSearch();
        onAfterSelect?.();
      }
    },
    [adminMode, router, locale, closeSearch, onAfterSelect],
  );

  const containerClasses = cn(
    "w-search",
    !isCollapsible && ["relative", "max-w-full", "md:max-w-search"],
    isCollapsible && [
      "absolute",
      "max-w-0",
      "transition-all",
      "duration-700",
      isSearchOpen && "max-w-search",
      position === "below" && "right-0 top-full mt-2",
      position === "left" && "right-full top-0",
    ],
  );

  const showList = isLoading || searchTerm.length > 2;
  const showBackgroundBlur = (isCollapsible ? isSearchOpen : true) && showList;

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeSearch();
    },
    [closeSearch],
  );

  useEffect(() => {
    const html = document.documentElement;
    const blockBodyClass = "block-body-onsearch";

    if (showBackgroundBlur) {
      document.body.classList.add(blockBodyClass);
      html.classList.add(blockBodyClass);
    } else {
      document.body.classList.remove(blockBodyClass);
      html.classList.remove(blockBodyClass);
    }

    return () => {
      document.body.classList.remove(blockBodyClass);
      html.classList.remove(blockBodyClass);
    };
  }, [showBackgroundBlur]);

  return (
    <div
      className="flex-end relative flex items-center font-sans"
      ref={searchCtnRef}
    >
      {showBackgroundBlur && (
        <div
          ref={backdropRef}
          className={cn("fixed inset-0 z-40 bg-black/20 backdrop-blur-sm")}
          aria-hidden="true"
          onClick={handleBackdropClick}
        />
      )}
      <div className={cn(containerClasses, "z-50")}>
        <SearchInput
          ref={searchInputRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onFocus={openSearch}
          className={inputClassName}
        />

        <SearchResultsList
          searchResults={searchResults}
          searchTerm={debouncedSearchTerm}
          isLoadingText={t.search.placeholder}
          noResultsText={t.search.noResults}
          isLoading={isLoading}
          onSelectItem={onSelectItem}
          adminMode={adminMode}
        />
      </div>
    </div>
  );
};
