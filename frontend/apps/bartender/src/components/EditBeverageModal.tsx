/** @format */

import { useState, useEffect } from "react";
import { usePutBeverage } from "@repo/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  Checkbox,
} from "@repo/ui";
import { Input } from "@repo/ui";

import { Button } from "@repo/ui";
import { Beverage } from "../../../../packages/api/src/types/beverage";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditBeverageModalProps {
  beverage: Beverage;
  isOpen: boolean;
  onClose: () => void;
}

const EditBeverageModal: React.FC<EditBeverageModalProps> = ({
  beverage,
  isOpen,
  onClose,
}) => {
  const editBeverage = usePutBeverage();
  const queryClient = useQueryClient();
  const [submissionStatus, setSubmissionStatus] = useState<
    null | "success" | "error"
  >(null); // State for submission status

  const formSchema = z.object({
    name: z.string().min(1, {
      message: "Navn skal udfyldes.",
    }),
    description: z.string().min(1, {
      message: "Beskrivelse skal udfyldes.",
    }),
    basePrice: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: "Basis pris skal være mindst 1 kr.",
      })
    ),
    minPrice: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: "Minimum pris skal være mindst 1 kr.",
      })
    ),
    maxPrice: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: "Maksimum pris skal være mindst 1 kr.",
      })
    ),

    buyMultiplier: z.preprocess(
      (val) => Number(val),
      z.number().min(1, {
        message: "Købsmultiplikatoren skal være mindst 1.",
      })
    ),
    halfTime: z.preprocess(
      (val) => Number(val),
      z.number().min(0, {
        message: "Halveringstiden skal være mindst 0.1",
      })
    ),
    active: z.boolean().default(true),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: beverage.name,
      description: beverage.description,
      basePrice: beverage.basePrice,
      minPrice: beverage.minPrice,
      maxPrice: beverage.maxPrice,
      buyMultiplier: beverage.buyMultiplier,
      halfTime: beverage.halfTime,
      active: beverage.isActive,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const beverageData = {
      beverage: {
        beverageId: beverage.beverageId,
        name: values.name,
        description: values.description,
        imageSrc: beverage.imageSrc,
        basePrice: values.basePrice,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
        isActive: values.active,
        buyMultiplier: values.buyMultiplier,
        halfTime: values.halfTime,
        totalSales: beverage.totalSales,
        prices: beverage.prices,
      },
    };

    console.log("Creating beverage:", beverageData);

    editBeverage.mutate(beverageData, {
      onSuccess: () => {
        console.log("Beverage created successfully");
        // Handle additional logic here
        setSubmissionStatus("success");
        queryClient.invalidateQueries({ queryKey: ["beverages"] });
        setTimeout(() => {
          onClose();
          setSubmissionStatus(null);
        }, 1500);
      },
      onError: (error) => {
        console.error("Error creating beverage:", error);
        setSubmissionStatus("error");
      },
    });
  }

  useEffect(() => {
    if (!isOpen) {
      setSubmissionStatus(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redigér Produkt</DialogTitle>
          <DialogDescription>
            Opdater informationen for produktet herunder.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beskrivelse</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* BasePrice */}
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basis pris</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* MinPrice */}
            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum pris</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* MaxPrice */}
            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maksimum pris</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* buyMultiplier */}
            <FormField
              control={form.control}
              name="buyMultiplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Købs multiplier</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Halflife */}
            <FormField
              control={form.control}
              name="halfTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Halveringstid</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Aktiver produkt
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Redigér produktet
            </Button>
          </form>
        </Form>

        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBeverageModal;
