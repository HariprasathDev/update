import React, { useState, useEffect } from "react";
import { RiDraggable } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";

interface RasiGridProps {
  centerLabel: string;
  onRasiContentsChange: (contents: string[][]) => void;
}
interface Label {
  id: number;
  name: string;
}
const RasiGrid: React.FC<RasiGridProps> = ({ centerLabel, onRasiContentsChange }) => {
  const initialLabels: Label[] = [
    { id: 1, name: "Raghu/Rahu" },
    { id: 2, name: "Mars/Chevai" },
    { id: 3, name: "Jupiter/Guru" },
    { id: 4, name: "Mercury/Budhan" },
    { id: 5, name: "Saturn/Sani" },
    { id: 6, name: "Lagnam" },
    { id: 7, name: "Sun/Suriyan" },
    { id: 8, name: "Venus/Sukran" },
    { id: 9, name: "Moon/Chandran" },
    { id: 10, name: "Kethu/Ketu" },
  ];

  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [rasiContents, setRasiContents] = useState<string[][]>(Array(12).fill([]));

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, label: Label) => {
    e.dataTransfer.setData("labelId", label.id.toString());
    e.dataTransfer.setData("source", "rasi");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDropRasiBox = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedLabelId = e.dataTransfer.getData("labelId");
    const source = e.dataTransfer.getData("source");

    if (source === "rasi" && draggedLabelId) {
      const draggedLabel = labels.find((label) => label.id === parseInt(draggedLabelId, 10));
      if (draggedLabel && !rasiContents[index].includes(draggedLabel.name) && rasiContents[index].length < 6) {
        const newContents = [...rasiContents];
        newContents[index] = [...newContents[index], draggedLabel.name];
        setRasiContents(newContents);

        setLabels((prevLabels) => prevLabels.filter((label) => label.id !== draggedLabel.id));
      }
    }
  };

  const handleRemoveLabel = (index: number, labelIndex: number) => {
    const newContents = [...rasiContents];
    const removedLabel = newContents[index][labelIndex];
    newContents[index].splice(labelIndex, 1);
    setRasiContents(newContents);

    const removedLabelObj = initialLabels.find((label) => label.name === removedLabel);
    if (removedLabelObj) {
      setLabels((prevLabels) => [...prevLabels, removedLabelObj]);
    }
  };

  useEffect(() => {
    onRasiContentsChange(rasiContents);
  }, [rasiContents, onRasiContentsChange]);

  useEffect(() => {
    console.log("Rasi Contents:");
    rasiContents.forEach((contents, index) => {
      if (contents.length === 0) {
        console.log(`Grid ${index + 1}: Empty`);
      } else if (contents.length === 1) {
        const labelId = initialLabels.find((label) => label.name === contents[0])?.id;
        console.log(`Grid ${index + 1}: ${labelId}`);
      } else {
        const ids = contents.map((label) => {
          const labelId = initialLabels.find((l) => l.name === label)?.id;
          return labelId || "";
        });
        console.log(`Grid ${index + 1}: [${ids.join(", ")}]`);
      }
    });
  }, [rasiContents]);

  return (
    <div className="flex justify-start items-start bg-gray-200 space-x-16">
      {/* Labels */}
      <div className="flex flex-col space-y-2">
        {labels.map((label, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, label)}
            className="flex items-center  bg-red-600 text-white  text-sm px-2 py-3 rounded text-center hover:cursor-grab"
          >
            <RiDraggable className="mr-2" />
            {label.name}
          </div>
        ))}
      </div>
      {/* Rasi Grid */}
      <div className="">
        <div className="col-span-3 grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              onDrop={(e) => handleDropRasiBox(e, index)}
              onDragOver={handleDragOver}
              className="w-48 h-48 rasi-box rounded border border-footer-text-gray flex flex-col items-start justify-center gap-2"
            >
              {rasiContents[index].map((label, labelIndex) => (
                <div
                  key={labelIndex}
                  className="w-32 h-auto mx-auto relative  bg-red-600 text-white  text-xs px-2 py-1 rounded text-center flex items-center justify-between"
                >
                  {label}
                  <AiOutlineClose
                    className="cursor-pointer ml-2"
                    onClick={() => handleRemoveLabel(index, labelIndex)}
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="row-start-2 ras-center-box col-start-2 col-end-4 row-end-4 rounded font-semibold border border-gray bg-gray flex justify-center items-center">
            {centerLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RasiGrid;
