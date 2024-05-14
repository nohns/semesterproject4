/** @format */

import { useState } from "react";
import { usePutBeverage } from "@repo/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@repo/ui";
import { Beverage } from "../../../../packages/api/src/types/beverage"; // yes this is cursed, but another file exports the same type so I can't just @repo/api

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
  const [name, setName] = useState(beverage.name);
  const [description, setDescription] = useState(beverage.description);
  const [imageSrc, setImageSrc] = useState(beverage.imageSrc);
  const [basePrice, setBasePrice] = useState(beverage.basePrice);
  const [maxPrice, setMaxPrice] = useState(beverage.maxPrice);
  const [minPrice, setMinPrice] = useState(beverage.minPrice);
  const [isActive, setIsActive] = useState(beverage.isActive);

  const mutation = usePutBeverage();

  const handleSave = () => {
    mutation.mutate({
      beverage: {
        ...beverage,
        name,
        description,
        imageSrc,
        basePrice,
        maxPrice,
        minPrice,
        isActive,
      },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redigér Produkt</DialogTitle>
          <DialogDescription>
            Opdater informationen for produktet herunder.
          </DialogDescription>
        </DialogHeader>
        <div>
          <label>Name</label>
          <Input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div>
          <label>Image URL</label>
          <Input
            value={imageSrc}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setImageSrc(e.target.value)
            }
          />
        </div>
        <div>
          <label>Base Price</label>
          <Input
            type="number"
            value={basePrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBasePrice(Number(e.target.value))
            }
          />
        </div>
        <div>
          <label>Max Price</label>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMaxPrice(Number(e.target.value))
            }
          />
        </div>
        <div>
          <label>Min Price</label>
          <Input
            type="number"
            value={minPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMinPrice(Number(e.target.value))
            }
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2">Active</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border border-input bg-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBeverageModal;
