<<<<<<< HEAD
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
=======
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
>>>>>>> 505f05052aeb87eb672a51a3fd561a77347cd52b
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateGrowerSchema,
  CreateGrowerSchemaType,
} from "@/schema/growers";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import React, { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateGrower } from "@/app/(dashboard)/_actions/growers";
import { Grower } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
  type: TransactionType;
  successCallback: (grower: Grower) => void;
  trigger?: ReactNode;
}

function CreateGrowerDialog({ type, successCallback, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateGrowerSchemaType>({
    resolver: zodResolver(CreateGrowerSchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateGrower,
    onSuccess: async (data: Grower) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Grower ${data.name} created successfully 🎉`, {
        id: "create-grower",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["growers"],
      });

      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "create-grower",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateGrowerSchemaType) => {
      toast.loading("Creating grower...", {
        id: "create-grower",
      });
      mutate(values);
    },
    [mutate]
  );
=======
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  useTheme,
  Loader2,
  useToast,
  useClient,
} from "@/components";
import { Grower } from "@prisma/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import { EmojiPicker } from "emoji-mart-react";

type Props = {
  type: TransactionType;
  successCallback: (grower: Grower) => void;
  trigger?: ReactNode;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  icon: yup.string().required(),
  type: yup.string().required(),
});

export default function CreateGrowerDialog({
  type,
  successCallback,
  trigger,
}: Props) {
  const router = useRouter();
  const theme = useTheme();
  const toast = useToast();
  const queryClient = useClient();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: yupResolver(schema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Grower) => {
      const res = await fetch("/api/growers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const grower = await res.json();
      return grower;
    },
  });

  const onSubmit = async (data: Grower) => {
    try {
      const newGrower = await mutate(data);
      toast.success(`Grower ${newGrower.name} created successfully 🎉`, {
        id: "create-grower",
      });
      successCallback(newGrower);
      await queryClient.invalidateQueries({
        queryKey: ["growers"],
      });
      setOpen((prev) => !prev);
    } catch (error) {
      toast.error("Something went wrong", {
        id: "create-grower",
      });
    }
  };
>>>>>>> 505f05052aeb87eb672a51a3fd561a77347cd52b

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
<<<<<<< HEAD
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={"ghost"}
            className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            Create new
=======
        {trigger || (
          <Button
            variant={"outline"}
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            onClick={() => setOpen((prev) => !prev)}
          >
            Create Grower
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
>>>>>>> 505f05052aeb87eb672a51a3fd561a77347cd52b
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
<<<<<<< HEAD
          <DialogTitle>
            Create
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>
            grower
          </DialogTitle>
          <DialogDescription>
            Growers are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Grower" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your grower will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[100px] w-full"
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your grower will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGrowerDialog;
=======
          <DialogTitle>Create Grower</DialogTitle>
          <DialogDescription>
            Create a new grower to track their transactions
          </DialogDescription>
        </DialogHeader>
        <Form onSubmit={form.handleSubmit
>>>>>>> 505f05052aeb87eb672a51a3fd561a77347cd52b
