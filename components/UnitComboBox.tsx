"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Units, Unit } from "@/lib/units";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { UpdateUserUnit } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

export function UnitComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Unit | null>(
    null
  );

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userUnit = Units.find(
      (Unit) => Unit.value === userSettings.data.Unit
    );
    if (userUnit) setSelectedOption(userUnit);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserUnit,
    onSuccess: (data: UserSettings) => {
      toast.success(`Unit updated successuflly 🎉`, {
        id: "update-Unit",
      });

      setSelectedOption(
        Units.find((c) => c.value === data.Unit) || null
      );
    },
    onError: (e) => {
      console.error(e);
      toast.error("Something went wrong", {
        id: "update-Unit",
      });
    },
  });

  const selectOption = React.useCallback(
    (Unit: Unit | null) => {
      if (!Unit) {
        toast.error("Please select a Unit");
        return;
      }

      toast.loading("Updating Unit...", {
        id: "update-Unit",
      });

      mutation.mutate(Unit.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set Unit</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Set Unit</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Unit | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter Unit..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Units.map((Unit: Unit) => (
            <CommandItem
              key={Unit.value}
              value={Unit.value}
              onSelect={(value) => {
                setSelectedOption(
                  Units.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {Unit.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
