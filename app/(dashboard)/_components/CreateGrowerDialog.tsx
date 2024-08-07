import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Grower</DialogTitle>
          <DialogDescription>
            Create a new grower to track their transactions
          </DialogDescription>
        </DialogHeader>
        <Form onSubmit={form.handleSubmit