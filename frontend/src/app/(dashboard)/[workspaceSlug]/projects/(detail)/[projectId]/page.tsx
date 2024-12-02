"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { StateDropdown } from "@/components/dropdown/state";
import { useParams } from "next/navigation";

export default function StateTestPage() {
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined,
  );
  const { states } = useProjectStateStore();

  const { projectId } = useParams();
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
  };

  const handleResetState = () => {
    setSelectedState(undefined);
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold">State Dropdown Test Page</h1>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">State Dropdown</h2>
        <div className="w-64">
          <StateDropdown projectId={projectId as string} onChange={handleStateChange} 
          value={selectedState}
          showDefaultState/>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Selected State</h2>
        <p>
          {selectedState
            ? `Selected state ID: ${selectedState}`
            : "No state selected"}
        </p>
        {selectedState && (
          <p>
            Selected state name:{" "}
            {states.find((state) => state.id === selectedState)?.name ||
              "Unknown"}
          </p>
        )}
      </div>

      <div>
        <Button onClick={handleResetState}>Reset Selection</Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">All Available States</h2>
        <ul className="list-disc pl-5">
          {states.map((state) => (
            <li key={state.id}>
              {state.name} (ID: {state.id}, Group: {state.group})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
