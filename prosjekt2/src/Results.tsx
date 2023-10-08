import { ReactElement } from "react";
import ActionAreaCard from "./Components/ActionAreaCard";
import "./Results.css";

export default function Results() {
  const movies: ReactElement<string, string>[] = [];
  for (let i = 0; i < 4; i++) {
    movies.push(
      <div className="card" key={`movie-${i}`}>
        <ActionAreaCard />
      </div>
    );
  }

  // Define the number of cards per row
  const cardsPerRow = 3; // Adjust this based on your design

  // Calculate the number of rows needed
  const numRows = Math.ceil(movies.length / cardsPerRow);

  // Create an array to store the rows
  const rows: ReactElement<string, string>[] = [];

  // Generate rows and insert ActionAreaCard components into them
  for (let i = 0; i < numRows; i++) {
    const startIndex = i * cardsPerRow;
    const endIndex = startIndex + cardsPerRow;
    const rowCards = movies.slice(startIndex, endIndex);
    // Add empty cards if needed to fill the row
    while (rowCards.length < cardsPerRow) {
      rowCards.push(
        <div className="card" key={`empty-${rowCards.length}`}></div>
      );
    }

    rows.push(
      <div className="row" key={`row-${i}`}>
        {rowCards}
      </div>
    );
  }
  return <div className="comp">{rows}</div>;
}
