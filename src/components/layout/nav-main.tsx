import { Link, useNavigate } from "react-router";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type SidebarItem } from "@/types/sidebar";
import {
  useInitialSidebarOpen,
  useResolvedActiveRoute,
  useResolvedRoute,
} from "@/lib";
import { useSidebarStore } from "@/stores/sidebar";
import { resolveNavIcon } from "@/systems/ui/nav-icon";

export function NavMain() {
  const navigate = useNavigate();
  const groups = useSidebarStore((store) => store.sidebarData);
  const { state } = useSidebar();

  const { resolvedUrl } = useResolvedRoute();
  const { pathname, isRouteActive, isExact } =
    useResolvedActiveRoute(resolvedUrl);

  const { openItems, setOpenItems } = useInitialSidebarOpen(
    groups,
    pathname,
    resolvedUrl,
  );

  const ITEM_CLASS =
    "h-9 gap-2.5 rounded-md px-3 text-[13px] font-normal text-text-mid transition-colors hover:bg-sidebar-hover hover:text-text-hi data-active:bg-sidebar-active data-active:font-normal data-active:text-text-hi [&_svg]:size-4 [&_svg]:text-text-low data-active:[&_svg]:text-brand";

  const renderItem = (item: SidebarItem) => {
    const hasSubItems = !!item.items?.length;
    const Icon = resolveNavIcon(item.icon);
    const parentUrl = resolvedUrl(item.url);

    if (hasSubItems) {
      const isChildActive = !!item.items?.some((sub) => isExact(sub.url));
      const isParentActive = isRouteActive(item.url);
      const isOpen = openItems[item.title] ?? (isChildActive || isParentActive);

      return (
        <Collapsible
          key={item.title}
          open={isOpen}
          onOpenChange={(open) =>
            setOpenItems((prev) => ({ ...prev, [item.title]: open }))
          }
        >
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger render={<div className="flex" />}>
                <SidebarMenuButton
                  className={ITEM_CLASS}
                  isActive={isParentActive}
                  onClick={() => {
                    setOpenItems((prev) => ({ ...prev, [item.title]: true }));
                    navigate(parentUrl);
                  }}
                >
                  <Icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {state === "expanded" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenItems((prev) => ({
                        ...prev,
                        [item.title]: !prev[item.title],
                      }));
                    }}
                  >
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>

            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((sub) => (
                  <SidebarMenuSubItem key={sub.title}>
                    <SidebarMenuSubButton
                      className="h-8 text-[13px] text-text-low hover:bg-sidebar-hover hover:text-text-hi data-active:bg-transparent data-active:text-brand"
                      render={<Link to={resolvedUrl(sub.url)} />}
                      isActive={isExact(sub.url)}
                    >
                      {sub.title}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <Tooltip>
          <TooltipTrigger
            render={
              <SidebarMenuButton
                className={ITEM_CLASS}
                render={<Link to={parentUrl} />}
                isActive={isRouteActive(item.url)}
              />
            }
          >
            <Icon />
            <span>{item.title}</span>
          </TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <SidebarGroup
          key={group.group ?? group.items[0]?.title}
          className="gap-2 p-0"
        >
          {group.group && (
            <SidebarGroupLabel className="h-auto px-3 text-[10px] font-normal tracking-[0.16em] text-text-low uppercase">
              {group.group}
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="gap-0.5">
            {group.items.map((item) => renderItem(item))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
