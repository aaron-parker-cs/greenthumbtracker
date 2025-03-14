import React from "react";
import { Table, Button } from "react-bootstrap";
import { Plant } from "../../models/plant";

interface PlantsTableProps {
  plants: Plant[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const PlantsTable: React.FC<PlantsTableProps> = ({
  plants,
  onEdit,
  onDelete,
}) => {
  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Species</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {plants.map((plant, index) => (
          <tr key={plant.id}>
            <td>{index + 1}</td>
            <td>{plant.name}</td>
            <td>{plant.species}</td>
            <td>
              {plant.created_ ? new Date(plant.created_).toDateString() : ""}
            </td>
            <td>
              {plant.updated_ ? new Date(plant.updated_).toDateString() : ""}
            </td>
            <td>
              <Button variant="warning" onClick={() => onEdit(plant.id)}>
                Edit
              </Button>{" "}
              <Button variant="danger" onClick={() => onDelete(plant.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PlantsTable;
