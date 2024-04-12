/** @format */

import { Button } from "./button";

interface NewBeverageCardProps {}

function NewBeverageCard({}: NewBeverageCardProps) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg mb-4 font-semibold">Ny Beverage</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Navn
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Blå vand"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Pris
            </label>
            <input
              type="text"
              id="price"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="25 kr"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Beskrivelse
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Den er blå"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload et transparent billede
            </label>
            <input
              type="file"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Button>
            Tilføj til sortiment
          </Button>
        </form>
      </div>
    );
  }
  
  export default NewBeverageCard;