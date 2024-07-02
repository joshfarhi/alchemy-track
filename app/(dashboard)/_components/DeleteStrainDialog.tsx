"use client";

import { DeleteStrain } from "@/app/(dashboard)/_actions/strains";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionType } from "@/lib/types";
import { Strain } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  trigger: ReactNode;
  strain: Strain;
}

function DeleteStrainDialog({ strain, trigger }: Props) {
  const strainIdentifier = `${strain.name}-${strain.type}`;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteStrain,
    onSuccess: async () => {
      toast.success("Strain deleted successfully", {
        id: strainIdentifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["strains"],
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: strainIdentifier,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            strain
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting strain...", {
                id: strainIdentifier,
              });
              deleteMutation.mutate({
                name: strain.name,
                type: strain.type as TransactionType,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteStrainDialog;
