/** @format */

import { useState } from "react";
import { useGetBeverages, useDeleteBeverage } from "@repo/api";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@repo/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { Button } from "@repo/ui";
import EditBeverageModal from "./EditBeverageModal";
import AddBeverage from "./AddBeverage";
import { Beverage } from "../../../../packages/api/src/types/beverage";
import { motion } from "framer-motion";

type SortCriteria = "name" | "status" | "price" | "sales";
type SortOrder = "asc" | "desc";

function Dashboard() {
  const { data: beverages, isLoading, error } = useGetBeverages();
  const deleteMutation = useDeleteBeverage();
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleEditClick = (beverage: Beverage) => {
    setSelectedBeverage(beverage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBeverage(null);
  };

  const handleDeleteClick = (beverageId: string) => {
    deleteMutation.mutate({ id: beverageId });
  };

  const handleSort = (criteria: SortCriteria) => {
    if (sortCriteria === criteria) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortCriteria(criteria);
      setSortOrder("asc");
    }
  };

  const sortedBeverages = beverages?.slice().sort((a, b) => {
    if (sortCriteria === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortCriteria === "status") {
      return sortOrder === "asc"
        ? Number(a.isActive) - Number(b.isActive)
        : Number(b.isActive) - Number(a.isActive);
    }
    if (sortCriteria === "price") {
      return sortOrder === "asc"
        ? a.basePrice - b.basePrice
        : b.basePrice - a.basePrice;
    }
    if (sortCriteria === "sales") {
      return sortOrder === "asc"
        ? a.totalSales - b.totalSales
        : b.totalSales - a.totalSales;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>Loading beverages...</CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>Error fetching beverages.</CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="flex flex-col w-full gap-y-2">
          <CardTitle>Produkter</CardTitle>
          <CardDescription>
            Administrér dine produkter og se deres salg.
          </CardDescription>
          <AddBeverage />
        </div>
      </CardHeader>
      <CardContent>
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Billede</span>
              </TableHead>
              <TableHead onClick={() => handleSort("name")}>
                Navn{" "}
                {sortCriteria === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("status")}>
                Status{" "}
                {sortCriteria === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("price")}>
                Pris{" "}
                {sortCriteria === "price" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="hidden md:table-cell"
                onClick={() => handleSort("sales")}
              >
                Solgte enheder{" "}
                {sortCriteria === "sales" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>
                <span className="sr-only">Handlinger</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBeverages &&
              sortedBeverages.map((beverage, index) => (
                <motion.tr
                  key={beverage.beverageId}
                  initial={{ opacity: 0, y: 50 }} // start with 0 opacity and slightly lower position
                  animate={{ opacity: 1, y: 0 }} // animate to full opacity and original position
                  exit={{ opacity: 0, y: 50 }} // animate out on exit
                  transition={{ delay: index * 0.1 }} // delay each item's animation by its index to create a staggered effect
                >
                  <TableCell className="hidden sm:table-cell">
                    <img
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={beverage.imageSrc}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{beverage.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {beverage.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{beverage.basePrice} dkk</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {beverage.totalSales}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(beverage)}
                        >
                          Redigér
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteClick(beverage.beverageId.toString())
                          }
                        >
                          Slet
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Viser <strong>{beverages?.length}</strong> af{" "}
          <strong>{beverages?.length}</strong> produkter
        </div>
      </CardFooter>
      {selectedBeverage && (
        <EditBeverageModal
          beverage={selectedBeverage}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Card>
  );
}

export default Dashboard;
